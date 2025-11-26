import { IsString, IsNumber, IsOptional, IsEnum, Min, MinLength, IsArray } from 'class-validator';

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  VILLA = 'VILLA',
  STUDIO = 'STUDIO',
}

export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export class CreateListingDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MinLength(5)
  address: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(0)
  bathrooms: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(ListingType)
  listingType: ListingType;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  amenities?: string[];
}
