import db from "../drizzle/db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const addUser = async (email: string, password: string) => {
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

export const checkUser = async (email: string, password: string) => {
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
