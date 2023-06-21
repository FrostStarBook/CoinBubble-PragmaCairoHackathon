
# Deploy with protostar

## install protostar
```shell
curl -L https://raw.githubusercontent.com/software-mansion/protostar/master/install.sh | bash
```
## Re-open the terminal to check the version
```shell
protostar -v
```




Prepare agentX wallet in advance

Add ```.pkey``` file in the deploy directory and write the private key



## test contract
```shell
protostar test ./tests
```

# The following operations need to record the returned data to facilitate data retrieval

## declare contract
```shell
protostar declare scord \             
--network testnet \
--account-address 0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e \
--max-fee auto \
--private-key-path ./.pkey
```

return data:
```shell
Declare transaction was sent.                                                                                                                                                                                         
Class hash: 0x02b1bf5f03591f923353d0b04eaa4e67d889223273529bdaef5f551975265352
StarkScan https://testnet.starkscan.co/class/0x02b1bf5f03591f923353d0b04eaa4e67d889223273529bdaef5f551975265352
Voyager   https://goerli.voyager.online/class/0x02b1bf5f03591f923353d0b04eaa4e67d889223273529bdaef5f551975265352

Transaction hash: 0x07b820739a588068ef92a0efea09c3e7bf32ca9bfdaca150187a8b906ed8c234
StarkScan https://testnet.starkscan.co/tx/0x07b820739a588068ef92a0efea09c3e7bf32ca9bfdaca150187a8b906ed8c234
Voyager   https://goerli.voyager.online/tx/0x07b820739a588068ef92a0efea09c3e7bf32ca9bfdaca150187a8b906ed8c234
13:57:08 [INFO] Execution time: 8.85 s
```


## deploy contract
```shell
protostar deploy 0x02b1bf5f03591f923353d0b04eaa4e67d889223273529bdaef5f551975265352 \
--network testnet \
--account-address 0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e \
--max-fee auto \
--private-key-path ./.pkey
```


return data:
```shell
Invoke transaction was sent to the Universal Deployer Contract.                                                                                                                                                       
Contract address: 0x01ab957989424a71045dee4f58e37e92d2b3a29717395f752da8972e9fe43076
StarkScan https://testnet.starkscan.co/contract/0x01ab957989424a71045dee4f58e37e92d2b3a29717395f752da8972e9fe43076
Voyager   https://goerli.voyager.online/contract/0x01ab957989424a71045dee4f58e37e92d2b3a29717395f752da8972e9fe43076

Transaction hash: 0x0787600916d47fc794a75b8604b86d36b96f40bff5e8859310851e14085a9f90
StarkScan https://testnet.starkscan.co/tx/0x0787600916d47fc794a75b8604b86d36b96f40bff5e8859310851e14085a9f90
Voyager   https://goerli.voyager.online/tx/0x0787600916d47fc794a75b8604b86d36b96f40bff5e8859310851e14085a9f90
14:01:16 [INFO] Execution time: 6.88 s
```


## contract call
```shell

protostar invoke \
--contract-address 0x01ab957989424a71045dee4f58e37e92d2b3a29717395f752da8972e9fe43076 \
--function "update_record" \
--network testnet \
--account-address 0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e \
--max-fee auto \
--inputs '0x060CA8040b63d9ae38F77A3d7817CbCC6B0b52dcC4b812B53fF82270bf2Fa96e' 33 \
--private-key-path ./.pkey
```
