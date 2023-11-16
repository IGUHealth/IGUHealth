import crypto from "node:crypto";
import { EncryptionProvider } from "./interface.js";

export default class LocalEncryption implements EncryptionProvider {
  private _key: Buffer;
  private _alg: string;
  private _iv: Buffer;

  constructor({
    iv,
    key,
    algorithm,
  }: {
    key: Buffer;
    iv: Buffer;
    algorithm?: string;
  }) {
    this._key = key;
    this._iv = iv;
    this._alg = algorithm || "aes-256-cbc";
  }
  async encrypt(
    context: Record<string, string>,
    data: string
  ): Promise<string> {
    const cipher = crypto.createCipheriv(
      this._alg,
      Buffer.from(this._key),
      this._iv
    );
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  }
  async decrypt(
    context: Record<string, string>,
    data: string
  ): Promise<string> {
    let encryptedText = Buffer.from(data, "hex");
    let decipher = crypto.createDecipheriv(
      this._alg,
      Buffer.from(this._key),
      this._iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
