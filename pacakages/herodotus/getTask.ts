import axios from "axios";

interface AccountAccessRequest {
    originChain: string;
    destinationChain: string;
    blockNumber: number;
    type: string;
    requestedProperties: {
        ACCOUNT_ACCESS: {
            account: string;
            properties: string[];
        };
    };
    scheduledAt: number;
    taskId: string;
    taskStatus: string;
    currentGroupId: string;
    processingStepsTracker: {
        type: string;
        actionsRequired: string[];
        currentActionIndex: number;
    };
    statusCombo: string;
}

interface AccountAccessResponse {
    nonce: number;
    balance: number;
    codeHash: string;
    storageHash: string;
}

async function fetchAccountAccessResponse(taskId: string, apiKey: string): Promise<AccountAccessResponse> {
    const response = await axios.get(`https://api.herodotus.cloud/status/${taskId}?apiKey=${apiKey}`);
    
    const data = response.data as AccountAccessRequest;
    const properties = data.requestedProperties.ACCOUNT_ACCESS.properties;
    const result: AccountAccessResponse = {
        nonce: properties.includes("nonce") ? parseInt(await getAccountNonce(data.requestedProperties.ACCOUNT_ACCESS.account)) : undefined,
        balance: properties.includes("balance") ? parseInt(await getAccountBalance(data.requestedProperties.ACCOUNT_ACCESS.account)) : undefined,
        codeHash: properties.includes("codeHash") ? await getAccountCodeHash(data.requestedProperties.ACCOUNT_ACCESS.account) : undefined,
        storageHash: properties.includes("storageHash") ? await getAccountStorageHash(data.requestedProperties.ACCOUNT_ACCESS.account) : undefined,
    };
    return result;
}

async function getAccountNonce(account: string): Promise<string> {
    // 向区块链节点发送请求，获取指定账户的 nonce
    // ...
}

async function getAccountBalance(account: string): Promise<string> {
    // 向区块链节点发送请求，获取指定账户的余额
    // ...
}

async function getAccountCodeHash(account: string): Promise<string> {
    // 向区块链节点发送请求，获取指定账户的代码哈希
    // ...
}

async function getAccountStorageHash(account: string): Promise<string> {
    // 向区块链节点发送请求，获取指定账户的存储哈希
    // ...
}
