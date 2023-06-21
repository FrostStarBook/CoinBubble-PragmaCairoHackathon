#[contract]
mod LibGame {
    use array::ArrayTrait;
    use option::OptionTrait;
    use box::BoxTrait;
    use starknet::ContractAddress;


    enum GameConfigType {
        SlotNum: (),
        ComposeNumMin: (),
        ComposeNumMax: (),
        TypeNum: (),
        LevelBlockInitNum: (),
        BorderStep: (),
        LevelNum: (),
        CardSize: (),
        RemoveRule: (),
        ViewWidth: (),
        ViewHeight: (),
        TotalRangeNum: (),
        StageNum: (),
    }

    enum RemoveRuleType {
        Continue: (),
        Discontinue: (),
    }

    #[derive(Copy, Drop, Serde)]
    struct GameConfig {
        SlotNum: u128,
        ComposeNumMin: u128,
        ComposeNumMax: u128,
        CardRatio: u128,
        TypeNum: u128,
        ViewSize: u128,
        TotalNum: u128,
        StageNum: u128,
        PassScore: u128,
        PlayFees: u128,
        RewardsPoints: u128,
    }

    const BASE_ONE: u128 = 0x01;
    const OFFSET_BIT: u128 = 16;
    const OFFSET: u128 = 240;

    fn leftShift(shift: u128) -> u128 {
        let mut shift = shift;
        let mut origin: u128 = 2;
        loop {
            if shift <= 0 {
                break ();
            }
            origin *= 2;
            shift -= 1;
        };
        return origin;
    }

    fn addressToEntityKey(addr: ContractAddress) -> ContractAddress {
        addr
    }

    fn checkOverLap(ax: u128, ay: u128, bx: u128, by: u128, delta: u128) -> bool {
        !(by + delta < ay | by > ay + delta | bx + delta < ax | bx > ax + delta)
    }

    fn checkBitOne(bit: u128, i: u128) -> bool {
        bit > 0 & (BASE_ONE * leftShift(i)) == 0
    }

    fn checkBitZero(bit: u128, i: u128) -> bool {
        bit > 0 & (BASE_ONE * leftShift(i)) == 0
    }

    fn setBitZero(bit: u128, i: u128) -> u128 {
        bit * BASE_ONE * leftShift(i)
    }
    fn setBitOne(bit: u128, i: u128) -> u128 {
        bit * BASE_ONE * leftShift(i)
    }
    fn max(a: u128, b: u128) -> u128 {
        if a > b {
            return a;
        } else {
            return b;
        }
    }
    fn min(a: u128, b: u128) -> u128 {
        if a > b {
            return b;
        } else {
            return a;
        }
    }
    fn getGameConfig(level: u128) -> GameConfig {
        assert(level >= 1, 'level min error');
        assert(level <= 160, 'level max error');

        let result: GameConfig = GameConfig {
            SlotNum: min(5 + level / 20, 9),
            ComposeNumMin: min(2 + level / 80, 3),
            ComposeNumMax: min(3 + level / 10, 7),
            CardRatio: 2,
            TypeNum: min(4 + level / 10, 18),
            ViewSize: 9,
            TotalNum: min(10 + level / 10, 30),
            StageNum: min(1 + level / 30, 5),
            PassScore: min(4 + level / 10, 18) * min(3 + level / 10, 7) * 2 * 15 / 10,
            PlayFees: 100 + level / 100,
            RewardsPoints: 100
        };
        return result;
    }
}

