#[starknet::contract]
mod HelloCairo {

use debug::PrintTrait;

    #[storage]
    struct Storage{
        red: felt252,
        blue: bool,
        yellow: u8,
    }


    #[external]
    #[test]
    fn main(self: Storage) -> felt252 {
        self.red.write(111111111111);
        let read_only = self.red.read();
        read_only.print();
        'Hello Cairo!'
    }
}