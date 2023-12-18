import { APICore } from './apiCore';
import axios from "axios";

const api = new APICore();
const baseUrl = 'http://localhost:8080'

const getData = () => {
    const configHeader = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    return axios.get('http://localhost:8080/statistical/search', configHeader);
}

const updateData = ({ id, data }) => {
    const url = baseUrl + `/statistical/${id}`;
    return axios.put(`${url}`, data);
}

const addData = ({ data }) => {
    const url = baseUrl + `/statistical/create`;
    return api.post(`${url}`, data);
}

const deleteData = ({ userId, data }) => {
    const url = baseUrl + `/statistical/${userId}`;
    return api.delete(url);
}

export { getData, updateData, addData, deleteData };
