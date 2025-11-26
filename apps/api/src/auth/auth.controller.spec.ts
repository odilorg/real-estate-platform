import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = app.get(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body).not.toHaveProperty('password');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token');
    });

    it('should fail to register with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...testUser, email: 'invalid-email' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should fail to register with short password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...testUser, password: '123' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should fail to register with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.message).toContain('already');
    });

    it('should register user without optional name', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'noname@example.com', password: 'password123' })
        .expect(201);

      expect(response.body.email).toBe('noname@example.com');
      expect(response.body.name).toBeNull();
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access_token');
    });

    it('should fail login with wrong password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);

      expect(response.body.message).toContain('Invalid');
    });

    it('should fail login with non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .expect(401);

      expect(response.body.message).toContain('Invalid');
    });

    it('should fail login with invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully and clear cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(200);

      expect(response.body.message).toContain('Logged out');
      expect(response.headers['set-cookie']).toBeDefined();
      const cookie = response.headers['set-cookie'][0];
      expect(cookie).toContain('access_token=');
    });
  });

  describe('GET /auth/me', () => {
    let authCookie: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      authCookie = response.headers['set-cookie'][0];
    });

    it('should return current user profile when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', 'access_token=invalid-token')
        .expect(401);
    });
  });

  describe('Auth Flow Integration', () => {
    it('should complete full auth flow: register -> logout -> login -> get profile', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(registerResponse.body.email).toBe(testUser.email);
      const registerCookie = registerResponse.headers['set-cookie'][0];

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', registerCookie)
        .expect(200);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      const loginCookie = loginResponse.headers['set-cookie'][0];

      const profileResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', loginCookie)
        .expect(200);

      expect(profileResponse.body.email).toBe(testUser.email);
      expect(profileResponse.body.name).toBe(testUser.name);
    });
  });
});
