# ✈️ Haris Travel Agency - Complete Website & Admin Panel

A modern, responsive, and dynamic website for **Haris Travel Agency** with a dedicated **Admin Panel** where the admin can manage all services, customer inquiries, and the 3 official social media links (**Facebook**, **Instagram**, and **WhatsApp**).

---

## 🌟 Key Features

### 1. Customer-Facing Website (`/`)
- **Luxury Travel Aesthetics**: Royal Navy (`#0B2545`), Emerald Teal (`#14A3A0`), and Gold (`#C9A24B`).
- **Live Airline Marquee Ticker**: Continuous flight strip (Emirates, PIA, Turkish Airlines, Qatar Airways, Saudia, Etihad, flydubai, Airblue, AirSial, Fly Jinnah, etc.).
- **Dynamic Services Showcase**: Services are dynamically pulled from the database/Admin Panel.
  - Interactive **"View Details & Itinerary"** modal dialog with inclusions and tour plans.
  - Direct **"Inquire on WhatsApp"** button pre-filled with the selected service name.
- **Popular Destinations Grid**: Dubai, Malaysia, Turkey, UK, Canada, USA, and Umrah (Makkah & Madinah) with day-by-day itineraries.
- **Dedicated Social Media Section**:
  - **Facebook**: Direct page link & follow button.
  - **Instagram**: Direct profile link & view button.
  - **WhatsApp**: Direct chat link with formatted pre-filled messaging.
  - *(Strictly limited to these 3 official channels as requested).*
- **Quote Request Form**: Customers can request customized trip quotes. Submissions are saved to the admin inbox **and** automatically launch WhatsApp with all travel details!
- **Floating WhatsApp Pulse Button**: Quick 1-click WhatsApp chat from any page section.
- **Google Reviews & FAQ Accordion**: Clean layout building trust and credibility.

---

### 2. Powerful Admin Dashboard (`/admin`)
- **Protected Login**: Secure sign-in with secret credentials:
  - **Username**: `admin`
  - **Password**: `569646` *(can be changed directly inside the dashboard)*
  - **Hidden Access**: The admin link is completely hidden from public visitors. Direct link: `http://localhost:3000/admin` or discrete double-click on `©` in footer.
- **📱 Social Media Management Tab**:
  - Handle your **Facebook**, **Instagram**, and **WhatsApp** links directly.
  - One-click **"Test Link"** button to preview each account before saving.
  - Updates immediately across the website header, social section, and footer.
- **🧳 Services Management Tab ("Apni Services Offer Karein")**:
  - **Add New Service**: Title, Category (Flights, Umrah, Tours, Visa, Hotels, etc.), Emoji/Icon, Pricing Badge, Short description, and checklist of inclusions/points.
  - **Edit Service**: Update any existing service's details, pricing, or itinerary.
  - **Delete Service**: Remove discontinued packages.
  - **Active / Hidden Switch**: Temporarily toggle visibility on the live website.
- **🏢 Agency Information Tab**:
  - Update agency phone numbers, WhatsApp, email, office address, proprietor name, and owner bio.
- **📩 Customer Inquiries Inbox**:
  - View all quote requests submitted through the website with customer name, phone, destination, date, and message.
  - One-click **"💬 Chat on WhatsApp"** button to instantly reply to the traveler.
- **🔒 Security Tab**:
  - Easily change your Admin Password at any time.

---

## ⚡ Supabase Cloud Database Setup (Easy 3-Step Guide)

Aapka poora database **Supabase** par connect karne ke liye ready hai:

### Step 1: Supabase Project Create Karein
1. [supabase.com](https://supabase.com) par free account banayein ya login karein.
2. **"New Project"** par click karein aur project ka naam (jaise `haris-travel-agency`) aur password rakhein.

### Step 2: Database Tables & Data Banayein (1-Click SQL)
1. Supabase Dashboard me left menu se **"SQL Editor"** par click karein.
2. Is project ke folder me mojood **`supabase_schema.sql`** file ko open karein, poora code copy karein aur SQL Editor me paste karein.
3. **"Run"** button dabayein!
   - Ye 1 second me saari tables (`site_settings`, `services`, `destinations`, `inquiries`, `admin_config`), permissions (RLS policies), aur initial travel services seed data tayyar kar dega.

### Step 3: API Keys Paste Karein
1. Supabase Dashboard me left bottom par **Project Settings** (gear icon) -> **API** par jayein.
2. Wahan se:
   - **Project URL** copy karein
   - **anon public** key copy karein
3. Apni project file **`public/js/supabase-config.js`** ko open karein aur paste kar dein:
```javascript
window.SUPABASE_CONFIG = {
  url: 'https://xyzabcdefghijklm.supabase.co',   // Aapka Project URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...' // Aapki anon public key
};
```
4. **Done!** Ab website aur admin panel direct Supabase Cloud se chalengy!
   - Admin panel me add/edit ki gayi services foran Supabase me save hongi.
   - Social media links (Instagram, Facebook, WhatsApp) Supabase me update hongy.
   - Website par aane walay customer quote requests direct Supabase ke `inquiries` table me store hongy!

---

## 🚀 How to Run the Website

### Option 1: Start the Local Node.js Server (Recommended)
Open your terminal in this folder and run:
```bash
node server.js
```
*(Or `npm start`)*

Then open in your browser:
- **Main Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

> **Note**: Zero external `npm install` packages are required! The server uses Node's native HTTP engine for maximum speed and instant startup on any computer.

---

### Option 2: Portable / Offline Direct Browser Use
If you don't have Node running or just want to open the site directly:
- Double-click **`index.html`** or **`public/index.html`** in your browser.
- Double-click **`admin.html`** or **`public/admin.html`** to access the Admin Panel.
- The site automatically falls back to browser `localStorage`, allowing full preview and editing even without a backend!

---

## 📁 Project Structure

```
Azain Website/
├── data/
│   ├── site-data.json       # Main database (social links, services, destinations, agency info)
│   └── inquiries.json       # Customer quote inquiries submitted on the website
├── public/
│   ├── css/
│   │   ├── style.css        # Main website styles (responsive, luxury travel theme)
│   │   └── admin.css        # Admin panel dashboard styles
│   ├── js/
│   │   ├── main.js          # Main website dynamic rendering & WhatsApp integration
│   │   └── admin.js         # Admin panel logic (Auth, Social links, Services CRUD, Inquiries)
│   ├── index.html           # Customer-facing website
│   └── admin.html           # Admin control panel
├── server.js                # Zero-dependency native Node.js HTTP & REST API server
├── package.json             # NPM configuration and scripts
├── index.html               # Root redirect entry
├── admin.html               # Root admin redirect entry
└── README.md                # Documentation & instructions
```

---

## 🔑 Admin Login Credentials
- **URL**: `http://localhost:3000/admin` *(or open `admin.html`)*
- **Username**: `admin`
- **Password**: `569646`
- **Hidden Access**: The admin link is completely hidden from the public website navbar and footer. Only you know the URL (`/admin` or `admin.html`), or you can simply **double-click the `©` copyright symbol** at the bottom of the website to open the Admin Panel!
