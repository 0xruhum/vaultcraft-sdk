import { Address, PublicClient, WalletClient, Transport, Chain, Account, PublicActions } from "viem";

export class Base {
    address: Address;
    protected client: WalletClient<Transport, Chain> & PublicActions;

    constructor(address: Address, walletClient: WalletClient<Transport, Chain, Account> & PublicActions) {
        this.address = address;
        this.client = walletClient;
    }
}