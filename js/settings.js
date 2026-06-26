// settings.js - GreenSpace Multi-Column Settings Controller

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
let staff = safeGetJSON('gs_staff').map(s => {
  if (!s.park_group_id) s.park_group_id = 'pg-virginia';
  return s;
});
let reports = safeGetJSON('gs_reports');
let rewards = safeGetJSON('gs_rewards');
let orders = safeGetJSON('gs_orders');
let parkGroups = safeGetJSON('gs_park_groups');
let userPoints = safeGetJSON('gs_user_points');
let greenCodes = safeGetJSON('gs_greencodes');

let currentTab = 'groups'; // 'groups', 'parks', 'categories', 'greencodes', 'staff', 'rewards'
let activeItemId = null;   // ID of currently editing item
let isCreatingNew = false;  // Flag for creation mode

// DOM selectors
const navItems = document.querySelectorAll('.settings-nav-item');
const listTitle = document.getElementById('list-title');
const searchInput = document.getElementById('settings-search');
const listContainer = document.getElementById('settings-list-container');
const editorContainer = document.getElementById('settings-editor-container');
const btnAddItem = document.getElementById('btn-add-item');

function saveState() {
  localStorage.setItem('gs_categories', JSON.stringify(categories));
  localStorage.setItem('gs_parks', JSON.stringify(parks));
  localStorage.setItem('gs_staff', JSON.stringify(staff));
  localStorage.setItem('gs_reports', JSON.stringify(reports));
  localStorage.setItem('gs_rewards', JSON.stringify(rewards));
  localStorage.setItem('gs_orders', JSON.stringify(orders));
  localStorage.setItem('gs_park_groups', JSON.stringify(parkGroups));
  localStorage.setItem('gs_user_points', JSON.stringify(userPoints));
  localStorage.setItem('gs_greencodes', JSON.stringify(greenCodes));
}

let activeParkGroupId = parkGroups[0]?.id || '';

function populateGroupSelector() {
  const groupSelector = document.getElementById('active-park-group-selector');
  if (!groupSelector) return;
  groupSelector.innerHTML = parkGroups.map(g => `<option value="${g.id}" ${activeParkGroupId === g.id ? 'selected' : ''}>${g.name}</option>`).join('') + `<option value="manage-groups">🏢 Manage Park Groups</option>`;
}

function renderNavigation() {
  const navContainer = document.getElementById('settings-nav-items-container');
  if (!navContainer) return;

  if (activeParkGroupId === 'manage-groups') {
    navContainer.innerHTML = `
      <button class="settings-nav-item ${currentTab === 'groups' ? 'active' : ''}" data-tab="groups">
        <span class="material-symbols-rounded">corporate_fare</span>
        <span>Manage Groups</span>
      </button>
    `;
  } else {
    navContainer.innerHTML = `
      <button class="settings-nav-item ${currentTab === 'groups' ? 'active' : ''}" data-tab="groups">
        <span class="material-symbols-rounded">settings</span>
        <span>Group Settings</span>
      </button>
      <button class="settings-nav-item ${currentTab === 'parks' ? 'active' : ''}" data-tab="parks">
        <span class="material-symbols-rounded">forest</span>
        <span>Parks</span>
      </button>
      <button class="settings-nav-item ${currentTab === 'categories' ? 'active' : ''}" data-tab="categories">
        <span class="material-symbols-rounded">category</span>
        <span>Global Categories</span>
      </button>
      <button class="settings-nav-item ${currentTab === 'staff' ? 'active' : ''}" data-tab="staff">
        <span class="material-symbols-rounded">badge</span>
        <span>Group Staff Pool</span>
      </button>
      <button class="settings-nav-item ${currentTab === 'rewards' ? 'active' : ''}" data-tab="rewards">
        <span class="material-symbols-rounded">featured_seasonal_and_gifts</span>
        <span>Marketplace Rewards</span>
      </button>
    `;
  }

  // Hook up event listeners to new nav items
  const navItems = navContainer.querySelectorAll('.settings-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentTab = item.dataset.tab;
      loadTab(currentTab);
    });
  });
}

// Initial setup
window.addEventListener('DOMContentLoaded', () => {
  populateGroupSelector();
  renderNavigation();
  setupSearch();
  setupAddButton();
  
  const groupSelector = document.getElementById('active-park-group-selector');
  if (groupSelector) {
    groupSelector.addEventListener('change', () => {
      activeParkGroupId = groupSelector.value;
      renderNavigation();
      if (activeParkGroupId === 'manage-groups') {
        loadTab('groups');
      } else {
        loadTab('groups'); // Group settings tab
      }
    });
  }

  loadTab(currentTab);
});

function setupSearch() {
  searchInput.addEventListener('input', () => {
    renderListColumn(searchInput.value.trim().toLowerCase());
  });
}

function setupAddButton() {
  btnAddItem.addEventListener('click', () => {
    isCreatingNew = true;
    activeItemId = null;
    renderEditor();
  });
}

function loadTab(tabName) {
  currentTab = tabName;
  isCreatingNew = false;
  activeItemId = null;
  searchInput.value = '';
  
  // Set tab titles
  const titles = {
    groups: 'Park Groups',
    parks: 'Parks',
    categories: 'Categories',
    greencodes: 'GreenCodes',
    staff: 'Staff Members',
    rewards: 'Reward Items'
  };
  listTitle.textContent = titles[tabName];
  
  renderListColumn();
  
  // Select first item by default if exists
  const items = getItemsForTab();
  if (items.length > 0) {
    selectItem(items[0].id || items[0]); // Category items are string primitives or objects
  } else {
    renderEditor();
  }
}

function getItemsForTab() {
  switch (currentTab) {
    case 'groups':
      if (activeParkGroupId === 'manage-groups') {
        return parkGroups;
      }
      return parkGroups.filter(g => g.id === activeParkGroupId);
    case 'parks':
      return parks.filter(p => String(p.park_group_id) === String(activeParkGroupId));
    case 'categories':
      return categories.filter(c => c.park_group_id === activeParkGroupId && !c.park_id);
    case 'greencodes':
      return greenCodes.filter(gc => {
        const park = parks.find(p => String(p.id) === String(gc.park_id));
        return park && String(park.park_group_id) === String(activeParkGroupId);
      });
    case 'staff':
      return staff.filter(s => String(s.park_group_id) === String(activeParkGroupId));
    case 'rewards':
      return rewards.filter(r => String(r.park_group_id) === String(activeParkGroupId));
    default: return [];
  }
}

