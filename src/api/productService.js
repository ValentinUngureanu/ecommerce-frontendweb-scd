import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';
const API_URL = `${BASE_URL}/products`;
const CART_URL = `${BASE_URL}/cart`;
const ORDER_URL = `${BASE_URL}/orders`;

export const productService = {
    // === SECȚIUNE PRODUSE ===

    getAll: () => axios.get(API_URL),

    getById: (id) => axios.get(`${API_URL}/${id}`),

    getByUser: (userId) => axios.get(`${API_URL}/user/${userId}`),

    create: (productData) => axios.post(`${API_URL}/add`, productData),

    // Această metodă va funcționa acum și pentru Admini deoarece trimite userId în params
    delete: (id, userId) => axios.delete(`${API_URL}/delete/${id}`, { params: { userId } }),

    update: (id, userId, productData) => axios.put(`${API_URL}/update/${id}`, productData, {
        params: { userId }
    }),

    search: (name) => axios.get(`${API_URL}/search`, { params: { name } }),

    getByCategory: (category) => axios.get(`${API_URL}/category/${category}`),

    // === SECȚIUNE COȘ DE CUMPĂRĂTURI ===

    getCart: (userId) => axios.get(`${CART_URL}/user/${userId}`),

    addToCart: (userId, productId) => axios.post(`${CART_URL}/add`, { userId, productId }),

    updateCartQuantity: (cartItemId, quantity) => axios.put(`${CART_URL}/update/${cartItemId}`, { quantity }),

    removeFromCart: (cartItemId) => axios.delete(`${CART_URL}/delete/${cartItemId}`),

    // === SECȚIUNE COMENZI ===

    placeOrder: (userId) => axios.post(`${ORDER_URL}/place`, null, { params: { userId } }),

    getOrdersByUser: (userId) => axios.get(`${ORDER_URL}/user/${userId}`)
};