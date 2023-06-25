
import {  Provider, Contract, Account, ec, json,constants  }from "starknet";

export class NetMgr {
    private constructor() {
    }

    private static instance: NetMgr | undefined

    static getInstance():NetMgr{
        if(NetMgr.instance === undefined) {
            NetMgr.instance = new NetMgr()
        }
        return NetMgr.instance;
    }
    public InitAccount():Account{
        console.log("initaccount");
      // initialize provider
        const provider = new Provider({ sequencer: {network: constants.NetworkName.SN_GOERLI}});
            // initialize existing pre-deployed account 0 of Devnet
        const privateKey = "980644733161600628839441017016534244514562534108892004563721274153348535390";
        const starkKeyPair = ec.starkCurve.getStarkKey(privateKey);
        const accountAddress = "0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e";
        const account = new Account(provider, accountAddress, starkKeyPair);
        
        console.log(account);
        return account;
 
    }

    public async LoadMemory(){
    //initialize Provider
    console.log("LoadMemory");
        const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI} });
        // Connect the deployed Test contract in Tesnet
        const testAddress = "0x0369e82f4c48427ef8149602c2a639bac3c6d9a8a0d7f0edd6fee49b6417dc4b";

            // read abi of Test contract
        const { abi: testAbi } = await provider.getClassAt(testAddress);
            if (testAbi === undefined) { throw new Error("no abi.") };
            const myTestContract = new Contract(testAbi, testAddress, provider);

            // Interaction with the contract with call
        const bal1 = await myTestContract.call("get_balance");
            console.log("Initial balance =", bal1.res.toString()); 
    }

    public async Test(){
        console.log("Test");
        //initialize Provider
        const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
        // connect your account. To adapt to your own account :
        const privateKey0 = "980644733161600628839441017016534244514562534108892004563721274153348535390";
        const account0Address = "0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e";

        const account0 = new Account(provider, account0Address, privateKey0);

        // Connect the deployed Test contract in Tesnet
        const testAddress = "0x0369e82f4c48427ef8149602c2a639bac3c6d9a8a0d7f0edd6fee49b6417dc4b";

        // read abi of Test contract
        const { abi: testAbi } = await provider.getClassAt(testAddress);
        if (testAbi === undefined) { throw new Error("no abi.") };
        const myTestContract = new Contract(testAbi, testAddress, provider);

        // Connect account with the contract
        myTestContract.connect(account0);

        // Interactions with the contract with meta-class
        const bal1 = await myTestContract.update_record(account0Address,45);
        console.log(bal1);
        console.log("update record =", bal1.res.toString());
       
    }

    
    public async Verify(...args:any):Promise<boolean>{
     //to
     //starknet const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
        // connect your account. To adapt to your own account :
        console.log(args);
        const provider = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } });
       
        const privateKey0 = "*";
        const account0Address = "0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e";

        const account0 = new Account(provider, account0Address, privateKey0);

        // Connect the deployed Test contract in Tesnet
        const testAddress = "0x0369e82f4c48427ef8149602c2a639bac3c6d9a8a0d7f0edd6fee49b6417dc4b";

        // read abi of Test contract
        const { abi: testAbi } = await provider.getClassAt(testAddress);
        if (testAbi === undefined) { throw new Error("no abi.") };
        const myTestContract = new Contract(testAbi, testAddress, provider);

        // Connect account with the contract
        myTestContract.connect(account0);

        // Interactions with the contract with meta-class
        const bal1 = await myTestContract.verify(args);
        console.log(bal1);
        console.log("update record =", bal1.res.toString());
       
        return true;
    }
}
 