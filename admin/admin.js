/* ============================================
   Admin Panel - JavaScript
   ============================================
   
   AUTHENTICATION:
   Uses Firebase Authentication (email/password).
   No passwords stored in code.
   
   FIRST-TIME SETUP:
   1. Go to Firebase Console → Authentication → Sign-in method
   2. Enable "Email/Password" provider
   3. Go to Users tab → Add user
   4. Enter your email and a strong password
   5. That's your admin login — done!
   
   FORGOT PASSWORD:
   Click "Forgot password?" on the login screen.
   A reset link will be sent to your email.
   
   ============================================ */

const auth = firebase.auth();

// EmailJS config (same as main site)
const EMAILJS_SERVICE_ID = "service_nfkd5do";
const EMAILJS_PUBLIC_KEY = "ilS2Lf40YU07jVTds";
// You'll need to create a second template for security alerts
// Template variables: {{email}}, {{time}}, {{ip}}, {{userAgent}}
const EMAILJS_ALERT_TEMPLATE_ID = "template_security";

let failedAttempts = 0;

// ---------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initTabs();
});

/* ========== Firebase Auth ========== */
function initAuth() {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("loginError");
  const forgotBtn = document.getElementById("forgotBtn");

  // Listen for auth state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      showDashboard();
    }
  });

  // Login form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // onAuthStateChanged will handle showing dashboard
    } catch (err) {
      failedAttempts++;

      switch (err.code) {
        case "auth/user-not-found":
          errorEl.textContent = "No admin account found with this email.";
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorEl.textContent = "Wrong password. Try again.";
          break;
        case "auth/invalid-email":
          errorEl.textContent = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          errorEl.textContent = "Too many attempts. Try again later.";
          break;
        default:
          errorEl.textContent = "Login failed. Please try again.";
      }

      // Send security alert on every failed attempt
      sendSecurityAlert(email, err.code);
    }
  });

  // Forgot password
  forgotBtn.addEventListener("click", async () => {
    const email = document.getElementById("adminEmail").value.trim();
    if (!email) {
      errorEl.textContent = "Enter your email first, then click Forgot password.";
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      errorEl.style.color = "#25D366";
      errorEl.textContent = "Password reset link sent to your email!";
    } catch (err) {
      errorEl.style.color = "";
      errorEl.textContent = "Could not send reset email. Check the email address.";
    }
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await auth.signOut();
    location.reload();
  });
}

function showDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("adminDashboard").style.display = "block";
  loadAllData();
}

/* ========== Tabs ========== */
function initTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
  });
}

