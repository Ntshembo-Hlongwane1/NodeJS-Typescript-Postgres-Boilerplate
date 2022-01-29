import Crypto from 'crypto';
import { config } from 'dotenv';
import { Hash } from '../Types/Hash';
config();

const key = process.env.cipher_key as string;
const iv = Crypto.randomBytes(16);
const algorithm = 'aes-256-ctr';

export const encrypt = (message: string): Hash => {
  const cipher = Crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash: Hash) => {
  const decipher = Crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};
