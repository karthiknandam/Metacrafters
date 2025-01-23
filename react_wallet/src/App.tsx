import { useEffect, useState } from "react";
import { PublicKey, Transaction, Connection } from "@solana/web3.js";

type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accoutnChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectedOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTrasaction: (trasaction: Transaction) => Promise<Transaction>;
  signTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectedOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};
function App() {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
    undefined
  );

  useEffect(() => {
    const response = getProvider();
    if (response) setProvider(response);
    else setProvider(undefined);
  }, []);

  const connectWallet = async () => {
    const { solana }: any = window;
    if (solana) {
      try {
        const respone = await solana.connect();
        setWalletKey(respone.publicKey.toString());
        console.log("Public key ", respone.publicKey.toString());
      } catch (err) {
        setWalletKey(undefined);
        console.error("User not connected please click to connect");
      }
    }
  };
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h2>Connect Wallet</h2>
          {(provider && !walletKey) == true && (
            <button
              style={{
                fontSize: "16px",
                padding: "20px",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                border: "2px black",
              }}
              onClick={connectWallet}
            >
              Connect Your Wallet
            </button>
          )}
          {provider && walletKey && <p>Wallet is connected </p>}
          {!provider && (
            <p>
              No Account Found Please Download Phantom Wallet;
              <a href="https://phantom.app/">
                {" "}
                Click here to download the extension
              </a>
            </p>
          )}
        </header>
      </div>
    </>
  );
}

export default App;
