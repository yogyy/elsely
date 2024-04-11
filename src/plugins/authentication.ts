import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

interface User {
  id: string;
  email: string;
  name: string;
}

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
    let user: User | undefined;
    if (verified && typeof verified === "object") {
      user = {
        id: verified.sub as string,
        name: verified.name as string,
        email: verified.email as string,
      };
    }
    return {
      isAuth: verified,
      user,
    };
  });
