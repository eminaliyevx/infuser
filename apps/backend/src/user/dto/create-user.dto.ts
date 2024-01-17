import { ApiProperty } from "@nestjs/swagger";
import { Gender, Status } from "@prisma/client";
import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: Gender,
  })
  @IsIn(Object.values(Gender))
  gender: Gender;

  @ApiProperty({
    enum: Status,
  })
  @IsIn(Object.values(Status))
  status: Status;
}
