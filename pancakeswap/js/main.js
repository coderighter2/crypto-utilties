function swapExactETHForTokens(){
    var   amount   = document.getElementById("amount_exact_eth").value * 1;
    var   path     = document.getElementById("contracts_exact_eth").value.trim().split(',').map(a => a.trim());

    const eth     = async () =>{
        if(window.ethereum){

            const accounts     = await window.ethereum.request({method: 'eth_requestAccounts'});
            var   to           = accounts[0];
            var   amountIn     = web3.utils.toWei(amount.toString(), 'ether');
            var   amountOutMin = await getOutputAmount(to, amountIn, path);
            amountOutMin = await getEstimateWithSlippage(amountOutMin, 10);
            var   deadline     = web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 25);
            var   contract     = new web3.eth.Contract(window.abis.PancakeRouter, contracts.router, {from: to});
            var   data         = await contract.methods['swapExactETHForTokens'](amountOutMin, path, to, deadline);
            var   count        = await web3.eth.getTransactionCount(to);
            var   gasPrice      = await web3.eth.getGasPrice();
            var   gas          = await data.estimateGas({value: amountIn});
            gas = web3.utils.toBN(gas).mul(web3.utils.toBN(10000).add(web3.utils.toBN(1000))).div(web3.utils.toBN(10000)).toNumber();
            
            
            var  tx = {
                from: to,
                gasPrice:web3.utils.toHex(gasPrice),
                gas: web3.utils.toHex(gas),
                to: contracts.router,
                value: web3.utils.toHex(amountIn),
                data: data.encodeABI(),
                nonce: web3.utils.toHex(count)
            };
            web3.eth.sendTransaction(tx,function(err, id){
                if(!err){
                    printLog(id);
                }else{
                    printLog(err);
                }
            });
        }
    };
    eth();
}

function swapExactTokensForETHSupportingFeeOnTransferTokens(){

    var   amount        = document.getElementById("amount_exact_eth_fee").value * 1;
    var   path     = document.getElementById("contracts_exact_eth_fee").value.trim().split(',').map(a => a.trim());

    const eth     = async () =>{
        if(window.ethereum){
            const accounts      = await window.ethereum.request({method: 'eth_requestAccounts'});
            var   to            = accounts[0];
            var   amountIn      =  web3.utils.toWei(amount.toString(), 'ether');
            var   amountOutMin = await getOutputAmount(to, amountIn, path);
            amountOutMin = await getEstimateWithSlippage(amountOutMin, 10);

            printLog('amountIn: ' + amountIn);
            printLog('amountOutMin: ' + amountOutMin);
            var   deadline      = web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 25);
            var   contract      = new web3.eth.Contract(window.abis.PancakeRouter, contracts.router, {from: to});
            var   data          = await contract.methods['swapExactETHForTokensSupportingFeeOnTransferTokens'](amountOutMin, path, to, deadline);
            var   count         = await web3.eth.getTransactionCount(to);
            var   gasPrice      = await web3.eth.getGasPrice();
            var   gas           = await data.estimateGas({value: amountIn});

            printLog('Estimated Gas: ' + gas);
            gas = web3.utils.toBN(gas).mul(web3.utils.toBN(10000).add(web3.utils.toBN(1000))).div(web3.utils.toBN(10000)).toNumber();
            printLog('Gas Limit: ' + gas);
            var   tx = {
                from: to,
                gasPrice:web3.utils.toHex(gasPrice),
                gas: web3.utils.toHex(gas),
                to: contracts.router,
                value: web3.utils.toHex(amountIn),
                data: data.encodeABI(),
                nonce: web3.utils.toHex(count)
            };

            web3.eth.sendTransaction(tx,function(err, id){
                if(!err){
                    printLog(id);
                }else{
                    printLog(err);
                }
            });


        }
    };eth();
}

function swapBNBToTokenWithFees2(swap, path){
    const eth     = async () =>{
        if(window.ethereum){
            const accounts      = await window.ethereum.request({method: 'eth_requestAccounts'});
            var   to            = accounts[0];
            var   path          = swap.path.map(x => contracts[x]);
            var   amountIn      = web3.utils.toWei(swap.amount.toString(), 'ether');
            var   amountOutMin  = web3.utils.toWei(swap.amountOutMin.toString(), 'ether');
            var   deadline      = web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 25);

            var   contract      = new web3.eth.Contract(window.abis.PancakeRouter, contracts.router, {from: to});

            try {
                var   price      = await contract.methods['getAmountsOut'](amountIn, path);
                var   p          = await price.call();
            } catch (e) {
                printLog(e.message);
                if (e.message.indexOf('INSUFFICIENT_LIQUIDITY') !== -1) {
                    alert('Insufficient Liqudity');
                }
                return;
            }


            var   data          = await contract.methods['swapExactETHForTokensSupportingFeeOnTransferTokens'](amountOutMin, path, to, deadline);
            var   count         = await web3.eth.getTransactionCount(to);
            var   gasPrice      = await web3.eth.getGasPrice();
            var   tx = {
                from: to,
                gasPrice:web3.utils.toHex(gasPrice),
                gas: web3.utils.toHex(490000),
                to: contracts.router,
                value: web3.utils.toHex(amountIn),
                data: data.encodeABI(),
                nonce: web3.utils.toHex(count)
            };

            web3.eth.sendTransaction(tx,function(err, id){
                if(!err){
                    printLog(id);
                }else{
                    printLog(err);
                }
            });


        }
    };eth();
}

function checkSwapPosibility() {
    const eth     = async () =>{
        if(window.ethereum){
            const accounts      = await window.ethereum.request({method: 'eth_requestAccounts'});
            var   to            = accounts[0];
            var   amount        = document.getElementById("amount_possibility").value * 1;
            var   contracts     = document.getElementById("contracts_possibility").value.trim().split(',').map(a => a.trim());
            var wei             = web3.utils.toWei(amount.toString(), 'ether')
            try {
                var output        = await getOutputAmount(to, wei, contracts);
                printLog('expected output', web3.utils.fromWei(output).toString());
                var outputWithSlippage = await getEstimateWithSlippage(output, 10);
                printLog('expected output with slippage = 10% :', web3.utils.fromWei(outputWithSlippage).toString());
            } catch (e) {
                printLog(e);
            }
        }
    }; eth();
}

function printLog(val) {
    var debugView = document.getElementById("debug");
    debugView.value = debugView.value + "\n" + Array.from(arguments).map(a => a.toString()).join("\n");
    debugView.scrollTop = debugView.scrollHeight;
}