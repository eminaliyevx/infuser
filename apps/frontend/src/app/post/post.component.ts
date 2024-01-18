import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import type { Post, User } from "@prisma/client";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ToastModule } from "primeng/toast";
import { catchError, of, tap } from "rxjs";
import { PostService } from "../posts/post.service";
import { UserService } from "../users/user.service";

@Component({
  selector: "app-post",
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    CommonModule,
  ],
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.css",
})
export class PostComponent implements OnInit, OnChanges {
  @Input() showDialog = false;
  @Input() postId?: number;
  @Output() onClose = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  post: Partial<Post> = {};
  loading = false;
  userId?: number;
  selectedUser?: User;
  users: User[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params["userId"];

    if (!this.userId) {
      this.userService
        .getUsers({
          page: 1,
          size: 100,
          orderBy: "",
          name: "",
          email: "",
          gender: "",
          status: "",
        })
        .subscribe(({ data }) => {
          this.users = data;
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["postId"]?.currentValue) {
      this.getPost(changes["postId"]?.currentValue as number);
    }
  }

  onHide(_event: any) {
    this.post = {};
    this.selectedUser = undefined;
    this.onClose.emit();
  }

  getPost(id: number) {
    this.postService.getPost(id).subscribe((data) => {
      this.post = data;
    });
  }

  savePost() {
    this.loading = true;

    if (this.postId) {
      this.postService
        .updatePost(this.post)
        .pipe(
          tap(() => {
            this.messageService.add({
              summary: "Success",
              detail: "Post updated",
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
      this.postService
        .createPost(
          (this.userId as number) || (this.selectedUser?.id as number),
          this.post as Post,
        )
        .pipe(
          tap(() => {
            this.messageService.add({
              summary: "Success",
              detail: "Post created",
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
