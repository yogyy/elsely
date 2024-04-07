import { Elysia, t } from "elysia";
class Logger {
  log(value: string) {
    console.log(value);
  }
}

const app = new Elysia()
  .decorate("author", "Constantine")
  .decorate("logger", new Logger())
  .get(
    "/",
    ({ path, author }) => `Hello Elysia, you're in ${path} \nfrom ${author}`
  )
  .post(
    "/login",
    ({ body, logger, set }) => {
      set.status = 201;
      logger.log(JSON.stringify(body));
      return body;
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 5 }),
      }),
    }
  )
  .listen(8080, (server) => {
    console.log(`http://${server.hostname}:${server.port}`);
  });
