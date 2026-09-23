// jest.setup.js — Mock Firebase before any tests run
process.env.NODE_ENV = 'test';
process.env.PORT = '10001';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
process.env.FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7o4qne60TB3wo\n-----END PRIVATE KEY-----\n';
process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
process.env.ADMIN_EMAIL = 'admin@test.com';

// Mock firebase-admin
jest.mock('firebase-admin', () => {
  const mockAuth = {
    verifyIdToken: jest.fn(),
    getUserByEmail: jest.fn(),
    getUser: jest.fn(),
  };
  const mockFirestore = () => {
    const mockDoc = {
      get: jest.fn().mockResolvedValue({ exists: false, data: () => null }),
      set: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };
    const mockQuery = {
      get: jest.fn().mockResolvedValue({ docs: [], size: 0 }),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
    const db = {
      collection: jest.fn().mockReturnValue({ ...mockQuery, doc: jest.fn().mockReturnValue(mockDoc), add: jest.fn().mockResolvedValue(mockDoc) }),
      doc: jest.fn().mockReturnValue(mockDoc),
    };
    return db;
  };
  mockFirestore.FieldValue = { increment: jest.fn((n) => n) };

  return {
    apps: [],
    initializeApp: jest.fn(),
    credential: { cert: jest.fn() },
    auth: jest.fn(() => mockAuth),
    firestore: mockFirestore,
    storage: jest.fn(() => ({ bucket: jest.fn() })),
  };
});
