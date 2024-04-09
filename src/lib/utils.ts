import { JWTPayloadSpec } from "@elysiajs/jwt";
import { JWTPayload } from "../types";
import { nanoid } from "nanoid";

interface JwtSign {
  readonly sign: (
    morePayload: Record<string, string | number> & JWTPayloadSpec
  ) => Promise<string>;
}
async function generateToken(user: JWTPayload, jwt: JwtSign) {
  return await jwt.sign({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
}

const createIdx = (prefix = "", length = 22) => `${prefix}_${nanoid(length)}`;

export { generateToken, createIdx };
