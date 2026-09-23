'use strict';

const request = require('supertest');
const app = require('../src/app');
const { getAuth, getDb } = require('../src/config/firebase');

describe('Authentication middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 when Authorization header has wrong format', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Basic abc123');
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    getAuth().verifyIdToken.mockRejectedValueOnce(new Error('Invalid token'));
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 when token is valid and user exists', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@test.com', displayName: 'Test User', role: 'user', status: 'active' };
    getAuth().verifyIdToken.mockResolvedValueOnce({ uid: 'test-uid', email: 'test@test.com', name: 'Test User' });
    const db = getDb();
    db.collection().doc().get.mockResolvedValueOnce({ exists: true, data: () => mockUser });

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  describe('Google Login Display Name Handling', () => {
    it('Case 1: Google user with displayName creates user with Google displayName', async () => {
      getAuth().verifyIdToken.mockResolvedValueOnce({
        uid: 'google-uid-1',
        email: 'harshit@example.com',
        name: 'Harshit Tripathi',
        picture: 'https://example.com/photo.jpg',
        firebase: { sign_in_provider: 'google.com' },
      });

      const db = getDb();
      db.collection().doc().get.mockResolvedValueOnce({ exists: false, data: () => null });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.displayName).toBe('Harshit Tripathi');
      expect(res.body.data.email).toBe('harshit@example.com');
      expect(db.collection().doc().set).toHaveBeenCalledWith(
        expect.objectContaining({
          uid: 'google-uid-1',
          displayName: 'Harshit Tripathi',
          email: 'harshit@example.com',
        })
      );
    });

    it('Case 2: Google user without displayName falls back to email username portion', async () => {
      getAuth().verifyIdToken.mockResolvedValueOnce({
        uid: 'google-uid-2',
        email: 'harshit@example.com',
        name: null,
        firebase: { sign_in_provider: 'google.com' },
      });
      getAuth().getUser.mockResolvedValueOnce({ displayName: null, photoURL: null });

      const db = getDb();
      db.collection().doc().get.mockResolvedValueOnce({ exists: false, data: () => null });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.displayName).toBe('harshit');
      expect(res.body.data.email).toBe('harshit@example.com');
      expect(db.collection().doc().set).toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: 'harshit',
          email: 'harshit@example.com',
        })
      );
    });

    it('Case 3: Existing Google user incorrectly stored with email updates to Google displayName', async () => {
      const existingUser = {
        uid: 'google-uid-3',
        email: 'harshit@example.com',
        displayName: 'harshit@example.com',
        role: 'user',
        status: 'active',
      };

      getAuth().verifyIdToken.mockResolvedValueOnce({
        uid: 'google-uid-3',
        email: 'harshit@example.com',
        name: 'Harshit Tripathi',
        firebase: { sign_in_provider: 'google.com' },
      });

      const db = getDb();
      db.collection().doc().get.mockResolvedValueOnce({ exists: true, data: () => existingUser });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.displayName).toBe('Harshit Tripathi');
      expect(db.collection().doc().update).toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: 'Harshit Tripathi',
        })
      );
    });

    it('Case 4: Existing customized profile name is NOT overwritten by Google displayName', async () => {
      const existingUser = {
        uid: 'google-uid-4',
        email: 'harshit@example.com',
        displayName: 'Harry',
        isCustomDisplayName: true,
        role: 'user',
        status: 'active',
      };

      getAuth().verifyIdToken.mockResolvedValueOnce({
        uid: 'google-uid-4',
        email: 'harshit@example.com',
        name: 'Harshit Tripathi',
        firebase: { sign_in_provider: 'google.com' },
      });

      const db = getDb();
      db.collection().doc().get.mockResolvedValueOnce({ exists: true, data: () => existingUser });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.displayName).toBe('Harry');
      // Should not update displayName to Google's name
      expect(db.collection().doc().update).not.toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: 'Harshit Tripathi',
        })
      );
    });

    it('Case 5: Referral author uses real displayName and never email', async () => {
      const authedUser = {
        uid: 'google-uid-5',
        email: 'harshit@example.com',
        displayName: 'Harshit Tripathi',
        role: 'user',
        status: 'active',
      };

      getAuth().verifyIdToken.mockResolvedValueOnce({
        uid: 'google-uid-5',
        email: 'harshit@example.com',
        name: 'Harshit Tripathi',
        firebase: { sign_in_provider: 'google.com' },
      });

      const db = getDb();
      db.collection().doc().get.mockResolvedValueOnce({ exists: true, data: () => authedUser });
      db.collection().where().where().where().limit().get.mockResolvedValueOnce({ empty: true, docs: [] });

      const res = await request(app)
        .post('/api/referrals')
        .set('Authorization', 'Bearer valid-token')
        .send({
          brandName: 'PayWise',
          benefitHeadline: '₹500 CASHBACK',
          description: 'Get ₹500 cashback on first UPI payment.',
          categoryId: 'finance',
          categoryName: 'Finance & Payments',
          referralCode: 'PAYWISE500',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.submittedByName).toBe('Harshit Tripathi');
      expect(res.body.data.submittedByName).not.toBe('harshit@example.com');
      expect(db.collection().doc().set).toHaveBeenCalledWith(
        expect.objectContaining({
          submittedBy: 'google-uid-5',
          submittedByName: 'Harshit Tripathi',
        })
      );
    });
  });
});
