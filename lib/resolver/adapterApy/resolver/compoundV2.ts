import { Contract, ethers } from "ethers";
import { resolveAdapterDefaults } from "@/lib/resolver/adapterDefaults/adapterDefaults";

export async function compoundV2Apy({ chainId, rpcUrl, address, resolver }: { chainId: number, rpcUrl: string, address: string, resolver: string }): Promise<number> {
  const [cTokenAddress] = await resolveAdapterDefaults({ chainId, address, resolver })
  const cToken = new Contract(
    // @ts-ignore
    cTokenAddress,
    ['function supplyRatePerBlock() public view returns (uint)'],
    new ethers.providers.JsonRpcProvider(rpcUrl, chainId),
  );

  const supplyRate = await cToken.supplyRatePerBlock();

  return (((Math.pow((Number(supplyRate) / 1e18 * 7200) + 1, 365))) - 1) * 100
}

export async function compoundV2({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<number> {
  return compoundV2Apy({ chainId, rpcUrl, address, resolver: "compoundV2" })
}
