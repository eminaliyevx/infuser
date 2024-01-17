import { ApiProperty } from "@nestjs/swagger";
import { Gender, Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsIn, IsOptional, IsString, isEmpty } from "class-validator";
import { PaginatedAndSortableDto } from "src/dto";

export class UserFilterDto extends PaginatedAndSortableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    enum: Gender,
    required: false,
  })
  @Transform(({ value }) => (isEmpty(value) ? undefined : value))
  @IsOptional()
  @IsIn(Object.values(Gender))
  gender?: Gender;

  @ApiProperty({
    enum: Status,
    required: false,
  })
  @Transform(({ value }) => (isEmpty(value) ? undefined : value))
  @IsOptional()
  @IsIn(Object.values(Status))
  status?: Status;
}
