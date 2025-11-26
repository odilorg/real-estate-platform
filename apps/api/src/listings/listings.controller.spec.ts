import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('ListingsController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authCookie: string;
  let userId: string;

  const testUser = {
    email: 'listings-test@example.com',
    password: 'password123',
    name: 'Listings Test User',
  };

  const validListing = {
    title: 'Beautiful Modern Apartment',
    description: 'A stunning apartment with great views and modern amenities throughout.',
    price: 250000,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    images: ['https://example.com/image1.jpg'],
    amenities: ['PARKING', 'ELEVATOR'],
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

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    authCookie = response.headers['set-cookie'][0];
    userId = response.body.id;
  });

  afterAll(async () => {
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('GET /listings', () => {
    it('should return empty array when no listings exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/listings')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all listings', async () => {
      // Create a listing first
      await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing);

      const response = await request(app.getHttpServer())
        .get('/listings')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(validListing.title);
    });

    it('should return listings without authentication (public endpoint)', async () => {
      await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing);

      const response = await request(app.getHttpServer())
        .get('/listings')
        .expect(200);

      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /listings/:id', () => {
    it('should return a single listing by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing);

      const listingId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/listings/${listingId}`)
        .expect(200);

      expect(response.body.id).toBe(listingId);
      expect(response.body.title).toBe(validListing.title);
      expect(response.body.user).toBeDefined();
    });

    it('should return 404 for non-existent listing', async () => {
      const response = await request(app.getHttpServer())
        .get('/listings/non-existent-id')
        .expect(404);

      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /listings', () => {
    it('should create a new listing when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(validListing.title);
      expect(response.body.price).toBe(validListing.price);
      expect(response.body.userId).toBe(userId);
    });

    it('should fail to create listing without authentication', async () => {
      await request(app.getHttpServer())
        .post('/listings')
        .send(validListing)
        .expect(401);
    });

    it('should fail with invalid title (too short)', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send({ ...validListing, title: 'Hi' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should fail with invalid description (too short)', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send({ ...validListing, description: 'Short desc' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should fail with negative price', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send({ ...validListing, price: -100 })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should fail with invalid property type', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send({ ...validListing, propertyType: 'INVALID' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should fail with invalid listing type', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send({ ...validListing, listingType: 'INVALID' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should create listing with optional fields omitted', async () => {
      const minimalListing = {
        title: 'Minimal Listing Title',
        description: 'This is a minimal listing description that meets the requirements.',
        price: 100000,
        address: '456 Test Ave',
        city: 'Boston',
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        propertyType: 'APARTMENT',
        listingType: 'RENT',
      };

      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(minimalListing)
        .expect(201);

      expect(response.body.title).toBe(minimalListing.title);
    });
  });

  describe('PATCH /listings/:id', () => {
    let listingId: string;

    beforeEach(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing);

      listingId = createResponse.body.id;
    });

    it('should update listing when authenticated as owner', async () => {
      const updateData = { title: 'Updated Listing Title' };

      const response = await request(app.getHttpServer())
        .patch(`/listings/${listingId}`)
        .set('Cookie', authCookie)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(validListing.description);
    });

    it('should update multiple fields', async () => {
      const updateData = {
        title: 'Completely Updated Title',
        price: 350000,
        bedrooms: 4,
      };

      const response = await request(app.getHttpServer())
        .patch(`/listings/${listingId}`)
        .set('Cookie', authCookie)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.bedrooms).toBe(updateData.bedrooms);
    });

    it('should fail to update without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/listings/${listingId}`)
        .send({ title: 'Unauthorized Update' })
        .expect(401);
    });

    it('should fail to update non-existent listing', async () => {
      await request(app.getHttpServer())
        .patch('/listings/non-existent-id')
        .set('Cookie', authCookie)
        .send({ title: 'Update Non-existent' })
        .expect(404);
    });

    it('should fail to update listing owned by another user', async () => {
      // Register another user
      const otherUser = {
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User',
      };

      const otherResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(otherUser);

      const otherCookie = otherResponse.headers['set-cookie'][0];

      // Try to update the first user listing
      const response = await request(app.getHttpServer())
        .patch(`/listings/${listingId}`)
        .set('Cookie', otherCookie)
        .send({ title: 'Unauthorized Update' })
        .expect(403);

      expect(response.body.message).toContain('own');
    });
  });

  describe('DELETE /listings/:id', () => {
    let listingId: string;

    beforeEach(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing);

      listingId = createResponse.body.id;
    });

    it('should delete listing when authenticated as owner', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/listings/${listingId}`)
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.message).toContain('deleted');

      // Verify listing is deleted
      await request(app.getHttpServer())
        .get(`/listings/${listingId}`)
        .expect(404);
    });

    it('should fail to delete without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/listings/${listingId}`)
        .expect(401);
    });

    it('should fail to delete non-existent listing', async () => {
      await request(app.getHttpServer())
        .delete('/listings/non-existent-id')
        .set('Cookie', authCookie)
        .expect(404);
    });

    it('should fail to delete listing owned by another user', async () => {
      // Register another user
      const otherUser = {
        email: 'delete-other@example.com',
        password: 'password123',
        name: 'Delete Other User',
      };

      const otherResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(otherUser);

      const otherCookie = otherResponse.headers['set-cookie'][0];

      // Try to delete the first user listing
      const response = await request(app.getHttpServer())
        .delete(`/listings/${listingId}`)
        .set('Cookie', otherCookie)
        .expect(403);

      expect(response.body.message).toContain('own');
    });
  });

  describe('Listings CRUD Integration', () => {
    it('should complete full CRUD flow', async () => {
      // CREATE
      const createResponse = await request(app.getHttpServer())
        .post('/listings')
        .set('Cookie', authCookie)
        .send(validListing)
        .expect(201);

      const listingId = createResponse.body.id;
      expect(createResponse.body.title).toBe(validListing.title);

      // READ (single)
      const readResponse = await request(app.getHttpServer())
        .get(`/listings/${listingId}`)
        .expect(200);

      expect(readResponse.body.id).toBe(listingId);

      // READ (all)
      const listResponse = await request(app.getHttpServer())
        .get('/listings')
        .expect(200);

      expect(listResponse.body).toHaveLength(1);

      // UPDATE
      const updateResponse = await request(app.getHttpServer())
        .patch(`/listings/${listingId}`)
        .set('Cookie', authCookie)
        .send({ title: 'Updated Title', price: 300000 })
        .expect(200);

      expect(updateResponse.body.title).toBe('Updated Title');
      expect(updateResponse.body.price).toBe(300000);

      // DELETE
      await request(app.getHttpServer())
        .delete(`/listings/${listingId}`)
        .set('Cookie', authCookie)
        .expect(200);

      // VERIFY deletion
      await request(app.getHttpServer())
        .get(`/listings/${listingId}`)
        .expect(404);

      const finalListResponse = await request(app.getHttpServer())
        .get('/listings')
        .expect(200);

      expect(finalListResponse.body).toHaveLength(0);
    });
  });
});
