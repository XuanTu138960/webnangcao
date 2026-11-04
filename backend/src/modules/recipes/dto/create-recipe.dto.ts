import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Thịt bò tươi', description: 'Tên nguyên liệu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 300, description: 'Định lượng' })
  @Min(0.01)
  quantity: number;

  @ApiProperty({ example: 'gram', description: 'Đơn vị tính (gram, ml, muỗng, cái...)' })
  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class CreateStepDto {
  @ApiProperty({ example: 1, description: 'Thứ tự bước làm' })
  @IsInt()
  @Min(1)
  stepNumber: number;

  @ApiProperty({
    example: 'Thái mỏng thịt bò ướp với tỏi băm, tiêu đen và nước tương trong 15 phút.',
    description: 'Nội dung hướng dẫn chi tiết bước làm',
  })
  @IsString()
  @IsNotEmpty()
  instruction: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    description: 'Ảnh minh họa bước làm',
  })
  @IsOptional()
  @IsString()
  imageAttachment?: string;

  @ApiPropertyOptional({ example: 10, description: 'Thời gian ước tính bước làm (phút)' })
  @IsOptional()
  @IsInt()
  durationMinutes?: number;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'Bò Bít Tết Sốt Tiêu Đen', description: 'Tên món ăn' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Món bò mềm ngọt hòa quyện cùng sốt tiêu đen cay nồng chuẩn phong vị Âu.',
    description: 'Mô tả ngắn gợi cảm hứng',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2, description: 'Số lượng khẩu phần mặc định' })
  @IsInt()
  @Min(1)
  @Max(50)
  servingSize: number;

  @ApiPropertyOptional({ example: 15, description: 'Thời gian chuẩn bị (phút)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  prepTimeMinutes?: number;

  @ApiProperty({ example: 25, description: 'Thời gian nấu (phút)' })
  @IsInt()
  @Min(1)
  cookTimeMinutes: number;

  @ApiPropertyOptional({ example: 'Dễ', description: 'Độ khó (Dễ, Trung bình, Khó)' })
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    description: 'Ảnh đại diện món ăn',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'mon-chinh', description: 'Slug hoặc ID danh mục' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ type: [CreateIngredientDto], description: 'Danh sách nguyên liệu định lượng' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  ingredients: CreateIngredientDto[];

  @ApiProperty({ type: [CreateStepDto], description: 'Các bước chế biến theo thứ tự' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps: CreateStepDto[];
}
