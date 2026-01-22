import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {authService} from './api/authService';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import AddProduct from './pages/product/AddProduct';
import ProductDetails from './pages/product/ProductDetails';
import Cart from "./pages/cart/Cart.jsx";
import EditProfile from "./pages/profile/EditProfile.jsx";
import EditProduct from "./pages/product/EditProduct.jsx";

const PrivateRoute = ({children}) => {
    const user = authService.getCurrentUser();
    return user ? children : <Navigate to="/login"/>;
};

const AdminRoute = ({children}) => {
    const user = authService.getCurrentUser();
    return (user && user.role === 'ADMIN') ? children : <Navigate to="/"/>;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/product/:id" element={<ProductDetails/>}/>

                    <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
                    <Route path="/cart" element={<PrivateRoute><Cart/></PrivateRoute>}/>
                    <Route path="/add-product" element={<PrivateRoute><AddProduct/></PrivateRoute>}/>
                    <Route path="/edit-profile" element={<PrivateRoute><EditProfile/></PrivateRoute>}/>
                    <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct/></PrivateRoute>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;