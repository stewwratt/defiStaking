
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        //load contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        //check to see if our reward tokens are transferred (1mil)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        //transfer 100 tokens the customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Reward Token Deployement', async () => {
        it('Matches symbol successfully', async () => {
            const symbol = await rwd.symbol()
            assert.equal(symbol, 'RWD')
        })
        it('Matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Tether Deployment', async () => {
        it('Matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Tether')
        })
    })

    describe('DecentralBank Deployment', async () => {
        it('Matches name successfully', async () => {
            const name =  await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })
        it('Contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yield Farming', async () => {
        it('Reward tokens for staking', async () => {
            let result
            //check invester balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'Customer tether balance before staking')

            //check staking customer of 100 tokens
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            //check updated balance of customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'Customer tether balance after staking')

            //check balance of decentral bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'Decentral Bank balance after customer staking')

            //is staking update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'Customer is staking status after staking')
            
            //test if issuance is carried out from the call of OWNER
            await decentralBank.issueTokens({from: owner})

            //test if issuance is carried out from the call of CUSTOMER (should not work)
            await decentralBank.issueTokens({from: customer}).should.be.rejected

            //unstake tokens
            await decentralBank.unstakeTokens({from: customer})

            //check unstaking balances
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'Customer tether balance after unstaking')

            //check balance of decentral bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('0'), 'Decentral Bank balance after customer unstaking')

            //is staking update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'false', 'Customer is no longer staking after unstaking')
        })
    })
})