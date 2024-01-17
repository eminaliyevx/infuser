import { Injectable } from "@angular/core";
import { TableLazyLoadEvent } from "primeng/table";
import { IPaginatedAndSortable } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class TableService<T extends IPaginatedAndSortable> {
  getParams(event: TableLazyLoadEvent) {
    let params: T = {
      page: 1,
      size: 10,
      orderBy: "",
    } as T;

    if (
      event.first !== undefined &&
      event.rows !== undefined &&
      event.rows !== null
    ) {
      params.page = event.first / event.rows + 1;
      params.size = event.rows;
    }

    if (event.multiSortMeta && event.multiSortMeta.length > 0) {
      params.orderBy = event.multiSortMeta
        .map((value) => `${value.field}:${value.order === 1 ? "asc" : "desc"}`)
        .join(",");
    }

    if (event.filters) {
      Object.entries(event.filters).forEach(([key, value]) => {
        if (value && !Array.isArray(value)) {
          params[key as keyof T] = value.value || "";
        }
      });
    }

    return params;
  }
}
