# Anshik Digital Solutions 🚀

A modern, high-converting client acquisition website for a digital service business that helps local businesses get found online.

## What This Website Does

- Captures leads from local business owners via a contact form
- Converts visitors into clients through WhatsApp integration
- Showcases services: Google Business Setup, Website Development, Complete Business Setup
- Stores lead data in Firebase Firestore

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla — no frameworks)
- **Database:** Firebase Firestore
- **Fonts:** Google Fonts (Inter)
- **Hosting:** GitHub Pages

## Project Structure

```
/project-root
├── index.html                 ← Main single-page website
├── css/
│   └── styles.css             ← All custom styles
├── js/
│   └── app.js                 ← Navigation, form, FAQ, animations, WhatsApp
├── firebase/
│   └── firebase-config.js     ← Firebase setup + lead saving function
├── assets/
│   ├── images/
│   └── icons/
├── .gitignore
└── README.md
```

## Features

- Mobile-first responsive design
- Sticky navbar with mobile hamburger menu
- Smooth scroll + fade-in/stagger animations
- Animated stat counters
- Context-aware WhatsApp messages (different message per service)
- Lead capture form with validation + Firebase storage
- Loading spinner + success popup on form submit
- FAQ accordion
- Floating WhatsApp button with tooltip + pulse animation
- Scroll progress bar
- Page loader
- Back to top button
- "Most Popular" badge on best-value service
- Click tracking (console + Google Analytics ready)
- SEO meta tags + Open Graph tags
- Firestore security rules (write-only, validated)

## Setup & Configuration

### 1. WhatsApp Number

Open `js/app.js` and update line 18:

```js
const WHATSAPP_NUMBER = "918637287899";
```

Format: country code + number, no `+` or spaces.

### 2. WhatsApp Messages

In the same file, update the `WHATSAPP_MESSAGES` object to change pre-filled messages:

```js
const WHATSAPP_MESSAGES = {
  general:  "Hi! I'm interested in your digital services.",
  google:   "Hi, I want to set up my business on Google.",
  website:  "Hi, I want a website for my business.",
  complete: "Hi, I want complete digital setup for my business.",
  hero:     "Hi, I want to grow my business online.",
  cta:      "Hi, I want to start getting customers online today!"
};
```

### 3. Firebase

The Firebase config is already set up in `firebase/firebase-config.js`. If you need to change it:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Your apps → Web app
3. Copy the config values and replace them in `firebase/firebase-config.js`

### 4. Firestore Security Rules

Paste these rules in Firebase Console → Firestore → Rules tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{leadId} {
      allow read: if false;
      allow create: if
        request.resource.data.keys().hasAll(['name', 'phone', 'businessType', 'timestamp', 'status'])
        && request.resource.data.keys().size() == 5
        && request.resource.data.name is string
        && request.resource.data.name.size() >= 2
        && request.resource.data.name.size() <= 100
        && request.resource.data.phone is string
        && request.resource.data.phone.size() == 10
        && request.resource.data.phone.matches('^[6-9][0-9]{9}$')
        && request.resource.data.businessType is string
        && request.resource.data.businessType in [
          'Cleaning Service', 'Salon / Spa', 'Gym / Fitness',
          'Restaurant / Cafe', 'Retail Shop', 'Medical / Clinic',
          'Education / Coaching', 'Real Estate', 'Other'
        ]
        && request.resource.data.status == 'new'
        && request.resource.data.timestamp == request.time;
      allow update, delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Deploy on GitHub Pages

```bash
git init
git add .
git commit -m "Anshik Digital Solutions - website launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then:

1. Go to your GitHub repo → **Settings** → **Pages**
2. Source: select `main` branch, folder `/ (root)`
3. Click **Save**
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Updating Stats

As your business grows, update the trust bar numbers in `index.html`:

```html
<div class="trust-number" data-count="2">0</div>  <!-- Change 2 to your real client count -->
```

## Viewing Leads

All form submissions are stored in Firebase Firestore under the `leads` collection. To view them:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Firestore Database → `leads` collection

Each lead contains: name, phone, businessType, timestamp, and status.

## License

© 2026 Anshik Digital Solutions. All rights reserved.
