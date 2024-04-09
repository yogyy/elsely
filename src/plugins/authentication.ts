import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

export const JwtPlugin = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "10m",
      iat: Math.floor(Date.now() / 1000),
    })
  )
  .derive({ as: "global" }, async ({ cookie: { token }, jwt }) => {
    const verified = await jwt.verify(token.value);

    return {
      isAuth: verified,
    };
  });
