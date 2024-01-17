import { Module } from "@nestjs/common";
import { PostService } from "src/post/post.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  providers: [UserService, PostService],
  controllers: [UserController],
})
export class UserModule {}
