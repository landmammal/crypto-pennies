// screen case syntax lets us know its using a hard coded value

const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3; // low difficulty for developing purposes
const GENESIS_DATA = { 
    timestamp: 1,
    lastHash: '------',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
 };

 module.exports = { GENESIS_DATA,  MINE_RATE } // key and value are both call GENESIS_DATA