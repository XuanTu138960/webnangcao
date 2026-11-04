import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  SearchRecipeQueryDto,
  SmartFridgeDto,
} from './dto/recipe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách công thức với tìm kiếm và lọc' })
  findAll(@Query() query: SearchRecipeQueryDto, @Request() req: any) {
    const currentUserId = req?.user?.id;
    return this.recipesService.findAll(query, currentUserId);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Lấy các món ăn thịnh hành' })
  getTrending(@Query('limit') limit = 8) {
    return this.recipesService.getTrending(+limit);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Lấy các món ăn mới nhất' })
  getLatest(@Query('limit') limit = 8) {
    return this.recipesService.getLatest(+limit);
  }

  @Post('smart-fridge')
  @ApiOperation({ summary: 'Tính năng Tủ Lạnh Thông Minh - gợi ý món ăn theo nguyên liệu' })
  findByIngredients(@Body() dto: SmartFridgeDto) {
    return this.recipesService.findByIngredients(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một công thức nấu ăn' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const currentUserId = req?.user?.id;
    return this.recipesService.findOne(id, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Đăng tải công thức nấu ăn mới' })
  create(@Body() createDto: CreateRecipeDto, @Request() req: any) {
    return this.recipesService.create(createDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật công thức nấu ăn' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRecipeDto,
    @Request() req: any,
  ) {
    return this.recipesService.update(id, updateDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa công thức nấu ăn' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.remove(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/like')
  @ApiOperation({ summary: 'Thích hoặc bỏ thích một công thức' })
  toggleLike(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.toggleLike(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/save')
  @ApiOperation({ summary: 'Lưu hoặc bỏ lưu công thức vào sổ tay' })
  toggleSave(@Param('id') id: string, @Request() req: any) {
    return this.recipesService.toggleSave(id, req.user.id);
  }
}
