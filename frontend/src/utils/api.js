import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const registerLand = async (data, token) => {
    return axios.post(`${API_URL}/registerLand`, data, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};
