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
import { PostFilterDto } from "src/post/dto/post-filter.dto";
import { PostService } from "src/post/post.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilterDto } from "./dto/user-filter.dto";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get()
  async getUsers(
    @Query() userFilterDto: UserFilterDto,
    @Query(new PaginationValidationPipe()) pagination: IPagination,
    @Query(
      "orderBy",
      new SortValidationPipe(["name", "email", "gender", "status"]),
    )
    orderBy: IOrderBy[],
  ) {
    return this.userService.findAll(userFilterDto, pagination, orderBy);
  }

  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number) {
    const user = await this.userService.findUnique(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(":id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.findUnique(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseIntPipe) id: number) {
    const user = await this.userService.findUnique(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.userService.delete(id);
  }

  @Get(":id/posts")
  async getPostsByUserId(
    @Param("id", ParseIntPipe) id: number,
    @Query() postFilterDto: PostFilterDto,
    @Query(new PaginationValidationPipe()) pagination: IPagination,
    @Query("orderBy", new SortValidationPipe(["name"]))
    orderBy: IOrderBy[],
  ) {
    const user = await this.userService.findUnique(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.postService.findPostsByUserId(
      id,
      postFilterDto,
      pagination,
      orderBy,
    );
  }
}
