#[contract]
mod TestStarknet {
    struct Storage {
        balance: felt252,
    }

    #[external]
    fn increase_balance(amount: felt252) {
        assert(amount != 0, 'Amount cannot be 0');
        balance::write(balance::read() + amount);
    }

    #[view]
    fn get_balance() -> felt252 {
        balance::read()
    }

    #[view]
    fn get_two() -> felt252 {
        hello_starknet::business_logic::utils::returns_two()
    }
}
