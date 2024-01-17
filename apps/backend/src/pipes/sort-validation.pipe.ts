import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { IOrderBy } from "src/interfaces";

@Injectable()
export class SortValidationPipe implements PipeTransform {
  constructor(private readonly fields: string[]) {}

  transform(value: string) {
    if (!value) {
      return [];
    }

    const sortRegex = /^([a-zA-Z]+):(asc|desc)$/;
    const fields = value.split(",");
    const orderBy = [];

    fields.forEach((field) => {
      if (!field.match(sortRegex)) {
        throw new BadRequestException("Invalid sort field");
      }

      const [property, direction] = field.split(":");

      if (!this.fields.includes(property)) {
        throw new BadRequestException("Invalid sort property");
      }

      orderBy.push({ [property]: direction });
    });

    return orderBy;
  }
}
