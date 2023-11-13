import {
  KMS,
  KmsKeyringNode,
  buildClient,
  MessageHeader,
} from "@aws-crypto/client-node";
import { EncryptionProvider } from "./interface.js";

function isVerifiedContext(
  messageHeader: MessageHeader,
  context: Record<string, string>
) {
  const { encryptionContext } = messageHeader;

  Object.entries(context).forEach(([key, value]) => {
    if (encryptionContext[key] !== value) return false;
  });

  return true;
}

export class AWSKMSProvider implements EncryptionProvider {
  private _client: ReturnType<typeof buildClient>;
  private _keyRing: InstanceType<typeof KmsKeyringNode>;

  constructor({
    clientConfig,
    generatorKeyARN,
    encryptorKeyARNS,
  }: {
    clientConfig: ConstructorParameters<typeof KMS>[0];
    generatorKeyARN: string;
    encryptorKeyARNS: string[];
  }) {
    this._client = buildClient();
    this._keyRing = new KmsKeyringNode({
      generatorKeyId: generatorKeyARN,
      keyIds: encryptorKeyARNS,
      clientProvider: (region) =>
        new KMS({
          ...clientConfig,
          region,
        }),
    });
  }
  async encrypt(
    context: Record<string, string>,
    data: string
  ): Promise<string> {
    const encryptedData = await this._client.encrypt(this._keyRing, data, {
      encryptionContext: context,
    });
    return encryptedData.result.toString("base64");
  }

  async decrypt(
    context: Record<string, string>,
    data: string
  ): Promise<string> {
    const { plaintext, messageHeader } = await this._client.decrypt(
      this._keyRing,
      Buffer.from(data, "base64")
    );

    if (!isVerifiedContext(messageHeader, context))
      throw new Error("Encryption Context does not match expected values");

    return plaintext.toString("utf8");
  }
}
