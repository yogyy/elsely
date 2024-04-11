import { DatabaseError } from "pg";
import { db } from "@/db";
import Elysia, { Static, StatusMap } from "elysia";
import { UserSignInDTO, UserSignUpDTO } from "./auths.dto";
import { ElysiaCookie } from "elysia/dist/cookies";

type CreateUserPayload = Static<typeof UserSignUpDTO> & { id: string };
type SignInPayload = Static<typeof UserSignInDTO>;
interface SET {
  headers: Record<string, string> & {
    "Set-Cookie"?: string | string[];
  };
  status?: number | keyof StatusMap;
  redirect?: string;
  cookie?: Record<string, ElysiaCookie>;
}

const AuthControler = new Elysia({ name: "Controller.Auth" }).derive(
  {
    as: "scoped",
  },
  ({ set }) => {
    return {
      Controller: {
        async createUserxxx(payload: CreateUserPayload) {
          try {
            await db
              .insertInto("ely_user")
              .values(payload)
              .returning([
                "id",
                "email",
                "username",
                "name",
                "role",
                "password",
              ])
              .executeTakeFirstOrThrow();
          } catch (err) {
            console.log(err);
            if (err instanceof DatabaseError) {
              if (err.code === "23505") {
                const errorMessage =
                  err.constraint === "ky_user_email_key"
                    ? "Email address"
                    : "Username";

                set.status = 409;
                return new Error(`${errorMessage} already exists`);
              }
            } else {
              set.status = 500;
              return err;
            }
          }
        },
        async signinUserxxx(payload: SignInPayload) {
          try {
            const { email, password } = payload;
            await db
              .selectFrom("ely_user")
              .where("email", "=", email)
              .select(["id", "email", "username", "name", "role", "password"])
              .executeTakeFirstOrThrow();
          } catch (err) {
            set.status = 500;
            return err;
          }
        },
      },
    };
  }
);

export default AuthControler;
