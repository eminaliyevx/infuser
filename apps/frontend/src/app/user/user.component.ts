import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { User } from "@prisma/client";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { catchError, of, tap } from "rxjs";
import { UserService } from "../users/user.service";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.css",
})
export class UserComponent implements OnChanges {
  @Input() showDialog = false;
  @Input() userId?: number;
  @Output() onClose = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  user: Partial<User> = {};
  genders = ["male", "female"];
  statuses = ["active", "inactive"];
  loading = false;

  constructor(
    private readonly userService: UserService,
    private messageService: MessageService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes["userId"]?.currentValue) {
      this.getUser(changes["userId"]?.currentValue as number);
    }
  }

  onHide(_event: any) {
    this.user = {};
    this.onClose.emit();
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe((data) => {
      this.user = data;
    });
  }

  saveUser() {
    this.loading = true;

    if (this.userId) {
      this.userService
        .updateUser(this.user)
        .pipe(
          tap(() => {
            this.messageService.add({
              summary: "Success",
              detail: "User updated",
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
            this.onHide(undefined);
            this.onSubmit.emit();
          }

          this.loading = false;
        });
    } else {
      this.userService
        .createUser(this.user as User)
        .pipe(
          tap(() => {
            this.messageService.add({
              summary: "Success",
              detail: "User created",
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
            this.onHide(undefined);
            this.onSubmit.emit();
          }

          this.loading = false;
        });
    }
  }
}
