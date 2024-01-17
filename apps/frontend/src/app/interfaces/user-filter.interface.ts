import { IPaginatedAndSortable } from "./paginated-and-sortable.interface";

export interface IUserFilter extends IPaginatedAndSortable {
  name: string;
  email: string;
  gender: string;
  status: string;
}
