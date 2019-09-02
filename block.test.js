const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config')
const cryptoHash = require('./cryptohash')

// describe from jest libary
// first argument is the name of what we are testing,
// second is a function that the class can run
describe('Block', () => {
    const timestamp = 2000;
    const hash = 'a-data';
    const lastHash = 'a-lastHash';
    const data = ['blockchain', 'data'];
    const nonce = 1; // number to change for finding difficulty hash
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty }); // if the key an the value are the same name we can declare it just by the name
    
    // first is the description of what your testing 
    // second is a callback function to run



    it('has a timestamp, lastHash, hash, data, nonce and difficulty property', () => {
        // takes a value to test the value upon (actual value)
        expect(block.timestamp).toEqual(timestamp); // the time stamp variable declare on line 5 is the expected value of the actual value of expect argument
        expect(block.lastHash).toEqual(lastHash); 
        expect(block.hash).toEqual(hash); 
        expect(block.data).toEqual(data); 
        expect(block.nonce).toEqual(nonce); 
        expect(block.difficulty).toEqual(difficulty); 
    });

    // testing the first block of the blockcahin
    describe('genesis()', ()=> {
        const genesisBlock = Block.genesisBlock(); // static function dont need to use or change the data on a specific instance of the class

        it('returns a block instance', () => {
            // instanceof returns true or flase value depending if the first part return
            // the same type as the second part of the statement
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    // testing the method that will mine new blocks added to blockchain
    describe('mineBlock()', () => {
        const lastBlock = Block.genesisBlock();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data });

        it('returns a block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the last `lasHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash); 
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it("it creates a sha256 `hash` based on the proper inputs", () => {
            expect(minedBlock.hash)
            .toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    lastBlock.hash,
                    data
                )
            );
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            // two possabilities: raised or lower
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100 
            })).toEqual(block.difficulty+1);
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({ 
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100 
            })).toEqual(block.difficulty-1);
        });

        it("has a lower limit of 1", () => {
            block.difficulty = -1;

            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        })
    });

});