/* ========== Show Save Status ========== */
function showSaved() {
  const el = document.getElementById("saveStatus");
  el.textContent = "✓ Saved!";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

/* ========== Load All Data from Firestore ========== */
async function loadAllData() {
  try {
    await loadStats();
    await loadHero();
    await loadServices();
    await loadUpcoming();
    await loadWhyMe();
    await loadTestimonials();
    await loadFAQData();
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

/* ========================================
   STATS
   ======================================== */
async function loadStats() {
  const doc = await db.collection("siteContent").doc("stats").get();
  if (doc.exists) {
    const d = doc.data();
    document.getElementById("stat-clients").value = d.clients || 2;
    document.getElementById("stat-delivery").value = d.delivery || 48;
    document.getElementById("stat-support").value = d.support || 1;
    document.getElementById("stat-price").value = d.price || 2999;
  } else {
    document.getElementById("stat-clients").value = 2;
    document.getElementById("stat-delivery").value = 48;
    document.getElementById("stat-support").value = 1;
    document.getElementById("stat-price").value = 2999;
  }
}

async function saveStats() {
  const data = {
    clients: parseInt(document.getElementById("stat-clients").value) || 0,
    delivery: parseInt(document.getElementById("stat-delivery").value) || 0,
    support: parseInt(document.getElementById("stat-support").value) || 0,
    price: parseInt(document.getElementById("stat-price").value) || 0
  };
  await db.collection("siteContent").doc("stats").set(data);
  showSaved();
}

/* ========================================
   SERVICES
   ======================================== */
let servicesData = [];

async function loadServices() {
  const doc = await db.collection("siteContent").doc("services").get();
  if (doc.exists) {
    servicesData = doc.data().list || [];
  } else {
    servicesData = [
      { icon: "📍", title: "Google Business Setup", desc: "Get your business listed on Google Maps & Search. I create and optimize your Google Business Profile so customers can find you easily.", price: "2,999", context: "google" },
      { icon: "🌐", title: "Website Development", desc: "A professional, mobile-friendly website that showcases your business, builds trust, and converts visitors into customers.", price: "4,999", context: "website" },
      { icon: "🚀", title: "Complete Business Setup", desc: "Google Business + Website + Basic SEO — the full package to establish your online presence and start getting customers.", price: "6,999", context: "complete", popular: true }
    ];
  }
  renderServices();
}

function renderServices() {
  const container = document.getElementById("servicesContainer");
  container.innerHTML = servicesData.map((s, i) => `
    <div class="editor-card">
      <div class="editor-card-header">
        <h3>${s.icon} Service ${i + 1} ${s.popular ? '(Most Popular)' : ''}</h3>
        <button class="btn-remove" onclick="removeService(${i})">Remove</button>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Icon (emoji)</label>
          <input type="text" value="${s.icon}" onchange="servicesData[${i}].icon=this.value">
        </div>
        <div class="form-field">
          <label>Price (₹)</label>
          <input type="text" value="${s.price}" onchange="servicesData[${i}].price=this.value">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Title</label>
          <input type="text" value="${s.title}" onchange="servicesData[${i}].title=this.value">
        </div>
        <div class="form-field">
          <label>Most Popular?</label>
          <select onchange="servicesData[${i}].popular=(this.value==='true')">
            <option value="false" ${!s.popular ? 'selected' : ''}>No</option>
            <option value="true" ${s.popular ? 'selected' : ''}>Yes</option>
          </select>
        </div>
      </div>
      <div class="form-field">
        <label>Description</label>
        <textarea onchange="servicesData[${i}].desc=this.value">${s.desc}</textarea>
      </div>
    </div>
  `).join("");
}

async function saveServices() {
  await db.collection("siteContent").doc("services").set({ list: servicesData });
  showSaved();
}

/* ========================================
   TESTIMONIALS
   ======================================== */
let testimonialsData = [];

async function loadTestimonials() {
  const doc = await db.collection("siteContent").doc("testimonials").get();
  if (doc.exists) {
    testimonialsData = doc.data().list || [];
  } else {
    testimonialsData = [
      { name: "Shankar Nath", initials: "SN", business: "Cleaning Service, Hyderabad", text: "Anshik Digital helped my cleaning business go live on Google within 2 days. Now I get 5-6 calls every week from new customers!", stars: 5 },
      { name: "Ashish Nath", initials: "AN", business: "Cleaning Service, Hyderabad", text: "Very affordable and professional. He set up everything for my business on Google and now customers find us easily online!", stars: 5 }
    ];
  }
  renderTestimonials();
}

function renderTestimonials() {
  const container = document.getElementById("testimonialsContainer");
  container.innerHTML = testimonialsData.map((t, i) => `
    <div class="editor-card">
      <div class="editor-card-header">
        <h3>💬 Testimonial ${i + 1}</h3>
        <button class="btn-remove" onclick="removeTestimonial(${i})">Remove</button>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Client Name</label>
          <input type="text" value="${t.name}" onchange="testimonialsData[${i}].name=this.value; testimonialsData[${i}].initials=this.value.split(' ').map(w=>w[0]).join('').toUpperCase();">
        </div>
        <div class="form-field">
          <label>Business & Location</label>
          <input type="text" value="${t.business}" onchange="testimonialsData[${i}].business=this.value">
        </div>
      </div>
      <div class="form-field" style="margin-bottom:1rem;">
        <label>Stars (1-5)</label>
        <input type="number" value="${t.stars}" min="1" max="5" onchange="testimonialsData[${i}].stars=parseInt(this.value)">
      </div>
      <div class="form-field">
        <label>Review Text</label>
        <textarea onchange="testimonialsData[${i}].text=this.value">${t.text}</textarea>
      </div>
    </div>
  `).join("");
}

function addTestimonial() {
  testimonialsData.push({ name: "", initials: "", business: "", text: "", stars: 5 });
  renderTestimonials();
  const container = document.getElementById("testimonialsContainer");
  container.lastElementChild.scrollIntoView({ behavior: "smooth" });
}

function removeTestimonial(index) {
  if (confirm("Remove this testimonial?")) {
    testimonialsData.splice(index, 1);
    renderTestimonials();
  }
}

async function saveTestimonials() {
  testimonialsData.forEach(t => {
    if (t.name && !t.initials) {
      t.initials = t.name.split(" ").map(w => w[0]).join("").toUpperCase();
    }
  });
  await db.collection("siteContent").doc("testimonials").set({ list: testimonialsData });
  showSaved();
}

/* ========================================
   FAQ
   ======================================== */
let faqData = [];

async function loadFAQData() {
  const doc = await db.collection("siteContent").doc("faq").get();
  if (doc.exists) {
    faqData = doc.data().list || [];
  } else {
    faqData = [
      { q: "How long does it take to set up my Google Business Profile?", a: "I typically set up and optimize your Google Business Profile within 24-48 hours. Google verification takes an additional 5-6 days, after which your business goes live to customers." },
      { q: "What is included in the website development package?", a: "You get a fully responsive, mobile-friendly website with up to 5 pages, contact form, WhatsApp integration, basic SEO setup, and 1 month of free support. Hosting guidance is also included." },
      { q: "Do I need any technical knowledge?", a: "Not at all! I handle everything from start to finish. Just share your business details and I take care of the rest. I'll also teach you how to manage your profiles." },
      { q: "What are the pricing options?", a: "Google Business Setup starts at ₹2,999, Website Development at ₹4,999, and the Complete Package at ₹6,999. All prices are one-time with no hidden charges." },
      { q: "Do you provide support after setup?", a: "Yes! I provide 1 month of free support after delivery. You can reach me anytime on WhatsApp for questions or minor updates." },
      { q: "Can I see examples of your previous work?", a: "Absolutely! Reach out on WhatsApp and I'll share my portfolio with examples of Google profiles and websites I've built for local businesses." }
    ];
  }
  renderFAQ();
}

function renderFAQ() {
  const container = document.getElementById("faqContainer");
  container.innerHTML = faqData.map((f, i) => `
    <div class="editor-card">
      <div class="editor-card-header">
        <h3>❓ Question ${i + 1}</h3>
        <button class="btn-remove" onclick="removeFAQ(${i})">Remove</button>
      </div>
      <div class="form-field" style="margin-bottom:1rem;">
        <label>Question</label>
        <input type="text" value="${f.q}" onchange="faqData[${i}].q=this.value">
      </div>
      <div class="form-field">
        <label>Answer</label>
        <textarea onchange="faqData[${i}].a=this.value">${f.a}</textarea>
      </div>
    </div>
  `).join("");
}

function addFAQ() {
  faqData.push({ q: "", a: "" });
  renderFAQ();
  const container = document.getElementById("faqContainer");
  container.lastElementChild.scrollIntoView({ behavior: "smooth" });
}

function removeFAQ(index) {
  if (confirm("Remove this FAQ?")) {
    faqData.splice(index, 1);
    renderFAQ();
  }
}

async function saveFAQ() {
  await db.collection("siteContent").doc("faq").set({ list: faqData });
  showSaved();
}

/* ========================================
   LEADS (Read-only view)
   ======================================== */
async function loadLeads() {
  const tbody = document.getElementById("leadsBody");
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Loading...</td></tr>';

  try {
    const snapshot = await db.collection("leads").orderBy("timestamp", "desc").get();

    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">No leads yet</td></tr>';
      return;
    }

    tbody.innerHTML = snapshot.docs.map(doc => {
      const d = doc.data();
      const date = d.timestamp ? d.timestamp.toDate().toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      }) : "—";

      return `
        <tr>
          <td>${d.name || "—"}</td>
          <td><a href="tel:${d.phone}" style="color: var(--primary); text-decoration:none;">${d.phone || "—"}</a></td>
          <td>${d.businessType || "—"}</td>
          <td>${date}</td>
          <td><span class="status-badge">${d.status || "new"}</span></td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Error loading leads:", err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--danger);">Error loading leads. Check Firestore rules.</td></tr>';
  }
}

/* ========================================
   HERO SECTION
   ======================================== */
async function loadHero() {
  const doc = await db.collection("siteContent").doc("hero").get();
  if (doc.exists) {
    const d = doc.data();
    document.getElementById("hero-headline").value = d.headline || "";
    document.getElementById("hero-description").value = d.description || "";
  } else {
    document.getElementById("hero-headline").value = "Get Your Business on Google & Start Getting Customers";
    document.getElementById("hero-description").value = "I help local businesses grow with Google Business Profile setup, professional websites & basic SEO — so customers can find you online.";
  }
}

async function saveHero() {
  await db.collection("siteContent").doc("hero").set({
    headline: document.getElementById("hero-headline").value,
    description: document.getElementById("hero-description").value
  });
  showSaved();
}

/* ========================================
   ADD / REMOVE SERVICES
   ======================================== */
function addService() {
  servicesData.push({ icon: "🆕", title: "", desc: "", price: "0", context: "general", popular: false });
  renderServices();
  const container = document.getElementById("servicesContainer");
  container.lastElementChild.scrollIntoView({ behavior: "smooth" });
}

function removeService(index) {
  if (confirm("Remove this service?")) {
    servicesData.splice(index, 1);
    renderServices();
  }
}

/* ========================================
   COMING SOON / UPCOMING SERVICES
   ======================================== */
let upcomingData = [];

async function loadUpcoming() {
  const doc = await db.collection("siteContent").doc("upcoming").get();
  if (doc.exists) {
    upcomingData = doc.data().list || [];
  } else {
    upcomingData = [
      { icon: "⚙️", title: "Full Stack Website + Admin Panel", desc: "A complete website with a custom admin panel to manage your content, orders, and customers — all by yourself." },
      { icon: "📱", title: "Mobile App for Business", desc: "A dedicated mobile app for your business to engage customers, send notifications, and boost loyalty." }
    ];
  }
  renderUpcoming();
}

function renderUpcoming() {
  const container = document.getElementById("upcomingContainer");
  container.innerHTML = upcomingData.map((u, i) => `
    <div class="editor-card">
      <div class="editor-card-header">
        <h3>🔜 Upcoming ${i + 1}</h3>
        <button class="btn-remove" onclick="removeUpcoming(${i})">Remove</button>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Icon (emoji)</label>
          <input type="text" value="${u.icon}" onchange="upcomingData[${i}].icon=this.value">
        </div>
        <div class="form-field">
          <label>Title</label>
          <input type="text" value="${u.title}" onchange="upcomingData[${i}].title=this.value">
        </div>
      </div>
      <div class="form-field">
        <label>Description</label>
        <textarea onchange="upcomingData[${i}].desc=this.value">${u.desc}</textarea>
      </div>
    </div>
  `).join("");
}

function addUpcoming() {
  upcomingData.push({ icon: "🆕", title: "", desc: "" });
  renderUpcoming();
  const container = document.getElementById("upcomingContainer");
  container.lastElementChild.scrollIntoView({ behavior: "smooth" });
}

function removeUpcoming(index) {
  if (confirm("Remove this upcoming service?")) {
    upcomingData.splice(index, 1);
    renderUpcoming();
  }
}

async function saveUpcoming() {
  await db.collection("siteContent").doc("upcoming").set({ list: upcomingData });
  showSaved();
}

/* ========================================
   WHY CHOOSE ME
   ======================================== */
let whyMeData = [];

async function loadWhyMe() {
  const doc = await db.collection("siteContent").doc("whyMe").get();
  if (doc.exists) {
    whyMeData = doc.data().list || [];
  } else {
    whyMeData = [
      { icon: "💰", title: "Affordable Pricing", desc: "No hidden fees. Transparent pricing that fits small business budgets." },
      { icon: "⚡", title: "Fast Delivery", desc: "Google profile setup in 24-48 hours, live to customers in 5-6 days after verification. Websites delivered in 3-4 days." },
      { icon: "🎯", title: "Local Business Focus", desc: "Specialized in helping local businesses get found by nearby customers." },
      { icon: "🤝", title: "Simple Process", desc: "No technical knowledge needed. Everything is handled from start to finish." }
    ];
  }
  renderWhyMe();
}

function renderWhyMe() {
  const container = document.getElementById("whyMeContainer");
  container.innerHTML = whyMeData.map((w, i) => `
    <div class="editor-card">
      <div class="editor-card-header">
        <h3>${w.icon} Feature ${i + 1}</h3>
        <button class="btn-remove" onclick="removeWhyMe(${i})">Remove</button>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Icon (emoji)</label>
          <input type="text" value="${w.icon}" onchange="whyMeData[${i}].icon=this.value">
        </div>
        <div class="form-field">
          <label>Title</label>
          <input type="text" value="${w.title}" onchange="whyMeData[${i}].title=this.value">
        </div>
      </div>
      <div class="form-field">
        <label>Description</label>
        <textarea onchange="whyMeData[${i}].desc=this.value">${w.desc}</textarea>
      </div>
    </div>
  `).join("");
}

function addWhyMe() {
  whyMeData.push({ icon: "✨", title: "", desc: "" });
  renderWhyMe();
  const container = document.getElementById("whyMeContainer");
  container.lastElementChild.scrollIntoView({ behavior: "smooth" });
}

function removeWhyMe(index) {
  if (confirm("Remove this feature?")) {
    whyMeData.splice(index, 1);
    renderWhyMe();
  }
}

async function saveWhyMe() {
  await db.collection("siteContent").doc("whyMe").set({ list: whyMeData });
  showSaved();
}

/* ========================================
   SECURITY: Failed Login Alerts
   ======================================== */
async function sendSecurityAlert(attemptedEmail, errorCode) {
  if (typeof emailjs === "undefined") return;

  // Get IP address (free API)
  let ip = "Unknown";
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    ip = data.ip;
  } catch (e) {
    ip = "Could not detect";
  }

  // Send alert using the lead notification template (reusing it)
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ALERT_TEMPLATE_ID, {
    name: "⚠️ SECURITY ALERT",
    phone: ip,
    businessType: "Failed Login Attempt #" + failedAttempts,
    time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
    email: attemptedEmail,
    ip: ip,
    userAgent: navigator.userAgent,
    errorCode: errorCode
  }, EMAILJS_PUBLIC_KEY)
  .then(() => console.log("Security alert sent"))
  .catch((err) => console.log("Security alert failed:", err));
}
