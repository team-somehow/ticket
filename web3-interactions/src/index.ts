/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Coinbase, readContract, Wallet } from "@coinbase/coinbase-sdk";

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

Coinbase.configureFromJson({
  filePath:
    "/Users/vinay/Desktop/Ongoing/ticket/web3-interactions/cdp_api_key.json",
});

export const helloWorld = onRequest(async (request, response) => {
  logger.info("Hello logs!", { structuredData: true });

  // let wallet = await Wallet.create({
  //   networkId: Coinbase.networks.BaseSepolia,
  // });
  // let address = await wallet.getDefaultAddress();
  // console.log(`Default address for the wallet: `, address.toString());

  // let data = wallet.export();
  // logger.info(`Wallet data: ${data}`);

  // wallet.saveSeed("owner.json");
  // console.log(
  //   `Seed for wallet ${wallet.getId()} successfully saved to ${"owner.json"}.`
  // );

  let fetchedWallet = await Wallet.fetch(
    "db8ee26d-7661-4d3b-a649-7e3296b184e1"
  );
  await fetchedWallet.loadSeed("owner.json");

  response.send(fetchedWallet);
  try {
    const balance = await readContract({
      networkId: "base-sepolia",
      contractAddress: "0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8",
      method: "stakeAmount",
      args: [],
    });
    logger.info(`Balance of the contract: ${balance}`);
  } catch (error) {
    logger.error(`Error reading contract: ${error?.message}`);
  }

  // const contractInvocation = await fetchedWallet.invokeContract({
  //   contractAddress: "0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8",
  //   method: "owner",
  //   args: [],
  // });
  // const result = await contractInvocation.wait();
  // console.log(`Contract invocation result: ${result}`);
});
