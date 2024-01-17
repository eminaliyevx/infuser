import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { User } from "@prisma/client";
import { PaginatedData } from "shared";
import { IUserFilter } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUsers(userFilter: IUserFilter) {
    return this.http.get<PaginatedData<User>>("api/user", {
      params: { ...userFilter },
    });
  }

  getUser(id: number) {
    return this.http.get<User>(`api/user/${id}`);
  }

  createUser(user: Omit<User, "id">) {
    return this.http.post<User>("api/user", user, {
      headers: { "Content-Type": "application/json" },
    });
  }

  updateUser(user: Partial<User>) {
    return this.http.patch<User>(`api/user/${user.id}`, user, {
      headers: { "Content-Type": "application/json" },
    });
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`api/user/${id}`);
  }
}
