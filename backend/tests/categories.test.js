'use strict';

const request = require('supertest');
const app = require('../src/app');
const { getDb } = require('../src/config/firebase');

describe('Categories API', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/categories returns 200 with array', async () => {
    const db = getDb();
    const mockCategory = { id: 'finance', name: 'Finance & Payments', slug: 'finance', isActive: true };
    db.collection().where().orderBy().get.mockResolvedValue({
      docs: [{ id: 'finance', data: () => mockCategory }],
      size: 1,
    });
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/categories/:id returns 404 for non-existent category', async () => {
    const db = getDb();
    db.collection().doc().get.mockResolvedValue({ exists: false, data: () => null });
    const res = await request(app).get('/api/categories/nonexistent');
    expect(res.status).toBe(404);
  });
});
