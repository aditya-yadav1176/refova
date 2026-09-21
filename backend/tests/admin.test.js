'use strict';

const request = require('supertest');
const app = require('../src/app');
const { getAuth, getDb } = require('../src/config/firebase');

const mockAdmin = { uid: 'admin-1', email: 'admin@test.com', displayName: 'Admin', role: 'admin', status: 'active' };
const mockUser = { uid: 'user-1', email: 'user@test.com', displayName: 'User', role: 'user', status: 'active' };

function setupAuth(user) {
  getAuth().verifyIdToken.mockResolvedValue({ uid: user.uid, email: user.email, name: user.displayName });
  const db = getDb();
  db.collection().doc().get.mockResolvedValue({ exists: true, data: () => user });
}

describe('Admin API', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Authorization', () => {
    it('GET /api/admin/dashboard returns 401 without token', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/dashboard returns 403 for non-admin user', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', 'Bearer user-token');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/admin/dashboard returns 200 for admin', async () => {
      setupAuth(mockAdmin);
      const db = getDb();
      db.collection().get.mockResolvedValue({ docs: [], size: 0 });
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', 'Bearer admin-token');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Referral moderation', () => {
    it('PATCH /api/admin/referrals/:id/approve requires admin', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .patch('/api/admin/referrals/some-id/approve')
        .set('Authorization', 'Bearer user-token');
      expect(res.status).toBe(403);
    });

    it('PATCH /api/admin/referrals/:id/reject requires admin', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .patch('/api/admin/referrals/some-id/reject')
        .set('Authorization', 'Bearer user-token');
      expect(res.status).toBe(403);
    });
  });

  describe('User management', () => {
    it('PATCH /api/admin/users/:uid/role requires admin', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .patch('/api/admin/users/user-2/role')
        .set('Authorization', 'Bearer user-token')
        .send({ role: 'admin' });
      expect(res.status).toBe(403);
    });
  });
});
