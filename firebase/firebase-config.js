/* ============================================
   Firebase Configuration
   ============================================
   
   HOW TO SET UP FIREBASE:
   
   1. Go to https://console.firebase.google.com/
   2. Click "Add Project" and create a new project
   3. Once created, click the web icon (</>) to add a web app
   4. Copy the firebaseConfig object and replace the placeholder below
   5. Go to Firestore Database in the sidebar → Click "Create Database"
   6. Choose "Start in test mode" (for development)
   7. Select a location and click "Enable"
   
   Your leads will be stored in a "leads" collection in Firestore.
   
   ============================================ */

// Import Firebase modules from CDN (loaded in index.html)
// These are available as global variables from the CDN scripts

// ⚠️ REPLACE these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBYZUxgpiP3vdgdFAwGF9e3MevLWLyNI9E",
  authDomain: "anshik-digital-leads.firebaseapp.com",
  projectId: "anshik-digital-leads",
  storageBucket: "anshik-digital-leads.firebasestorage.app",
  messagingSenderId: "2754021965",
  appId: "1:2754021965:web:42a97165b228560525aa04"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore database
const db = firebase.firestore();

/**
 * Save a lead to Firestore
 * @param {Object} leadData - The lead information
 * @param {string} leadData.name - Customer name
 * @param {string} leadData.phone - Customer phone number
 * @param {string} leadData.businessType - Type of business
 * @returns {Promise} - Resolves when data is saved
 */
async function saveLead(leadData) {
  try {
    const docRef = await db.collection("leads").add({
      name: leadData.name,
      phone: leadData.phone,
      businessType: leadData.businessType,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      status: "new"
    });
    console.log("Lead saved with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving lead:", error);
    return { success: false, error: error.message };
  }
}
