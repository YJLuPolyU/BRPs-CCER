'use strict';

const fs = require('fs');
const path = require('path');
const { FileSystemWallet, Gateway } = require('fabric-network');

async function main() {
  try {
    // 1. 读取本地 energy_consumption.json
    const energyPath = path.join(__dirname, 'energy_consumption.json');
    if (!fs.existsSync(energyPath)) {
      console.error('energy_consumption.json not found at:', energyPath);
      process.exit(1);
    }

    const energyRaw = fs.readFileSync(energyPath, 'utf8');
    let energyData;
    try {
      energyData = JSON.parse(energyRaw);
    } catch (e) {
      console.error('Failed to parse energy_consumption.json as JSON:', e);
      process.exit(1);
    }

    console.log('=== Local energy_consumption.json ===');
    console.log(JSON.stringify(energyData, null, 2));

    // 2. 读取连接配置文件（你刚刚编辑过，只保留了 peer0）
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // 3. 使用 wallet 中的 appUser 身份
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const userExists = await wallet.exists('appUser');
    if (!userExists) {
      console.error('An identity for the user "appUser" does not exist in the wallet');
      console.error('Run the enrollment / registerUser script first.');
      process.exit(1);
    }

    // 4. 连接网关
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'appUser',
      discovery: { enabled: true, asLocalhost: true }
    });

    // 5. 获取通道和 money_demo 链码
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('money_demo');

    // 6. 调用 EmissionReduction
    const energyJSON = JSON.stringify(energyData); // 转成字符串传给链码
    console.log('\n=== Submitting transaction: EmissionReduction ===');

    const resultBuffer = await contract.submitTransaction('EmissionReduction', energyJSON);

    // 7. 解析并打印结果
    const resultStr = resultBuffer.toString('utf8');
    console.log('\n=== EmissionReduction Result (raw JSON) ===');
    console.log(resultStr);

    let resultObj;
    try {
      resultObj = JSON.parse(resultStr);
      console.log('\n=== EmissionReduction Result (pretty) ===');
      console.log(JSON.stringify(resultObj, null, 2));
    } catch (e) {
      console.warn('Result is not valid JSON, raw string printed above.');
    }

    // 8. 断开网关
    await gateway.disconnect();
    console.log('\n=== Done ===');
  } catch (error) {
    console.error('\n*** Failed to evaluate/submit transaction:', error);
    process.exit(1);
  }
}

main();