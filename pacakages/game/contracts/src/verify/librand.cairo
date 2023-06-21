#[contract]
mod LibRand {
    const a: u128 = 214013;
    const b: u128 = 2531011;
    const m: u128 = 4294967296;

    fn rand(seed: u128, length: u128) -> (u128, u128) {
        let seed = (seed * a + b) % m;
        return (seed, seed % length);
    }

    fn randomNum(seed: u128, minNum: u128, maxNum: u128) -> (u128, u128) {
        let mut s : u128 = 0;
        let mut r : u128 = 0;
        let (s, r) = rand(seed, maxNum - minNum + 1);
        return (s, r + minNum);
    }
}
