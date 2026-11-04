import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'ID công thức', example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  recipeId: string;

  @ApiProperty({ description: 'Nội dung bình luận', example: 'Món này nấu rất ngon và chuẩn vị!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Đánh giá sao (1-5)', example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'ID bình luận cha nếu là câu trả lời' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
