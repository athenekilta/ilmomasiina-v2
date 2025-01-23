import { hash, compare } from "bcrypt";

export function comparePassword(input: string, hashed: string) {
  return compare(input, hashed);
}

export const hashPassword = (password: string): Promise<string> => {
  return hash(password, 10);
};
