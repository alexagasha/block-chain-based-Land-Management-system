const gasLimit = await landRegistryContract.estimateGas.registerLand(plotNumber, ownerName, area);
const transaction = await landRegistryContract.registerLand(plotNumber, ownerName, area, {
  gasLimit: gasLimit
});
