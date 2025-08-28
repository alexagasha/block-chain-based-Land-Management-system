import React, { useState, useEffect } from 'react';
import web3 from './web3';
import LandRegistry from './LandRegistry.json';

const ContractAddress = '0x...'; // Your deployed contract address
const landRegistryContract = new web3.eth.Contract(LandRegistry.abi, ContractAddress);

const LandDetails = () => {
  const [landDetails, setLandDetails] = useState(null);

  useEffect(() => {
    const fetchLandDetails = async () => {
      try {
        const landId = 1; // Replace with dynamic ID
        const details = await landRegistryContract.methods.getLandDetails(landId).call();
        setLandDetails(details);
      } catch (error) {
        console.error('Error fetching land details:', error);
      }
    };

    fetchLandDetails();
  }, []);

  if (!landDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Land Details</h2>
      <p>Owner: {landDetails.ownerName}</p>
      <p>Location: {landDetails.location}</p>
      <p>Area: {landDetails.area}</p>
    </div>
  );
};

export default LandDetails;
