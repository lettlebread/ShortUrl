import crypto from "crypto"

export const createHashString = (message?: string): string => {
  let str = message || Date.now().toString();
  return crypto.createHash('md5').update(str).digest('hex');
}