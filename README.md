# Anshik Digital Solutions 🚀

A modern, tech-themed client acquisition website with admin panel, lead management, email notifications, and client feedback system.

## What This Website Does

- Captures leads via contact form → saves to Firebase → sends email notification
- Converts visitors into clients through context-aware WhatsApp integration
- Showcases services with dynamic pricing managed from admin panel
- Client feedback system with admin approval workflow
- Full admin panel to manage all website content without touching code

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla — no frameworks)
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (email/password)
- **Email:** EmailJS (lead notifications + security alerts)
- **Fonts:** Google Fonts (Inter)
- **Hosting:** GitHub Pages
- **Admin:** PWA-enabled admin panel (installable on phone)

## Project Structure

```
/project-root
├── index.html                 ← Main single-page website
├── feedback.html              ← Client feedback/review form
├── css/
│   └── styles.css             ← All custom styles (dark tech theme)
├── js/
│   └── app.js                 ← Navigation, form, animations, WhatsApp, dynamic content
├── firebase/
│   ├── firebase-config.js     ← Firebase setup + lead saving function
│   └── firestore.rules        ← Firestore security rules (reference copy)
├── admin/
│   ├── admin.html             ← Admin panel (PWA)
│   ├── admin.css              ← Admin panel styles
│   ├── admin.js               ← Admin panel logic
│   ├── manifest.json          ← PWA manifest
│   ├── sw.js                  ← Service worker
│   └── icon-192.svg           ← PWA icon
├── assets/
│   ├── images/
│   └── icons/
├── .gitignore
└── README.md
```

## Features

### Website
- Dark tech-themed UI with neon cyan + indigo gradient accents
- Mobile-first responsive design
- Sticky dark navbar with glassmorphism blur
- Smooth scroll + fade-in/stagger animations
- Animated stat counters (auto-updated from admin)
- Auto-scrolling testimonials marquee
- Context-aware WhatsApp messages (different message per service)
- Lead capture form with validation + Firebase storage
- Loading spinner + success popup on form submit
- FAQ accordion
- Floating WhatsApp button with tooltip + pulse animation
- Scroll progress bar with glow effect
- Page loader
- Back to top button
- "Most Popular" badge on services
- "Coming Soon" section for upcoming services
- SEO meta tags + Open Graph tags
- Dynamic content loaded from Firestore (managed via admin panel)

### Admin Panel
- Firebase Authentication (email/password — no passwords in code)
- PWA — installable on phone as an app
- 9 management tabs:
  - 📊 Stats — trust bar numbers
  - 🏠 Hero — headline and description
  - 🛠️ Services — add/edit/remove services with pricing
  - 🔜 Coming Soon — manage upcoming services
  - ⭐ Why Me — edit features/benefits
  - 💬 Testimonials — manage client reviews
  - ❓ FAQ — add/edit/remove questions
  - 📋 Leads — view all form submissions
  - ⭐ Reviews — approve/reject client feedback
- Hidden admin link in footer (click company name)
- All changes reflect on website instantly

### Notifications
- Email notification on every new lead (via EmailJS)
- Security alert email on failed admin login attempts (with IP address)
- "Reply on WhatsApp" button in lead notification emails

### Client Feedback System
- Separate feedback page (`feedback.html`) to share with clients
- Interactive star rating with hover effects
- Reviews saved as "pending" → admin approves → appears on website
- Average rating auto-calculated from approved reviews
- Client count auto-updated in trust bar

## Setup & Configuration

### 1. WhatsApp Number
Open `js/app.js` and update:
```js
const WHATSAPP_NUMBER = "918637287899";
```

### 2. Firebase
Config is in `firebase/firebase-config.js`. To change:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Your apps → Web app
3. Replace config values in `firebase-config.js`

### 3. Firebase Authentication
1. Firebase Console → Authentication → Sign-in method
2. Enable Email/Password
3. Users tab → Add user (your admin email + password)

### 4. Firestore Security Rules
Copy rules from `firebase/firestore.rules` and paste in:
Firebase Console → Firestore → Rules tab → Publish

### 5. EmailJS (Lead Notifications)
Config in `js/app.js`:
```js
const EMAILJS_SERVICE_ID = "service_nfkd5do";
const EMAILJS_TEMPLATE_ID = "template_bczee25";
const EMAILJS_PUBLIC_KEY = "ilS2Lf40YU07jVTds";
```
To change: update values from [EmailJS Dashboard](https://dashboard.emailjs.com/)

## Deploy on GitHub Pages

```bash
git init
git add .
git commit -m "Anshik Digital Solutions - website launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then: GitHub repo → Settings → Pages → Source: `main` branch → Save

## Admin Panel Access

- URL: `https://your-site.github.io/repo-name/admin/admin.html`
- Or click "Anshik Digital Solutions" text in the website footer
- Login with Firebase Auth credentials
- Install as app on phone: Chrome menu → "Install app" / Safari → "Add to Home Screen"

## Client Feedback Link

Share with clients after completing their project:
`https://your-site.github.io/repo-name/feedback.html`

## License

© 2026 Anshik Digital Solutions. All rights reserved.
