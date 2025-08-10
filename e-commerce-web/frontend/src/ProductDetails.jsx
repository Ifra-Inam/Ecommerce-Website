import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from './App.jsx';
import axios from 'axios';

function ProductDetails() {

  const loggedIn = Boolean(localStorage.getItem('loggedIn'));
  const params = useParams();
  const { products } = useData();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    product_id: null, 
    user_id: null,
    quantity: null,
    price: null
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (cart.product_id) {
      axios.post('http://localhost:5000/addtocart', cart)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        if (error.response) {
          setError(error.response.data.message); 
        }
        else {
          setError("An error occured. Please try again later.")
        }
      })
    }
  }, [cart])
  
  const product = products.find(product => product.id === Number(params.id));

  if (!product) return <div>Not found</div>;

  const {id, title, price, description, category, image, rating} = product;

  function handleQuantityDecrease() {
    setQuantity(q => q - 1);
  }

  function handleQuantityIncrease() {
    setQuantity(q => q + 1);
  }

  function handleAddToCart() {
    setAdded(true);

    const userId = localStorage.getItem('userId');
    if (userId) {
      setCart(c => ({
        ...c, 
        product_id: id, 
        user_id: Number(userId),
        quantity: quantity,
        price: quantity * price
      }));
    }
    else {
      navigate('/login');
    }
  }

  return (
    <div className="product-details">

      <div><img src={image} alt={title}/></div>

      <div className="product-text-2">
        <h3>{title}</h3>
        <h4>${price}</h4>
        <h4>{rating.rate}</h4>
        <h4>Category: {category}</h4>
        <h5>Description: {description}</h5>
      </div>

      <div className="quantity-section">
        <button onClick={handleQuantityDecrease} disabled={quantity <= 1}>-</button>
        <div>{quantity}</div>
        <button onClick={handleQuantityIncrease} disabled={quantity >= 10}>+</button>
      </div>
      <button disabled={added && loggedIn} onClick={handleAddToCart}>Add to Cart</button>
      {error && <div>{error}</div>}
      {added && loggedIn && <Link to='/cart'>Go to Cart</Link>}

    </div>    
  );

}

export default ProductDetails;