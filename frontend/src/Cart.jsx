import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { useData } from './App.jsx';

function Cart() {

    const { products } = useData();
    
    const [viewCart, setViewCart] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        localStorage.setItem('orderProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts])

    useEffect(() => {
        const userId = localStorage.getItem('userId');                                        
        if (userId) {
            axios.get(`http://localhost:5000/cart?userId=${userId}`)
            .then(response => {
                console.log(response.data);
                setViewCart(response.data.result);
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data.message);
                }
                else {
                    console.log("An error occured. Please try again later.");
                }
            })
        }
    }, [])

    function handleCheckboxChange(productId) {
        setSelectedProducts(sp => {
            if (sp.includes(productId)) {
                return sp.filter(id => id !== productId);
            }
            else {
                return [...sp, productId];
            }
        });
    }

    const cartProducts = viewCart.map(product => {
        const matchingProduct = products.find(mp => mp.id == product.product_id);
        return (
            <li key={product.id}>
                {matchingProduct && (
                    <div>
                        <input 
                            type="checkbox"
                            value={matchingProduct.id}
                            checked={selectedProducts.includes(matchingProduct.id)}
                            onChange={() => handleCheckboxChange(matchingProduct.id)}
                        />
                        <img src={matchingProduct.image} alt={matchingProduct.title}/>
                        <h3>{matchingProduct.title}</h3>
                        <h4>${matchingProduct.price}</h4>
                        <h4>Qty: {product.quantity}</h4>
                    </div>
                )}
            </li>
        );
    })

    return (
        <div>
            <ul>
                {cartProducts}
            </ul>

            {selectedProducts.length > 0 && (
                <div>
                    <Link to='/checkout'>CHECKOUT</Link>
                </div>
            )}
        </div>
    );

}

export default Cart;