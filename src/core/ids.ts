import { nanoid } from "nanoid";

/** Generate a collision-resistant, client-side unique id. */
export function createId(): string {
  return nanoid(16);
}
