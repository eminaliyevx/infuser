import { Injectable } from "@nestjs/common";
import { IOrderBy, IPagination } from "src/interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilterDto } from "./dto/user-filter.dto";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    userFilterDto: UserFilterDto,
    pagination: IPagination,
    orderBy: IOrderBy[],
  ) {
    const { name, email, gender, status } = userFilterDto;
    const { page, size, skip, take } = pagination;

    const count = await this.prismaService.user.count({
      where: {
        name: { contains: name, mode: "insensitive" },
        email: { contains: email, mode: "insensitive" },
        gender,
        status,
      },
    });

    const data = await this.prismaService.user.findMany({
      where: {
        name: { contains: name, mode: "insensitive" },
        email: { contains: email, mode: "insensitive" },
        gender,
        status,
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ id: "desc" }],
      skip,
      take,
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
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      data: updateUserDto,
      where: { id },
    });
  }

  async delete(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
