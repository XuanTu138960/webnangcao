import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CookbooksService } from './cookbooks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Cookbooks')
@Controller('cookbooks')
export class CookbooksController {
  constructor(private readonly cookbooksService: CookbooksService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('my')
  @ApiOperation({ summary: 'Lấy các bộ sưu tập của bản thân' })
  getMyCookbooks(@Request() req: any) {
    return this.cookbooksService.getUserCookbooks(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết bộ sưu tập' })
  getDetails(@Param('id') id: string) {
    return this.cookbooksService.getCookbookDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Tạo bộ sưu tập mới' })
  create(@Request() req: any, @Body() body: { name: string; description?: string }) {
    return this.cookbooksService.createCookbook(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/recipes/:recipeId')
  @ApiOperation({ summary: 'Thêm công thức vào bộ sưu tập' })
  addRecipe(
    @Request() req: any,
    @Param('id') id: string,
    @Param('recipeId') recipeId: string,
  ) {
    return this.cookbooksService.addRecipeToCookbook(id, recipeId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id/recipes/:recipeId')
  @ApiOperation({ summary: 'Xóa công thức khỏi bộ sưu tập' })
  removeRecipe(
    @Request() req: any,
    @Param('id') id: string,
    @Param('recipeId') recipeId: string,
  ) {
    return this.cookbooksService.removeRecipeFromCookbook(id, recipeId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bộ sưu tập' })
  deleteCookbook(@Request() req: any, @Param('id') id: string) {
    return this.cookbooksService.deleteCookbook(id, req.user.id);
  }
}
