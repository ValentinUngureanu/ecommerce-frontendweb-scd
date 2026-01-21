import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

export const productService = {
    // 1. Obține TOATE produsele (pentru Home)
    getAll: () => {
        return axios.get(API_URL);
    },

    // 2. Obține DETALIILE unui produs (pentru ProductDetails.jsx)
    // Mapat pe @GetMapping("/{id}") din Java
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // 3. Obține produsele unui anumit USER (pentru Profil)
    // Mapat pe @GetMapping("/user/{userId}") din Java
    getByUser: (userId) => {
        return axios.get(`${API_URL}/user/${userId}`);
    },

    // 4. CREARE produs nou (pentru AddProduct.jsx)
    // Mapat pe @PostMapping("/add") din Java
    create: (productData) => {
        return axios.post(`${API_URL}/add`, productData);
    },

    // 5. ȘTERGERE produs
    // Mapat pe @DeleteMapping("/delete/{id}") din Java
    delete: (id, userId) => {
        return axios.delete(`${API_URL}/delete/${id}`, { params: { userId } });
    },

    // 6. ACTUALIZARE produs
    // Mapat pe @PutMapping("/update/{id}") din Java
    update: (id, userId, productData) => {
        return axios.put(`${API_URL}/update/${id}`, productData, { params: { userId } });
    },

    // 7. CĂUTARE (pentru search bar-ul de pe Home)
    // Mapat pe @GetMapping("/search") din Java
    search: (name) => {
        return axios.get(`${API_URL}/search`, { params: { name } });
    },

    // 8. FILTRARE CATEGORIE
    // Mapat pe @GetMapping("/category/{category}") din Java
    getByCategory: (category) => {
        return axios.get(`${API_URL}/category/${category}`);
    }
};