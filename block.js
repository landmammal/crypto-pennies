class Block {
    // when passing parameters as an object order wont matter
    constructor({ timestamp, lastHash, hash, data }){
        // this refrences the current instances been created
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
}

const block1 = new Block({ 
    timestamp: "01/01/2019", 
    lastHash: 'foo-lasthash', 
    hash: "foo-hash", 
    data: 'foo-data' 
});
console.log(block1)