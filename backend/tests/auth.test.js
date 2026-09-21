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
});
