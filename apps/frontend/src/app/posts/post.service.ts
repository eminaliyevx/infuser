import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Post } from "@prisma/client";
import { PaginatedData } from "shared";
import { IPostFilter } from "../interfaces/post-filter.interface";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(private readonly http: HttpClient) {}

  getPosts(postFilter: IPostFilter, userId?: number) {
    if (userId) {
      return this.http.get<PaginatedData<Post>>(`api/user/${userId}/posts`, {
        params: { ...postFilter },
      });
    }

    return this.http.get<PaginatedData<Post>>(`api/post`, {
      params: { ...postFilter },
    });
  }

  getPost(id: number) {
    return this.http.get<Post>(`api/post/${id}`);
  }

  createPost(userId: number, post: Omit<Post, "id">) {
    return this.http.post<Post>(`api/post/${userId}`, post, {
      headers: { "Content-Type": "application/json" },
    });
  }

  updatePost(post: Partial<Post>) {
    return this.http.patch<Post>(`api/post/${post.id}`, post, {
      headers: { "Content-Type": "application/json" },
    });
  }

  deletePost(id: number) {
    return this.http.delete<Post>(`api/post/${id}`);
  }
}
