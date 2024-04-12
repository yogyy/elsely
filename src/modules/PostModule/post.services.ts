import Elysia from "elysia";
import { db } from "@/db";

interface CreatePostPayload {
  id: string;
  author_id: string;
  content: string;
}

const PostService = new Elysia({ name: "Post.Service" }).derive(
  { as: "scoped" },
  () => {
    return {
      Service: {
        async getAllPost() {
          return await db.selectFrom("ely_post").selectAll().execute();
        },
        async getById(id: string) {
          return await db
            .selectFrom("ely_post")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();
        },
        async createPost(payload: CreatePostPayload) {
          return await db
            .insertInto("ely_post")
            .values(payload)
            .returningAll()
            .executeTakeFirst();
        },
        async updatePost(id: string, content: string, author_id: string) {
          return await db
            .updateTable("ely_post")
            .set({ content })
            .where((eb) => eb.and({ id, author_id }))
            .returningAll()
            .executeTakeFirstOrThrow();
        },
        async deletePost(id: string, author_id: string) {
          return await db
            .deleteFrom("ely_post")
            .where((eb) => eb.and({ id, author_id }))
            .returning(["id"])
            .executeTakeFirstOrThrow();
        },
      },
    };
  }
);

export default PostService;
