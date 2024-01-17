import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginatedAndSortableDto } from "src/dto";

export class PostFilterDto extends PaginatedAndSortableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;
}
