import {
  Controller,
  Get,
  Patch,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê tổng quan hệ thống' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Danh sách người dùng hệ thống' })
  getAllUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllUsers(+page, +limit);
  }

  @Patch('users/:id/toggle-status')
  @ApiOperation({ summary: 'Khóa / Mở khóa tài khoản' })
  toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('recipes')
  @ApiOperation({ summary: 'Danh sách toàn bộ công thức' })
  getAllRecipes(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllRecipes(+page, +limit);
  }

  @Patch('recipes/:id/toggle-publish')
  @ApiOperation({ summary: 'Ẩn / Hiện công thức' })
  toggleRecipePublish(@Param('id') id: string) {
    return this.adminService.toggleRecipePublished(id);
  }

  @Patch('recipes/:id/toggle-featured')
  @ApiOperation({ summary: 'Bật / Tắt trạng thái nổi bật của món' })
  toggleRecipeFeatured(@Param('id') id: string) {
    return this.adminService.toggleRecipeFeatured(id);
  }

  @Get('comments')
  @ApiOperation({ summary: 'Danh sách bình luận' })
  getAllComments(@Query('page') page = 1, @Query('limit') limit = 30) {
    return this.adminService.getAllComments(+page, +limit);
  }

  @Patch('comments/:id/toggle-visibility')
  @ApiOperation({ summary: 'Ẩn / Hiện bình luận' })
  toggleCommentVisibility(@Param('id') id: string) {
    return this.adminService.toggleCommentVisibility(id);
  }
}
