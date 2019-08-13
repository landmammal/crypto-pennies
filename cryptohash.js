// native module crypto
const crypto = require('crypto');

// spread operator to take in multiple arguments and store them in an array call inputs
const cryptoHash = (...inputs) => {
    // for(inputs)
    const hash = crypto.createHash('sha256');
    
    hash.update( inputs.sort().join(' ') );

    return hash.digest('hex');
}

module.exports = cryptoHash