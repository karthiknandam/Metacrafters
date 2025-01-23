// Import Solana web3 functionalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");
const { S_KEY, R_KEY } = require("./secret");
// Making a keypair and getting the private key
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
const SENDER_KEY = new Uint8Array(S_KEY);

const RECIEVER_KEY = new Uint8Array(R_KEY);

const getBalance = async (key) => {
  try {
    const balance = await connection.getBalance(new PublicKey(key));
    console.log(parseInt(balance), "Sol");
  } catch (er) {
    console.error("Failed to get balance");
  }
};
const airdrop = async (key) => {
  try {
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(key),
      2 * LAMPORTS_PER_SOL
    );
    let latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature,
    });
    console.log("Succesfully airdropped");
  } catch (err) {
    console.error("Airdrop failed");
  }
};

const transfer_sol = async () => {
  try {
    const from = Keypair.fromSecretKey(SENDER_KEY);
    const to = Keypair.fromSecretKey(RECIEVER_KEY);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
        lamports: LAMPORTS_PER_SOL / 100,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    console.log("Transfer succesfull");
    console.log(signature);
  } catch (err) {
    console.error("Transfer unsuccsfull");
  }
};

transfer_sol();
getBalance(Keypair.fromSecretKey(SENDER_KEY).publicKey);
