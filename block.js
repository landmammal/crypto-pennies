const { GENESIS_DATA }  = require('./config');
const cryptoHash = require('./cryptohash')

class Block {
    // when passing parameters as an object order wont matter
    constructor({ timestamp, lastHash, hash, data }){
    //     // this refrences the current instances been created
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    // factory method methods that return an instance without calling the constructor
    static genesisBlock(){
        const genBlock = new this(GENESIS_DATA);
        return  genBlock
    }

    // mining new blocks method from last block and new data to add to block
    static mineBlock({ lastBlock, data }){ 
        const minedBlock = new this({timestamp: Date.now() ,lastHash: lastBlock.hash, data });
        minedBlock.hash = cryptoHash(minedBlock.timestamp, minedBlock.lastHash, data)
        return minedBlock
    }
}


module.exports = Block;