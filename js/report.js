// Initialize Supabase Client
// (Loaded via config.js)

function seedDataIfEmpty() {
  if (localStorage.getItem('gs_seeded') === 'true') return;

  const defaultCategories = ["Trash Can", "Recycle Bin", "Dog Bag Station", "Restroom", "Water Fountain", "Trailhead", "Sign", "Lighting"];
  
  const defaultParkGroups = [
    {
      id: "pg-virginia",
      name: "Virginia Historic Parks",
      owner_id: "demo-uuid-1234",
      max_locations: 10,
      max_users: 10,
      points_enabled: true,
      reports_month: 4,
      rewards_inst: "Collect your rewards at the main visitor center. Bring your digital voucher code.",
      subscription_plan: "GreenSpace Premium Group Plan",
      total_pts: 240,
      parks: ["1", "2", "3"]
    }
  ];

  const defaultParks = [
    {
      id: "1",
      name: "Freedom Park",
      city: "Williamsburg",
      state: "VA",
      zip_code: 23188,
      identifier: "LOC-FREEDOM",
      park_group_id: "pg-virginia",
      lat: 37.3387,
      lng: -76.7865
    },
    {
      id: "2",
      name: "Waller Mill Park",
      city: "Williamsburg",
      state: "VA",
      zip_code: 23185,
      identifier: "LOC-WALLER",
      park_group_id: "pg-virginia",
      lat: 37.2941,
      lng: -76.7324
    },
    {
      id: "3",
      name: "Yorktown Battlefield Trail",
      city: "Yorktown",
      state: "VA",
      zip_code: 23690,
      identifier: "LOC-YORKTOWN",
      park_group_id: "pg-virginia",
      lat: 37.2212,
      lng: -76.5123
    }
  ];

  const defaultReports = [
    {
      id: "rep-1",
      park_id: 1,
      type: "Trash Can",
      location: "Trash Can #4 near Playground",
      details: "Overflowing with plastic bottles and pizza boxes. Bees are gathering.",
      status: "Received",
      priority: "High",
      assigned_to: null,
      reporter_email: "visitor1@gmail.com",
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      lat: 37.3392,
      lng: -76.7860
    }
  ];

  const defaultRewards = [
    { id: "rew-1", name: "Free Day Parking Pass", cost: 50, park_group_id: "pg-virginia", available: true }
  ];

  localStorage.setItem('gs_categories', JSON.stringify(defaultCategories));
  localStorage.setItem('gs_parks', JSON.stringify(defaultParks));
  localStorage.setItem('gs_reports', JSON.stringify(defaultReports));
  localStorage.setItem('gs_rewards', JSON.stringify(defaultRewards));
  localStorage.setItem('gs_park_groups', JSON.stringify(defaultParkGroups));
  localStorage.setItem('gs_seeded', 'true');
}

seedDataIfEmpty();

function safeGetJSON(key) {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === "undefined") return [];
    return JSON.parse(val);
  } catch (e) {
    console.warn("Failed to parse localStorage key:", key, e);
    return [];
  }
}

let categories = safeGetJSON('gs_categories').map((c, i) => {
  if (typeof c === 'string') {
    return { id: `cat-${i}`, name: c, park_group_id: 'pg-virginia', park_id: null };
  }
  return c;
});
let parks = safeGetJSON('gs_parks');
let reports = safeGetJSON('gs_reports');
let userPoints = safeGetJSON('gs_user_points');
let parkGroups = safeGetJSON('gs_park_groups');

let activeReportParkId = '1';

// DOM Elements
const wizardStep1 = document.getElementById('wizard-step-1');
const wizardStep2 = document.getElementById('wizard-step-2');
const wizardStep3 = document.getElementById('wizard-step-3');

const selectParkDropdown = document.getElementById('select-park');
const formLocationCode = document.getElementById('form-location-code');
const formManualPark = document.getElementById('form-manual-park');
const formReportDetails = document.getElementById('form-report-details');

const detailIssueTypeSelect = document.getElementById('detail-issue-type');
const detailLocationInput = document.getElementById('detail-location');
const detailLocationText = document.getElementById('detail-location-text');
const detailNotesTextarea = document.getElementById('detail-notes');
const detailEmailInput = document.getElementById('detail-email');

const headerActionContainer = document.getElementById('header-action-container');
const operatorGreetingCard = document.getElementById('operator-greeting-card');
const greetingUsername = document.getElementById('greeting-username');

