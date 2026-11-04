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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('recipe/:recipeId')
  @ApiOperation({ summary: 'Lấy tất cả bình luận của một công thức' })
  findByRecipe(@Param('recipeId') recipeId: string) {
    return this.commentsService.findByRecipe(recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Gửi bình luận hoặc đánh giá sao' })
  create(@Body() createDto: CreateCommentDto, @Request() req: any) {
    return this.commentsService.create(createDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bình luận' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.commentsService.remove(id, req.user);
  }
}
