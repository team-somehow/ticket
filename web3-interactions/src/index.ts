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

import * as ethers from "ethers";

import { setGlobalOptions } from "firebase-functions/options";

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import QRCode from "qrcode";

import { createCanvas, loadImage } from "canvas";

import { byteCode } from "./bytecode";

import TicketProtocolImplementation from "./artifacts/gpt_contract.json";

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
    logger.error(`Error reading contract: ${error}`);
  }

  // const contractInvocation = await fetchedWallet.invokeContract({
  //   contractAddress: "0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8",
  //   method: "owner",
  //   args: [],
  // });
  // const result = await contractInvocation.wait();
  // console.log(`Contract invocation result: ${result}`);
});

initializeApp();

setGlobalOptions({
  timeoutSeconds: 1000,
  memory: "1GiB",
});
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = "0x40a124a1079251Ee683A6B301Bf3688416DaAA5A";
// const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
// const provider = new ethers.JsonRpcProvider(
// "bsc-testnet-dataseed.bnbchain.org"
// );

export const setUserScores = onRequest(async (request, response) => {
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  if (request.method !== "POST") {
    response.status(405).send({
      message: "Method not allowed",
    });
    return;
  }
  if (!request.body || !request.body.users || !request.body.scores) {
    response.status(400).send({
      message: "Invalid request",
    });
    return;
  }
  try {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      TicketProtocolImplementation.abi,
      wallet
    );
    contract.getDeployedCode().then((code) => {
      logger.info("Contract code", { code });
    });

    const tx = await contract.setFanScores(
      ["0x0Dd7D7Ad21d15A999dcc7218E7Df3F25700e696f"],
      ["35"]
    );
    logger.info("Transaction successful", { tx });
    // const receipt = await tx.wait();
    // logger.info("Transaction successful", { receipt });

    response.status(200).send({
      message: "Fan scores updated successfully",
      transactionHash: tx.hash,
    });
  } catch (error) {
    logger.error("Something went wrong", error);
    response.status(500).send({
      message: "Something went wrong",
      error,
    });
  }
});

export const test = onRequest(async (request, response) => {
  response.status(200).send({
    method: request.method,
    body: request.body,
    query: request.query,
  });
});

// export const onEventCreated = onDocumentWritten(
//   { document: "/events/{eventID}" },
//   async (event) => {
//     const snapshot = event.data;
//     const context = event.params;
//     logger.info("Event created", { snapshot, context });
//   }
// );

export const createContract = onRequest(async (request, response) => {
  logger.info(process.env.PRIVATE_KEY);

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const data = await getFirestore()
    .collection("events")
    .where("contractAddress", "==", null)
    .get();

  const contractAddresses: string[] = []; // Array to hold deployed contract addresses

  for (const doc of data.docs) {
    const eventId = doc.id;
    const eventData = doc.data();

    // Fetch constructor parameters from eventData
    const {
      name,
      symbol,
      ticketPrice,
      maxResalePrice,
      royaltyReceiver,
      royaltyFeeNumerator,
      baseTokenURI,
      minFanScore,
      totalTickets,
      stakeAmount,
    } = eventData;

    // Log the parameters to verify
    logger.info("Deploying contract with parameters:", {
      name,
      symbol,
      ticketPrice,
      maxResalePrice,
      royaltyReceiver,
      royaltyFeeNumerator,
      baseTokenURI,
      minFanScore,
      totalTickets,
      stakeAmount,
    });

    // Deploy the contract
    const factoryContract = new ethers.ContractFactory(
      TicketProtocolImplementation.abi,
      byteCode,
      wallet
    );

    try {
      const gasLimit = 3000000; // Adjust this value as needed
      const gasPrice = ethers.parseUnits("10", "gwei"); // Adjust gas price

      const contract = await factoryContract.deploy(
        name,
        symbol,
        ticketPrice,
        maxResalePrice,
        royaltyReceiver,
        royaltyFeeNumerator,
        baseTokenURI,
        minFanScore,
        totalTickets,
        stakeAmount,
        {
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        }
      );

      const contractAddress = await contract.getAddress();

      logger.info("Contract deployed", {
        newContractAddress: contractAddress,
      });

      // Update Firestore with the deployed contract address
      await getFirestore().collection("events").doc(eventId).update({
        contractAddress: contractAddress,
      });

      contractAddresses.push(contractAddress); // Store the address
    } catch (error) {
      logger.error("Error deploying contract", error);
      response.status(500).send({
        message: "Error deploying contract",
        error: error,
      });
      return; // Exit on error
    }
  }

  response.status(200).send(contractAddresses);
});

