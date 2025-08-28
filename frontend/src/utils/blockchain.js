
const txHash = '0xcdc73844c5acd49092bbf99eed9dd07338acc43baeffdd70fa7f24a26f446eac'; // Replace with your transaction hash
const isValid = await validateBlockchainTransaction(txHash);
if (isValid) {
    console.log('Transaction was successful!');
} else {
    console.log('Transaction failed or not yet confirmed.');
}
