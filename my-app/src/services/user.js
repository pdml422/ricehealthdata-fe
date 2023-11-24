import { APICore } from './apiCore';

const api = new APICore();
const baseUrl = 'http://localhost:8080'

const getUsers = () => {
    const url = baseUrl + '/users';
    return api.get(url);
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
