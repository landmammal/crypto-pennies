const hextoToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE }  = require('./config');
const cryptoHash = require('./cryptohash');

class Block {
    // when passing parameters as an object order wont matter
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }){
    //     // this refrences the current instances been created
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    // factory method methods that return an instance without calling the constructor
    static genesisBlock(){
        const genBlock = new this(GENESIS_DATA);
        return  genBlock
    }

    // mining new blocks method from last block and new data to add to block
    static mineBlock({ lastBlock, data }){ 
        const lastHash = lastBlock.hash
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;
        
        // regenerate hash by changing nonce value 
        // continue until hash generated meets difficulty criteria (number of zeros it starts with)
        do {
            nonce++ ; 
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash( timestamp, lastHash, data, nonce, difficulty );
        } while (hextoToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({ timestamp, lastHash, data, nonce, difficulty, hash });
    }

    static adjustDifficulty({ originalBlock, timestamp }){
        let { difficulty } = originalBlock;
        
        // default difficulty 
        if(difficulty < 1 ) return 1;

        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;
        
        return difficulty + 1;
    }
}


module.exports = Block;