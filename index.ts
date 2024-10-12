const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  fetch(request) {
    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port}`);

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
