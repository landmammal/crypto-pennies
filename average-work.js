const Blockchain = require('./blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });

let prevTime, currentTime, timeDiff, average, currentBlock;

const times = [];

for (let i=0; i < 10000; i++) {
    prevTime = blockchain.chain[blockchain.chain.length-1].timestamp;

    blockchain.addBlock({ data: `block ${i}`});
    currentBlock = blockchain.chain[blockchain.chain.length-1]

    currentTime = currentBlock.timestamp;
    timeDiff = currentTime - prevTime;
    times.push(timeDiff);

    average = times.reduce((total, num) =>  (total + num) )/times.length;

    console.log(`Times to mine a Block: ${timeDiff}ms. Difficulty: ${currentBlock.difficulty}. Average: ${average}.`);
}