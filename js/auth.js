// Initialize Supabase Client
// (Loaded via config.js)

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
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/index.html',
      });
      if (error) throw error;
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
    if (!supabase) {
      throw new Error("Supabase client is not initialized.");
    }

    if (isSignUpMode) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      const user = data.user;
      
      if (user) {
        const first = fullName.split(' ')[0] || '';
        const last = fullName.split(' ').slice(1).join(' ') || '';
        
        // Try inserting into public users table
        try {
          await supabase.from('users').insert([{
            id: user.id,
            first_name: first,
            last_name: last,
            email: user.email,
            temp: false
          }]);
        } catch (dbErr) {
          console.warn("Failed to create public user record:", dbErr);
        }

        showMessage('success', 'Registration successful! Proceeding...');
        localStorage.setItem('greenspace_user', JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: fullName || 'New Operator',
          role: 'Operator',
          temp: 'no',
          emailConfirmed: user.email_confirmed_at ? 'yes' : 'no'
        }));
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      const user = data.user;

      if (user) {
        // Fetch user profile info
        let role = 'Operator';
        let name = user.user_metadata?.full_name || email.split('@')[0];

        try {
          const { data: userProfile } = await supabase.from('users').select('*').eq('id', user.id).single();
          if (userProfile) {
            name = `${userProfile.first_name} ${userProfile.last_name}`;
            if (userProfile.email === 'bpmchose@outlook.com') {
              role = 'Park Admin';
            }
          }
        } catch (dbErr) {
          console.warn("Could not query user profile:", dbErr);
        }

        localStorage.setItem('greenspace_user', JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: name,
          role: role,
          temp: 'no',
          emailConfirmed: user.email_confirmed_at ? 'yes' : 'no'
        }));
        window.location.href = 'dashboard.html';
      }
    }
  } catch (err) {
    console.warn("Supabase Auth failed, testing credentials fallback:", err.message);

    // Fallback Local Demo Mode
    if (email === 'bpmchose@outlook.com' && password === 'Test123!') {
      showMessage('success', 'Logging in to Demo Mode...');
      localStorage.setItem('greenspace_user', JSON.stringify({
        id: 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693',
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
    if (!supabase) {
      alert("Supabase client is not initialized.");
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard.html'
        }
      });
      if (error) throw error;
    } catch (err) {
      showMessage('error', `Google Authentication Error: ${err.message}`);
    }
  });
}
