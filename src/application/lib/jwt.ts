import JWT from "jsonwebtoken";
import NodeRSA from "node-rsa";
import { logger } from "./logger";
import { BadRequestError } from "../errors";
import { KeyModel } from "../infra/database/mongo/models/key-model";

const model = new KeyModel().getModel();

export type VerifyJwtPayload = {
  user_id: string;
  email: string;
};

export async function makeJwt() {
  let keyPair = await model.findOne({ name: "jwt" });

  if (!keyPair) {
    const rsa = new NodeRSA({ b: 256 });

    const keys = rsa.generateKeyPair();

    const privateKey = keys.exportKey("pkcs1-private");
    const publicKey = keys.exportKey("pkcs1-public");

    keyPair = await model.create({
      name: "jwt",
      publicKey,
      privateKey,
    });
  }

  return {
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey,
  };
}

export async function signJwt(payload: VerifyJwtPayload) {
  try {
    const keyPair = await makeJwt();

    if (!keyPair) {
      throw new BadRequestError("Missing key pair");
    }

    const { privateKey } = keyPair;

    const token = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1d",
    });

    return token;
  } catch (error) {
    logger.error(error);
    throw new BadRequestError("Failed to verify token");
  }
}

export async function verifyJwt(token: string) {
  try {
    const keyPair = await makeJwt();

    if (!keyPair) {
      throw new BadRequestError("Missing key pair");
    }

    const { publicKey } = keyPair;

    const payload = JWT.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
    return payload;
  } catch (error) {
    logger.error(error);
    throw new BadRequestError("Failed to sign token");
  }
}
