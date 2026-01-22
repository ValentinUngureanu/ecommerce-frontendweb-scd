import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './api/authService';

// Importuri pagini existente
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import AddProduct from './pages/product/AddProduct';
import ProductDetails from './pages/product/ProductDetails';
import Cart from "./pages/cart/Cart.jsx";
import EditProfile from "./pages/profile/EditProfile.jsx";
import EditProduct from "./pages/product/EditProduct.jsx";

// --- COMPONENTE DE PROTECȚIE ---

// Protejează rutele care cer login (Profile, Cart, etc.)
const PrivateRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    return user ? children : <Navigate to="/login" />;
};

// Protejează rutele de ADMIN
const AdminRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    return (user && user.role === 'ADMIN') ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Rute Publice */}
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/product/:id" element={<ProductDetails/>}/>

                    {/* Rute Protejate (Necesită Login) */}
                    <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
                    <Route path="/cart" element={<PrivateRoute><Cart/></PrivateRoute>}/>
                    <Route path="/add-product" element={<PrivateRoute><AddProduct/></PrivateRoute>}/>
                    <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                    <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />

                    {/* Rute de ADMIN (Exemplu dacă ai pagină separată, deși tu o ai integrată în Profile) */}
                    {/* Dacă decizi să faci o pagină separată de Dashboard:
                        <Route path="/admin-stats" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;