'use strict';

const request = require('supertest');
const app = require('../src/app');
const { getAuth, getDb } = require('../src/config/firebase');

const mockUser = { uid: 'user-1', email: 'user@test.com', displayName: 'Test', role: 'user', status: 'active' };
const mockAdmin = { uid: 'admin-1', email: 'admin@test.com', displayName: 'Admin', role: 'admin', status: 'active' };

function setupAuth(user) {
  getAuth().verifyIdToken.mockResolvedValue({ uid: user.uid, email: user.email, name: user.displayName });
  const db = getDb();
  db.collection().doc().get.mockResolvedValue({ exists: true, data: () => user });
}

describe('Referrals API', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/referrals', () => {
    it('returns 200 with paginated referrals', async () => {
      const db = getDb();
      db.collection().where().orderBy().get.mockResolvedValue({ docs: [], size: 0 });
      const res = await request(app).get('/api/referrals');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('accepts search and category query params', async () => {
      const db = getDb();
      db.collection().where().orderBy().get.mockResolvedValue({ docs: [], size: 0 });
      const res = await request(app).get('/api/referrals?search=paywise&category=finance&page=1&limit=10');
      expect(res.status).toBe(200);
    });

    it('clamps limit to maximum 50', async () => {
      const db = getDb();
      db.collection().where().orderBy().get.mockResolvedValue({ docs: [], size: 0 });
      const res = await request(app).get('/api/referrals?limit=1000');
      expect(res.status).toBe(200);
      expect(res.body.pagination.limit).toBeLessThanOrEqual(50);
    });
  });

  describe('GET /api/referrals/featured', () => {
    it('returns 200', async () => {
      const db = getDb();
      db.collection().where().orderBy().get.mockResolvedValue({ docs: [], size: 0 });
      const res = await request(app).get('/api/referrals/featured');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/referrals/trending', () => {
    it('returns 200', async () => {
      const db = getDb();
      db.collection().where().orderBy().get.mockResolvedValue({ docs: [], size: 0 });
      const res = await request(app).get('/api/referrals/trending');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/referrals', () => {
    it('returns 401 when not authenticated', async () => {
      const res = await request(app).post('/api/referrals').send({ brandName: 'Test' });
      expect(res.status).toBe(401);
    });

    it('returns 400 when referral data is invalid', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .post('/api/referrals')
        .set('Authorization', 'Bearer valid-token')
        .send({ brandName: '' }); // missing required fields
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 201 when valid referral is created', async () => {
      setupAuth(mockUser);
      const db = getDb();
      db.collection().where().where().where().limit().get.mockResolvedValue({ empty: true, docs: [] });
      db.collection().doc().set.mockResolvedValue({});
      db.collection().doc().get.mockResolvedValue({
        exists: true,
        data: () => ({ id: 'new-id', brandName: 'PayWise', status: 'draft' }),
      });

      const res = await request(app)
        .post('/api/referrals')
        .set('Authorization', 'Bearer valid-token')
        .send({
          brandName: 'PayWise',
          benefitHeadline: '₹500 CASHBACK',
          description: 'Get ₹500 cashback on your first UPI payment of ₹100 or more.',
          categoryId: 'finance',
          categoryName: 'Finance & Payments',
          referralCode: 'PAYWISE500',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/referrals/parse', () => {
    it('returns 401 when not authenticated', async () => {
      const res = await request(app).post('/api/referrals/parse').send({ text: 'test' });
      expect(res.status).toBe(401);
    });

    it('returns parsed referral data', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .post('/api/referrals/parse')
        .set('Authorization', 'Bearer valid-token')
        .send({ text: 'Get ₹500 cashback on PhonePe. Use code PHONE500. New users only. Valid till 31 Dec 2026.' });
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.brandName).toBeDefined();
      expect(res.body.data.benefitHeadline).toBeDefined();
    });

    it('returns 400 when text is empty', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .post('/api/referrals/parse')
        .set('Authorization', 'Bearer valid-token')
        .send({ text: '' });
      expect(res.status).toBe(400);
    });
  });
});
