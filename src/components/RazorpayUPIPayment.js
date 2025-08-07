import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function RazorpayUPIPayment({ amount, cartItems }) {
  const { tableId } = useParams();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (amount <= 0) {
      alert('Cart is empty. Please add items before proceeding.');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // 🔁 Replace with your Razorpay key
      amount: amount * 100, // 💰 Razorpay accepts amount in paise
      currency: 'INR',
      name: 'Restaurant Order',
      description: `Table ${tableId} order`,
      image: '/logo192.png', // optional - you can use your logo
      handler: function (response) {
        alert(
          'Payment successful! Payment ID: ' + response.razorpay_payment_id
        );
        console.log('Payment success:', response);
        // Optional: Send to backend here for verification or saving order
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      notes: {
        table_id: tableId,
        order_items: cartItems
          .map(item => `${item.qty}x ${item.name}`)
          .join(', '),
      },
      theme: {
        color: '#528FF0',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      alert('Payment failed. Please try again.');
    });

    rzp.open();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button className="checkout-btn" onClick={handlePayment}>
        Pay Now with UPI
      </button>
    </div>
  );
}
