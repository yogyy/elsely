import { t } from "elysia";

export const UserSignUpDTO = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
  username: t.String({ minLength: 3 }),
  name: t.String({ minLength: 3 }),
});

export const UserSignInDTO = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});
