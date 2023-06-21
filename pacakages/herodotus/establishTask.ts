import axios from "axios";

const apiKey = "YOUR_API_KEY";
const url = `https://api.herodotus.cloud/?apiKey=${apiKey}`;


const {ACCOUNT, BLOCK_NUMBER} = process.env;

interface RequestedProperties {
    nonce: number;
    balance: number;
    codeHash: string;
    storageHash: string;
}

interface AccountAccessRequest {
    originChain: string;
    destinationChain: string;
    blockNumber: number;
    type: string;
    requestedProperties: {
        ACCOUNT_ACCESS: {
            account: string;
            properties: Array<keyof RequestedProperties>;
        };
    };
    webhookUrl?: string;
}

const requestData: AccountAccessRequest = {
    originChain: "GOERLI",
    destinationChain: "STARKNET_GOERLI",
    blockNumber: Number(BLOCK_NUMBER),
    type: "ACCOUNT_ACCESS",
    requestedProperties: {
        ACCOUNT_ACCESS: {
            account: ACCOUNT,
            properties: ["nonce", "balance", "codeHash", "storageHash"],
        },
    },
};

async function postData(url: string, data: any) {
    try {
        const response = await axios.post(url, data);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

postData(url, requestData).then(r => console.log(r));