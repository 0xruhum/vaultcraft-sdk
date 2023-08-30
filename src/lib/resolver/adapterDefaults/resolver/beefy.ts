import { ADDRESS_ZERO, SUPPORTED_NETWORKS, transformNetwork } from "@/lib/helpers.js";

interface Vault {
  tokenAddress: string;
  earnContractAddress: string;
}

interface Boost {
  tokenAddress: string;
  earnContractAddress: string;
  status: "active" | "eol"
}

export async function beefy({ chainId, rpcUrl, address, }: { chainId: number, rpcUrl: string, address: string }): Promise<any[]> {
  const network = transformNetwork(SUPPORTED_NETWORKS.find(chain => chain.id === chainId)?.network)

  const vaults = await (await fetch(`https://api.beefy.finance/vaults/${network}`)).json() as Vault[];
  const boosts = await (await fetch(`https://api.beefy.finance/boosts/${network}`)).json() as Boost[];
  
  const vaultAddress = vaults.find(vault => vault.tokenAddress.toLowerCase() === address.toLowerCase())?.earnContractAddress;
  const boost = boosts.find(boost => boost.tokenAddress.toLowerCase() === vaultAddress?.toLowerCase());

  return [vaultAddress, boost && boost.status === "active" ? boost.earnContractAddress : ADDRESS_ZERO]
}