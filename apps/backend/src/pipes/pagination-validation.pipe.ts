import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UserFilterDto } from "src/user/dto/user-filter.dto";

@Injectable()
export class PaginationValidationPipe implements PipeTransform {
  transform(value: UserFilterDto) {
    const page = parseInt(value.page) || 1;
    const size = parseInt(value.size) || 10;

    if (isNaN(page) || isNaN(size) || page < 1 || size < 1) {
      throw new BadRequestException("Invalid pagination params");
    }

    const take = size;
    const skip = (page - 1) * take;

    return { page, size, skip, take };
  }
}
