// Import Solana web3 functionalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Exact the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

const getWalletBalance = async () => {
  try {
    const walletBalance = await connection.getBalance(
      new PublicKey(newPair.publicKey)
    );
    console.log(
      `Your wallet balance is ${
        parseInt(walletBalance) / LAMPORTS_PER_SOL
      } yeahhhh`
    );
  } catch (err) {
    console.error("Unable to fetch details");
  }
};

getWalletBalance();

const airDropSol = async () => {
  try {
    const airDropTransaction = await connection.requestAirdrop(
      new PublicKey(newPair.publicKey),
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airDropTransaction);
  } catch (err) {
    console.error("Unable to airdrop the amount of sol");
  }
};

const mainFunction = async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
};
mainFunction();
