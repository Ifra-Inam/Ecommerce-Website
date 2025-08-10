import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Checkout() {

    const loggedIn = localStorage.getItem('loggedIn');
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France', 'Japan', 'Brazil', 'South Korea'];
    const [values, setValues] = useState({
        location: '',
        firstname: '',
        lastname: '',
        contact: '',
        address1: '',
        address2: '',
        postal: '',
        stateProv: '',
        city: ''
    });
    const [values1, setValues1] = useState({
        cardnumber: '',
        exp: '',
        ccv: '',
        name: '',
    });
    const [shippingMethod, setShippingMethod] = useState('option1');
    const [standardShippingDate, setStandardShippingDate] = useState(null); 
    const [expressShippingDate, setExpressShippingDate] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    const userId = localStorage.getItem('userId');
    const orderProducts = JSON.parse(localStorage.getItem('orderProducts'));
    const [prices, setPrices] = useState([]);
    const [subTotal, setSubTotal] = useState(0);

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchPrices = async () => {
            const pricesArray = []; // Array to hold all the prices
    
            for (let product of orderProducts) {
                try {
                    const response = await axios.post('http://localhost:5000/getsubtotal', { userId, product });
                    console.log(response.data);
                    pricesArray.push(Number(response.data.price)); // Collect the price
                } catch (error) {
                    if (error.response) {
                        console.log(error.response.data.message);
                    } else {
                        console.log("An error occurred. Please try again later.");
                    }
                }
            }
            console.log(pricesArray);
            setPrices(pricesArray); // Once all prices are fetched, update the state
        };
    
        fetchPrices();
    }, []);

    useEffect(() => {
        setSubTotal(prices.reduce((acc, price) => acc + price, 0));
    }, [prices]);

    function handleValueChange(e) {
        setValues(v => ({...v, [e.target.name]: e.target.value}));
    }
    
    function addDays(date, days) {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    }

    function handleRadioChange(value) {
        setShippingMethod(value);      
    }

    useEffect(() => {
        const todayDate = new Date();
        setStandardShippingDate(addDays(todayDate, 14)); 
        setExpressShippingDate(addDays(todayDate, 3)); 
    }, [])

    function formatDate(date) {
        return date && date.toDateString();  
    }

    function handlePaymentMethod(method) {
        setPaymentMethod(method);
    }

    useEffect(() => {
        if (subTotal) {
            if (shippingMethod === 'option1') {
                setTotalPrice(subTotal * 1.05 + 3.05);
            }
            else if (shippingMethod === 'option2') {
                setTotalPrice(subTotal * 1.05 + 26);
    
            }
        }
    }, [subTotal, shippingMethod]);

    function handleCreditInfo(e) {
        setValues1(v => ({...v, [e.target.name]: e.target.value}))
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(values, values1);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <div>
                <h1>Shipping Address</h1>

                <label htmlFor="location">Location</label>
                <select 
                    name="location" 
                    value={values.location} 
                    onChange={handleValueChange}
                >
                    <option value="">Select a country</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                <label htmlFor="firstname">First Name</label>
                <input name="firstname" type="text" placeholder="Enter your first name" required onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="lastname">Last Name</label>
                <input name="lastname" type="text" placeholder="Enter your last name" required onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="contact">Phone Number</label>
                <input name="contact" type="text" placeholder="(XXX)-XXX-XXXX" required onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="address1">Adress Line 1</label>
                <input name="address1" type="text" placeholder="Adress Line 1" required onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="address2">Adress Line 2</label>
                <input name="address2" type="text" placeholder="Adress Line 2" onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="postal">Postal/Zip Code</label>
                <input name="postal" type="text" placeholder="XXX-XXX" required onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="stateProv">State/Province</label>
                <input name="stateProv" type="text" placeholder="Enter your state/province" required onChange={(e) => handleValueChange(e)}/>

                <label htmlFor="city">City</label>
                <input name="city" type="text" placeholder="Enter your city" required onChange={(e) => handleValueChange(e)}/>
            </div>

            <div className="shipping-method">
                <h1>Shipping Method</h1>

                <input type="radio" checked={shippingMethod === 'option1'} onChange={() => handleRadioChange('option1')} /> STANDARD SHIPPING, $3.05, {formatDate(standardShippingDate)}
                <input type="radio" checked={shippingMethod === 'option2'} onChange={() => handleRadioChange('option2')} /> EXPRESS SHIPPING, $26.00, {formatDate(expressShippingDate)}
            </div>

            <div className="payment-method">
                <h1>Payment Method</h1>

                <input type="radio" checked={paymentMethod === 'option1'} onChange={() => handlePaymentMethod('option1')} /> Credit/Debit Card
                {paymentMethod && (<div>
            <label>Card Number</label>
            <input name="cardnumber" type="text" placeholder="Card number" required onChange={handleCreditInfo}/>
            <label>Expiration Date (MM/YY)</label>
            <input name="exp" type="text" placeholder="MM/YY" required onChange={handleCreditInfo}/>
            <label>Security Code</label>
            <input name="ccv" type="text" placeholder="CVV 3-4 digits" required onChange={handleCreditInfo}/>
            <label>Name on card</label>
            <input name="name" type="text" placeholder="First and last name" required onChange={handleCreditInfo}/>
        </div>)}
            </div>

            <div className="payment">
                <h1>Payment</h1>
                {subTotal % 1 !== 0 ? <p>${subTotal}</p> : <p>${subTotal}.00</p>}
                <p>Subtotal: ${subTotal}</p>
                <p>Shipping Fee: ${shippingMethod === 'option2' ? 26.00 : 3.05}</p>
                <p>Tax: 5%</p>
                <p>Total: {totalPrice}</p>
            </div>

<button type="submit">Place Oder</button>
            </form>


        </div>
    );
}

export default Checkout;