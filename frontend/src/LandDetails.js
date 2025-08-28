// LandDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import LandRegistry from "./abis/LandRegistry.json"; 
import axios from "axios";
import "./LandManagement.css";

function LandDetails() {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [extraData, setExtraData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1️ Connect to blockchain
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const networkId = await web3.eth.net.getId();
          const networkData = LandRegistry.networks[networkId];
          if (!networkData) {
            setError("Smart contract not deployed to this network");
            setLoading(false);
            return;
          }
          const contract = new web3.eth.Contract(
            LandRegistry.abi,
            networkData.address
          );

          // 2️⃣ Fetch land details from blockchain
          const landData = await contract.methods.getLand(id).call();
          setLand({
            id,
            owner: landData.owner,
            size: landData.size,
            location: landData.location,
            isForSale: landData.isForSale
          });

          // 3️⃣ Fetch extra off-chain metadata from backend
          const response = await axios.get(`/api/lands/${id}`);
          setExtraData(response.data || {});
        } else {
          setError("Ethereum provider not detected");
        }
      } catch (err) {
        console.error("Error fetching land details:", err);
        setError("Failed to load land details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <div className="loading">Loading land details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!land) return <div className="no-data">No land found.</div>;

  return (
    <div className="container">
      <h2>Land Details</h2>

      <div className="card p-3">
        <p><strong>Land ID:</strong> {land.id}</p>
        <p><strong>Owner Address:</strong> {land.owner}</p>
        <p><strong>Size:</strong> {land.size} acres</p>
        <p><strong>Blockchain Location:</strong> {land.location}</p>
        <p><strong>For Sale:</strong> {land.isForSale ? "Yes" : "No"}</p>

        {extraData.latitude && extraData.longitude && (
          <p>
            <strong>Geo Coordinates:</strong> {extraData.latitude}, {extraData.longitude}
          </p>
        )}
        {extraData.description && (
          <p><strong>Description:</strong> {extraData.description}</p>
        )}
        {extraData.imageUrl && (
          <img
            src={extraData.imageUrl}
            alt="Land"
            style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "10px" }}
          />
        )}
      </div>

      <footer>
        <p>Data fetched from blockchain & enriched with off-chain metadata</p>
      </footer>
    </div>
  );
}

export default LandDetails;
