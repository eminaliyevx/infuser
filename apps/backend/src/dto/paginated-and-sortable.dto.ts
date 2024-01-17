import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class PaginatedAndSortableDto {
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumberString()
  size?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderBy?: string;
}
