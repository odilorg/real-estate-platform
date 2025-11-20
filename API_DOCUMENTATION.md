# Real Estate Platform - API Documentation

## Overview

This document describes all available REST API endpoints for the Real Estate Platform. All endpoints use in-memory data storage and are ready to be replaced with database operations.

**Base URL:** `http://localhost:3001/api`

## Authentication

Protected endpoints require authentication via Clerk. Include the Clerk session token in your requests.

🔒 = Authentication required

---

## Properties

### GET /api/properties

Get all properties.

**Authentication:** None

**Response:**
```json
[
  {
    "id": "1",
    "title": "Modern 2-Bedroom Apartment",
    "description": "Beautiful apartment...",
    "propertyType": "APARTMENT",
    "listingType": "RENT",
    "price": 2500,
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "yearBuilt": 2018,
    "floor": 5,
    "totalFloors": 10,
    "parking": 1,
    "images": ["url1", "url2"],
    "amenities": ["PARKING", "ELEVATOR"],
    "userId": "user_123",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

---

### GET /api/properties/[id]

Get a single property by ID.

**Authentication:** None

**Parameters:**
- `id` (path) - Property ID

**Response:**
```json
{
  "id": "1",
  "title": "Modern 2-Bedroom Apartment",
  ...
}
```

**Error Responses:**
- `404` - Property not found

---

### POST /api/properties 🔒

Create a new property.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Modern 2-Bedroom Apartment",
  "description": "Beautiful apartment with stunning city views...",
  "propertyType": "APARTMENT",
  "listingType": "RENT",
  "price": 2500,
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "yearBuilt": 2018,
  "floor": 5,
  "totalFloors": 10,
  "parking": 1,
  "images": ["url1"],
  "amenities": ["PARKING", "ELEVATOR"]
}
```

**Validation Rules:**
- `title`: 10-100 characters
- `description`: minimum 50 characters
- `propertyType`: APARTMENT, HOUSE, CONDO, TOWNHOUSE, LAND, COMMERCIAL, VILLA, STUDIO
- `listingType`: SALE, RENT
- `price`: positive number
- `address`: minimum 5 characters
- `city`: minimum 2 characters
- `images`: 1-20 image URLs
- `amenities`: array of valid amenity values

**Response:**
```json
{
  "id": "9",
  "title": "Modern 2-Bedroom Apartment",
  "userId": "user_123",
  "createdAt": "2024-01-15T00:00:00.000Z",
  ...
}
```

**Error Responses:**
- `401` - Unauthorized
- `400` - Validation failed

---

### PUT /api/properties/[id] 🔒

Update a property.

**Authentication:** Required (must be property owner)

**Parameters:**
- `id` (path) - Property ID

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "price": 2800,
  "description": "Updated description..."
}
```

**Response:**
```json
{
  "id": "1",
  "title": "Updated Title",
  "updatedAt": "2024-01-20T00:00:00.000Z",
  ...
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not property owner)
- `404` - Property not found
- `400` - Validation failed

---

### DELETE /api/properties/[id] 🔒

Delete a property.

**Authentication:** Required (must be property owner)

**Parameters:**
- `id` (path) - Property ID

**Response:**
```json
{
  "message": "Property deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not property owner)
- `404` - Property not found

---

### GET /api/properties/search

Search and filter properties.

**Authentication:** None

**Query Parameters:**
- `query` - Search text (searches in title, description, address, city)
- `propertyType` - APARTMENT, HOUSE, CONDO, etc.
- `listingType` - SALE or RENT
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Number of bedrooms
- `bathrooms` - Minimum number of bathrooms
- `city` - City name (case-insensitive)
- `amenities` - Comma-separated list (e.g., "PARKING,POOL")
- `sort` - Sort field: price, area, bedrooms, createdAt (default)
- `order` - asc or desc (default: desc)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Example Request:**
```
GET /api/properties/search?propertyType=APARTMENT&listingType=RENT&minPrice=2000&maxPrice=3000&bedrooms=2&page=1&limit=10
```

**Response:**
```json
{
  "properties": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasMore": true
  },
  "filters": {
    "propertyType": "APARTMENT",
    "listingType": "RENT",
    "minPrice": 2000,
    "maxPrice": 3000,
    "bedrooms": 2
  }
}
```

---

## Favorites

### GET /api/favorites 🔒

Get all favorite properties for the current user.

**Authentication:** Required

**Response:**
```json
[
  {
    "id": "1",
    "title": "Modern 2-Bedroom Apartment",
    ...
  }
]
```

**Error Responses:**
- `401` - Unauthorized

---

### POST /api/favorites 🔒

Add a property to favorites.

**Authentication:** Required

**Request Body:**
```json
{
  "propertyId": "1"
}
```

**Response:**
```json
{
  "id": "1",
  "userId": "user_123",
  "propertyId": "1",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `400` - Property already in favorites or invalid request
- `404` - Property not found

---

### DELETE /api/favorites 🔒

Remove a property from favorites.

**Authentication:** Required

**Request Body:**
```json
{
  "propertyId": "1"
}
```

**Response:**
```json
{
  "message": "Favorite removed successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Favorite not found

---

## Users

### GET /api/users/me/properties 🔒

Get all properties listed by the current user.

**Authentication:** Required

**Response:**
```json
[
  {
    "id": "1",
    "title": "Modern 2-Bedroom Apartment",
    "userId": "user_123",
    ...
  }
]
```

**Error Responses:**
- `401` - Unauthorized

---

## Testing with cURL

### List all properties
```bash
curl http://localhost:3001/api/properties
```

### Get single property
```bash
curl http://localhost:3001/api/properties/1
```

### Search properties
```bash
curl "http://localhost:3001/api/properties/search?propertyType=APARTMENT&listingType=RENT&minPrice=2000&maxPrice=3000"
```

### Create property (requires authentication)
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Beautiful 3BR House",
    "description": "Spacious house with beautiful garden and modern amenities...",
    "propertyType": "HOUSE",
    "listingType": "SALE",
    "price": 450000,
    "address": "456 Oak Avenue",
    "city": "San Francisco",
    "state": "CA",
    "bedrooms": 3,
    "bathrooms": 2.5,
    "area": 2000,
    "images": ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"],
    "amenities": ["PARKING", "GARDEN", "GARAGE"]
  }'
```

---

## Data Store

All data is currently stored in-memory using the `DataStore` class in `src/lib/dataStore.ts`. The data store:

- Initializes with mock data from `src/lib/mockData.ts`
- Persists data only during the server session
- Resets when the server restarts
- Is easily replaceable with database operations

### Replacing with Database

To connect to a real database, modify the functions in `dataStore.ts` to use Prisma:

```typescript
// Instead of:
getAllProperties(): Property[] {
  return [...this.properties]
}

// Use:
async getAllProperties(): Promise<Property[]> {
  return await prisma.property.findMany()
}
```

All API routes are already designed to work with async/await, making the migration straightforward.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized to perform action)
- `404` - Not Found
- `500` - Internal Server Error
