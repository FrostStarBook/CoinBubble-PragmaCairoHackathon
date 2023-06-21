
#[contract]
mod LibBlock {
    use coin_bubble::verify::LibRand;
    use coin_bubble::verify::LibGame;

    use array::ArrayTrait;
    use option::OptionTrait;
    use box::BoxTrait;
    use traits::Into;
    use traits::TryInto;


    #[derive(Copy, Drop, Serde)]
    struct BlockType {
        x: u128,
        y: u128,
        id: u128,
        state: u128,
        blockType: u128,
    }
    #[derive(Copy, Drop, Serde)]
    struct VerifyType {
        slotBit: u128,
        slotSize: u128,
        score: u128,
    }

    fn verify(opts: ArrayTrait<u8>, config: GameConfig, seed: u128) -> u128 {
        let length: u32 = opts.len();

        let blockNumUint: u128 = config.ComposeNumMax * config.CardRatio * config.TypeNum;
        let viewMax = 2 * config.ViewSize - 1;

        let blocks: Array<BlockType> = ArrayTrait::new();
        let pos: Array<u128> = ArrayTrait::new();

        creatBlocks(@config, blocks, pos, seed);

        let slots: Array<u128> = ArrayTrait::new();
        let verifys: VerifyType = VerifyType { slotBit: 0, slotSize: 0, score: 0,  };

        let mut i: u32 = 0;
        loop {
            if i >= length {
                break ();
            };
            let k:u128 = opts.at(i).into();
            if LibGame.checkBitOne(verifys.slotBit, k) & blocks.at(k.tryInto().unwrap()).state == 1 {
                touchSlot(blocks, slots, @config, verifys, k);
            } else if blocks.at(k.tryInto().unwrap()).state != 0 {
                assert(false, 'touch state error');
                checkTouchCard(blocks, pos, viewMax, k);
            } else if verifys.slotSize == config.SlotNum {
                assert(false, 'slot size error');
                checkTouchCard(blocks, pos, viewMax, k);
            }

            i += 1;
        };

        let mut i: u32= 0;
        loop {
            if blocks.at(i).state != 2 {
                assert(false, 'block state error');
            }
            i += 1;
        };

        return verifys.score;
    }


    fn checkTouchCard(blocks: Array<BlockType>, pos: Array<u128>, size: u128, id: u128) {
        let mut x: u128 = blocks.at(id.tryInto().unwrap()).x;
        let mut y: u128 = blocks.at(id.tryInto().unwrap()).y;

        let i_max: u128 = if x == size - 1 {
            size - 1
        } else {
            x + 1
        };
        let j_max: u128 = if y == size - 1 {
            size - 1
        } else {
            y + 1
        };

        let id_pos = util.leftShift(id);

        let mut i: u128 = if x == 0 {
            0
        } else {
            x - 1
        };
        loop {
            if i >= i_max {
                break ();
            };
            let mut j: u128 = if y == 0 {
                0
            } else {
                y - 1
            };
            loop {
                if j >= j_max {
                    break ();
                };
                let _pos: u128 = i * size + j;
                if LibGame.checkBitOne(pos.at(_pos), id) & pos.at(_pos) - id_pos > id_pos {
                    assert(false, 'pos error');
                } else if pos.at(_pos) > id_pos {
                    assert(false, 'pos error');
                }
                j += 1;
            }
            i += 1;
        }
    }

    fn touchSlot(
        blocks: Array<BlockType>,
        slots: Array<u128>,
        config: GameConfig,
        verifys: VerifyType,
        id: u128
    ) {
        let blockType: u128 = blocks.at(id).blockType;

        let mut i: u128 = 0;
        let mut pow: u128 = 0;
        loop {
            if i >= verifys.slotSize {
                break ();
            };

            if blocks.at(slots.at(i)) == blockType {
                verifys.slotBit = LibGame.setBitOne(verifys.slotBit, slots.at(i));

                slots.at(i) = slots.at(verifys.slotSize - 1);
                slots.at(verifys.slotSize - 1) = 0;
                verifys.slotSize -= 1;

                pow += 1;

                if (pow == config.ComposeNumMax) {
                    break ();
                }
                if (verifys.slotSize == 0) {
                    break ();
                }
            } else {
                i += 1;
            }
        };

        if pow < 2 | pow < config.ComposeNumMin {
            assert(false, 'pow size error');
        }

        verify.score += pow;
    }


    fn creatBlocks(config: GameConfig, result: Array<BlockType>, pos: Array<u128>, seed: u128) {
        let blockNumUint: u128 = result.len();
        let TypeNum: u128 = config.TypeNum;

        let typeArray: Array<u128> = ArrayTrait::new();
        seed = getRandomTypeArray(@config, @typeArray, @seed);
        let viewMax: u128 = 2 * config.ViewSize - 1;
        let mut randomX: u128 = 0;
        let mut randomY: u128 = 0;
        let mut i: u128 = 0;
        loop {
            if i >= blockNumUint {
                break ();
            }
            (seed, randomX) = LibRand.randomNum(seed, 0, viewMax - 1);
            (seed, randomY) = LibRand.randomNum(seed, 0, viewMax - 1);

            result.at(i) = BlockType {
                x: randomX, y: randomY, id: i, state: 0, blockType: typeArray.at(i % TypeNum), 
            }
            i += 1;
        };
        shuffleBlocks(@result, @seed);
    }

    fn getRandomTypeArray(config: GameConfig, typeArray: Array<u128>, seed: u128) -> u128 {
        let totalNum: u128 = config.TypeNum;
        let typeNum: u128 = config.TypeNum;
        let totalArray: Array<u128> = ArrayTrait::new();

        let mut i: u128 = 0;
        loop {
            if i >= totalNum {
                break ();
            }
            totalArray.at(i) = i;
            i += 1;
        };

        let mut j: u128 = 0;
        let mut k: u128 = 0;
        let mut i: u128 = 0;
        loop {
            if i >= typeNum {
                break ();
            }
            k = totalNum - i - 1;

            (seed, j) = LibRand.randomNum(@seed, 0, @k);
            typeArray.at(i) = totalArray.at(j);
            totalArray.at(j) = totalArray.at(k);
            i += 1;
        };

        return seed;
    }

    fn shuffleBlocks(totalArray: Array<BlockType>, seed: u128) {
        let length: u128 = totalArray.len();
        let mut j: u128 = 0;
        let mut i: u128 = 0;
        loop {
            if i >= length {
                break ();
            }
            (seed, j) = LibRand.randomNum(seed, 0, i);
            (totalArray.at(i).blockType, totalArray.at(j).blockType) =
                (totalArray.at(j).blockType, totalArray.at(i).blockType);
            i += 1;
        };
    }
}

