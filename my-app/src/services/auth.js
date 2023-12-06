import { APICore } from './apiCore';

const api = new APICore();

function login(params) {
    const baseUrl = '/auth/login';
    return api.post(`${baseUrl}`, params);
}

function logout() {
    const baseUrl = '/logout/';
    return api.post(`${baseUrl}`, {});
}

function signup(params) {
    const baseUrl = '/auth/register';
    return api.post(`${baseUrl}`, params);
}

function forgotPassword(params) {
    const baseUrl = '/forget-password/';
    return api.post(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params) {
    const baseUrl = '/password/reset/confirm/';
    return api.post(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword, forgotPasswordConfirm };
