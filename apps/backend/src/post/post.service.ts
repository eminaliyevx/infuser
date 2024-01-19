import { Injectable } from "@nestjs/common";
import { IOrderBy, IPagination } from "src/interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostFilterDto } from "./dto/post-filter.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    postFilterDto: PostFilterDto,
    pagination: IPagination,
    orderBy: IOrderBy[],
  ) {
    const { title } = postFilterDto;
    const { page, size, skip, take } = pagination;

    const count = await this.prismaService.post.count({
      where: {
        title: { contains: title, mode: "insensitive" },
      },
    });

    const data = await this.prismaService.post.findMany({
      where: {
        title: { contains: title, mode: "insensitive" },
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ id: "desc" }],
      skip,
      take,
      include: { user: true },
    });

    return {
      page,
      size,
      totalPages: Math.ceil(count / take),
      totalItems: count,
      data,
    };
  }

  async findPostsByUserId(
    userId: number,
    postFilterDto: PostFilterDto,
    pagination: IPagination,
    orderBy: IOrderBy[],
  ) {
    const { title } = postFilterDto;
    const { page, size, skip, take } = pagination;

    const count = await this.prismaService.post.count({
      where: {
        userId,
        title: { contains: title, mode: "insensitive" },
      },
    });

    const data = await this.prismaService.post.findMany({
      where: {
        userId,
        title: { contains: title, mode: "insensitive" },
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ id: "desc" }],
      skip,
      take,
      include: { user: true },
    });

    return {
      page,
      size,
      totalPages: Math.ceil(count / take),
      totalItems: count,
      data,
    };
  }

  async findUnique(id: number) {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  async create(userId: number, createPostDto: CreatePostDto) {
    return this.prismaService.post.create({
      data: { userId, ...createPostDto },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({
      data: updatePostDto,
      where: { id },
    });
  }

  async delete(id: number) {
    return this.prismaService.post.delete({ where: { id } });
  }
}
