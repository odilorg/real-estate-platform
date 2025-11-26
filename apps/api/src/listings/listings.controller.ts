import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Get()
  @Public()
  async findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() dto: CreateListingDto) {
    const user = req.user as { id: string };
    return this.listingsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Req() req: Request, @Body() dto: UpdateListingDto) {
    const user = req.user as { id: string };
    return this.listingsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.listingsService.remove(id, user.id);
  }
}
