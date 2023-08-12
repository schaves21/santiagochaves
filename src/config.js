import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

/*
import { customAlphabet } from 'nanoid';

export function generateCartId() {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 25);
  return nanoid();
}
*/
