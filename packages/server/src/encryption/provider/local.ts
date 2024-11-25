import crypto, { BinaryLike, CipherGCMTypes, CipherKey } from "node:crypto";

import { EncryptionProvider } from "./interface.js";

export default class LocalEncryption implements EncryptionProvider {
  private _key: Buffer;
  private _alg: CipherGCMTypes;
  private _iv: Buffer;

  constructor({
    iv,
    key,
    algorithm,
  }: {
    key: Buffer;
    iv: Buffer;
    algorithm?: CipherGCMTypes;
  }) {
    this._key = key;
    this._iv = iv;
    this._alg = algorithm ?? ("aes-256-cbc" as CipherGCMTypes);
  }
  async encrypt(
    context: Record<string, string>,
    data: string,
  ): Promise<string> {
    const cipher = crypto.createCipheriv(
      this._alg,
      this._key as CipherKey,
      this._iv as BinaryLike,
    );
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([
      encrypted as Uint8Array<ArrayBufferLike>,
      cipher.final() as Uint8Array<ArrayBufferLike>,
    ]);
    return encrypted.toString("hex");
  }
  async decrypt(
    context: Record<string, string>,
    data: string,
  ): Promise<string> {
    const encryptedText = Buffer.from(data, "hex");
    const decipher = crypto.createDecipheriv(
      this._alg,
      this._key as CipherKey,
      this._iv as BinaryLike,
    );

    let decrypted = decipher.update(
      encryptedText as Uint8Array<ArrayBufferLike>,
    );
    decrypted = Buffer.concat([
      decrypted as Uint8Array<ArrayBufferLike>,
      decipher.final() as Uint8Array<ArrayBufferLike>,
    ]);
    return decrypted.toString();
  }
}
