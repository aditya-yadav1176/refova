'use strict';

const { parseReferral } = require('../src/services/referralParser.service');
const request = require('supertest');
const app = require('../src/app');
const { getAuth, getDb } = require('../src/config/firebase');

const mockUser = { uid: 'user-1', email: 'user@test.com', displayName: 'Test', role: 'user', status: 'active' };

function setupAuth(user) {
  getAuth().verifyIdToken.mockResolvedValue({ uid: user.uid, email: user.email, name: user.displayName });
  const db = getDb();
  db.collection().doc().get.mockResolvedValue({ exists: true, data: () => user });
}

describe('Referral Parser Engine Tests', () => {
  beforeEach(() => jest.clearAllMocks());
  describe('Test 1 — MobiKwik real-world input', () => {
    const input = `Hey! I switched to MobiKwik for my daily payments and honestly it's been great.
Use my link to join, make any payment, and start earning cashback on all your payments!
https://w6em.app.link/t193VQymC6b`;

    it('accurately identifies brand, category, benefit without hallucinating amounts', async () => {
      const result = await parseReferral(input);

      expect(result.brandName).toBe('MobiKwik');
      expect(result.category).toBe('finance');
      expect(result.benefitHeadline).toMatch(/cashback/i);
      expect(result.benefitHeadline).not.toMatch(/₹|500|100/);
      expect(result.referralUrl).toBe('https://w6em.app.link/t193VQymC6b');
      expect(result.expiryType).toBe('no_expiry_specified');
      expect(result.expiryDate).toBeNull();
      expect(result.needsReview).toBe(false);
    });
  });

  describe('Test 2 — Explicit Cashback with condition', () => {
    const input = `Join MobiKwik using my link and get ₹100 cashback on your first payment.
https://example.com/ref123`;

    it('extracts explicit reward amount and stated condition without inventing extra terms', async () => {
      const result = await parseReferral(input);

      expect(result.brandName).toBe('MobiKwik');
      expect(result.benefitHeadline).toBe('₹100 Cashback');
      expect(result.conditions.some((c) => /first payment/i.test(c))).toBe(true);
      expect(result.expiryType).toBe('no_expiry_specified');
    });
  });

  describe('Test 3 — Explicit Expiry Date', () => {
    const input = `Get ₹500 cashback. Offer valid until 30 September 2026.
https://example.com/ref`;

    it('extracts fixed_date expiry and formats ISO date correctly', async () => {
      const result = await parseReferral(input);

      expect(result.benefitHeadline).toBe('₹500 Cashback');
      expect(result.expiryType).toBe('fixed_date');
      expect(result.expiryDate).toMatch(/^2026-09-30/);
    });
  });

  describe('Test 4 — No Expiry Specified', () => {
    const input = `Join using my referral link and earn cashback on payments.
https://example.com/ref`;

    it('defaults to no_expiry_specified and null date', async () => {
      const result = await parseReferral(input);

      expect(result.expiryType).toBe('no_expiry_specified');
      expect(result.expiryDate).toBeNull();
    });
  });

  describe('Test 5 — Google Pay brand multi-word recognition', () => {
    const input = `Use my Google Pay referral link and start using GPay to earn rewards.
https://example.com/ref`;

    it('identifies canonical "Google Pay" rather than "Google" or "Pay"', async () => {
      const result = await parseReferral(input);

      expect(result.brandName).toBe('Google Pay');
      expect(result.category).toBe('finance');
      expect(result.brandName).not.toBe('Google');
      expect(result.brandName).not.toBe('Pay');
    });
  });

  describe('Test 6 — Unknown Brand (No hallucination)', () => {
    const input = `Join this new app and get rewards.
https://example.com/ref`;

    it('returns brandName as null and sets needsReview to true', async () => {
      const result = await parseReferral(input);

      expect(result.brandName).toBeNull();
      expect(result.needsReview).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Additional Brand Recognition Tests', () => {
    it('recognizes PhonePe and assigns finance category', async () => {
      const result = await parseReferral('Send money with PhonePe and earn rewards! https://phon.pe/ref123');
      expect(result.brandName).toBe('PhonePe');
      expect(result.category).toBe('finance');
    });

    it('recognizes Paytm and assigns finance category', async () => {
      const result = await parseReferral('Pay your bills using Paytm and get cashback. https://p-y.tm/ref123');
      expect(result.brandName).toBe('Paytm');
      expect(result.category).toBe('finance');
    });

    it('recognizes Amazon and assigns shopping category', async () => {
      const result = await parseReferral('Shop your favorites on Amazon and get 20% off with my link: https://amzn.to/3xyz');
      expect(result.brandName).toBe('Amazon');
      expect(result.category).toBe('shopping');
      expect(result.benefitHeadline).toBe('20% OFF');
    });

    it('recognizes Swiggy and assigns food category', async () => {
      const result = await parseReferral('Order delicious meals on Swiggy and get ₹150 off on first order https://swiggy.com/ref');
      expect(result.brandName).toBe('Swiggy');
      expect(result.category).toBe('food');
      expect(result.benefitHeadline).toBe('₹150 OFF');
    });

    it('recognizes Zomato and assigns food category', async () => {
      const result = await parseReferral('Craving food? Use Zomato to order lunch with my invite link https://zoma.to/r/xyz');
      expect(result.brandName).toBe('Zomato');
      expect(result.category).toBe('food');
    });
  });

  describe('API Endpoint: POST /api/referrals/parse', () => {
    it('returns structured parsed data via the HTTP endpoint', async () => {
      setupAuth(mockUser);
      const res = await request(app)
        .post('/api/referrals/parse')
        .set('Authorization', 'Bearer valid-token')
        .send({
          text: `Hey! I switched to MobiKwik for my daily payments and honestly it's been great.
Use my link to join, make any payment, and start earning cashback on all your payments!
https://w6em.app.link/t193VQymC6b`,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.brandName).toBe('MobiKwik');
      expect(res.body.data.expiryType).toBe('no_expiry_specified');
      expect(res.body.data.confidence).toBeDefined();
    });
  });
});
