import { Controller, Get, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles, UserRole } from 'src/auth/decorators/roles.decorator';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(id, updateReviewStatusDto);
  }
}
