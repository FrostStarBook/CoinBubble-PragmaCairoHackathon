use array::ArrayTrait;
use result::ResultTrait;
use box::BoxTrait;
use debug::PrintTrait;
use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
enum Data {
    Address: ContractAddress,
    Value: u128,
}

#[test]
fn test_scord_update() {

    let contract_address = deploy_contract('scord', @ArrayTrait::new()).unwrap();
    contract_address.print();

    // let mut invoke_calldata: Array<Data> = ArrayTrait::new();
    // invoke_calldata.append(Data::Address('0x91cfa66046acc70f55521d'));
    // invoke_calldata.append(Data::Value(22));
    // invoke(contract_address, 'update_record', @invoke_calldata);
    // let result = call(contract_address, 'get_record', @invoke_calldata).unwrap();

    // assert(result.get(0_u32) == 22, 'update failed');

    let mut invoke_calldata = ArrayTrait::new();
    invoke_calldata.append('0x91cfa66046acc70f55521d');
    invoke_calldata.append(22);
    invoke(contract_address, 'update_record', @invoke_calldata);

    let mut invoke_calldata = ArrayTrait::new();
    invoke_calldata.append('0x91cfa66046acc70f55521d');
    let result = call(contract_address, 'get_record', @invoke_calldata).unwrap();

    assert(*result.at(0) == 22, 'update failed');

}
