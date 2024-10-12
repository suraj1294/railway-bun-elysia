import db from "./drizzle/db";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";

const getUsers = async () => {
  const res = await db.query.users.findMany();
  return res;
};

const addUser = async (email: string, password: string) => {
  const hash = await Bun.password.hash(password, { algorithm: "bcrypt" });

  const res = await db
    .insert(users)
    .values({
      fullName: email,
      email: email,
      role: "user",
      password: hash,
    })
    .returning();
  return res;
};

const checkUser = async (email: string, password: string) => {
  const res = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();

  if (res.length > 0) {
    const user = res[0];
    const hash = user.password;
    const isValid = await Bun.password.verify(password, hash, "bcrypt");
    return isValid;
  }

  return false;
};

const DeleUser = async (email: string) => {
  const res = await db.delete(users).where(eq(users.email, email)).returning();
  return res;
};

//console.log(await addUser("suraj@test.com", "suraj1294"));

//console.log(await checkUser("suraj@test.com", "suraj1294f"));

//console.log(await DeleUser("suraj@test.com"));

console.log(await getUsers());
