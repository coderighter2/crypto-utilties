

window.contracts = {
    router:'0xD99D1c33F9fC3444f8101754aBC46c52416550D1',// Pancake testnet Swap Router
    factory: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
    // router: '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3', // Pancake.kiemtienonline360 test Swap Router
    // router: '0xcc7adc94f3d80127849d2b41b6439b7cf1eb4ae0', //pcs.nhancv.com swap router
    bnb: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    busd: '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7',
    dai: '0x8a9424745056eb399fd19a0ec26a14316684e274',
    usdt: '0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684',
    msc: '0xb3ae8e5bccebd6f7002c3bf1d5713477b16f8791',
    fatcake:'0x77FeBAaE535eC00d05648F49C36226BB1d0170FE', // Target Token
};

function loadABIs(baseDir) {
    window.abis = window.abis || {};
    var items = ['IUniswapV2Pair', 'PancakeFactory', 'PancakeRouter'];
    var promises = items.map(item => {
        return new Promise((resolve, reject) =>  {
            fetch(baseDir + "/abi/" + item + ".json").then(response => response.json()).then(json => {
                window.abis[item] = json.abi;
                resolve(true)
            });
        })
    });
    return Promise.all(promises);
}

