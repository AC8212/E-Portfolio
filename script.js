// script.js

// Custom Cursor
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
  requestAnimationFrame(animRing);
})();

// Hover effect on clickable elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '48px';
    ring.style.height = '48px';
    ring.style.borderColor = 'rgba(201,168,76,0.9)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '32px';
    ring.style.height = '32px';
    ring.style.borderColor = 'rgba(201,168,76,0.5)';
  });
});

// Scroll Reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// Smooth nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) {
      current = s.getAttribute('id');
    }
  });
  navLinks.forEach(l => {
    const href = l.getAttribute('href');
    if (href === '#' + current) {
      l.style.color = 'var(--gold)';
    } else {
      l.style.color = '';
    }
  });
});

// ========== EMAILJS INTEGRATION ==========
// Initialize EmailJS with your Public Key
// IMPORTANT: Replace 'YOUR_PUBLIC_KEY_HERE' with your actual EmailJS public key
(function initEmailJS() {
  emailjs.init({
    publicKey: 'uQ_VIladU3rbQHh5J', // <-- REPLACE THIS
  });
})();

// Email sending functionality
const sendBtn = document.getElementById('sendMessageBtn');
const statusDiv = document.getElementById('form-status');

// Function to show status message
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? '#e74c3c' : 'var(--gold)';
  statusDiv.style.fontSize = '0.8rem';
  statusDiv.style.marginTop = '1rem';
  statusDiv.style.opacity = '1';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusDiv.style.opacity = '0';
    setTimeout(() => {
      if (statusDiv.style.opacity === '0') {
        statusDiv.textContent = '';
      }
    }, 500);
  }, 5000);
}

// Function to validate form
function validateForm() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  
  if (!fname || !lname || !email || !subject || !message) {
    showStatus('⚠️ Please fill in all fields.', true);
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showStatus('⚠️ Please enter a valid email address.', true);
    return false;
  }
  
  return { fname, lname, email, subject, message };
}

// Send email function
async function sendEmail(e) {
  e?.preventDefault();
  
  const validation = validateForm();
  if (!validation) return;
  
  const { fname, lname, email, subject, message } = validation;
  
  // 🔁 REPLACE THESE THREE WITH YOUR REAL EmailJS KEYS
  const SERVICE_ID  = 'service_fllmw69';
  const TEMPLATE_ID = 'template_t2kucvg';
  
  const templateParams = {
    name: `${fname} ${lname}`.trim(),
    email: email,
    subject: subject,
    message: message,
    time: new Date().toLocaleString(),
  };
  
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  sendBtn.style.opacity = '0.7';
  
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    showStatus('✓ Message sent successfully!');
    // clear form
    document.getElementById('fname').value = '';
    document.getElementById('lname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
  } catch (error) {
    console.error(error);
    showStatus('❌ Failed to send. Please try again.', true);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Message';
    sendBtn.style.opacity = '1';
  }
}

// Attach event listener to send button
if (sendBtn) {
  sendBtn.addEventListener('click', sendEmail);
}

// Also allow pressing Enter in any field to send? (Optional: not added to avoid accidental sends)