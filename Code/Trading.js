'use strict';

const G = require('./open.js');
const fs = require('fs');
const logger = require('@hyperledger/caliper-core').CaliperUtils.getLogger('Test');

let bc, contx;
let total, index = 0;

module.exports.init = async (blockchain, context, args) => {
    bc = blockchain;
    contx = context;
    total = G.counts ? G.counts.length : 0;
    index = 0;
};

module.exports.run = async () => {
    if(index >= total) {
        logger.warn('交易索引超出总数');
        return;
    }

    // 读取本地 Request.json
    let requests;
    try {
        requests = JSON.parse(fs.readFileSync('../chaincode/demo/callback/Request.json', 'utf-8'));
    } catch (e) {
        logger.error('本地Request.json读取失败:', e.message);
        throw e;
    }

    // Trading
    let tradingArgs = {
        chaincodeFunction: 'Trading',
        chaincodeArguments: [JSON.stringify(requests)],
    };

    let respTrading = await bc.invokeSmartContract(contx, G.contractID, G.contractVer, tradingArgs, 10000);

    if (!(respTrading && Array.isArray(respTrading) && respTrading[0] && respTrading[0].status)) {
        logger.error('Trading链码调用返回异常:', respTrading);
    }

    index++;
    return respTrading;
};

module.exports.end = async () => {};