import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import type { Post } from "@prisma/client";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { catchError, of, tap } from "rxjs";
import type { PostWithUser } from "shared";
import { IPostFilter } from "../interfaces/post-filter.interface";
import { PostComponent } from "../post/post.component";
import { TableService } from "../services/table.service";
import { UserComponent } from "../user/user.component";
import { PostService } from "./post.service";

@Component({
  selector: "app-posts",
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
    PostComponent,
  ],
  templateUrl: "./posts.component.html",
  styleUrl: "./posts.component.css",
})
export class PostsComponent {
  posts: PostWithUser[] = [];
  totalRecords!: number;
  params!: IPostFilter;
  loading = false;
  showPostDialog = false;
  postId?: number;
  userId?: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postService: PostService,
    private readonly tableService: TableService<IPostFilter>,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.userId = this.route.snapshot.params["userId"];
  }

  getPosts(params: IPostFilter) {
    this.postService
      .getPosts(params, this.userId)
      .subscribe(({ data, totalItems }) => {
        this.posts = data;
        this.totalRecords = totalItems;
        this.loading = false;
      });
  }

  loadPosts(event?: TableLazyLoadEvent) {
    this.loading = true;

    if (!event) {
      this.getPosts(this.params);
      return;
    }

    const params = this.tableService.getParams(event);
    this.params = params;

    this.getPosts(params);
  }

  openPostDialog() {
    this.showPostDialog = true;
  }

  closePostDialog() {
    this.showPostDialog = false;
    this.postId = undefined;
  }

  editPost(post: Post) {
    this.postId = post.id;
    this.openPostDialog();
  }

  deletePost(post: Post) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this post?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.postService
          .deletePost(post.id)
          .pipe(
            tap(() => {
              this.messageService.add({
                summary: "Success",
                detail: "Post deleted",
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
              this.loadPosts();
            }
          });
      },
    });
  }
}
