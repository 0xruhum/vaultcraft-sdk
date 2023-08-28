import { Hash, Address, WalletClient, Transport, Chain, maxUint256, pad, zeroAddress, PublicActions, Account } from "viem";

import { VaultControllerABI } from "./abi/VaultControllerABI";
import { Base } from "./base";
import { VaultFees, WriteOptions } from "./types";

const ABI = VaultControllerABI;

export type VaultOptions = {
    asset: Address;
    adapter: Address;
    fees: VaultFees;
    feeRecipient: Address;
    depositLimit?: bigint;
    owner: Address;
    staking: boolean;
    initialDeposit: bigint;
};

export type VaultMetadata = {
    metadataCID: string;
    swapTokenAddresses: [Address, Address, Address, Address, Address, Address, Address, Address];
    swapAddress: Address;
    exchange: bigint;
}

export class VaultController extends Base {
    private baseObj;

    constructor(address: Address, walletClient: WalletClient<Transport, Chain, Account> & PublicActions) {
        super(address, walletClient);

        this.baseObj = {
            address,
            abi: ABI,
        };
    }

    // We assume that the adapter was already created.
    async createVault(vault: VaultOptions, metadata: VaultMetadata, options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "deployVault",
            args: [
                {
                    asset: vault.asset,
                    adapter: vault.adapter,
                    fees: vault.fees,
                    feeRecipient: vault.feeRecipient,
                    depositLimit: vault.depositLimit ? vault.depositLimit : maxUint256 - BigInt(1),
                    owner: vault.owner,
                },
                {
                    // we expect the adapter to be deployed already
                    id: pad("0x"),
                    data: "0x",
                },
                {
                    // we expect the strategy to be deployed already
                    id: pad("0x"),
                    data: "0x",
                },
                vault.staking,
                "0x", // reward data should be added in a separate step
                {
                    ...metadata,
                    // these three will be overriden by the VaultController. Specifying them here is pointless.
                    // But, we have to include them in the type so that viem doesn't throw an error
                    vault: zeroAddress,
                    staking: zeroAddress,
                    creator: zeroAddress,
                },
                vault.initialDeposit,
            ]
        });
        return this.client.writeContract(request);
    }

    async proposeVaultAdapters(vaults: Address[], adapters: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "proposeVaultAdapters",
            args: [vaults, adapters],
        });
        return this.client.writeContract(request);
    }

    async changeVaultAdapters(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "changeVaultAdapters",
            args: [vaults],
        });
        return this.client.writeContract(request);
    }

    async proposeVaultFees(vaults: Address[], fees: VaultFees[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "proposeVaultFees",
            args: [vaults, fees],
        });
        return this.client.writeContract(request);
    }

    async changeVaultFees(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "changeVaultFees",
            args: [vaults],
        });
        return this.client.writeContract(request);
    }

    async setVaultQuitPeriods(vaults: Address[], quitPeriods: bigint[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultQuitPeriods",
            args: [vaults, quitPeriods],
        });
        return this.client.writeContract(request);
    }

    async setVaultFeeRecipients(vaults: Address[], recipients: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultFeeRecipients",
            args: [vaults, recipients],
        });
        return this.client.writeContract(request);
    }

    async pauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "pauseVaults",
            args: [vaults],
        });
        return this.client.writeContract(request);
    }

    async unpauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "unpauseVaults",
            args: [vaults],
        });
        return this.client.writeContract(request);
    }

    async setVaultDepositLimits(vaults: Address[], limits: bigint[], options: WriteOptions): Promise<Hash> {
        const { request } = await this.client.simulateContract({
            ...options,
            ...this.baseObj,
            functionName: "setVaultDepositLimits",
            args: [vaults, limits],
        });
        return this.client.writeContract(request);
    }
}