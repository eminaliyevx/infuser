import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { User } from "@prisma/client";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { catchError, of, tap } from "rxjs";
import { IUserFilter } from "../interfaces";
import { TableService } from "../services/table.service";
import { UserComponent } from "../user/user.component";
import { UserService } from "./user.service";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    TableModule,
    FormsModule,
    DropdownModule,
    UserComponent,
    CommonModule,
    ConfirmDialogModule,
    RouterLink,
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  totalRecords!: number;
  genders = ["male", "female"];
  statuses = ["active", "inactive"];
  params!: IUserFilter;
  loading = false;
  showUserDialog = false;
  userId?: number;

  constructor(
    private readonly userService: UserService,
    private readonly tableService: TableService<IUserFilter>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.loading = true;
  }

  getUsers(params: IUserFilter) {
    this.userService.getUsers(params).subscribe(({ data, totalItems }) => {
      this.users = data;
      this.totalRecords = totalItems;
      this.loading = false;
    });
  }

  loadUsers(event?: TableLazyLoadEvent) {
    this.loading = true;

    if (!event) {
      this.getUsers(this.params);
      return;
    }

    const params = this.tableService.getParams(event);
    this.params = params;

    this.getUsers(params);
  }

  openUserDialog() {
    this.showUserDialog = true;
  }

  closeUserDialog() {
    this.showUserDialog = false;
    this.userId = undefined;
  }

  editUser(user: User) {
    this.userId = user.id;
    this.openUserDialog();
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this user?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.userService
          .deleteUser(user.id)
          .pipe(
            tap(() => {
              this.messageService.add({
                summary: "Success",
                detail: "User deleted",
                severity: "success",
                life: 3000,
              });
            }),
            catchError(() => {
              this.messageService.add({
                summary: "Error",
                detail: "An error occurred",
                severity: "error",
                life: 3000,
              });

              return of(null);
            }),
          )
          .subscribe((data) => {
            if (data) {
              this.loadUsers();
            }
          });
      },
    });
  }
}
