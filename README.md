#### BRPs-CCER
Code/:
chaincode.go: The smart contract in this study that implements various functions and defines registration, EmissionReduction, RevenueAllocation, Trading, and Transfer.

config.yaml: Benchmark configuration file for Hyperledger Caliper, specifying workload profiles, network settings, and measurement parameters for evaluating the performance of the smart contract functions.

index.js: When validating the EmissionReduction and RevenueAllocation functions, this script reads energy_consumption.json from the local file system and invokes the EmissionReduction function in the chaincode to calculate emission reductions.

Trading.js: When validating the aggregation mechanism, this script, within the Hyperledger Caliper benchmarking environment, sequentially reads local Request.json data and repeatedly calls the chaincode’s Trading function, while performing performance testing and logging.

energy_consumption.json: Energy consumption data used to validate the EmissionReduction and RevenueAllocation functions.

Request Data: Request data uploaded when evaluating the aggregation mechanism.

CCER Data.xlsx: CCER transaction data.

CEA Data.xlsx: CEA transaction data.
