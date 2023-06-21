#[contract]
mod score {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use debug::PrintTrait;
    use serde::Serde;

    #[derive(Copy, Drop, Serde)]
    struct Storage {
        controller: ContractAddress,
        record: LegacyMap::<ContractAddress, u128>,
    }


    #[constructor]
    fn constructor() {
        let caller_address = get_caller_address();
        controller::write(caller_address);
    }

    #[external]
    fn update_record(address: ContractAddress, value: u128) {
        // assert(controller::read() == get_caller_address(), 'Only the controller');

        let original = record::read(address);

        if value > original {
            record::write(address, value);
            record_updated(address, value);
        }
    }

    #[event]
    fn record_updated(address: ContractAddress, score: u128) {}

    #[view]
    fn get_record(address: ContractAddress) -> u128 {
        record::read(address)
    }

}
