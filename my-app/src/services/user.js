import { APICore } from './apiCore';
import axios from "axios";

const api = new APICore();
const baseUrl = 'http://localhost:8080'

const getUsers = () => {
    try {
        const configHeader = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        };
        const response =  axios.get('http://localhost:8080/users', configHeader);
        console.log(response)
    } catch (error) {}
}

const getUserDetail = ({ userId }) => {
    const url = baseUrl + `/users/${userId}`;
    return api.get(url);
}

const updateUser = ({ userId, data }) => {
    const url = baseUrl + `/users/${userId}`;
    return api.put(`${url}`, data);
}

const addUser = ({ data }) => {
    const url = baseUrl + `/users`;
    return api.post(`${url}`, data);
}

const deleteUser = ({ userId, data }) => {
    const url = baseUrl + `/users/${userId}`;
    return api.delete(url);
}

export { getUsers, getUserDetail, updateUser, addUser, deleteUser };
