import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import { ethers } from "ethers";

config();

async function test() {
  const provider = new ethers.providers.JsonRpcProvider(
    // "https://shibuya.public.blastapi.io"
    "https://evm.shibuya.astar.network"
  );

  console.log("provider: ", provider);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

  const bundler: IBundler = new Bundler({
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/81/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    chainId: 81,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const module = await ECDSAOwnershipValidationModule.create({
    signer: wallet,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  });
  let biconomySmartAccount = await BiconomySmartAccountV2.create({
    chainId: 81,
    bundler: bundler,
    // paymaster: paymaster,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module,
    activeValidationModule: module,
  });
  console.log("address: ", await biconomySmartAccount.getAccountAddress());
  // return biconomySmartAccount;
  try {
    const transaction = {
      to: "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD",
      data: "0x",
      value: ethers.utils.parseEther("0.001"),
    };
    console.log("transaction: ", transaction);

    console.log("address", biconomySmartAccount.getAccountAddress());

    const userOp = await biconomySmartAccount.buildUserOp([transaction]);
    // userOp.paymasterAndData = "0x";

    // const userOpResponse = await biconomySmartAccount.sendUserOp(userOp);

    // const transactionDetail = await userOpResponse.wait();

    // console.log("transaction detail below");
    // console.log(
    //   `https://shibuya.subscan.io/extrinsic/${transactionDetail.receipt.transactionHash}`
    // );
  } catch (error) {
    console.log(error);
  }
}

// const module = await ECDSAOwnershipValidationModule.create({
//   signer: wallet,
//   moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
// });

// async function createAccount() {
//   const module = await ECDSAOwnershipValidationModule.create({
//     signer: wallet,
//     moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
//   });

//   let biconomySmartAccount = await BiconomySmartAccountV2.create({
//     chainId: 81,
//     bundler: bundler,
//     // paymaster: paymaster,
//     entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
//     defaultValidationModule: module,
//     activeValidationModule: module,
//   });
//   console.log("address: ", await biconomySmartAccount.getAccountAddress());
//   return biconomySmartAccount;
// }

// async function createTransaction() {
//   const smartAccount = await createAccount();
//   try {
//     const transaction = {
//       to: "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD",
//       data: "0x",
//       value: ethers.utils.parseEther("0.001"),
//     };

//     const userOp = await smartAccount.buildUserOp([transaction]);
//     userOp.paymasterAndData = "0x";

//     const userOpResponse = await smartAccount.sendUserOp(userOp);

//     const transactionDetail = await userOpResponse.wait();

//     console.log("transaction detail below");
//     console.log(
//       `https://shibuya.subscan.io/extrinsic/${transactionDetail.receipt.transactionHash}`
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

// createTransaction();

test();
