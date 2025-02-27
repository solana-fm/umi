import {
  EddsaInterface,
  Keypair,
  Pda,
  publicKey,
  PublicKey,
  PublicKeyInput,
} from '@metaplex-foundation/umi';
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  toWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters';
import * as ed25519 from '@noble/ed25519';
import {
  Keypair as Web3JsKeypair,
  PublicKey as Web3JsPublicKey,
} from '@solana/web3.js';

export function createWeb3JsEddsa(): EddsaInterface {
  const generateKeypair = (): Keypair =>
    fromWeb3JsKeypair(Web3JsKeypair.generate());

  const createKeypairFromSecretKey = (secretKey: Uint8Array): Keypair =>
    fromWeb3JsKeypair(Web3JsKeypair.fromSecretKey(secretKey));

  const createKeypairFromSeed = (seed: Uint8Array): Keypair =>
    fromWeb3JsKeypair(Web3JsKeypair.fromSeed(seed));

  const isOnCurve = (input: PublicKeyInput): boolean =>
    Web3JsPublicKey.isOnCurve(toWeb3JsPublicKey(publicKey(input)));

  const findPda = (programId: PublicKeyInput, seeds: Uint8Array[]): Pda => {
    const [key, bump] = Web3JsPublicKey.findProgramAddressSync(
      seeds,
      toWeb3JsPublicKey(publicKey(programId))
    );
    return { ...fromWeb3JsPublicKey(key), bump };
  };

  const sign = (message: Uint8Array, keypair: Keypair): Uint8Array =>
    ed25519.sync.sign(message, keypair.secretKey.slice(0, 32));

  const verify = (
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: PublicKey
  ): boolean => ed25519.sync.verify(signature, message, publicKey.bytes);

  return {
    generateKeypair,
    createKeypairFromSecretKey,
    createKeypairFromSeed,
    isOnCurve,
    findPda,
    sign,
    verify,
  };
}
