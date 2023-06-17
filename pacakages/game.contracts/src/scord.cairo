#[starknet:: contract ] 
mod ScordRecord {
    use starknet::ContractAddress;
    use option::OptionTrait;
    use array::ArrayTrait;
    use debug::PrintTrait;

    sturct Storage { record : LegacyMap :: < ContractAddress , u128 > }

#[external]
fn update_record(ref self: ContractState, address: ContractAddress, value: u128) {
    let mut original = self.record.get(address);
    if original == None || value > original {
        self.record.write(address, value);
        record_updated(@address, @value);
    }
}

#[event]
fn record_updated(address: @ContractAddress, score: @u128) {}

#[view]
fn get_record(ref self: ContractState, address: @ContractAddress) -> u128 {
    self.record.get(address)
}

#[test]
fn test() {
    let scord = 10_u128;
    let address = ContractAddress::from(0x1);
    update_record(, address, scord);
    let record = get_record(self: ContractState, address);
}
} 
