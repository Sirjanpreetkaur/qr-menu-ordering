# 🍽️ QR Menu Ordering with Razorpay  

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/) 
[![Vite](https://img.shields.io/badge/Vite-Build-orange?logo=vite)](https://vitejs.dev/) 
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-brightgreen?logo=razorpay)](https://razorpay.com/) 
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa)](https://web.dev/progressive-web-apps/) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A sleek **QR-based digital menu & ordering system** built with **React + Vite + React Router**.  
Scan a QR on your table, browse menu categories, add items to your cart, pay with **Razorpay (test mode)**, and download a PDF receipt.  
Now also works as a **Progressive Web App (PWA)** — installable on desktop & mobile! 🚀  

---

## 🚀 Features
- 📱 **QR Table Routing** → `/menu/:tableId/:category` for per-table context.
- 🥘 **Menu Categories** → small/medium/large plates, breads, drinks & desserts.
- ➕ **Item Modal + Cart Drawer** → add items, manage qty, view taxes.
- 💳 **Razorpay Checkout** (test key via `.env`) → supports UPI & card.
- 🧾 **Order Success + PDF Receipt** → auto-generated bill with GST & service charge.
- 🧑‍🍳 **QR Generator** → prints ready-to-use QR codes for 12 tables.
- 📲 **PWA Support** → installable app with offline fallback & icons.

---

## 🛠️ Tech Stack
- ⚛️ React 18 + Vite + React Router v6  
- 🎨 Framer Motion + React Icons  
- 🧾 jsPDF (via CDN) for receipts  
- 💳 Razorpay Checkout (test mode)  
- 📲 VitePWA for Progressive Web App support  
- 🧢 react-helmet-async for SEO/meta  

---

## 📦 Installation
```bash
# 1. Clone the repo
git clone https://github.com/your-username/qr-menu-razorpay.git
cd qr-menu-razorpay

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root
echo "VITE_APP_TEST_RAZORPAY_KEY_ID=rzp_test_xxxxxx" > .env

# 4. Start development server (runs at http://localhost:3000)
npm run dev
