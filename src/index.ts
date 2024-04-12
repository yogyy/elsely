import { Elysia } from "elysia";
import authRoutes from "./modules/AuthModule";
import cors from "@elysiajs/cors";
import postRoutes from "./modules/PostModule";
import swagger from "@elysiajs/swagger";

const app = new Elysia();

app
  // .use(cors({ origin: /.*\.localhost:3000/ }))
  .use(swagger())
  .group("/api", (route) => route.use(postRoutes).use(authRoutes))
  .listen(8080, (server) => {
    console.log(
      `🦊 Elysia is running at http://${server?.hostname}:${server?.port}`
    );
  });
