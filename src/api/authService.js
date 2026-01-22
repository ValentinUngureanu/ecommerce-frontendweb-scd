import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

export const authService = {
    login: async (email, password) => {
        return axios.post(`${API_URL}/login`, {email, password});
    },

    register: async (userData) => {
        return axios.post(`${API_URL}/register`, userData);
    },

    updateProfile: async (id, userData) => {
        const response = await axios.put(`${API_URL}/${id}`, userData);

        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        if (!user) return null;
        try {
            return JSON.parse(user);
        } catch (e) {
            return null;
        }
    }
};