function renderListColumn(filterStr = '') {
  listContainer.innerHTML = '';
  const items = getItemsForTab();
  
  const filtered = items.filter(item => {
    const name = (item.name || item.full_name || '').toLowerCase();
    return name.includes(filterStr);
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `<div style="font-size:0.85rem; padding:16px; text-align:center; color:var(--color-text-muted);">No items found</div>`;
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement('div');
    const itemId = item.id;
    div.className = `settings-list-item ${activeItemId === itemId ? 'active' : ''}`;
    
    let subText = '';
    if (currentTab === 'parks') {
      subText = `<span style="font-size:0.75rem; color:var(--color-text-secondary);">${item.city || ''}</span>`;
    } else if (currentTab === 'rewards') {
      subText = `<span style="font-size:0.75rem; color:var(--color-text-secondary);">${item.cost} pts</span>`;
    } else if (currentTab === 'staff') {
      subText = `<span style="font-size:0.75rem; color:var(--color-text-secondary);">${item.role}</span>`;
    } else if (currentTab === 'greencodes') {
      const park = parks.find(p => String(p.id) === String(item.park_id));
      const parkName = park ? park.name : 'Unknown Park';
      subText = `<span style="font-size:0.75rem; color:var(--color-text-secondary);">${item.code || ''} • ${parkName}</span>`;
    } else if (currentTab === 'categories') {
      const park = item.park_id ? parks.find(p => String(p.id) === String(item.park_id)) : null;
      subText = `<span style="font-size:0.75rem; color:var(--color-text-secondary);">${park ? `Park: ${park.name}` : 'Global Category'}</span>`;
    }

    div.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-weight:600;">${item.name || item.full_name || item}</span>
        ${subText}
      </div>
      <span class="material-symbols-rounded" style="font-size:16px; opacity:0.6;">chevron_right</span>
    `;

    div.addEventListener('click', () => {
      isCreatingNew = false;
      selectItem(itemId);
    });

    listContainer.appendChild(div);
  });
}

function selectItem(id) {
  activeItemId = id;
  
  // Highlight in list
  const listItems = listContainer.querySelectorAll('.settings-list-item');
  const items = getItemsForTab();
  const selectedIndex = items.findIndex(i => i.id === id);
  
  renderListColumn(searchInput.value.trim().toLowerCase());
  renderEditor();
}

function renderEditor() {
  editorContainer.innerHTML = '';
  
  const items = getItemsForTab();
  const activeItem = isCreatingNew ? null : items.find(i => i.id === activeItemId);

  if (!activeItem && !isCreatingNew) {
    editorContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--color-text-muted);">
        <span class="material-symbols-rounded" style="font-size:48px; margin-bottom:12px;">tune</span>
        <p>Select an item from the list to configure, or create a new one.</p>
      </div>
    `;
    return;
  }

  const card = document.createElement('div');
  card.className = 'settings-detail-card';

  let formHtml = '';
  let title = isCreatingNew ? 'Create New Item' : 'Edit Configuration';

  switch (currentTab) {
    case 'groups':
      formHtml = getGroupForm(activeItem);
      break;
    case 'parks':
      formHtml = isCreatingNew ? getParkForm(null) : getParkWorkspaceHtml(activeItem);
      break;
    case 'categories':
      formHtml = getCategoryForm(activeItem);
      break;
    case 'greencodes':
      formHtml = getGreenCodeForm(activeItem);
      break;
    case 'staff':
      formHtml = getStaffForm(activeItem);
      break;
    case 'rewards':
      formHtml = getRewardForm(activeItem);
      break;
  }

  card.innerHTML = `
    <h2 style="font-size:1.5rem; font-weight:800; color:black; margin-bottom:24px;">${title}</h2>
    <form id="settings-editor-form">
      ${formHtml}
      <div style="display:flex; gap:12px; margin-top:32px; border-top:1px solid var(--neutral-gray-border); padding-top:24px;">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        ${!isCreatingNew ? `<button type="button" id="btn-delete-item" class="btn btn-secondary" style="color:var(--status-destructive); border-color:var(--status-destructive); background:none;">Delete</button>` : ''}
      </div>
    </form>
  `;

  editorContainer.appendChild(card);

  if (currentTab === 'parks') {
    const pgSelect = document.getElementById('park-group-id');
    if (pgSelect) {
      pgSelect.addEventListener('change', () => {
        refreshParkStaffCheckboxes(pgSelect.value, activeItem);
      });
      refreshParkStaffCheckboxes(pgSelect.value, activeItem);
    }
    if (document.getElementById('settings-geofence-map')) {
      const park = activeItem || (isCreatingNew ? null : items.find(i => i.id === activeItemId));
      if (park) {
        setTimeout(() => {
          window.initSettingsGeofenceMap(park);
        }, 50);
      }
    }
  }

  if (currentTab === 'categories') {
    const groupSelect = document.getElementById('category-group-id');
    const scopeSelect = document.getElementById('category-scope');
    const parkContainer = document.getElementById('category-park-container');
    const parkSelect = document.getElementById('category-park-id');

    const updateParksList = () => {
      const gId = groupSelect.value;
      const filteredParks = parks.filter(p => String(p.park_group_id) === String(gId));
      if (parkSelect) {
        parkSelect.innerHTML = filteredParks.map(p => `<option value="${p.id}" ${activeItem && String(activeItem.park_id) === String(p.id) ? 'selected' : ''}>${p.name}</option>`).join('');
      }
    };

    if (groupSelect && scopeSelect && parkContainer) {
      groupSelect.addEventListener('change', updateParksList);
      scopeSelect.addEventListener('change', () => {
        parkContainer.style.display = scopeSelect.value === 'park' ? 'block' : 'none';
      });
      updateParksList();
    }
  }

  // Hook up form event listener
  document.getElementById('settings-editor-form').addEventListener('submit', handleFormSubmit);
  if (!isCreatingNew) {
    document.getElementById('btn-delete-item')?.addEventListener('click', handleDelete);
  }
}

// Sub-Form generators
function getGroupForm(item) {
  return `
    <div class="form-group">
      <label>Park Group Name</label>
      <input type="text" id="group-name" class="form-control" value="${item ? item.name : ''}" required placeholder="e.g. Virginia Parks Association">
    </div>
    <div class="form-group" style="display:flex; align-items:center; gap:8px; margin: 24px 0;">
      <input type="checkbox" id="group-points" style="width:18px; height:18px; cursor:pointer;" ${(!item || item.points_enabled) ? 'checked' : ''}>
      <label for="group-points" style="margin-bottom:0; cursor:pointer;">Enable Reward Points Marketplace</label>
    </div>
    <div class="form-group">
      <label>Redemption Instructions (shown to visitors)</label>
      <textarea id="group-instructions" class="form-control" rows="3" required placeholder="Pickup points, gift shop vouchers, etc.">${item ? item.rewards_inst : ''}</textarea>
    </div>
    <div class="form-group">
      <label>Max Allowed Parks/Locations</label>
      <input type="number" id="group-max-loc" class="form-control" value="${item ? item.max_locations : 5}">
    </div>
  `;
}

function getParkForm(item) {
  const groupsOptions = parkGroups.map(g => `<option value="${g.id}" ${item && item.park_group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('');
  
  const cachedUserStr = localStorage.getItem('greenspace_user');
  const loggedInUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
  const isAdmin = loggedInUser && (loggedInUser.email === 'bpmchose@gmail.com' || loggedInUser.email === 'bpmchose@outlook.com' || loggedInUser.role === 'Park Admin');
  
  // Hidden inputs for backward compatibility with state loading/saving
  const hiddenFields = `
    <input type="hidden" id="park-lat" value="${item ? item.lat : 37.3387}">
    <input type="hidden" id="park-lng" value="${item ? item.lng : -76.7865}">
    <input type="hidden" id="park-geofence-radius" value="${item ? (item.geofence_radius || 800) : 800}">
  `;

  let geofenceViewer = '';
  if (item) {
    const editBtn = isAdmin ? `
      <button type="button" class="btn btn-secondary" style="margin-top: 8px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; font-size: 0.8rem; background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32;" onclick="window.location.href='dashboard.html?editpark=${item.id}'">
        <span class="material-symbols-rounded" style="font-size: 16px;">edit_square</span>
        <span>Edit Geofence in Map Editor</span>
      </button>
    ` : '';
    geofenceViewer = `
      <div class="form-group">
        <label style="font-weight: 700; color: var(--color-primary); display:block; margin-bottom:8px;">Geofence Area Boundary</label>
        <div id="settings-geofence-map" style="height: 220px; width: 100%; border-radius: var(--radius-md); border: 1px solid var(--neutral-gray-border); z-index: 1;"></div>
        ${editBtn}
      </div>
    `;
  } else {
    geofenceViewer = `
      <div class="form-group" style="padding: 12px; background: #fff3e0; border: 1px solid #ffe0b2; border-radius: var(--radius-md); font-size: 0.8rem; color: #e65100;">
        <span class="material-symbols-rounded" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">info</span>
        <span>After creating this park, you can define and edit its geofence boundary using the Map Editor.</span>
      </div>
    `;
  }

  return `
    <div class="form-group">
      <label>Park Name</label>
      <input type="text" id="park-name" class="form-control" value="${item ? item.name : ''}" required>
    </div>
    <div class="form-group">
      <label>City</label>
      <input type="text" id="park-city" class="form-control" value="${item ? item.city : ''}" required>
    </div>
    <div class="form-group">
      <label>State</label>
      <input type="text" id="park-state" class="form-control" value="${item ? item.state : ''}" required>
    </div>
    <div class="form-group">
      <label>Zip Code</label>
      <input type="number" id="park-zip" class="form-control" value="${item ? item.zip_code : ''}" required>
    </div>
    <div class="form-group">
      <label>Belongs to Park Group</label>
      <select id="park-group-id" class="form-control">
        ${groupsOptions}
      </select>
    </div>
    ${hiddenFields}
    ${geofenceViewer}
    <div class="form-group">
      <label style="font-weight: 700; color: var(--color-primary); display:block; margin-bottom:12px;">Staff Assignments</label>
      <div id="park-staff-checkboxes-container" style="border: 1px solid var(--neutral-gray-border); border-radius: var(--radius-md); padding:16px; background:var(--bg-canvas);">
        <!-- Populated dynamically -->
      </div>
    </div>
  `;
}

function refreshParkStaffCheckboxes(groupId, currentPark) {
  const container = document.getElementById('park-staff-checkboxes-container');
  if (!container) return;

  const groupStaff = staff.filter(s => String(s.park_group_id) === String(groupId));
  if (groupStaff.length === 0) {
    container.innerHTML = `<p style="font-size:0.85rem; color:var(--color-text-muted); font-style:italic;">No staff members belong to this Park Group yet. Create some in the Staff tab.</p>`;
    return;
  }

  const assigned = currentPark ? (currentPark.assigned_staff || []) : [];
  container.innerHTML = groupStaff.map(s => `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
      <input type="checkbox" name="park-staff-assignment" value="${s.id}" id="chk-staff-${s.id}" style="width:16px; height:16px; cursor:pointer;" ${assigned.includes(s.id) ? 'checked' : ''}>
      <label for="chk-staff-${s.id}" style="margin-bottom:0; cursor:pointer; font-size:0.875rem;">${s.full_name} (${s.email})</label>
    </div>
  `).join('');
}

function getCategoryForm(item) {
  const groupsOptions = parkGroups.map(g => `<option value="${g.id}" ${item && item.park_group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('');
  
  return `
    <div class="form-group">
      <label>Category Label Name</label>
      <input type="text" id="category-name" class="form-control" value="${item ? item.name : ''}" required placeholder="e.g. Trash Can">
    </div>
    <div class="form-group">
      <label>Belongs to Park Group</label>
      <select id="category-group-id" class="form-control">
        ${groupsOptions}
      </select>
    </div>
    <div class="form-group">
      <label>Scope / Availability</label>
      <select id="category-scope" class="form-control">
        <option value="global" ${!item || !item.park_id ? 'selected' : ''}>Global (All Parks in Group)</option>
        <option value="park" ${item && item.park_id ? 'selected' : ''}>Specific Park</option>
      </select>
    </div>
    <div class="form-group" id="category-park-container" style="display: ${item && item.park_id ? 'block' : 'none'};">
      <label>Assign to Specific Park</label>
      <select id="category-park-id" class="form-control">
        <!-- Dynamically populated -->
      </select>
    </div>
  `;
}

function getStaffForm(item) {
  const groupsOptions = parkGroups.map(g => `<option value="${g.id}" ${item && item.park_group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('');
  
  return `
    <div class="form-group">
      <label>Staff Member Full Name</label>
      <input type="text" id="staff-name" class="form-control" value="${item ? item.full_name : ''}" required>
    </div>
    <div class="form-group">
      <label>Email Address</label>
      <input type="email" id="staff-email" class="form-control" value="${item ? item.email : ''}" required>
    </div>
    <div class="form-group">
      <label>Belongs to Park Group</label>
      <select id="staff-group-id" class="form-control">
        ${groupsOptions}
      </select>
    </div>
    <div class="form-group">
      <label>Access Privilege Role</label>
      <select id="staff-role" class="form-control">
        <option value="Employee" ${item && item.role === 'Employee' ? 'selected' : ''}>Employee / Patrol Officer</option>
        <option value="Park Admin" ${item && item.role === 'Park Admin' ? 'selected' : ''}>Park Group Administrator</option>
      </select>
    </div>
  `;
}

function getRewardForm(item) {
  const groupsOptions = parkGroups.map(g => `<option value="${g.id}" ${item && item.park_group_id === g.id ? 'selected' : ''}>${g.name}</option>`).join('');
  return `
    <div class="form-group">
      <label>Reward Prize Name</label>
      <input type="text" id="reward-name" class="form-control" value="${item ? item.name : ''}" required placeholder="e.g. Free Mug Voucher">
    </div>
    <div class="form-group">
      <label>Cost (in Points)</label>
      <input type="number" id="reward-cost" class="form-control" value="${item ? item.cost : 50}" required min="1">
    </div>
    <div class="form-group">
      <label>Belongs to Park Group</label>
      <select id="reward-group-id" class="form-control">
        ${groupsOptions}
      </select>
    </div>
    <div class="form-group" style="display:flex; align-items:center; gap:8px; margin: 24px 0;">
      <input type="checkbox" id="reward-available" style="width:18px; height:18px; cursor:pointer;" ${(!item || item.available) ? 'checked' : ''}>
      <label for="reward-available" style="margin-bottom:0; cursor:pointer;">Available in Storefront</label>
    </div>
  `;
}

function getGreenCodeForm(item) {
  const parkOptions = parks.map(p => `<option value="${p.id}" ${item && String(item.park_id) === String(p.id) ? 'selected' : ''}>${p.name}</option>`).join('');
  
  let qrCodeHtml = '';
  if (item) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://grsp.co/report/${item.park_id}/${item.id}`;
    qrCodeHtml = `
      <div style="margin-top:20px; padding:16px; border:1px solid var(--neutral-gray-border); border-radius:var(--radius-md); background:var(--bg-canvas); display:flex; flex-direction:column; align-items:center; gap:8px;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--color-primary); text-transform:uppercase;">GreenCode QR Code</span>
        <img src="${qrUrl}" alt="GreenCode QR" style="border:4px solid white; box-shadow:var(--shadow-sm); width:150px; height:150px; background:white;" />
        <span style="font-size:0.75rem; color:var(--color-text-secondary); word-break:break-all; text-align:center;">grsp.co/report/${item.park_id}/${item.id}</span>
      </div>
    `;
  }

  return `
    <div class="form-group">
      <label>GreenCode ID/Identifier (Unique, e.g. gc-5)</label>
      <input type="text" id="greencode-id-input" class="form-control" value="${item ? item.id : ''}" ${item ? 'disabled' : ''} placeholder="Leave blank to auto-generate">
    </div>
    <div class="form-group">
      <label>GreenCode Code/Label (matches URL /park_id/item_id)</label>
      <input type="text" id="greencode-code" class="form-control" value="${item ? item.code : ''}" required placeholder="e.g. LOC-FREEDOM-PLAY">
    </div>
    <div class="form-group">
      <label>Location Name</label>
      <input type="text" id="greencode-name" class="form-control" value="${item ? item.name : ''}" required placeholder="e.g. Playground Area">
    </div>
    <div class="form-group">
      <label>Belongs to Park</label>
      <select id="greencode-park-id" class="form-control">
        ${parkOptions}
      </select>
    </div>
    <div class="form-group">
      <label>Latitude Coordinates</label>
      <input type="number" step="any" id="greencode-lat" class="form-control" value="${item ? item.lat : 37.3387}" required>
    </div>
    <div class="form-group">
      <label>Longitude Coordinates</label>
      <input type="number" step="any" id="greencode-lng" class="form-control" value="${item ? item.lng : -76.7865}" required>
    </div>
    ${qrCodeHtml}
  `;
}

// Form logic operations
// Form logic operations
async function handleFormSubmit(e) {
  e.preventDefault();
  
  window.lastPredictedPolygon = null;

  if (currentTab === 'parks') {
    // Check if the park already has an existing geofence polygon
    let hasExistingPolygon = false;
    if (!isCreatingNew) {
      const park = parks.find(p => String(p.id) === String(activeItemId));
      if (park && park.geofence_polygon && park.geofence_polygon.length >= 3) {
        hasExistingPolygon = true;
      }
    }

    if (hasExistingPolygon) {
      // Proceed directly to save without re-predicting the geofence
      if (isCreatingNew) {
        createNewItem();
      } else {
        updateExistingItem();
      }
      saveState();
      populateGroupSelector();
      renderNavigation();
      renderListColumn(searchInput.value.trim().toLowerCase());
      isCreatingNew = false;
      renderEditor();
      alert("Configuration saved successfully!");
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Save Changes';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ Predicting Geofence...</span>`;
    }
    
    try {
      const name = document.getElementById('park-name').value.trim();
      const city = document.getElementById('park-city').value.trim();
      const state = document.getElementById('park-state').value.trim();
      
      const query = encodeURIComponent(`${name}, ${city}, ${state}`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&polygon_geojson=1&limit=1`);
      let data = await res.json();

      // Fallback 1: search without city
      if ((!data || data.length === 0) && state) {
        const fallbackQuery = encodeURIComponent(`${name}, ${state}`);
        const fbRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${fallbackQuery}&format=json&polygon_geojson=1&limit=1`);
        data = await fbRes.json();
      }

      // Fallback 2: search just by name
      if (!data || data.length === 0) {
        const nameQuery = encodeURIComponent(name);
        const nameRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${nameQuery}&format=json&polygon_geojson=1&limit=1`);
        data = await nameRes.json();
      }
      
      let lat = parseFloat(document.getElementById('park-lat').value) || 37.3387;
      let lng = parseFloat(document.getElementById('park-lng').value) || -76.7865;
      let geofencePolygon = null;
      
      let nominatimPolygon = null;
      let isNeighborhood = false;
      if (data && data.length > 0) {
        const item = data[0];
        lat = parseFloat(item.lat);
        lng = parseFloat(item.lon);
        
        const isNeighItem = (item.class === 'place' && ['neighbourhood', 'suburb', 'quarter', 'residential'].includes(item.type)) ||
                            (item.class === 'landuse' && item.type === 'residential') ||
                            ['neighbourhood', 'suburb', 'quarter', 'residential'].includes(item.type) ||
                            name.toLowerCase().includes('neighborhood') || 
                            name.toLowerCase().includes('subdivision') || 
                            name.toLowerCase().includes('community') || 
                            name.toLowerCase().includes('association') || 
                            name.toLowerCase().includes('hoa') ||
                            name.toLowerCase().includes('homes');

        if (isNeighItem) {
          isNeighborhood = true;
        }

        if (item.geojson && (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon')) {
          if (item.geojson.type === 'Polygon') {
            let coords = item.geojson.coordinates[0].map(pt => [pt[1], pt[0]]);
            if (coords.length >= 3) {
              nominatimPolygon = isNeighborhood ? getConvexHull(coords) : coords;
            }
          } else if (item.geojson.type === 'MultiPolygon') {
            let polyList = [];
            item.geojson.coordinates.forEach(poly => {
              if (poly[0] && poly[0].length >= 3) {
                polyList.push(poly[0].map(pt => [pt[1], pt[0]]));
              }
            });
            if (polyList.length > 0) {
              // Always use getConvexHull for MultiPolygons to avoid disjoint shapes
              nominatimPolygon = getConvexHull(polyList.flat());
            }
          }
        }
      }
      
      // Query Overpass first to find detailed OSM feature boundaries matching the name
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:15];(way[leisure~"park|nature_reserve|recreation_ground|common"](around:1500,${lat},${lng});relation[leisure~"park|nature_reserve|recreation_ground|common"](around:1500,${lat},${lng});way[boundary~"protected_area|national_park"](around:1500,${lat},${lng});relation[boundary~"protected_area|national_park"](around:1500,${lat},${lng});way[place~"neighbourhood|suburb|quarter"](around:1500,${lat},${lng});relation[place~"neighbourhood|suburb|quarter"](around:1500,${lat},${lng});way[landuse=residential](around:1500,${lat},${lng});relation[landuse=residential](around:1500,${lat},${lng}););out geom;`;
      
      try {
        const ovRes = await fetch(overpassUrl);
        const ovData = await ovRes.json();
        
        if (ovData && ovData.elements && ovData.elements.length > 0) {
          const isProbablyPark = name.toLowerCase().includes('park') || 
                                 name.toLowerCase().includes('reserve') || 
                                 name.toLowerCase().includes('recreation') || 
                                 name.toLowerCase().includes('common') || 
                                 name.toLowerCase().includes('garden') || 
                                 name.toLowerCase().includes('forest');

          ovData.elements.forEach(el => {
            let score = 0;
            const elName = (el.tags?.name || '').toLowerCase();
            if (elName) {
              words.forEach(w => {
                if (elName.includes(w)) score += 10;
              });
            }
            const hasGeom = el.geometry || (el.members && el.members.some(m => m.geometry));
            if (hasGeom) score += 1;

            if (!isProbablyPark && hasGeom) {
              const tags = el.tags || {};
              const isRes = tags.landuse === 'residential' || 
                            tags.place === 'neighbourhood' || 
                            tags.place === 'suburb' || 
                            tags.place === 'quarter';
              if (isRes) {
                let coords = [];
                if (el.geometry) {
                  coords = el.geometry.map(pt => [pt.lat, pt.lon]);
                } else if (el.members) {
                  el.members.forEach(m => {
                    if (m.geometry) coords.push(...m.geometry.map(pt => [pt.lat, pt.lon]));
                  });
                }
                if (coords.length >= 3) {
                  const isInside = isPointInPolygon([lat, lng], coords);
                  if (isInside) {
                    score += 20;
                  } else {
                    score += 5;
                  }
                }
              }
            }

            if (score >= 10 && hasGeom) {
              matchingElements.push(el);
            }
          });

          if (matchingElements.length === 0) {
            let bestElement = null;
            let bestScore = -1;
            ovData.elements.forEach(el => {
              let score = 0;
              const elName = (el.tags?.name || '').toLowerCase();
              if (elName) {
                words.forEach(w => {
                  if (elName.includes(w)) score += 10;
                });
              }
              const hasGeom = el.geometry || (el.members && el.members.some(m => m.geometry));
              if (hasGeom) score += 1;

              if (!isProbablyPark && hasGeom) {
                const tags = el.tags || {};
                const isRes = tags.landuse === 'residential' || 
                              tags.place === 'neighbourhood' || 
                              tags.place === 'suburb' || 
                              tags.place === 'quarter';
                if (isRes) {
                  let coords = [];
                  if (el.geometry) {
                    coords = el.geometry.map(pt => [pt.lat, pt.lon]);
                  } else if (el.members) {
                    el.members.forEach(m => {
                      if (m.geometry) coords.push(...m.geometry.map(pt => [pt.lat, pt.lon]));
                    });
                  }
                  if (coords.length >= 3) {
                    const isInside = isPointInPolygon([lat, lng], coords);
                    if (isInside) {
                      score += 20;
                    } else {
                      score += 5;
                    }
                  }
                }
              }

              if (score > bestScore && hasGeom) {
                bestScore = score;
                bestElement = el;
              }
            });
            if (bestElement) {
              matchingElements.push(bestElement);
            }
          }

          let polyList = [];
          let isNeighborhoodOverpass = isNeighborhood || matchingElements.some(el => {
            const tags = el.tags || {};
            return tags.place === 'neighbourhood' || 
                   tags.place === 'suburb' || 
                   tags.place === 'quarter' || 
                   tags.landuse === 'residential';
          });

          matchingElements.forEach(el => {
            if (el.geometry && el.geometry.length >= 3) {
              polyList.push(el.geometry.map(pt => [pt.lat, pt.lon]));
            } else if (el.members) {
              el.members.forEach(member => {
                if (member.role !== 'inner' && member.geometry && member.geometry.length >= 3) {
                  polyList.push(member.geometry.map(pt => [pt.lat, pt.lon]));
                }
              });
            }
          });

          if (polyList.length > 0) {
            // Apply getConvexHull if it is classified as neighborhood OR has multiple disjoint shapes
            geofencePolygon = (isNeighborhoodOverpass || polyList.length > 1) ? getConvexHull(polyList.flat()) : polyList[0];
          }
        }
      } catch (ovErr) {
        console.warn("Overpass boundary search failed:", ovErr);
      }

      // If Overpass search failed or returned nothing matching, fall back to Nominatim's geojson boundary
      if (!geofencePolygon && nominatimPolygon) {
        geofencePolygon = nominatimPolygon;
      }

      if (!geofencePolygon) {
        // Fallback: generate a square predicted polygon centered at lat, lng
        const offset = 0.005; // ~500m
        geofencePolygon = [
          [lat - offset, lng - offset],
          [lat + offset, lng - offset],
          [lat + offset, lng + offset],
          [lat - offset, lng + offset]
        ];
      }
      
      document.getElementById('park-lat').value = lat;
      document.getElementById('park-lng').value = lng;
      window.lastPredictedPolygon = geofencePolygon;
      
    } catch (err) {
      console.warn("Geofence prediction failed:", err);
      let lat = parseFloat(document.getElementById('park-lat').value) || 37.3387;
      let lng = parseFloat(document.getElementById('park-lng').value) || -76.7865;
      const offset = 0.005;
      window.lastPredictedPolygon = [
        [lat - offset, lng - offset],
        [lat + offset, lng - offset],
        [lat + offset, lng + offset],
        [lat - offset, lng + offset]
      ];
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  }
  
  if (isCreatingNew) {
    await createNewItem();
  } else {
    updateExistingItem();
    if (currentTab === 'parks' && window.lastPredictedPolygon) {
      await autoGenerateAllParkFeatures(activeItemId);
    }
  }

  saveState();
  
  // Refresh active group dropdown and navigation
  populateGroupSelector();
  renderNavigation();

  renderListColumn(searchInput.value.trim().toLowerCase());
  
  // Reselect or close
  isCreatingNew = false;
  renderEditor();
  alert("Configuration saved successfully!");
}

async function createNewItem() {
  const newId = `item-${Date.now()}`;
  
  switch (currentTab) {
    case 'groups':
      const newGroup = {
        id: newId,
        name: document.getElementById('group-name').value.trim(),
        owner_id: 'demo-uuid-1234',
        max_locations: parseInt(document.getElementById('group-max-loc').value, 10) || 5,
        max_users: 5,
        points_enabled: document.getElementById('group-points').checked,
        rewards_inst: document.getElementById('group-instructions').value.trim(),
        subscription_plan: 'GreenSpace Starter Plan',
        total_pts: 0,
        parks: []
      };
      parkGroups.push(newGroup);
      activeItemId = newId;
      break;
      
    case 'parks':
      const newPark = {
        id: String(Date.now()),
        name: document.getElementById('park-name').value.trim(),
        city: document.getElementById('park-city').value.trim(),
        state: document.getElementById('park-state').value.trim(),
        zip_code: parseInt(document.getElementById('park-zip').value, 10) || 23185,
        identifier: 'LOC-' + Math.floor(Math.random() * 1000),
        park_group_id: document.getElementById('park-group-id').value,
        lat: parseFloat(document.getElementById('park-lat').value) || 37.3387,
        lng: parseFloat(document.getElementById('park-lng').value) || -76.7865,
        geofence_radius: parseInt(document.getElementById('park-geofence-radius').value, 10) || 800,
        geofence_polygon: window.lastPredictedPolygon || null,
        assigned_staff: Array.from(document.querySelectorAll('input[name="park-staff-assignment"]:checked')).map(el => el.value)
      };
      parks.push(newPark);
      // Link to group
      const targetGroup = parkGroups.find(g => g.id === newPark.park_group_id);
      if (targetGroup) {
        if (!targetGroup.parks) targetGroup.parks = [];
        targetGroup.parks.push(newPark.id);
      }
      activeItemId = newPark.id;
      
      // Auto-generate features since geofence is now predicted and saved
      if (newPark.geofence_polygon) {
        return autoGenerateAllParkFeatures(newPark.id);
      }
      break;
      
    case 'categories':
      const catVal = document.getElementById('category-name').value.trim();
      const catGroupId = document.getElementById('category-group-id').value;
      const catScope = document.getElementById('category-scope').value;
      const catParkId = catScope === 'park' ? document.getElementById('category-park-id').value : null;
      
      const newCat = {
        id: 'cat-' + Date.now(),
        name: catVal,
        park_group_id: catGroupId,
        park_id: catParkId
      };
      categories.push(newCat);
      activeItemId = newCat.id;
      break;
      
    case 'greencodes':
      let gcId = document.getElementById('greencode-id-input').value.trim();
      if (!gcId) {
        let idx = 1;
        while (greenCodes.some(g => String(g.id) === `gc-${idx}`)) {
          idx++;
        }
        gcId = `gc-${idx}`;
      } else {
        // Enforce uniqueness if user typed something custom
        if (greenCodes.some(g => String(g.id) === String(gcId))) {
          alert(`Error: GreenCode ID "${gcId}" is already in use. Please enter a different one or leave blank to auto-generate.`);
          return;
        }
      }

      const newGC = {
        id: gcId,
        code: document.getElementById('greencode-code').value.trim(),
        name: document.getElementById('greencode-name').value.trim(),
        park_id: document.getElementById('greencode-park-id').value,
        lat: parseFloat(document.getElementById('greencode-lat').value) || 37.3387,
        lng: parseFloat(document.getElementById('greencode-lng').value) || -76.7865
      };
      greenCodes.push(newGC);
      activeItemId = newGC.id;
      break;
      
    case 'staff':
      const newStaff = {
        id: newId,
        full_name: document.getElementById('staff-name').value.trim(),
        email: document.getElementById('staff-email').value.trim(),
        park_group_id: document.getElementById('staff-group-id').value,
        role: document.getElementById('staff-role').value
      };
      staff.push(newStaff);
      activeItemId = newId;
      break;
      
    case 'rewards':
      const newReward = {
        id: newId,
        name: document.getElementById('reward-name').value.trim(),
        cost: parseInt(document.getElementById('reward-cost').value, 10) || 50,
        park_group_id: document.getElementById('reward-group-id').value,
        available: document.getElementById('reward-available').checked
      };
      rewards.push(newReward);
      activeItemId = newId;
      break;
  }
}

function updateExistingItem() {
  switch (currentTab) {
    case 'groups':
      const group = parkGroups.find(g => g.id === activeItemId);
      if (group) {
        group.name = document.getElementById('group-name').value.trim();
        group.points_enabled = document.getElementById('group-points').checked;
        group.rewards_inst = document.getElementById('group-instructions').value.trim();
        group.max_locations = parseInt(document.getElementById('group-max-loc').value, 10) || 5;
      }
      break;
      
    case 'parks':
      const park = parks.find(p => String(p.id) === String(activeItemId));
      if (park) {
        const nameInput = document.getElementById('park-name');
        if (nameInput) park.name = nameInput.value.trim();
        
        const cityInput = document.getElementById('park-city');
        if (cityInput) park.city = cityInput.value.trim();
        
        const stateInput = document.getElementById('park-state');
        if (stateInput) park.state = stateInput.value.trim();
        
        const zipInput = document.getElementById('park-zip');
        if (zipInput) park.zip_code = parseInt(zipInput.value, 10) || 23185;
        
        const latInput = document.getElementById('park-lat');
        if (latInput) park.lat = parseFloat(latInput.value) || 37.3387;
        
        const lngInput = document.getElementById('park-lng');
        if (lngInput) park.lng = parseFloat(lngInput.value) || -76.7865;
        
        const gfRadiusInput = document.getElementById('park-geofence-radius');
        if (gfRadiusInput) {
          park.geofence_radius = parseInt(gfRadiusInput.value, 10) || 800;
        }

        if (window.lastPredictedPolygon) {
          park.geofence_polygon = window.lastPredictedPolygon;
        }

        const staffChecks = document.querySelectorAll('input[name="park-staff-assignment"]');
        if (staffChecks.length > 0) {
          park.assigned_staff = Array.from(document.querySelectorAll('input[name="park-staff-assignment"]:checked')).map(el => el.value);
        }
      }
      break;
      
    case 'categories':
      const catObj = categories.find(c => c.id === activeItemId);
      if (catObj) {
        const catScope = document.getElementById('category-scope').value;
        const oldName = catObj.name;
        const newName = document.getElementById('category-name').value.trim();
        catObj.name = newName;
        catObj.park_group_id = document.getElementById('category-group-id').value;
        catObj.park_id = catScope === 'park' ? document.getElementById('category-park-id').value : null;

        // Update reports category too
        reports.forEach(r => {
          if (r.type === oldName) r.type = newName;
        });
      }
      break;
      
    case 'greencodes':
      const gc = greenCodes.find(g => g.id === activeItemId);
      if (gc) {
        gc.code = document.getElementById('greencode-code').value.trim();
        gc.name = document.getElementById('greencode-name').value.trim();
        gc.park_id = document.getElementById('greencode-park-id').value;
        gc.lat = parseFloat(document.getElementById('greencode-lat').value) || 37.3387;
        gc.lng = parseFloat(document.getElementById('greencode-lng').value) || -76.7865;
      }
      break;
      
    case 'staff':
      const staffMember = staff.find(s => s.id === activeItemId);
      if (staffMember) {
        staffMember.full_name = document.getElementById('staff-name').value.trim();
        staffMember.email = document.getElementById('staff-email').value.trim();
        staffMember.park_group_id = document.getElementById('staff-group-id').value;
        staffMember.role = document.getElementById('staff-role').value;
      }
      break;
      
    case 'rewards':
      const reward = rewards.find(r => r.id === activeItemId);
      if (reward) {
        reward.name = document.getElementById('reward-name').value.trim();
        reward.cost = parseInt(document.getElementById('reward-cost').value, 10) || 50;
        reward.park_group_id = document.getElementById('reward-group-id').value;
        reward.available = document.getElementById('reward-available').checked;
      }
      break;
  }
}

function handleDelete() {
  if (!confirm("Are you sure you want to delete this configuration? This cannot be undone.")) return;

  switch (currentTab) {
    case 'groups':
      parkGroups = parkGroups.filter(g => g.id !== activeItemId);
      break;
    case 'parks':
      parks = parks.filter(p => String(p.id) !== String(activeItemId));
      break;
    case 'categories':
      categories = categories.filter(c => c.id !== activeItemId);
      break;
    case 'greencodes':
      greenCodes = greenCodes.filter(g => g.id !== activeItemId);
      break;
    case 'staff':
      staff = staff.filter(s => s.id !== activeItemId);
      break;
    case 'rewards':
      rewards = rewards.filter(r => r.id !== activeItemId);
      break;
  }

  saveState();
  loadTab(currentTab);
  alert("Configuration deleted successfully.");
}

let activeParkWorkspaceTab = 'general'; // 'general', 'staff', 'categories', 'greencodes'

function getParkWorkspaceHtml(park) {
  if (!park) return '';
  
  const tabButton = (tabName, icon, label) => `
    <button type="button" class="btn ${activeParkWorkspaceTab === tabName ? 'btn-primary' : 'btn-secondary'}" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-md); display:flex; align-items:center; gap:4px;" onclick="setParkWorkspaceTab('${tabName}')">
      <span class="material-symbols-rounded" style="font-size: 14px;">${icon}</span>
      <span>${label}</span>
    </button>
  `;

  let tabContentHtml = '';
  if (activeParkWorkspaceTab === 'general') {
    const cachedUserStr = localStorage.getItem('greenspace_user');
    const loggedInUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    const isAdmin = loggedInUser && (loggedInUser.email === 'bpmchose@gmail.com' || loggedInUser.email === 'bpmchose@outlook.com' || loggedInUser.role === 'Park Admin');
    
    const hiddenFields = `
      <input type="hidden" id="park-lat" value="${park.lat || 37.3387}">
      <input type="hidden" id="park-lng" value="${park.lng || -76.7865}">
      <input type="hidden" id="park-geofence-radius" value="${park.geofence_radius || 800}">
    `;

    const editBtn = isAdmin ? `
      <button type="button" class="btn btn-secondary" style="margin-top: 8px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; font-size: 0.8rem; background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32;" onclick="window.location.href='dashboard.html?editpark=${park.id}'">
        <span class="material-symbols-rounded" style="font-size: 16px;">edit_square</span>
        <span>Edit Geofence in Map Editor</span>
      </button>
    ` : '';

    const geofenceViewer = `
      <div class="form-group">
        <label style="font-weight: 700; color: var(--color-primary); display:block; margin-bottom:8px;">Geofence Area Boundary</label>
        <div id="settings-geofence-map" style="height: 220px; width: 100%; border-radius: var(--radius-md); border: 1px solid var(--neutral-gray-border); z-index: 1;"></div>
        ${editBtn}
      </div>
    `;

    tabContentHtml = `
      <div class="form-group">
        <label>Park Name</label>
        <input type="text" id="park-name" class="form-control" value="${park.name}" required>
      </div>
      <div class="form-group">
        <label>City</label>
        <input type="text" id="park-city" class="form-control" value="${park.city}" required>
      </div>
      <div class="form-group">
        <label>State</label>
        <input type="text" id="park-state" class="form-control" value="${park.state}" required>
      </div>
      <div class="form-group">
        <label>Zip Code</label>
        <input type="number" id="park-zip" class="form-control" value="${park.zip_code || ''}" required>
      </div>
      ${hiddenFields}
      ${geofenceViewer}
    `;
  } else if (activeParkWorkspaceTab === 'staff') {
    const groupStaff = staff.filter(s => String(s.park_group_id) === String(park.park_group_id));
    const assigned = park.assigned_staff || [];
    
    if (groupStaff.length === 0) {
      tabContentHtml = `<p style="font-size:0.85rem; color:var(--color-text-muted); font-style:italic;">No staff members belong to this Park Group yet. Create some in the Staff tab.</p>`;
    } else {
      tabContentHtml = `
        <label style="font-weight: 700; color: var(--color-primary); display:block; margin-bottom:12px;">Assign Staff Members to Patrol this Park</label>
        <div style="border: 1px solid var(--neutral-gray-border); border-radius: var(--radius-md); padding:16px; background:var(--bg-canvas); max-height: 250px; overflow-y: auto;">
          ${groupStaff.map(s => `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <input type="checkbox" name="park-staff-assignment" value="${s.id}" id="chk-staff-${s.id}" style="width:16px; height:16px; cursor:pointer;" ${assigned.includes(s.id) ? 'checked' : ''}>
              <label for="chk-staff-${s.id}" style="margin-bottom:0; cursor:pointer; font-size:0.875rem;">${s.full_name} (${s.email})</label>
            </div>
          `).join('')}
        </div>
      `;
    }
  } else if (activeParkWorkspaceTab === 'categories') {
    const parkCats = categories.filter(c => String(c.park_id) === String(park.id));
    tabContentHtml = `
      <label style="font-weight: 700; color: var(--color-primary); display:block; margin-bottom:12px;">Park-Specific Categories</label>
      <div style="display:flex; gap:8px; margin-bottom:16px;">
        <input type="text" id="new-park-cat-name" class="form-control" placeholder="Add custom category (e.g. Broken Fence)..." style="height:38px; flex-grow:1;">
        <button type="button" class="btn btn-primary" onclick="addParkSpecificCategory('${park.id}')" style="height:38px; display:inline-flex; align-items:center; gap:4px; padding: 0 16px;">
          <span class="material-symbols-rounded" style="font-size:16px;">add</span> Add
        </button>
      </div>
      <div style="border: 1px solid var(--neutral-gray-border); border-radius: var(--radius-md); background:var(--bg-canvas); max-height: 250px; overflow-y: auto;">
        ${parkCats.length === 0 ? `<p style="font-size:0.85rem; padding:16px; color:var(--color-text-muted); text-align:center; font-style:italic;">No custom park categories defined yet.</p>` : `
          <table style="width:100%; border-collapse:collapse; font-size:0.875rem;">
            ${parkCats.map(c => `
              <tr style="border-bottom:1px solid var(--neutral-gray-border);">
                <td style="padding:10px 16px; font-weight:600;">${c.name}</td>
                <td style="padding:10px 16px; text-align:right;">
                  <button type="button" class="btn btn-secondary" onclick="deleteParkSpecificCategory('${c.id}', '${park.id}')" style="padding:4px 8px; font-size:0.75rem; color:var(--status-destructive); border-color:var(--status-destructive); background:none;">Delete</button>
                </td>
              </tr>
            `).join('')}
          </table>
        `}
      </div>
    `;
  } else if (activeParkWorkspaceTab === 'greencodes') {
    const parkGCs = greenCodes.filter(gc => String(gc.park_id) === String(park.id));
    tabContentHtml = `
      <label style="font-weight: 700; color: var(--color-primary); display:block; margin-bottom:12px;">Park GreenCodes</label>
      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; padding:16px; background:var(--bg-canvas); border-radius:var(--radius-md); border:1px solid var(--neutral-gray-border);">
        <h4 style="font-size:0.9rem; font-weight:700; margin:0;">Create a New GreenCode</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.75rem;">Label Name (e.g. Playground)</label>
            <input type="text" id="new-gc-name" class="form-control" placeholder="e.g. Visitor Center" style="height:36px;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.75rem;">Custom ID (e.g. gc-5)</label>
            <input type="text" id="new-gc-custom-id" class="form-control" placeholder="Leave blank to auto-generate" style="height:36px;">
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.75rem;">Latitude Coordinates</label>
            <input type="number" step="any" id="new-gc-lat" class="form-control" value="${park.lat || 37.3387}" style="height:36px;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.75rem;">Longitude Coordinates</label>
            <input type="number" step="any" id="new-gc-lng" class="form-control" value="${park.lng || -76.7865}" style="height:36px;">
          </div>
        </div>
        <button type="button" class="btn btn-primary" onclick="addParkGreenCode('${park.id}')" style="height:38px; display:inline-flex; align-items:center; justify-content:center; gap:4px; margin-top:4px;">
          <span class="material-symbols-rounded" style="font-size:16px;">add</span> Add GreenCode
        </button>
      </div>

      <div style="border: 1px solid var(--neutral-gray-border); border-radius: var(--radius-md); background:white; max-height: 350px; overflow-y: auto;">
        ${parkGCs.length === 0 ? `<p style="font-size:0.85rem; padding:16px; color:var(--color-text-muted); text-align:center; font-style:italic;">No GreenCodes registered for this park.</p>` : `
          <div style="display:flex; flex-direction:column;">
            ${parkGCs.map(gc => {
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://grsp.co/report/${gc.park_id}/${gc.id}`;
              return `
                <div style="display:flex; align-items:center; gap:16px; padding:16px; border-bottom:1px solid var(--neutral-gray-border);">
                  <img src="${qrUrl}" alt="GreenCode QR" style="border:1px solid var(--neutral-gray-border); width:70px; height:70px; background:white;" />
                  <div style="display:flex; flex-direction:column; gap:2px; flex-grow:1;">
                    <span style="font-weight:700; font-size:0.9rem;">${gc.name}</span>
                    <span style="font-size:0.75rem; color:var(--color-text-muted); font-family:monospace;">ID: ${gc.id} • Code: ${gc.code}</span>
                    <span style="font-size:0.7rem; color:var(--color-text-secondary); word-break:break-all;">grsp.co/report/${gc.park_id}/${gc.id}</span>
                  </div>
                  <button type="button" class="btn btn-secondary" onclick="deleteParkGreenCode('${gc.id}', '${park.id}')" style="padding:6px 10px; font-size:0.75rem; color:var(--status-destructive); border-color:var(--status-destructive); background:none; flex-shrink:0;">Delete</button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  return `
    <div style="display:flex; gap:8px; margin-bottom:24px; border-bottom:1px solid var(--neutral-gray-border); padding-bottom:16px; flex-wrap:wrap;">
      ${tabButton('general', 'forest', 'Info')}
      ${tabButton('staff', 'badge', 'Staff assignments')}
      ${tabButton('categories', 'category', 'Park categories')}
      ${tabButton('greencodes', 'qr_code_2', 'GreenCodes')}
    </div>
    
    <div id="park-workspace-tab-content">
      ${tabContentHtml}
    </div>
  `;
}

window.setParkWorkspaceTab = function(tabName) {
  activeParkWorkspaceTab = tabName;
  renderEditor();
};

window.addParkSpecificCategory = function(parkId) {
  const input = document.getElementById('new-park-cat-name');
  if (input && input.value.trim()) {
    const name = input.value.trim();
    const newCat = {
      id: 'cat-' + Date.now(),
      name,
      park_group_id: activeParkGroupId,
      park_id: parkId
    };
    categories.push(newCat);
    saveState();
    renderEditor();
    alert("Park-specific category added successfully!");
  }
};

window.deleteParkSpecificCategory = function(catId, parkId) {
  if (confirm("Are you sure you want to delete this park-specific category?")) {
    categories = categories.filter(c => c.id !== catId);
    saveState();
    renderEditor();
  }
};

window.addParkGreenCode = function(parkId) {
  const nameInput = document.getElementById('new-gc-name');
  const customIdInput = document.getElementById('new-gc-custom-id');
  const latInput = document.getElementById('new-gc-lat');
  const lngInput = document.getElementById('new-gc-lng');
  
  if (nameInput && nameInput.value.trim()) {
    const name = nameInput.value.trim();
    let gcId = customIdInput.value.trim();
    if (!gcId) {
      let idx = 1;
      while (greenCodes.some(g => String(g.id) === `gc-${idx}`)) {
        idx++;
      }
      gcId = `gc-${idx}`;
    }
    
    const lat = parseFloat(latInput.value) || 37.3387;
    const lng = parseFloat(lngInput.value) || -76.7865;
    
    const newGC = {
      id: gcId,
      code: 'LOC-' + name.toUpperCase().replace(/\\s+/g, '-').slice(0, 10) + '-' + Math.floor(Math.random() * 100),
      name,
      park_id: parkId,
      lat,
      lng
    };
    
    greenCodes.push(newGC);
    saveState();
    renderEditor();
    alert("GreenCode added successfully!");
  }
};

window.deleteParkGreenCode = function(gcId, parkId) {
  if (confirm("Are you sure you want to delete this GreenCode?")) {
    greenCodes = greenCodes.filter(gc => gc.id !== gcId);
    saveState();
    renderEditor();
  }
};

window.initSettingsGeofenceMap = function(park) {
  const mapDiv = document.getElementById('settings-geofence-map');
  if (!mapDiv || !park) return;
  
  // Create small Map instance
  const map = L.map('settings-geofence-map', {
    zoomControl: false,
    attributionControl: false
  });
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  // Check if geofence polygon exists
  if (park.geofence_polygon && park.geofence_polygon.length >= 3) {
    const polygon = L.polygon(park.geofence_polygon, {
      color: '#e65100',
      fillColor: '#ffe0b2',
      fillOpacity: 0.4,
      weight: 3
    }).addTo(map);
    map.fitBounds(polygon.getBounds());
  } else {
    // Fallback to center marker
    const lat = park.lat || 37.3387;
    const lng = park.lng || -76.7865;
    L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 14);
  }
};

function getConvexHull(points) {
  if (points.length <= 3) return points;

  const sorted = points.slice().sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  const lower = [];
  for (let i = 0; i < sorted.length; i++) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], sorted[i]) <= 0) {
      lower.pop();
    }
    lower.push(sorted[i]);
  }

  const upper = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], sorted[i]) <= 0) {
      upper.pop();
    }
    upper.push(sorted[i]);
  }

  lower.pop();
  upper.pop();

  return lower.concat(upper);
}

function crossProduct(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function isPointInPolygon(point, vs) {
  if (!vs || vs.length === 0) return false;
  if (Array.isArray(vs[0][0])) {
    return vs.some(subPoly => isPointInPolygon(point, subPoly));
  }
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function autoGenerateAllParkFeatures(parkId) {
  const park = parks.find(p => String(p.id) === String(parkId));
  if (!park || !park.geofence_polygon || park.geofence_polygon.length < 3) return;

  const flatCoords = Array.isArray(park.geofence_polygon[0][0]) ? park.geofence_polygon.flat() : park.geofence_polygon;
  let lats = flatCoords.map(p => p[0]);
  let lngs = flatCoords.map(p => p[1]);
  let south = Math.min(...lats);
  let north = Math.max(...lats);
  let west = Math.min(...lngs);
  let east = Math.max(...lngs);

  // Consolidated Overpass query
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(
    way[highway~"footway|path|track|pedestrian|cycleway"](${south},${west},${north},${east});
    node[amenity~"bench|toilets|drinking_water|shelter|picnic_table|parking|waste_basket|bicycle_parking|cafe|restaurant|fountain"](${south},${west},${north},${east});
    way[amenity~"parking|fountain"](${south},${west},${north},${east});
    node[tourism~"viewpoint|information|artwork|picnic_site|attraction"](${south},${west},${north},${east});
    way[tourism~"picnic_site|attraction"](${south},${west},${north},${east});
    node[leisure~"playground|firepit|swimming_pool|dog_park|sports_centre|pitch|track|wildlife_hide"](${south},${west},${north},${east});
    way[leisure~"playground|swimming_pool|dog_park|sports_centre|pitch|track"](${south},${west},${north},${east});
    node[historic~"memorial|monument|landmark|ruins|archaeological_site|wayside_shrine"](${south},${west},${north},${east});
    way[historic~"ruins|archaeological_site"](${south},${west},${north},${east});
    node[natural~"water|wetland|spring"](${south},${west},${north},${east});
    way[natural~"water|wetland"](${south},${west},${north},${east});
    way[waterway~"riverbank|pond|stream|canal"](${south},${west},${north},${east});
  );out geom;`;

  return fetch(overpassUrl)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.elements) return;

      const customTrails = (JSON.parse(localStorage.getItem('gs_custom_trails')) || []).filter(t => String(t.park_id) !== String(parkId));
      const customPois = (JSON.parse(localStorage.getItem('gs_custom_pois')) || []).filter(p => String(p.park_id) !== String(parkId));
      const customShapes = (JSON.parse(localStorage.getItem('gs_custom_shapes')) || []).filter(s => String(s.park_id) !== String(parkId));

      let addedTrails = 0;
      let addedPois = 0;
      let addedShapes = 0;

      function mergeLineSegments(segments) {
        if (segments.length === 0) return [];
        let remaining = segments.map(s => [...s]);
        let merged = [];
        function dist(p1, p2) {
          let dLat = p1[0] - p2[0];
          let dLng = p1[1] - p2[1];
          return Math.sqrt(dLat * dLat + dLng * dLng);
        }
        while (remaining.length > 0) {
          let current = remaining.shift();
          let extended = true;
          while (extended) {
            extended = false;
            for (let i = 0; i < remaining.length; i++) {
              let other = remaining[i];
              let dStartStart = dist(current[0], other[0]);
              let dStartEnd = dist(current[0], other[other.length - 1]);
              let dEndStart = dist(current[current.length - 1], other[0]);
              let dEndEnd = dist(current[current.length - 1], other[other.length - 1]);
              const threshold = 0.0003;
              if (dEndStart < threshold) {
                current = current.concat(other.slice(1));
                remaining.splice(i, 1);
                extended = true;
                break;
              } else if (dStartEnd < threshold) {
                current = other.concat(current.slice(1));
                remaining.splice(i, 1);
                extended = true;
                break;
              } else if (dStartStart < threshold) {
                current = other.slice().reverse().concat(current.slice(1));
                remaining.splice(i, 1);
                extended = true;
                break;
              } else if (dEndEnd < threshold) {
                current = current.concat(other.slice().reverse().slice(1));
                remaining.splice(i, 1);
                extended = true;
                break;
              }
            }
          }
          merged.push(current);
        }
        if (merged.length === 1) return merged[0];
        return merged;
      }

      const namedGroups = {};
      const unnamedWays = [];

      data.elements.forEach(element => {
        // 1. Check if it's a custom shape (water or parking)
        const isWater = element.tags?.natural === 'water' || element.tags?.waterway || (element.tags?.water !== undefined);
        const isParking = element.tags?.amenity === 'parking';

        if (element.geometry && element.geometry.length >= 3 && (isWater || isParking)) {
          let wayCoords = element.geometry.map(pt => [pt.lat, pt.lon]);
          let isInside = wayCoords.some(coord => isPointInPolygon(coord, park.geofence_polygon));
          if (isInside) {
            addedShapes++;
            const type = isParking ? 'parking' : 'water';
            const defaultName = type === 'parking' ? `${park.name} Parking Lot ${addedShapes}` : `${park.name} Water Feature ${addedShapes}`;
            const name = element.tags?.name || defaultName;
            customShapes.push({
              id: 'shape-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedShapes,
              park_id: parkId,
              name: name,
              type: type,
              coords: wayCoords
            });
          }
          return;
        }

        // 2. Check if it's a trail
        const isTrail = element.tags?.highway && ['footway', 'path', 'track', 'pedestrian', 'cycleway'].includes(element.tags.highway);
        if (isTrail && element.geometry && element.geometry.length >= 2) {
          if (element.tags?.service === 'alley' || element.tags?.highway === 'service') return;
          let wayCoords = element.geometry.map(pt => [pt.lat, pt.lon]);
          let isInside = wayCoords.some(coord => isPointInPolygon(coord, park.geofence_polygon));
          if (isInside) {
            const name = element.tags?.name;
            if (name) {
              if (!namedGroups[name]) namedGroups[name] = [];
              namedGroups[name].push(wayCoords);
            } else {
              unnamedWays.push(wayCoords);
            }
          }
          return;
        }

        // 3. Otherwise, treat it as a POI
        let lat = element.lat;
        let lon = element.lon;
        if (!lat && element.geometry && element.geometry.length > 0) {
          let sumLat = 0, sumLon = 0;
          element.geometry.forEach(pt => {
            sumLat += pt.lat;
            sumLon += pt.lon;
          });
          lat = sumLat / element.geometry.length;
          lon = sumLon / element.geometry.length;
        }

        if (lat && lon) {
          let isInside = isPointInPolygon([lat, lon], park.geofence_polygon);
          if (isInside) {
            addedPois++;
            let typeName = "Point of Interest";
            if (element.tags?.historic) typeName = element.tags.historic.replace('_', ' ');
            else if (element.tags?.amenity) typeName = element.tags.amenity.replace('_', ' ');
            else if (element.tags?.tourism) typeName = element.tags.tourism.replace('_', ' ');
            else if (element.tags?.leisure) typeName = element.tags.leisure.replace('_', ' ');
            else if (element.tags?.natural) typeName = element.tags.natural.replace('_', ' ');
            else if (element.tags?.waterway) typeName = element.tags.waterway.replace('_', ' ');

            typeName = typeName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            const name = element.tags?.name || `${park.name} ${typeName}`;
            const desc = element.tags?.description || `Auto-discovered ${typeName} via OpenStreetMap.`;

            customPois.push({
              id: 'poi-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedPois,
              park_id: parkId,
              name: name,
              description: desc,
              lat: lat,
              lng: lon
            });
          }
        }
      });

      // Process trails named groups
      for (const name in namedGroups) {
        const mergedCoords = mergeLineSegments(namedGroups[name]);
        let totalPts = 0;
        if (Array.isArray(mergedCoords[0][0])) {
          mergedCoords.forEach(seg => totalPts += seg.length);
        } else {
          totalPts = mergedCoords.length;
        }
        const distance = (totalPts * 0.04).toFixed(1) + " miles";
        addedTrails++;
        customTrails.push({
          id: 'trail-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedTrails,
          park_id: parkId,
          name: name,
          difficulty: "Easy",
          distance: distance,
          coords: mergedCoords
        });
      }

      // Process unnamed trails
      const mergedUnnamed = mergeLineSegments(unnamedWays);
      if (mergedUnnamed.length > 0) {
        if (Array.isArray(mergedUnnamed[0][0])) {
          mergedUnnamed.forEach(coords => {
            addedTrails++;
            const name = `${park.name} Walkway ${addedTrails}`;
            const distance = (coords.length * 0.04).toFixed(1) + " miles";
            customTrails.push({
              id: 'trail-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedTrails,
              park_id: parkId,
              name: name,
              difficulty: "Easy",
              distance: distance,
              coords: coords
            });
          });
        } else {
          addedTrails++;
          const name = `${park.name} Walkway ${addedTrails}`;
          const distance = (mergedUnnamed.length * 0.04).toFixed(1) + " miles";
          customTrails.push({
            id: 'trail-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedTrails,
            park_id: parkId,
            name: name,
            difficulty: "Easy",
            distance: distance,
            coords: mergedUnnamed
          });
        }
      }

      if (addedTrails === 0) {
        let trailCoords = [];
        let sumLat = 0, sumLng = 0;
        const mainPoly = Array.isArray(park.geofence_polygon[0][0]) ? park.geofence_polygon[0] : park.geofence_polygon;
        mainPoly.forEach(coord => {
          sumLat += coord[0];
          sumLng += coord[1];
        });
        const cenLat = sumLat / mainPoly.length;
        const cenLng = sumLng / mainPoly.length;
        
        mainPoly.forEach(coord => {
          const lat = cenLat + (coord[0] - cenLat) * 0.65;
          const lng = cenLng + (coord[1] - cenLng) * 0.65;
          trailCoords.push([lat, lng]);
        });
        trailCoords.push(trailCoords[0]);

        customTrails.push({
          id: 'trail-' + Date.now(),
          park_id: parkId,
          name: park.name + " Internal Loop",
          difficulty: "Easy",
          distance: "1.2 miles",
          coords: trailCoords
        });
        addedTrails++;
      }

      localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
      localStorage.setItem('gs_custom_pois', JSON.stringify(customPois));
      localStorage.setItem('gs_custom_shapes', JSON.stringify(customShapes));
    })
    .catch(err => {
      console.warn("Failed to auto-generate park features, falling back:", err);
      const customTrails = (JSON.parse(localStorage.getItem('gs_custom_trails')) || []).filter(t => String(t.park_id) !== String(parkId));
      let trailCoords = [];
      let sumLat = 0, sumLng = 0;
      const mainPoly = Array.isArray(park.geofence_polygon[0][0]) ? park.geofence_polygon[0] : park.geofence_polygon;
      mainPoly.forEach(coord => {
        sumLat += coord[0];
        sumLng += coord[1];
      });
      const cenLat = sumLat / mainPoly.length;
      const cenLng = sumLng / mainPoly.length;
      
      mainPoly.forEach(coord => {
        const lat = cenLat + (coord[0] - cenLat) * 0.65;
        const lng = cenLng + (coord[1] - cenLng) * 0.65;
        trailCoords.push([lat, lng]);
      });
      trailCoords.push(trailCoords[0]);

      customTrails.push({
        id: 'trail-' + Date.now(),
        park_id: parkId,
        name: park.name + " Internal Loop",
        difficulty: "Easy",
        distance: "1.2 miles",
        coords: trailCoords
      });
      localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
    });
}
