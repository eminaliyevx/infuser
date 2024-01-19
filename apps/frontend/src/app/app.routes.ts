import { Routes } from "@angular/router";
import { PostsComponent } from "./posts/posts.component";
import { UsersComponent } from "./users/users.component";

export const routes: Routes = [
  { path: "users", component: UsersComponent },
  { path: "posts", component: PostsComponent },
  { path: "user/:userId/posts", component: PostsComponent },
  { path: "**", redirectTo: "/users" },
];
