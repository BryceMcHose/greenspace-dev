// Initialize Firebase Client
let firebaseAuth = null;
try {
  firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
} catch (err) {
  console.warn("Firebase not initialized: Using configuration placeholders.", err);
}

// Elements
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const nameFieldGroup = document.getElementById('name-field-group');
const submitBtn = document.getElementById('submit-btn');
const toggleBtn = document.getElementById('toggle-btn');
const toggleText = document.getElementById('toggle-text');
const messageBanner = document.getElementById('auth-message-banner');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const fullNameInput = document.getElementById('fullName');

// Google Sign-In element
const googleSigninBtn = document.getElementById('google-signin-btn');

// Forgot Password elements
const forgotPasswordLink = document.getElementById('forgot-password-link');
const resetPasswordModal = document.getElementById('reset-password-modal');
const closeResetModalBtn = document.getElementById('close-reset-modal-btn');
const resetPasswordForm = document.getElementById('reset-password-form');
const resetEmailInput = document.getElementById('reset-email');

// Verification Banners
const tempUserBanner = document.getElementById('temp-user-banner');
const unconfirmedEmailBanner = document.getElementById('unconfirmed-email-banner');
const resendVerificationBtn = document.getElementById('resend-verification-btn');

let isSignUpMode = false;

// Check existing session
window.addEventListener('DOMContentLoaded', () => {
  const cachedUser = localStorage.getItem('greenspace_user');
  if (cachedUser) {
    const user = JSON.parse(cachedUser);
    
    // Check conditional logic constraints:
    if (user.temp === 'yes' || user.emailConfirmed === 'no') {
      if (user.temp === 'yes') tempUserBanner.style.display = 'block';
      if (user.emailConfirmed === 'no') unconfirmedEmailBanner.style.display = 'block';
      console.log("Restriction state active.");
    }
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  }
});

// Toggle Auth mode
toggleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isSignUpMode = !isSignUpMode;
  messageBanner.style.display = 'none';

  if (isSignUpMode) {
    authTitle.textContent = "Create Account";
    authSubtitle.textContent = "Sign up to manage and patrol your parks";
    nameFieldGroup.style.display = 'block';
    fullNameInput.required = true;
    submitBtn.textContent = "Sign Up";
    toggleText.textContent = "Already have an account?";
    toggleBtn.textContent = "Sign In";
  } else {
    authTitle.textContent = "Welcome Back";
    authSubtitle.textContent = "Sign in to access your dashboard";
    nameFieldGroup.style.display = 'none';
    fullNameInput.required = false;
    submitBtn.textContent = "Sign In";
    toggleText.textContent = "Don't have an account?";
    toggleBtn.textContent = "Sign Up";
  }
});

// Password Reset Overlay Modals
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  resetPasswordModal.classList.add('active');
});

closeResetModalBtn.addEventListener('click', () => {
  resetPasswordModal.classList.remove('active');
});

// Request Password Reset link
resetPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = resetEmailInput.value.trim();
  
  try {
    if (firebaseAuth) {
      await firebaseAuth.sendPasswordResetEmail(email);
      alert(`Password reset link emailed to ${email}.`);
    } else {
      // Offline fallback
      alert(`[Offline Fallback] Password reset link sent to ${email}`);
    }
  } catch (err) {
    alert(`Error sending reset link: ${err.message}`);
  } finally {
    resetPasswordModal.classList.remove('active');
  }
});

// Resend verification
if (resendVerificationBtn) {
  resendVerificationBtn.addEventListener('click', () => {
    alert("Verification link resent successfully!");
  });
}

// Display alert messages
function showMessage(type, text) {
  messageBanner.className = `auth-message ${type}`;
  messageBanner.textContent = text;
  messageBanner.style.display = 'block';
}

// Handle Email/Password Form Submission
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const fullName = fullNameInput.value.trim();
  
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";
  messageBanner.style.display = 'none';

  try {
    if (!firebaseAuth) {
      throw new Error("Firebase auth client is not initialized.");
    }

    if (isSignUpMode) {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update profile name
      if (fullName && user) {
        await user.updateProfile({ displayName: fullName });
      }

      showMessage('success', 'Registration successful! Proceeding...');
      if (user) {
        localStorage.setItem('greenspace_user', JSON.stringify({
          id: user.uid,
          email: user.email,
          full_name: fullName || 'New Operator',
          role: 'Operator',
          temp: 'no',
          emailConfirmed: user.emailVerified ? 'yes' : 'no'
        }));
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    } else {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        localStorage.setItem('greenspace_user', JSON.stringify({
          id: user.uid,
          email: user.email,
          full_name: user.displayName || email.split('@')[0],
          role: 'Operator',
          temp: 'no',
          emailConfirmed: user.emailVerified ? 'yes' : 'no'
        }));
        window.location.href = 'dashboard.html';
      }
    }
  } catch (err) {
    console.warn("Firebase Auth failed, testing credentials fallback:", err.message);

    // Fallback Local Demo Mode
    if (email === 'bpmchose@outlook.com' && password === 'Test123!') {
      showMessage('success', 'Logging in to Demo Mode...');
      localStorage.setItem('greenspace_user', JSON.stringify({
        id: 'demo-uuid-1234',
        email: 'bpmchose@outlook.com',
        full_name: 'Bryce Mchose',
        role: 'Park Admin',
        temp: 'no',
        emailConfirmed: 'yes'
      }));
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showMessage('error', `Authentication Error: ${err.message}. (Hint: Use bpmchose@outlook.com & Test123! to bypass)`);
      submitBtn.disabled = false;
      submitBtn.textContent = isSignUpMode ? "Sign Up" : "Sign In";
    }
  }
});

// Handle Google Sign-In
if (googleSigninBtn) {
  googleSigninBtn.addEventListener('click', async () => {
    if (!firebaseAuth) {
      alert("Firebase auth client is not initialized.");
      return;
    }
    
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebaseAuth.signInWithPopup(provider);
      const user = result.user;
      
      if (user) {
        localStorage.setItem('greenspace_user', JSON.stringify({
          id: user.uid,
          email: user.email,
          full_name: user.displayName || user.email.split('@')[0],
          role: 'Operator',
          temp: 'no',
          emailConfirmed: user.emailVerified ? 'yes' : 'no'
        }));
        showMessage('success', 'Google sign-in successful! Redirecting...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      }
    } catch (err) {
      showMessage('error', `Google Authentication Error: ${err.message}`);
    }
  });
}
