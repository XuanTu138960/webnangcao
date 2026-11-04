import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { RecipeCategory, DifficultyLevel } from '../../../entities/recipe.entity';

export class CreateRecipeDto {
  @ApiProperty({ description: 'Tên món ăn', example: 'Bò xào hành tây cần tây' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Mô tả món ăn' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Hình ảnh đại diện URL' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ enum: RecipeCategory, default: RecipeCategory.MON_CHINH })
  @IsEnum(RecipeCategory)
  category: RecipeCategory;

  @ApiProperty({ description: 'Nguyên liệu dạng JSON string hoặc text' })
  @IsNotEmpty()
  ingredients: string;

  @ApiProperty({ description: 'Hướng dẫn các bước nấu dạng JSON string hoặc text' })
  @IsNotEmpty()
  instructions: string;

  @ApiPropertyOptional({ description: 'Thời gian chuẩn bị (phút)', default: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prepTime?: number;

  @ApiPropertyOptional({ description: 'Thời gian nấu (phút)', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cookTime?: number;

  @ApiPropertyOptional({ description: 'Khẩu phần ăn (người)', default: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  servings?: number;

  @ApiPropertyOptional({ enum: DifficultyLevel, default: DifficultyLevel.TRUNG_BINH })
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @ApiPropertyOptional({ description: 'Nhãn chế độ ăn (JSON string hoặc comma separated)' })
  @IsOptional()
  @IsString()
  dietaryTags?: string;

  @ApiPropertyOptional({ description: 'Calories trên mỗi khẩu phần' })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional({ description: 'Mẹo nhà bếp' })
  @IsOptional()
  @IsString()
  kitchenTips?: string;

  @ApiPropertyOptional({ description: 'Video hướng dẫn URL' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'Nguồn gốc/Vùng miền món ăn' })
  @IsOptional()
  @IsString()
  origin?: string;
}

export class UpdateRecipeDto extends CreateRecipeDto {}

export class SearchRecipeQueryDto {
  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (tên hoặc nguyên liệu)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: RecipeCategory, description: 'Phân loại món' })
  @IsOptional()
  @IsEnum(RecipeCategory)
  category?: RecipeCategory;

  @ApiPropertyOptional({ description: 'Thời gian nấu tối đa (phút)' })
  @IsOptional()
  @IsNumber()
  maxCookTime?: number;

  @ApiPropertyOptional({ description: 'Tag dinh dưỡng/chế độ ăn' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Trang hiện tại', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Số lượng mỗi trang', default: 12 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Sắp xếp: newest, popular, rating', default: 'newest' })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class SmartFridgeDto {
  @ApiProperty({ description: 'Danh sách nguyên liệu đang có', example: ['thịt bò', 'hành tây', 'tỏi'] })
  @IsNotEmpty()
  ingredients: string[];
}
