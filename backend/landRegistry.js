

import web3 from './web3';
import LandRegistry from './LandRegistry.json';  



// Contract address (replace with the address you deployed on your network)
const contractAddress = LandRegistry.networks['5777'].address;  

// Create the contract instance
const landRegistryContract = new web3.eth.Contract(LandRegistry.abi, contractAddress);

// Fetch land details by ID
const getLandDetails = async (landId) => {
    try {
        const landDetails = await landRegistryContract.methods.getLandDetails(landId).call();
        console.log('Owner Name:', landDetails.ownerName);
        console.log('Location:', landDetails.location);
        console.log('Area:', landDetails.area);
        return landDetails;
    } catch (error) {
        console.error("Error fetching land details:", error);
    }
};

// Example: Fetch land details for land ID 1
const landId = 1;  // Example land ID
getLandDetails(landId);

// Export if you need this function elsewhere
export default getLandDetails;

app.post('/api/register', (req, res) => {
  // Handle registration logic
});
