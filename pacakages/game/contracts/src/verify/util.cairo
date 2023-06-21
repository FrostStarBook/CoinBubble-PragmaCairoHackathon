#[contract]
mod util {

    fn leftShift(shift: u128) -> u128 {
        let mut origin: u128 = 2;
        loop {
            if (shift > 0) {
                origin *= 2;
                shift -= 1;
            }
        }
        return origin;
    }

    fn rightShift(shift: u128) -> u128 {
        let mut origin: u128 = 1;
        loop {
            if (shift > 0) {
                origin /= 2;
                shift -= 1;
            }
        }
        return origin;
    }

}
