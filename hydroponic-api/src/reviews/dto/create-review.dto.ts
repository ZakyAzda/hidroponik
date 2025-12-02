import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}