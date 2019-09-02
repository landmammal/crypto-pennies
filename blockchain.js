const Block = require('./block');
const cryptoHash = require('./cryptohash');

class Blockchain {
    constructor(){
        let genesis = Block.genesisBlock()
        this.chain = [genesis]    
    }

    addBlock({data}){
        let lastBlock = this.chain[this.chain.length-1]
        let newBlock = Block.mineBlock({lastBlock, data})
        this.chain.push(newBlock)
    }

    static isValidChain(chain){
        // two objects in js can not be === unless they are of the same instance of a class

        // check to make sure genesis block is the first block in the chain
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock())) return false;

        // compare hash of previouse block to current block lasthash to make sure they are the same
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, hash, lastHash, data, nonce, difficulty } = chain[i];
            const prevBlockHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;
            
            // duplica hash from block data of each block
            const duplicateHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)

            // each blocks last hash field matches last blocks hash field
            if ( prevBlockHash !== lastHash ) return false 

            // each block has a valid hash based on all the fields
            if (hash !== duplicateHash) return false 

            // prevents difficulty to jump by more than one
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true
    }

    replaceChain(chain) {
        // chain must be valid
        if(!Blockchain.isValidChain(chain)){
            console.error('Incomming Chain is not a valid Chain')
            return;
        }

        // chain must be longer
        if(chain.length <= this.chain.length){
            console.error('Incoming Chain must be longer than current Chain')
            return;
        }
        
        console.log('Replacing Chain with ', chain)
        this.chain = chain;
    }
}

module.exports = Blockchain;