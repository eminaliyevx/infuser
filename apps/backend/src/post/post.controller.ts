import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IOrderBy, IPagination } from "src/interfaces";
import { PaginationValidationPipe, SortValidationPipe } from "src/pipes";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostFilterDto } from "./dto/post-filter.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostService } from "./post.service";

@ApiTags("Post")
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getPosts(
    @Query() postFilterDto: PostFilterDto,
    @Query(new PaginationValidationPipe()) pagination: IPagination,
    @Query("orderBy", new SortValidationPipe(["title"]))
    orderBy: IOrderBy[],
  ) {
    return this.postService.findAll(postFilterDto, pagination, orderBy);
  }

  @Get(":id")
  async getPost(@Param("id", ParseIntPipe) id: number) {
    const post = await this.postService.findUnique(id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  @Post(":userId")
  async createPost(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(userId, createPostDto);
  }

  @Patch(":id")
  async updatePost(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postService.findUnique(id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.postService.update(id, updatePostDto);
  }

  @Delete(":id")
  async deletePost(@Param("id", ParseIntPipe) id: number) {
    const post = await this.postService.findUnique(id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.postService.delete(id);
  }
}
