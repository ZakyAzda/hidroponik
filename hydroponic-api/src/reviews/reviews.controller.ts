import { Controller, Get, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Req, Post } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus } from '@prisma/client';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user.userId;
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get('public')
  findAllApproved() {
    return this.reviewsService.findAllApproved();
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, updateReviewStatusDto);
  }
}
