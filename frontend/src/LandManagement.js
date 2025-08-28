import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import LandRegistry from "./abis/LandRegistry.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandManagement.css";
import "./App.css";

const contractAddress = "0x9C65B156a7Df500123811bf6C6Dd7cd2959900E7";

const LandManagement = () => {
  // Owner details
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  // Location details
  const [village, setVillage] = useState("");
  const [parish, setParish] = useState("");
  const [subCounty, setSubCounty] = useState("");
  const [county, setCounty] = useState("");
  const [district, setDistrict] = useState("");
  const [region, setRegion] = useState("");
  // Other land info
  const [area, setArea] = useState("");
  const [nin, setNin] = useState("");
  // Next of kin
  const [nokName, setNokName] = useState("");
  const [nokPhone, setNokPhone] = useState("");
  // Misc
  const [message, setMessage] = useState("");
  const [contract, setContract] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const landRegistry = new Contract(contractAddress, LandRegistry.abi, signer);
          setContract(landRegistry);
        } else {
          alert("Please install MetaMask!");
        }
      } catch (err) {
        console.error("Contract initialization error:", err);
      }
    };
    initContract();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLandRegistration = async () => {
    if (!contract) return;
    const ownerName = `${firstName.trim()} ${surname.trim()}`.trim();
    const location = `${village}, ${parish}, ${subCounty}, ${county}, ${district}, ${region}`.replace(/(, )+/g, ", ").trim();

    try {
      const tx = await contract.registerLand(ownerName, location, area, nin);
      await tx.wait();
      setMessage("✅ Land registered successfully.");
    } catch (error) {
      console.error("❌ Registration error:", error);
      setMessage("Error registering land");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar Dashboard */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
        <h5 className="mb-4">Dashboard</h5>
        <button className="btn btn-light w-100 mb-2" onClick={() => navigate("/login")}>
          Login Page
        </button>
        <button className="btn btn-light w-100 mb-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Register New Land
        </button>
        <button className="btn btn-light w-100 mb-2" onClick={() => navigate("/land-details")}>
          Land Details
        </button>
        <button className="btn btn-light w-100 mb-2" onClick={() => navigate("/show-lands")}>
          Show All Lands
        </button>
        <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="container p-4">
        <div className="card p-4 mb-4 shadow-sm">
          <h4 className="mb-4">Register New Land</h4>
          {/* Form Fields */}
          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <input type="tel" className="form-control" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          {/* Location fields */}
          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="Village" value={village} onChange={(e) => setVillage(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Parish" value={parish} onChange={(e) => setParish(e.target.value)} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="Sub-county" value={subCounty} onChange={(e) => setSubCounty(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="County" value={county} onChange={(e) => setCounty(e.target.value)} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
          </div>

          {/* Area and NIN */}
          <div className="row mb-3">
            <div className="col">
              <input type="number" className="form-control" placeholder="Area (sq meters)" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="National Identification Number (NIN)" value={nin} onChange={(e) => setNin(e.target.value)} />
            </div>
          </div>

          {/* Next of Kin */}
          <h5 className="mt-4 mb-3">Next of Kin Details</h5>
          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="Next of Kin Name" value={nokName} onChange={(e) => setNokName(e.target.value)} />
            </div>
            <div className="col">
              <input type="tel" className="form-control" placeholder="Next of Kin Phone" value={nokPhone} onChange={(e) => setNokPhone(e.target.value)} />
            </div>
          </div>

          {/* Geo-coordinates */}
          <h5 className="mt-4 mb-3">Location Geo-coordinates</h5>
          <div className="row mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="Latitude" value={latitude} readOnly />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Longitude" value={longitude} readOnly />
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleLandRegistration}>
            Register Land
          </button>

          <div className="text-danger mt-2">{message}</div>
        </div>

        {/* Footer */}
        <footer className="text-center py-3 border-top mt-4">
          &copy; {new Date().getFullYear()} Lands Management System. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandManagement;
