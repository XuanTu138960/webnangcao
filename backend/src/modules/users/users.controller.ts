import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm người dùng' })
  searchUsers(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.usersService.searchUsers(query, +page, +limit);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo username' })
  getProfile(@Param('username') username: string, @Request() req: any) {
    const currentUserId = req?.user?.id;
    return this.usersService.getUserProfile(username, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('profile')
  @ApiOperation({ summary: 'Cập nhật thông tin profile của bản thân' })
  updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/follow')
  @ApiOperation({ summary: 'Theo dõi người dùng' })
  followUser(@Request() req: any, @Param('id') followingId: string) {
    return this.usersService.followUser(req.user.id, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id/follow')
  @ApiOperation({ summary: 'Bỏ theo dõi người dùng' })
  unfollowUser(@Request() req: any, @Param('id') followingId: string) {
    return this.usersService.unfollowUser(req.user.id, followingId);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Lấy danh sách người theo dõi' })
  getFollowers(
    @Param('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.usersService.getFollowers(userId, +page, +limit);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Lấy danh sách đang theo dõi' })
  getFollowing(
    @Param('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.usersService.getFollowing(userId, +page, +limit);
  }

  @Get(':username/recipes')
  @ApiOperation({ summary: 'Lấy danh sách công thức của người dùng' })
  getUserRecipes(
    @Param('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    return this.usersService.getUserRecipes(username, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me/saved')
  @ApiOperation({ summary: 'Lấy công thức đã lưu của bản thân' })
  getSavedRecipes(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    return this.usersService.getSavedRecipes(req.user.id, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me/liked')
  @ApiOperation({ summary: 'Lấy công thức đã thích của bản thân' })
  getLikedRecipes(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    return this.usersService.getLikedRecipes(req.user.id, +page, +limit);
  }
}
