import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/products`;
const CART_URL = `${BASE_URL}/cart`;
const ORDER_URL = `${BASE_URL}/orders`;

export const productService = {

    getAll: () => {
        return axios.get(API_URL);
    },

    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    getByUser: (userId) => {
        return axios.get(`${API_URL}/user/${userId}`);
    },

    create: (productData) => {
        return axios.post(`${API_URL}/add`, productData);
    },

    delete: (id, userId) => {
        return axios.delete(`${API_URL}/delete/${id}`, {params: {userId}});
    },

    update: (id, userId, productData) => {
        return axios.put(`${API_URL}/update/${id}`, productData, {
            params: {userId}
        });
    },

    search: (name) => {
        return axios.get(`${API_URL}/search`, {params: {name}});
    },

    getByCategory: (category) => {
        return axios.get(`${API_URL}/category/${category}`);
    },

    translateDescription: (id) => {
        return axios.get(`${API_URL}/${id}/translate`);
    },


    getCart: (userId) => {
        return axios.get(`${CART_URL}/user/${userId}`);
    },

    addToCart: (userId, productId) => {
        return axios.post(`${CART_URL}/add`, {userId, productId});
    },

    updateCartQuantity: (cartItemId, quantity) => {
        return axios.put(`${CART_URL}/update/${cartItemId}`, {quantity});
    },

    removeFromCart: (cartItemId) => {
        return axios.delete(`${CART_URL}/delete/${cartItemId}`);
    },


    placeOrder: (userId) => {
        return axios.post(`${ORDER_URL}/place`, null, {params: {userId}});
    },

    getOrdersByUser: (userId) => {
        return axios.get(`${ORDER_URL}/user/${userId}`);
    }
};