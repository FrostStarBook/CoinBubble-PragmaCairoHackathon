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



