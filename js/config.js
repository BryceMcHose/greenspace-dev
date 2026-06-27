// GreenSpace Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-BzQqUzWxpIq2fKfeWFsHtPaOmlbC9ZY",
  authDomain: "park-patrol.firebaseapp.com",
  databaseURL: "https://park-patrol-default-rtdb.firebaseio.com",
  projectId: "park-patrol",
  storageBucket: "park-patrol.appspot.com",
  messagingSenderId: "568587211356",
  appId: "1:568587211356:web:457db40e7212ec21460c99",
  measurementId: "G-92P2Y7QPHN"
};

// GreenSpace Supabase Configuration
const supabaseUrl = "https://kguznoohgpvswhosnokn.supabase.co";
const supabaseKey = "sb_publishable_BJqGs3b5n3CuGDVqpzR60g_D2_ewBIH";
const supabase = typeof supabase !== 'undefined' ? supabase.createClient(supabaseUrl, supabaseKey) : (window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null);

// Deployment Timestamp: 2026-06-27T03:27:50Z
