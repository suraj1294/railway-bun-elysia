/**
 * Hono App
 */

import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import { logger } from "hono/logger";
import { addUser, checkUser } from "./lib/users-repo";
const app = new Hono();

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: JSON.parse(process.env.CORS_ORIGIN ?? "[]"),
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hono!"));

app.post("/sign-up", async (c) => {
  const body = await c.req.json();
  try {
    const res = await addUser(body.email, body.password);
    const { id, email, role } = res?.[0];
    return c.json({ ok: "true", data: { id, email, role } }, 200);
  } catch (e) {
    return c.json({ ok: "false", error: e }, 403);
  }
});

app.post("/sign-in", async (c) => {
  const body = await c.req.json();

  if (!body.email || !body.password) {
    return c.json({ ok: "false", error: "bad request" }, 404);
  }

  //check if user exists
  const isValid = await checkUser(body.email, body.password);

  if (isValid) {
    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; //15 minute

    const payload = {
      sub: body.email,
      exp: expiresAt,
    };

    const token = await sign(payload, process.env.JWT_SECRET as string);

    const expires = new Date(expiresAt * 1000);

    setCookie(c, "__Session", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires,
      sameSite: "None",
    });

    return c.json({ ok: "true", token }, 200);
  } else {
    return c.json({ ok: "false", error: "invalid username or password" }, 403);
  }
});

app.get("/profile", async (c) => {
  const token = getCookie(c, "__Session");

  if (token) {
    try {
      const payload = await verify(token, process.env.JWT_SECRET as string);
      return c.json(payload);
    } catch (e: any) {
      console.log(e?.name);
      return c.json({ ok: "false", message: "unauthorized" }, 401);
    }
  } else {
    console.log("here");
    return c.json({ ok: "false", message: "unauthorized" }, 401);
  }
});
app.onError(async (err, c) => {
  console.log(err);
  return c.json("internal server error", 500);
});

export default {
  fetch: app.fetch,
  port: process.env.PORT ?? 3000,
};

/**
 * Bun Server
 */

// const server = Bun.serve({
//   hostname: "::",
//   port: process.env.PORT ?? 3000,
//   fetch(request) {
//     return new Response("Welcome to Bun!");
//   },
// });

// console.log(`Listening on http://localhost:${server.port}`);

// ------------------------------------------------------------------------------------------------//
/**
 * Elysia App
 */

// import { Elysia, t } from "elysia";
// import { swagger } from "@elysiajs/swagger";

// const app = new Elysia()
//   .use(swagger())
//   .get("/", () => ({ ok: "true" }))
//   .post(
//     "/sign-in",
//     async (context) => {
//       const { set, body } = context;

//       if (await signIn(body)) {
//         set.status = 200;
//         return { ok: "true" };
//       } else {
//         set.status = 403;
//         return { ok: "false", error: "invalid username or password" };
//       }
//     },
//     {
//       body: t.Object({
//         username: t.String(),
//         password: t.String(),
//       }),
//     }
//   )
//   .listen({
//     hostname: "::",
//     port: process.env.PORT ?? 3000,
//   });

// export type App = typeof app;

// function signIn(body: { username: string; password: string }): Promise<any> {
//   return new Promise((resolve) => {
//     if (body.username === "suraj" && body.password === "suraj1294") resolve(1);
//     else resolve(0);
//   });
// }

// // const server = Bun.serve({
// //   hostname: "::",
// //   port: process.env.PORT ?? 3000,
// //   fetch(request) {
// //     return new Response("Welcome to Bun!");
// //   },
// // });

// // console.log(`Listening on http://localhost:${server.port}`);