// Responsive triggers
const btnSubmitDesktop = document.getElementById('btn-submit-desktop');
const btnSubmitMobile = document.getElementById('btn-submit-mobile');

function parseQRParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  let qrValue = urlParams.get('qr');
  if (!qrValue) {
    qrValue = window.location.href.split('?')[0];
  }
  if (qrValue) {
    const segments = qrValue.split('/').filter(s => s.trim().length > 0 && !s.includes('report.html'));
    if (segments.length >= 2) {
      const itemId = decodeURIComponent(segments[segments.length - 1]);
      const parkId = decodeURIComponent(segments[segments.length - 2]);
      return { parkId, itemId };
    }
  }
  return null;
}

// Page Load - Checks cached Operator user session
let loggedInUser = null;
window.addEventListener('DOMContentLoaded', async () => {
  if (typeof supabase !== 'undefined' && supabase) {
    await loadStateFromSupabase();
  }
  
  const cachedUser = localStorage.getItem('greenspace_user');
  if (cachedUser) {
    loggedInUser = JSON.parse(cachedUser);
    
    // Auto-fill operator email
    detailEmailInput.value = loggedInUser.email;
    
    // Set customized operator footer greeting card
    greetingUsername.textContent = `Hey ${loggedInUser.full_name || 'Bryce'}!`;
    operatorGreetingCard.style.display = 'block';
  }

  setupSelectors();

async function loadStateFromSupabase() {
  if (typeof supabase === 'undefined' || !supabase) return;
  try {
    const { data: dbParks } = await supabase.from('parks').select('*');
    if (dbParks) {
      parks = dbParks.map(p => ({
        id: String(p.id),
        name: p.name,
        city: p.city,
        state: p.state,
        zip_code: p.zip_code,
        identifier: p.identifier,
        park_group_id: String(p.park_group_id),
        status: p.status,
        geofence_status: p.geofence_status,
        geofence_polygon: p.geofence_polygon,
        lat: p.lat,
        lng: p.lng
      }));
    }

    const { data: dbCategories } = await supabase.from('categories').select('*');
    if (dbCategories) {
      categories = dbCategories.map(c => ({
        id: String(c.id),
        name: c.name,
        park_group_id: String(c.park_group_id),
        park_id: null
      }));
    }

    const { data: dbIssues } = await supabase.from('issues').select('*');
    if (dbIssues) {
      reports = dbIssues.map(i => ({
        id: String(i.id),
        park_id: i.park_id,
        type: i.type,
        location: i.location,
        details: i.details,
        status: i.status === 'new' ? 'Received' : (i.status === 'in_progress' ? 'Investigating' : 'Complete'),
        priority: i.priority,
        assigned_to: i.assigned_to,
        reporter_email: i.reporter_email,
        created_at: i.created_at,
        lat: i.lat || 37.3387,
        lng: i.lng || -76.7865
      }));
    }
  } catch (e) {
    console.error("Failed to load state from Supabase in reports:", e);
  }
}
  setupSubmitDisplay();

  // GPS Location Selector
  const btnGetGps = document.getElementById('btn-get-gps');
  const gpsStatus = document.getElementById('gps-selection-status');
  if (btnGetGps) {
    btnGetGps.addEventListener('click', () => {
      gpsStatus.textContent = 'Acquiring GPS location...';
      gpsStatus.style.color = 'var(--color-primary)';
      
      if (!navigator.geolocation) {
        gpsStatus.textContent = 'Geolocation not supported by this browser.';
        gpsStatus.style.color = 'var(--status-destructive)';
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          gpsStatus.textContent = `Coordinates acquired: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          gpsStatus.style.color = 'var(--status-success)';

          let nearestPark = parks[0];
          let minDistance = Infinity;
          parks.forEach(p => {
            if (p.lat && p.lng) {
              const dist = Math.sqrt(Math.pow(p.lat - lat, 2) + Math.pow(p.lng - lng, 2));
              if (dist < minDistance) {
                minDistance = dist;
                nearestPark = p;
              }
            }
          });

          activeReportParkId = nearestPark.id;
          const locVal = `GPS Location: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Within ${nearestPark.name})`;
          detailLocationInput.value = locVal;
          if (detailLocationText) detailLocationText.textContent = locVal;
          
          window.pinnedLat = lat;
          window.pinnedLng = lng;

          setupSelectors();
          setTimeout(() => {
            wizardStep1.classList.remove('active');
            wizardStep2.classList.add('active');
          }, 800);
        },
        (error) => {
          console.error(error);
          gpsStatus.textContent = 'Failed to acquire location. Please check browser permissions.';
          gpsStatus.style.color = 'var(--status-destructive)';
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  // QR prefill parser
  const qrData = parseQRParameters();
  if (qrData) {
    const { parkId, itemId } = qrData;
    const matchedPark = parks.find(p => String(p.id) === String(parkId) || p.identifier === parkId || p.name.toLowerCase().includes(parkId.toLowerCase()));
    if (matchedPark) {
      activeReportParkId = matchedPark.id;
      
      const gCodes = safeGetJSON('gs_greencodes');
      const gc = gCodes.find(g => String(g.id) === String(itemId) || g.code === itemId);
      let locText = `GreenCode: ${itemId} (Within ${matchedPark.name})`;
      if (gc) {
        locText = `GreenCode: ${gc.name} (Within ${matchedPark.name})`;
        window.pinnedLat = gc.lat;
        window.pinnedLng = gc.lng;
      } else {
        window.pinnedLat = matchedPark.lat;
        window.pinnedLng = matchedPark.lng;
      }
      
      detailLocationInput.value = locText;
      if (detailLocationText) detailLocationText.textContent = locText;
      window.pinnedLng = matchedPark.lng;

      setupSelectors();
      wizardStep1.classList.remove('active');
      wizardStep2.classList.add('active');
    }
  }

  // Bind login redirect button
  bindLoginRedirect();
});

// Populate Category & Park Dropdowns
function setupSelectors() {
  // Parks list
  if (selectParkDropdown) {
    selectParkDropdown.innerHTML = '';
    parks.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      selectParkDropdown.appendChild(opt);
    });
  }

  // Categories list
  if (detailIssueTypeSelect) {
    detailIssueTypeSelect.innerHTML = '';
    const park = parks.find(p => String(p.id) === String(activeReportParkId));
    let parkCats = [];
    if (park) {
      parkCats = categories.filter(c => 
        (c.park_group_id === park.park_group_id && !c.park_id) || 
        (String(c.park_id) === String(park.id))
      );
    } else {
      parkCats = categories;
    }
    parkCats.forEach(cat => {
      const opt = document.createElement('option');
      const catName = cat.name || cat;
      opt.value = catName;
      opt.textContent = catName;
      detailIssueTypeSelect.appendChild(opt);
    });
  }
}

// Check desktop/mobile submit button displays dynamically
// "Every time condition: page width < 992px switches to mobile Submit triggers"
function setupSubmitDisplay() {
  const checkWidth = () => {
    if (window.innerWidth < 992) {
      if (btnSubmitDesktop) btnSubmitDesktop.style.display = 'none';
      if (btnSubmitMobile) btnSubmitMobile.style.display = 'inline-flex';
    } else {
      if (btnSubmitDesktop) btnSubmitDesktop.style.display = 'inline-flex';
      if (btnSubmitMobile) btnSubmitMobile.style.display = 'none';
    }
  };
  checkWidth();
  window.addEventListener('resize', checkWidth);
}

// Step 1: Submit Location code
if (formLocationCode) {
  formLocationCode.addEventListener('submit', (e) => {
    e.preventDefault();
    const locCode = document.getElementById('input-loc-code').value.trim();
    
    if (locCode.toUpperCase().includes('LOC2')) {
      activeReportParkId = '2';
    } else if (locCode.toUpperCase().includes('LOC3')) {
      activeReportParkId = '3';
    } else {
      activeReportParkId = '1';
    }

    const park = parks.find(p => p.id === activeReportParkId);
    const gCodes = safeGetJSON('gs_greencodes');
    const gc = gCodes.find(g => g.code === locCode || String(g.id) === String(locCode));
    let locText = `GreenCode: ${locCode} (Within ${park.name})`;
    if (gc) {
      locText = `GreenCode: ${gc.name} (Within ${park.name})`;
      window.pinnedLat = gc.lat;
      window.pinnedLng = gc.lng;
    } else {
      window.pinnedLat = park.lat || null;
      window.pinnedLng = park.lng || null;
    }
    
    detailLocationInput.value = locText;
    if (detailLocationText) detailLocationText.textContent = locText;
    window.pinnedLng = park.lng || null;
    
    setupSelectors();
    // Transition to details
    wizardStep1.classList.remove('active');
    wizardStep2.classList.add('active');
  });
}

// Step 1: Submit Park selection
if (formManualPark && selectParkDropdown) {
  formManualPark.addEventListener('submit', (e) => {
    e.preventDefault();
    activeReportParkId = selectParkDropdown.value;
    const park = parks.find(p => String(p.id) === String(activeReportParkId));
    detailLocationInput.placeholder = `Describe Location within ${park ? park.name : ''}...`;

    setupSelectors();
    // Transition to details
    wizardStep1.classList.remove('active');
    wizardStep2.classList.add('active');
  });
}

// Step 2 Form Submissions
formReportDetails.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const type = detailIssueTypeSelect.value;
  const location = detailLocationInput.value.trim();
  const details = detailNotesTextarea.value.trim();
  const email = detailEmailInput.value.trim();

  let isAnonymous = true;
  if (email.length > 0) {
    isAnonymous = false;
    
    const park = parks.find(p => String(p.id) === String(activeReportParkId));
    const group = park && parkGroups.find(g => g.id === park.park_group_id);
    if (group && group.points_enabled) {
      const targetUserId = loggedInUser ? loggedInUser.id : 'demo-uuid-1234';
      let upRec = userPoints.find(up => up.user_id === targetUserId && up.park_group_id === group.id);
      if (!upRec) {
        upRec = { id: Date.now(), user_id: targetUserId, park_group_id: group.id, points: 0 };
        userPoints.push(upRec);
      }
      upRec.points += 5;
      localStorage.setItem('gs_user_points', JSON.stringify(userPoints));
    }
  }

  const newReport = {
    id: Date.now(),
    park_id: parseInt(activeReportParkId),
    type,
    location,
    details,
    status: 'Received',
    assigned_to: null,
    priority: 'Medium',
    created_at: new Date().toISOString(),
    reporter_email: isAnonymous ? null : email,
    lat: window.pinnedLat || null,
    lng: window.pinnedLng || null
  };

  if (typeof supabase !== 'undefined' && supabase) {
    try {
      const userRes = await supabase.auth.getUser();
      const currentUserObj = userRes.data?.user;
      const parkIdVal = isNaN(Number(newReport.park_id)) ? 1 : Number(newReport.park_id);
      
      const { data: dbIssue, error } = await supabase.from('issues').insert([{
        park_id: parkIdVal,
        type: newReport.type,
        location: newReport.location,
        details: newReport.details,
        status: 'new',
        priority: newReport.priority || 'Medium',
        reporter_email: isAnonymous ? null : (currentUserObj ? currentUserObj.email : newReport.reporter_email)
      }]).select().single();
      
      if (!error && dbIssue) {
        newReport.id = String(dbIssue.id);
      }
    } catch (dbErr) {
      console.error("Failed to insert issue in Supabase:", dbErr);
    }
  }

  // Update local application state memory
  reports.unshift(newReport);
  localStorage.setItem('gs_reports', JSON.stringify(reports));

  // Transition to Success Step 3
  wizardStep2.classList.remove('active');
  wizardStep3.classList.add('active');

  // Change top header action to "File another report"
  headerActionContainer.innerHTML = `
    <button id="btn-reset-wizard" class="btn btn-secondary">
      <span class="material-symbols-rounded" style="margin-right:6px; font-size:16px; vertical-align:middle;">description</span>
      File another report
    </button>
  `;

  // Bind Reset button
  document.getElementById('btn-reset-wizard').addEventListener('click', () => {
    resetWizard();
  });
});

// Reset Form Wizard
function resetWizard() {
  document.getElementById('input-loc-code').value = '';
  detailLocationInput.value = '';
  if (detailLocationText) detailLocationText.textContent = 'No location selected yet';
  detailNotesTextarea.value = '';
  if (!loggedInUser) detailEmailInput.value = '';

  // Switch to step 1 view
  wizardStep3.classList.remove('active');
  wizardStep1.classList.add('active');

  // Restore login button on top header if logged out
  if (!loggedInUser) {
    headerActionContainer.innerHTML = `<button id="btn-login-redirect" class="btn btn-secondary">Log in</button>`;
    bindLoginRedirect();
  } else {
    headerActionContainer.innerHTML = '';
  }
}

// Redirects login button
function bindLoginRedirect() {
  const btnLogin = document.getElementById('btn-login-redirect');
  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}
bindLoginRedirect();
