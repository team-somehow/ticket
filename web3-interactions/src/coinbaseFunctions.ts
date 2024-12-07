import { Wallet, readContract } from "@coinbase/coinbase-sdk";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";

// Function to fetch wallet and balance
export const fetchWalletAndBalance = async (walletId: string) => {
  let fetchedWallet = await Wallet.fetch(
    "db8ee26d-7661-4d3b-a649-7e3296b184e1"
  );
  await fetchedWallet.loadSeed("owner.json");

  try {
    const balance = await readContract({
      networkId: "base-sepolia",
      contractAddress: "0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8",
      method: "stakeAmount",
      args: [],
    });
    logger.info(`Balance of the contract: ${balance}`);
    return { wallet: fetchedWallet, balance };
  } catch (error) {
    logger.error(`Error reading contract: ${error}`);
    throw error;
  }
};

// Function to set user scores
export const setUserScores = async (
  contractAddress: string,
  scores: string[],
  wallet: Wallet
) => {
  const tx = await wallet.invokeContract({
    contractAddress,
    method: "setFanScores",
    args: [["0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8"], scores],
  });
  logger.info("Transaction successful", { tx });
  return tx;
};

// Function to distribute tickets
export const distributeTickets = async (eventId: string) => {
  const db = getFirestore();
  const { wallet } = await fetchWalletAndBalance(
    "db8ee26d-7661-4d3b-a649-7e3296b184e1"
  );

  const eventDoc = await db.collection("events").doc(eventId).get();
  if (!eventDoc.exists) {
    throw new Error("Event not found");
  }

  const eventData = eventDoc.data();
  const totalTickets = eventData?.totalTickets || 0;

  const userAppliedEventsRef = db.collection("user_applied_events");
  const querySnapshot = await userAppliedEventsRef
    .where("eventId", "==", eventId)
    .orderBy("score", "desc")
    .get();

  if (querySnapshot.empty) {
    throw new Error("No applicants found for this event");
  }

  const topParticipants = querySnapshot.docs.slice(0, totalTickets);
  const contractAddress = "0x40a124a1079251Ee683A6B301Bf3688416DaAA5A"; // Update with your contract address

  for (const doc of topParticipants) {
    const userRef = userAppliedEventsRef.doc(doc.id);
    const userData = doc.data();
    const qrData = `Event: ${eventData.name}, User: ${userData.address}`;

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    // Create a canvas to overlay text
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext("2d");
    const qrImage = await loadImage(qrCodeDataURL);
    ctx.drawImage(qrImage, 0, 0, 300, 300);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(eventData.name, 10, 290);

    const finalQRCodeDataURL = canvas.toDataURL();
    const storage = getStorage();
    const bucket = storage.bucket();
    const fileName = `qr-codes/${eventId}/${doc.id}.png`;
    const file = bucket.file(fileName);
    const buffer = Buffer.from(finalQRCodeDataURL.split(",")[1], "base64");

    await file.save(buffer, {
      metadata: { contentType: "image/png" },
      public: true,
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    await userRef.update({ status: "accepted", nftUrl: url });
  }

  const scores = topParticipants.map((doc) => doc.data().score.toString());
  await setUserScores(contractAddress, scores, wallet);

  const rejectedParticipants = querySnapshot.docs.slice(totalTickets);
  for (const doc of rejectedParticipants) {
    const userRef = userAppliedEventsRef.doc(doc.id);
    await userRef.update({ status: "rejected" });
  }

  return {
    message: "Tickets distributed successfully",
    awardedUsers: topParticipants.map((doc) => doc.data()),
  };
};

// {
//   "source": "functions",
//   "codebase": "functions",
//   "ignore": [
//     "venv",
//     ".git",
//     "firebase-debug.log",
//     "firebase-debug.*.log",
//     "*.local"
//   ]
// }
