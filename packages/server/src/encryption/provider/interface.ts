export interface EncryptionProvider {
  encrypt(context: Record<string, string>, data: string): Promise<string>;
  decrypt(context: Record<string, string>, data: string): Promise<string>;
}
