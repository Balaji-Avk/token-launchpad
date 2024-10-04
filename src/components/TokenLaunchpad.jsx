import {createMint, ExtensionType, getMintLen, TOKEN_2022_PROGRAM_ID,TYPE_SIZE,LENGTH_SIZE} from '@solana/spl-token'
import {useConnection,useWallet} from '@solana/wallet-adapter-react'
import {Keypair,Transaction} from '@solana/web3.js'
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
export function TokenLaunchpad() {
    const wallet = useWallet();
    const {connection} = useConnection();
    async function createToken(){
        const mintKeypair = Keypair.generate()
        const metadata  = {
            mint : mintKeypair.publicKey,
            name : 'abc',
            symbol : 'AB',
            uri : '',
            additionalMetadata :[]
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;



        const lamports = connection.getMinimumBalanceForRentExemption(mintLen + metadataLen)
        const transaction = new Transaction().add({
            fromPubKey : wallet.publicKey,
            newAccountPubKey : mintKeypair.publicKey,
            space : mintLen,
            lamports,
            TOKEN_2022_PROGRAM_ID
        })
        
        transaction.partialSign(mintKeypair);
        wallet.signTransaction(transaction);
    }

    return  <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1 className="pb-3">Solana Token Launchpad</h1>
        <input className='inputText bg-neutral-950' type='text' placeholder='Name'></input> <br />
        <input className='inputText bg-neutral-950' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText bg-neutral-950' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText bg-neutral-950' type='text' placeholder='Initial Supply'></input> <br />
        <button className='btn'>Create a token</button>
    </div>
}