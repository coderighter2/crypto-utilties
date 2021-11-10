/**
 * 
 * @param {*} account web3 ethereum account connected
 * @param {*} tokenA token contract address
 * @param {*} tokenB token contract address
 * @returns pair contract address
 */
async function getPair(account, tokenA, tokenB) {
    var contract    = new web3.eth.Contract(window.abis.PancakeFactory, contracts.factory, {from: account});
    var func        = await contract.methods['getPair'](tokenA, tokenB);
    return await func.call();
}

/**
 * 
 * @param {*} account web3 ethereum account connected
 * @param {*} tokens pair of token contract addresses
 * @returns response of getReserves method of the pair contract
 */
async function getPairReserves(account, contractAddress) {
    var contract    = new web3.eth.Contract(window.abis.IUniswapV2Pair, contractAddress, {from: account});
    var func        = await contract.methods['getReserves']();
    return await func.call();
}

/**
 * 
 * @param {*} account web3 ethereum account connected
 * @param {*} tokens pair of token contract addresses
 * @returns reserves at the pair contract between two tokens
 */
async function getTokenReserves(account, tokens) {
    var pairAddress = '';
    var pairReserves = undefined;
    try {
        pairAddress = await getPair(account, tokens[0], tokens[1]);
        try {
            pairReserves= await getPairReserves(account, pairAddress);
            if (tokens[0].toLowerCase() < tokens[1].toLowerCase()) {
                return [pairReserves[0], pairReserves[1]];
            } else {
                return [pairReserves[1], pairReserves[0]];
            }
        } catch (e) {
            throw new Error('cannot get reserves between ' +  + tokens[0] + ' ' + tokens[1]);
        }
    } catch (e) {
        throw new Error('cannot find pair between ' + tokens[0] + ' ' + tokens[1]);
    }
}

/**
 * 
 * @param {*} account web3 ethereum account connected
 * @param {*} amountIn amount in the currency of path[0]
 * @param {*} path array of token contract address, length >= 2
 * @returns estimated ouptut in wei
 */
async function getOutputAmount(account, amountIn, path) {
    var subPath = path.slice(0, 2);
    var reserves    = await getTokenReserves(account, subPath);

    var inputReserve = web3.utils.toBN(reserves[0]);
    var outputReserve = web3.utils.toBN(reserves[1]);
    var inputAmountWithFee = (web3.utils.isBN(amountIn) ? amountIn : web3.utils.toBN(amountIn)).mul(web3.utils.toBN(997));
    var numerator = inputAmountWithFee.mul(outputReserve);
    var denominator = inputReserve.mul(web3.utils.toBN(1000)).add(inputAmountWithFee);
    var outputAmount = numerator.div(denominator);

    if (path.length > 2) {
        return await getOutputAmount(account, outputAmount, path.slice(1));
    } else {
        return outputAmount.toString();
    }
}

/**
 * 
 * @param {*} amount output amount in wei
 * @param {*} slippage slippage percent (0.1, 0.2, 12 etc)
 * @returns output amount applied with slippage
 */
async function getEstimateWithSlippage(amount, slippage) {
    var res = web3.utils.toBN(amount).mul(web3.utils.toBN(1000)).div(web3.utils.toBN(1000).add(web3.utils.toBN(slippage).mul(web3.utils.toBN(10))));
    return res.toString();
}