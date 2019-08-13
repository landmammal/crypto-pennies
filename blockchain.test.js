const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;


    // creating a new blockchain instance before each test
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true)    
    })

    it('starts with a genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesisBlock())
    })

    it('adds a new block to the chain', () => {
        const newData = 'some data'
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data ).toEqual(newData);
    })

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('return false', () => {
                blockchain.chain[0] = { data: "fake-genesis" }

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            })
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            // create blocks before each test case
            beforeEach(() => {
                blockchain.addBlock({ data: "beers" });
                blockchain.addBlock({ data: "bets" });
                blockchain.addBlock({ data: "buzz lightyear" });
            })

            describe('and last hash reference has changed', () => {
                it('return false', () => {     
                    blockchain.chain[2].lastHash = "tamper-with-hash-link"

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('return false', () => {
                    blockchain.chain[2].data = "Evil-block-data"

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain down not contain any invalid blocks', () => {
                it('return true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain()', () => {
        let errMock, logMock;

        beforeEach(() => {
            errMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errMock;
            global.console.log = logMock;
        })

        describe('when the chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0] = { new: 'chain' };

                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs and error', () => {
                expect(errMock).toHaveBeenCalled();
            })
        });

        describe('when the new chain is longer', () => {
             // create blocks before each test case
            beforeEach(() => {
                newChain.addBlock({ data: "beers" });
                newChain.addBlock({ data: "bets" });
                newChain.addBlock({ data: "buzz lightyear" });
            })

            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = "fake-hash"

                    blockchain.replaceChain(newChain.chain);
                });
                
                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);                    
                });

                it('logs and error', () => {
                    expect(errMock).toHaveBeenCalled();
                })
            });

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it('it reaplces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs chain replacement notice ', () => {
                    expect(logMock).toHaveBeenCalled();
                })
            });
         });
    });
})