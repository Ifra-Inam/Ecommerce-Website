import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const DataContext = createContext();
const apiURL = 'https://fakestoreapi.com/products';

function App() {

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    async function searchProducts(searchTerm) {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            const filteredProducts = data.filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                            product.category.toLowerCase().includes(searchTerm.toLowerCase()));
            setProducts(filteredProducts);
        } 
        catch(error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        searchProducts(searchTerm);
    }, [searchTerm]); 

    useEffect(() => {

        const tokenExp = localStorage.getItem('tokenExp');

        if (tokenExp) {
            const currTime = Math.floor(Date.now() / 1000);

            if (parseInt(tokenExp) < currTime) {
                console.log("Token is invalid. Logged Out.");
                localStorage.setItem('loggedIn', false);
                localStorage.clear();
                navigate('/login');
            }
            else {
                console.log("Token is valid. Logged In.")
            }
        }

    }, []);
    
    return (
        <DataContext.Provider value={{searchProducts, products, searchTerm, setSearchTerm}}>
            <Navbar />
            <Outlet />
        </DataContext.Provider>
    );

}

function useData() {
    return useContext(DataContext);
}

export { App, useData };