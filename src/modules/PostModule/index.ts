import { JwtPlugin } from "@/plugins/authentication";
import Elysia, { t } from "elysia";
import PostService from "./post.services";
import { createIdx } from "@/lib/utils";
import { NoResultError } from "kysely";

const postRoutes = new Elysia({ prefix: "/posts" })
  .use(PostService)
  .use(JwtPlugin)
  .onBeforeHandle(({ isAuth, set }) => {
    if (!isAuth) {
      set.status = 401;
      return `Unauthorized`;
    }
  })
  .get("/", async ({ Service }) => {
    const posts = await Service.getAllPost();

    return posts;
  })
  .get(
    "/:id",
    async ({ Service, params, set }) => {
      const post = await Service.getById(params.id);
      if (!post) {
        set.status = "Not Found";
        throw new Error("post not found");
      }
      return post;
    },
    { params: t.Object({ id: t.String() }) }
  )

  .post(
    "/",
    async ({ Service, body, user }) => {
      const { content } = body;
      const id = createIdx("post", 18);

      const newpost = await Service.createPost({
        id,
        content,
        author_id: user!.id,
      });

      return newpost;
    },
    {
      body: t.Object({ content: t.String() }),
    }
  )
  .patch(
    "/:id",
    async ({ Service, body, set, params, user }) => {
      const postId = params.id;
      const { content } = body;
      try {
        const updatedPost = await Service.updatePost(postId, content, user!.id);

        return updatedPost;
      } catch (err) {
        console.log(err);
        if (err instanceof NoResultError) {
          set.status = "Not Found";
          throw new Error("post not found");
        } else {
          set.status = "Internal Server Error";
        }
      }
    },
    { body: t.Object({ content: t.String() }) }
  )
  .delete(
    "/:id",
    async ({ Service, set, params, user }) => {
      try {
        const deleted = await Service.deletePost(params.id, user!.id);

        set.status = "OK";
        return {
          message: `${deleted.id} deleted`,
        };
      } catch (err) {
        console.log(err);
        if (err instanceof NoResultError) {
          set.status = "Not Found";
          throw new Error("post not found");
        } else {
          set.status = "Internal Server Error";
        }
      }
    },
    { params: t.Object({ id: t.String() }) }
  );

export default postRoutes;
