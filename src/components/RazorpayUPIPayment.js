import React, { useEffect, useState } from "react";

const RazorpayUPIPayment = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error("Razorpay SDK failed to load");
      alert("Failed to load payment SDK. Please try refreshing.");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!scriptLoaded) {
      alert("Payment SDK not loaded yet. Please wait.");
      return;
    }

    const options = {
      key: "HIQ4yiRGEH5JVd9AlZeae3yc", // ⚠️ Replace with your test/public key
      amount: 50000, // 500 INR in paise
      currency: "INR",
      name: "Your Company",
      description: "Test UPI Transaction",
      image: "https://yourdomain.com/logo.png", // Optional
      handler: function (response) {
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9123456789",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: true,
        card: false,
        netbanking: false,
        wallet: false,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h2>Pay ₹500 via UPI</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#0a8fdc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Pay Now
      </button>

      {/* Optional Fallback UPI link */}
      <div style={{ marginTop: "20px" }}>
        <p>If the payment window doesn't open, use the UPI link below:</p>
        <a
          href="upi://pay?pa=9958912322@ybl&pn=Your+Name&am=500.00&cu=INR"
          style={{ color: "#0a8fdc", textDecoration: "underline" }}
        >
          Pay using UPI app
        </a>
      </div>
    </div>
  );
};

export default RazorpayUPIPayment;
