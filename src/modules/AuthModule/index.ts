import { Elysia, t } from "elysia";
import { JwtPlugin } from "@/plugins/authentication";
import { UserSignInDTO, UserSignUpDTO } from "./auths.dto";
import { DatabaseError } from "pg";
import { AuthService } from "./auth.services";
import { createIdx, generateToken } from "@/lib/utils";
import { password } from "bun";

const authRoutes = new Elysia({ prefix: "/auth" })
  .use(JwtPlugin)
  .use(AuthService)
  .model({ "auth.signup": UserSignUpDTO, "auth.signin": UserSignInDTO })
  // .decorate("pass", password) /* using this make accessable to parent/main */
  .derive({ as: "local" }, () => {
    /* using this make accessable to config you choose, as: "type" */
    return { pass: password };
  })
  .post(
    "/signup",
    async ({ jwt, cookie: { token }, body, set, service, pass }) => {
      const { email, name, password, username } = body;

      try {
        const id = createIdx("user");
        const hashPW = await pass.hash(password);

        const newUser = await service.createUser({
          id,
          email,
          name,
          password: hashPW,
          username,
        });
        const access_token = await generateToken(newUser!, jwt);

        token.set({
          value: access_token,
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 60 * 60),
          secure: true,
        });

        return {
          token: access_token,
        };
      } catch (err) {
        console.log(err);
        if (err instanceof DatabaseError) {
          if (err.code === "23505") {
            const errorMessage =
              err.constraint === "ely_user_email_key"
                ? "Email address"
                : "Username";
            set.status = "Conflict";
            return new Error(`${errorMessage} already exists`);
          } else {
            set.status = "Bad Request";
            return err;
          }
        } else {
          set.status = "Internal Server Error";
          return err;
        }
      }
    },
    { body: "auth.signup" }
  )
  .post(
    "/signin",
    async ({ jwt, cookie: { token }, body, set, service, pass }) => {
      const { email, password } = body;
      try {
        const user = await service.findUser(email);

        if (!user) {
          set.status = "Not Found";
          return new Error("User Not Found");
        }

        const verified = await pass.verify(password, user.password);
        const access_token = await generateToken(user, jwt);

        if (!verified) {
          set.status = "Unauthorized";
          return new Error("Invalid Email or Password");
        }

        token.set({
          value: access_token,
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 60 * 60),
          secure: true,
        });

        return { token: access_token };
      } catch (err) {
        console.log(err);

        set.status = "Internal Server Error";
        return err;
      }
    },
    { body: "auth.signin" }
  )
  .post(
    "/signout",
    async ({ cookie: { token }, jwt, set, isAuth }) => {
      token.set({
        value: "",
        httpOnly: true,
        maxAge: 0,
        secure: true,
      });

      return new Response("Logout Successful");
    },
    {
      beforeHandle({ set, isAuth }) {
        if (!isAuth) {
          set.status = 401;
          return `Unauthorized`;
        }
      },
    }
  );

export default authRoutes;
