import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import {addresses, contractFactory} from "@devprotocol/dev-kit"
import Web3 from "web3";
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import getWeb3 from '../libs/getWeb3'

const Home = () => {

  const router = useRouter();

  const [targetAddress, setTargetAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(0);

  // useEffect(() => {
  //   getWeb3();
  //   console.log('X');
    
  // }, [])

  useEffect(() => {
    if (router.query.targetAddress) setTargetAddress(router.query.targetAddress as string);
    if (router.query.transferAmount) setTransferAmount(Number(router.query.transferAmount));
  }, [router.query.targetAddress, router.query.transferAmount])

  const handleTransferButton = async (_: React.MouseEvent<HTMLButtonElement>) => {
    if (!targetAddress || !transferAmount) return window.alert('input address and amount!');

    const provider  = await getWeb3();
    const clientDev = contractFactory(provider.currentProvider)
    const registryContract = clientDev.registry(addresses.eth.ropsten.registry)
    const addressDEV = await registryContract.token()
    const decimalNumber = Math.pow(10, 18).toString()
    const transferDev   = BigNumber.from(transferAmount).mul(decimalNumber).toString()
    const transfer      = await clientDev.dev(addressDEV).transfer(targetAddress, transferDev)
    console.log(transfer);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple Dev Transfer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="my-auto border-2 shadow w-full md:w-2/5 p-8 rounded">
        <h1 className="text-center text-3xl mb-8">Simple Dev Transfer</h1>
        <div className="flex mb-2">
          <label className="ml-0 mr-auto my-auto">TargetAddress</label>
          <input
            className='border rounded mr-0 ml-auto px-2 py-1'
            type="text"
            value={targetAddress}
            onChange={e => setTargetAddress(e.target.value)}
            placeholder='targetAddress'
          />
        </div>
        <div className="flex mb-2">
          <label className="ml-0 mr-auto my-auto">TransferAmount</label>
          <input
            className='border rounded mr-0 ml-auto px-2 py-1'
            type="text"
            value={transferAmount}
            onChange={e => setTransferAmount(Number(e.target.value))}
            placeholder='amount'
          />
        </div>
        <div className="mt-4 text-center">
          <button className='font-bold bg-blue-600 hover:bg-blue-900 rounded text-white px-4 py-2 my-2' onClick={handleTransferButton}>transfer</button>
        </div>
      </main>

      <footer className="mt-auto mb-2">
        <a
          href="https://github.com/theMistletoe"
          target="_blank"
          rel="noopener noreferrer"
        >
          @2021 theMistletoe All Right Reserved.
        </a>
      </footer>
    </div>
  )
}

export default Home;