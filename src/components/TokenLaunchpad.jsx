import {createMint, ExtensionType, getMintLen, TOKEN_PROGRAM_ID,TYPE_SIZE,LENGTH_SIZE, createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE} from '@solana/spl-token'
import {useConnection,useWallet} from '@solana/wallet-adapter-react'
import {Keypair,Transaction,SystemProgram} from '@solana/web3.js'
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from 'react';

export function TokenLaunchpad() {
    const wallet = useWallet();
    const {connection} = useConnection();
    
    const [name,setName] = useState("");
    const [symbol,setSymbol] = useState("");
    const [imageUrl,setImageUrl] = useState("");
    const [supply,setSupply] = useState();
    const [decimals,setDecimals] = useState();

 
 
    async function createToken(){
        const mintKeypair = Keypair.generate()
        /*
        const metadata  = {
            mint : mintKeypair.publicKey,
            name : name,
            symbol : symbol,
            uri : '',
            additionalMetadata :[]
        };

        */
        //const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        //const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
            fromPubkey : wallet.publicKey,
            newAccountPubkey : mintKeypair.publicKey,
            space :  MINT_SIZE,
            lamports,
            programId:TOKEN_PROGRAM_ID
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey,9,wallet.publicKey,wallet.publicKey,TOKEN_PROGRAM_ID)
        )
                
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = wallet.publicKey
        transaction.partialSign(mintKeypair);
        await wallet.sendTransaction(transaction,connection);
    }

    return  <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1 className="pb-3">Solana Token Launchpad</h1>
        <input className='inputText bg-neutral-950' type='text' placeholder='Name' value={name} onChange={(e)=>{setName(e.target.value)}}></input> <br />
        <input className='inputText bg-neutral-950' type='text' placeholder='Symbol' value={symbol} onChange={(e)=>{setSymbol(e.target.value)}}></input> <br />
        <input className='inputText bg-neutral-950' type='text' placeholder='Image URL' value={imageUrl} onChange={(e)=>{setImageUrl(e.target.value)}}></input> <br />
        <input className='inputText bg-neutral-950' type='number' placeholder='Initial Supply' value={supply} onChange={(e)=>{setSupply(e.target.value)}}></input> <br />
        <input className='inputText bg-neutral-950' type='number' placeholder='Decimals' value={decimals} onChange={(e)=>{setDecimals(e.target.value)}}></input> <br />
        <button className='btn' onClick={createToken}>Create a token</button>
    </div>
}