export const distributeTickets = onRequest(
  { cors: true },
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).send({
        message: "Method not allowed",
      });
      return;
    }

    const { eventId } = request.body;
    if (!eventId) {
      response.status(400).send({
        message: "Event ID is required",
      });
      return;
    }

    const db = getFirestore();

    try {
      // Retrieve event details
      const eventDoc = await db.collection("events").doc(eventId).get();
      if (!eventDoc.exists) {
        response.status(404).send({
          message: "Event not found",
        });
        return;
      }

      const eventData = eventDoc.data();
      const totalTickets = eventData?.totalTickets || 0;

      if (!eventData) {
        response.status(404).send({
          message: "Event not found",
        });
        return;
      }

      // Fetch all users who have applied for the event
      const userAppliedEventsRef = db.collection("user_applied_events");
      const querySnapshot = await userAppliedEventsRef
        .where("eventId", "==", eventId)
        .orderBy("score", "desc")
        .get();

      if (querySnapshot.empty) {
        response.status(404).send({
          message: "No applicants found for this event",
        });
        return;
      }

      // Distribute tickets to top participants based on score
      const topParticipants = querySnapshot.docs.slice(0, totalTickets);

      for (const doc of topParticipants) {
        const userRef = userAppliedEventsRef.doc(doc.id);
        const userData = doc.data();
        const qrData = `Event: ${eventData.name}, User: ${userData.address}`;

        // Generate QR code with custom colors
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
          color: {
            dark: "#000000", // Dark color for QR code
            light: "#ffffff", // Light color for background
          },
        });

        // Create a canvas to overlay text
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext("2d");

        // Load the QR code image
        const qrImage = await loadImage(qrCodeDataURL);
        ctx.drawImage(qrImage, 0, 0, 300, 300);

        // Add event name text
        ctx.font = "20px Arial";
        ctx.fillStyle = "#000000"; // Text color
        ctx.fillText(eventData.name, 10, 290); // Position text at the bottom

        // Convert canvas to data URL
        const finalQRCodeDataURL = canvas.toDataURL();

        // Upload QR code to Firebase Storage
        const storage = getStorage();
        const bucket = storage.bucket();
        const fileName = `qr-codes/${eventId}/${doc.id}.png`;
        const file = bucket.file(fileName);
        const buffer = Buffer.from(finalQRCodeDataURL.split(",")[1], "base64");

        await file.save(buffer, {
          metadata: { contentType: "image/png" },
          public: true, // Make the file publicly accessible
        });

        // Use the public URL directly
        const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Update Firestore with the QR code URL
        await userRef.update({ status: "accepted", nftUrl: url });
      }

      // Set status to "rejected" for users who didn't get tickets
      const rejectedParticipants = querySnapshot.docs.slice(totalTickets);

      for (const doc of rejectedParticipants) {
        const userRef = userAppliedEventsRef.doc(doc.id);
        await userRef.update({ status: "rejected" });
      }

      response.status(200).send({
        message: "Tickets distributed successfully",
        awardedUsers: topParticipants.map((doc) => doc.data()),
      });
    } catch (error) {
      logger.error("Error distributing tickets", error);
      response.status(500).send({
        message: "Something went wrong",
        error: error,
      });
    }
  }
);
