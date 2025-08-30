import React, { useEffect, useState, useMemo } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaReceipt,
  FaDownload,
  FaHome,
} from 'react-icons/fa';
import successSound from '../assets/sound/success.wav';
import { motion } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// Add jsPDF script dynamically
if (typeof window !== 'undefined' && !window.jspdf) {
  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => {
    console.log('jsPDF loaded');
  };
  document.head.appendChild(script);
}

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentId, setPaymentId] = useState(null);

  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(true);

  const state = location.state || {};
  const cartItems = state.items || [];
  const couponApplied = state.couponApplied || false;
  const tableId = state.tableId;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id');

    if (paymentId) {
      setPaymentId(paymentId);
    }

    return () => {
      setPaymentId(null);
    };
  }, []);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      console.log('Order should be ready!');
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const progressPercentage = ((20 * 60 - timeLeft) / (20 * 60)) * 100;

  const calculateTotals = () => {
    if (couponApplied) {
      return {
        baseAmount: 0.68,
        serviceCharge: 0.03,
        gst: 0.29,
        total: 1,
      };
    }

    const baseAmount = cartItems.reduce(
      (sum, item) => sum + parseInt(item.price.replace('₹', '')) * item.qty,
      0
    );

    const serviceCharge = Math.round(baseAmount * 0.05 * 100) / 100;
    const subtotalAfterService = baseAmount + serviceCharge;
    const gst = Math.round(subtotalAfterService * 0.18 * 100) / 100;
    const total = Math.round((baseAmount + serviceCharge + gst) * 100) / 100;

    return {
      baseAmount,
      serviceCharge,
      gst,
      total,
    };
  };

  const { baseAmount, serviceCharge, gst, total } = calculateTotals();

  const subtotal = baseAmount;
  const serviceTax = serviceCharge;
  const gstAmount = gst;
  const totalAmount = total;

  const receiptNumber = useMemo(
    () => `RCP-${Date.now().toString().slice(-8)}`,
    []
  );

  const currentDateTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const downloadReceipt = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set default font
    doc.setFont('helvetica');

    // HEADER SECTION
    doc.setFillColor(28, 167, 69);
    doc.rect(0, 0, 210, 35, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('DEBUGGERS DA DHABBA', 105, 15, { align: 'center' });

    // Tagline
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text('Authentic Indian Cuisine • Code, Eat, Repeat', 105, 22, {
      align: 'center',
    });

    // Contact info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Tech Street, Digital City, PIN-110001', 105, 28, {
      align: 'center',
    });
    doc.text('+91-9876543210 | orders@debuggersdadhabba.com', 105, 32, {
      align: 'center',
    });

    // RECEIPT TITLE
    let y = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(240, 248, 255);
    doc.setDrawColor(28, 167, 69);
    doc.setLineWidth(1);
    doc.rect(15, y, 180, 12, 'FD');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 167, 69);
    doc.text('PAYMENT RECEIPT', 105, y + 8, { align: 'center' });

    // RECEIPT DETAILS SECTION
    y += 20;
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(220, 220, 220);
    doc.rect(15, y, 180, 32, 'FD');

    // Section headers
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(28, 167, 69);
    doc.text('RECEIPT DETAILS', 20, y + 8);
    doc.text('PAYMENT INFORMATION', 115, y + 8);

    // Details content
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Left column
    doc.text('Receipt No:', 20, y + 14);
    doc.setFont('helvetica', 'bold');
    doc.text(receiptNumber, 55, y + 14);
    doc.setFont('helvetica', 'normal');

    doc.text('Date & Time:', 20, y + 18);
    doc.text(currentDateTime, 55, y + 18);

    doc.text('Table Number:', 20, y + 22);
    doc.setFont('helvetica', 'bold');
    doc.text(`Table ${tableId}`, 55, y + 22);
    doc.setFont('helvetica', 'normal');

    doc.text('Customer ID:', 20, y + 26);
    doc.text('WALK-IN-001', 55, y + 26);

    // Right column
    doc.text('Payment Status:', 115, y + 14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 0);
    doc.text('PAID', 160, y + 14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.text('Payment Method:', 115, y + 18);
    doc.text('Online Payment', 160, y + 18);

    doc.text('Payment ID:', 115, y + 22);
    doc.text(paymentId || 'N/A', 160, y + 22);

    doc.text('Transaction:', 115, y + 26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 0);
    doc.text('SUCCESS', 160, y + 26);

    // ORDER DETAILS SECTION
    y += 40;
    doc.setFillColor(28, 167, 69);
    doc.rect(15, y, 180, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER DETAILS', 105, y + 7, { align: 'center' });

    // Table header
    y += 12;
    doc.setFillColor(235, 235, 235);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ITEM NAME', 20, y + 5);
    doc.text('QTY', 120, y + 5);
    doc.text('RATE', 145, y + 5);
    doc.text('AMOUNT', 175, y + 5);

    // Table rows
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    cartItems.forEach((item, index) => {
      const itemRate = parseInt(item.price.replace('₹', '').trim());
      const itemAmount = itemRate * item.qty;

      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, y - 3, 180, 8, 'F');
      }

      doc.text(item.name, 20, y + 2);
      doc.text(String(item.qty), 122, y + 2);
      doc.text(`Rs. ${itemRate}`, 145, y + 2);
      doc.text(`Rs. ${itemAmount}`, 175, y + 2);

      y += 8;
    });

    // BILL SUMMARY SECTION
    y += 5;
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(28, 167, 69);
    doc.setLineWidth(1.5);
    doc.rect(110, y, 85, 35, 'FD');

    // Summary header
    doc.setFillColor(28, 167, 69);
    doc.rect(110, y, 85, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL SUMMARY', 152, y + 5, { align: 'center' });

    // Summary details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    y += 12;
    doc.text('Subtotal:', 115, y);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 185, y, { align: 'right' });

    y += 5;
    doc.text('Service Charge (5%):', 115, y);
    doc.text(`Rs. ${serviceTax.toFixed(2)}`, 185, y, { align: 'right' });

    y += 5;
    doc.text('GST (18%):', 115, y);
    doc.text(`Rs. ${gstAmount.toFixed(2)}`, 185, y, { align: 'right' });

    // // Add coupon discount if applied
    // if (couponApplied) {
    //   y += 5;
    //   doc.setTextColor(255, 0, 0);
    //   doc.text('Coupon Discount:', 115, y);
    //   doc.text(
    //     `-Rs. ${(subtotal + serviceTax + gstAmount - 1).toFixed(2)}`,
    //     185,
    //     y,
    //     { align: 'right' }
    //   );
    //   doc.setTextColor(0, 0, 0);
    // }

    // Total section
    y += 8;
    doc.setFillColor(28, 167, 69);
    doc.rect(110, y - 3, 85, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', 115, y + 3);
    doc.text(`Rs. ${totalAmount.toFixed(2)}`, 185, y + 3, { align: 'right' });

    // FOOTER SECTION
    y += 20;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('GST Registration No: 09ABCDE1234F1Z5', 105, y, {
      align: 'center',
    });
    doc.text('FSSAI License No: 12345678901234', 105, y + 4, {
      align: 'center',
    });
    doc.text('PAN: ABCDE1234F', 105, y + 8, { align: 'center' });

    // Thank you message
    y += 18;
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(220, 220, 220);
    doc.rect(15, y - 5, 180, 20, 'FD');

    doc.setTextColor(28, 167, 69);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank You For Dining With Us!', 105, y + 3, { align: 'center' });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Visit us again for more delicious coding meals!', 105, y + 8, {
      align: 'center',
    });

    // Footer line
    doc.setDrawColor(28, 167, 69);
    doc.setLineWidth(2);
    doc.line(15, y + 15, 195, y + 15);

    // Generation timestamp
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, y + 20);

    // Save the PDF
    doc.save(`Receipt_DebuggersDaDhabba_${receiptNumber}.pdf`);
  };

  // Play success sound on mount
  useEffect(() => {
    const audio = new Audio(successSound);
    audio.play().catch(error => {
      console.log('Audio play failed:', error);
    });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px',
      }}
    >
      <motion.div
        className="order-success-container"
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70px',
              height: '70px',
              backgroundColor: '#28a745',
              borderRadius: '50%',
              marginBottom: '20px',
            }}
          >
            <FaCheckCircle size={35} color="white" />
          </div>

          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px',
              margin: '0',
            }}
          >
            Order Successful!
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#666',
              margin: '10px 0',
            }}
          >
            Thank you! Your payment has been received.
          </p>

          {paymentId && (
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#e8f5e8',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #28a745',
                margin: '10px 0',
              }}
            >
              <span
                style={{
                  fontWeight: '500',
                  color: '#28a745',
                  fontSize: '0.9rem',
                }}
              >
                Payment ID: {paymentId}
              </span>
            </div>
          )}

          <p
            style={{
              marginTop: '15px',
              fontSize: '1rem',
              color: '#333',
              fontWeight: '500',
            }}
          >
            Your order for <strong>Table {tableId}</strong> has been placed and
            is being prepared.
          </p>
        </div>

        <div
          style={{
            border: '2px solid #28a745',
            borderRadius: '12px',
            padding: '20px',
            margin: '30px 0',
            backgroundColor: '#f8f9fa',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
              color: '#333',
            }}
          >
            <FaClock
              style={{
                marginRight: '10px',
                color: '#28a745',
                fontSize: '1.2rem',
              }}
            />
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              Estimated Time Remaining
            </span>
          </div>

          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: timeLeft > 0 ? '#28a745' : '#dc3545',
              marginBottom: '15px',
            }}
          >
            {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#e9ecef',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '15px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: timeLeft > 0 ? '#28a745' : '#dc3545',
                borderRadius: '5px',
                transition: 'width 1s linear',
                backgroundImage:
                  timeLeft > 0
                    ? 'linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent)'
                    : 'none',
                backgroundSize: '20px 20px',
              }}
            ></div>
          </div>

          <div
            style={{
              fontSize: '1rem',
              color: '#666',
              fontStyle: 'italic',
            }}
          >
            {timeLeft > 0
              ? 'Your delicious meal is being prepared...'
              : 'Order should be ready! Please collect from the counter.'}
          </div>
        </div>

        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '25px',
            margin: '30px 0',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              borderBottom: '2px solid #28a745',
              paddingBottom: '15px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaReceipt
                style={{
                  marginRight: '10px',
                  color: '#28a745',
                  fontSize: '1.2rem',
                }}
              />
              <h3
                style={{
                  margin: 0,
                  color: '#333',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                }}
              >
                Payment Receipt
              </h3>
            </div>
            <button
              onClick={downloadReceipt}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '500',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)',
              }}
              onMouseOver={e => (e.target.style.backgroundColor = '#218838')}
              onMouseOut={e => (e.target.style.backgroundColor = '#28a745')}
            >
              <FaDownload style={{ marginRight: '6px' }} />
              Download Receipt
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <div>
              <p style={{ margin: '3px 0', fontSize: '0.9rem' }}>
                <strong>Receipt No:</strong> {receiptNumber}
              </p>
              <p style={{ margin: '3px 0', fontSize: '0.9rem' }}>
                <strong>Date:</strong> {currentDateTime}
              </p>
            </div>
            <div>
              <p style={{ margin: '3px 0', fontSize: '0.9rem' }}>
                <strong>Table:</strong> {tableId}
              </p>
              {paymentId && (
                <p style={{ margin: '3px 0', fontSize: '0.9rem' }}>
                  <strong>Payment ID:</strong> {paymentId}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #eee',
              paddingTop: '20px',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                margin: '0 0 15px 0',
                fontSize: '1.1rem',
                color: '#333',
              }}
            >
              Order Items
            </h4>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom:
                    index < cartItems.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      minWidth: '25px',
                      padding: '2px 6px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      marginRight: '8px',
                    }}
                  >
                    {item.qty}
                  </span>
                  {item.name}
                </span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#28a745',
                  }}
                >
                  ₹{parseInt(item.price.replace('₹', '')) * item.qty}{' '}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '6px 0',
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>Subtotal:</span>
              <span style={{ fontSize: '0.95rem' }}>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '6px 0',
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>Service Charge (5%):</span>
              <span style={{ fontSize: '0.95rem' }}>
                ₹{serviceTax.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '6px 0',
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>GST (18%):</span>
              <span style={{ fontSize: '0.95rem' }}>
                ₹{gstAmount.toFixed(2)}
              </span>
            </div>

            {/* {couponApplied && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '6px 0',
                  color: '#dc3545',
                }}
              >
                <span style={{ fontSize: '0.95rem' }}>Coupon Discount:</span>
                <span style={{ fontSize: '0.95rem' }}>
                  -₹{(subtotal + serviceTax + gstAmount - 1).toFixed(2)}
                </span>
              </div>
            )} */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '15px 0 5px 0',
                padding: '15px 0',
                borderTop: '2px solid #28a745',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              <span>Total Amount:</span>
              <span style={{ color: '#28a745' }}>
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#666',
              border: '1px solid #e9ecef',
            }}
          >
            GST Registration No: 09ABCDE1234F1Z5 | FSSAI License: 12345678901234
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onMouseOver={e => (e.target.style.backgroundColor = '#5a6268')}
            onMouseOut={e => (e.target.style.backgroundColor = '#6c757d')}
          >
            <FaHome style={{ marginRight: '8px' }} />
            Back to Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
