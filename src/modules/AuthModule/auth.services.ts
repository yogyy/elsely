import Elysia, { Static } from "elysia";
import { db } from "@/db";
import { UserSignUpDTO } from "./auths.dto";

type CreateUserPayload = Static<typeof UserSignUpDTO> & { id: string };

export const AuthService = new Elysia({ name: "Service.Auth" }).derive(
  { as: "scoped" },
  () => {
    return {
      service: {
        async createUser(payload: CreateUserPayload) {
          try {
            const newUser = await db
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
              .executeTakeFirst();

            return newUser;
          } catch (err) {
            throw err;
          }
        },

        async findUser(email: string) {
          try {
            const user = await db
              .selectFrom("ely_user")
              .where("email", "=", email)
              .select(["id", "email", "username", "name", "role", "password"])
              .executeTakeFirst();

            return user;
          } catch (err) {
            throw err;
          }
        },
      },
    };
  }
);
