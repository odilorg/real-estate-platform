import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.listing.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async create(userId: string, dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...dto,
        images: JSON.stringify(dto.images || []),
        amenities: JSON.stringify(dto.amenities || []),
        state: dto.state || '',
        zipCode: dto.zipCode || '',
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    const updateData: any = { ...dto };
    if (dto.images) {
      updateData.images = JSON.stringify(dto.images);
    }
    if (dto.amenities) {
      updateData.amenities = JSON.stringify(dto.amenities);
    }

    return this.prisma.listing.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.listing.delete({ where: { id } });

    return { message: 'Listing deleted successfully' };
  }
}
