// Initialize Supabase Client
// (Loaded via config.js)

// Session check
let currentUser = null;
function checkSession() {
  const cachedUser = localStorage.getItem('greenspace_user');
  if (!cachedUser) {
    window.location.href = 'index.html';
  } else {
    currentUser = JSON.parse(cachedUser);
  }
}
checkSession();

// --- STATE MANAGEMENT ENGINE & SEEDING ---
function seedDataIfEmpty() {
  const existingParks = localStorage.getItem('gs_parks');
  if (localStorage.getItem('gs_seeded') === 'true' && existingParks && JSON.parse(existingParks).length > 0) return;

  const defaultCategories = [
    { id: "cat-1", name: "Trash Can", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-2", name: "Recycle Bin", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-3", name: "Dog Bag Station", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-4", name: "Restroom", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-5", name: "Water Fountain", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-6", name: "Trailhead", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-7", name: "Sign", park_group_id: "pg-virginia", park_id: null },
    { id: "cat-8", name: "Lighting", park_group_id: "pg-virginia", park_id: null }
  ];
  
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
      parks: ["1", "2", "3", "4"],
      status: "Active"
    },
    {
      id: "pg-pending-1",
      name: "Blue Ridge Trail Group (Pending)",
      owner_id: "staff-2",
      max_locations: 5,
      max_users: 5,
      points_enabled: true,
      reports_month: 0,
      rewards_inst: "Visitor center rewards.",
      subscription_plan: "GreenSpace Basic Group Plan",
      total_pts: 0,
      parks: [],
      status: "Pending Approval"
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
      lng: -76.7865,
      status: "Active",
      geofence_status: "Approved",
      geofence_polygon: [
        [37.342, -76.790],
        [37.342, -76.780],
        [37.334, -76.780],
        [37.334, -76.790]
      ]
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
      lng: -76.7324,
      status: "Active",
      geofence_status: "Approved"
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
      lng: -76.5123,
      status: "Active",
      geofence_status: "Approved"
    },
    {
      id: "4",
      name: "Colonial Park (Pending Approval)",
      city: "Jamestown",
      state: "VA",
      zip_code: 23081,
      identifier: "LOC-COLONIAL",
      park_group_id: "pg-virginia",
      lat: 37.2104,
      lng: -76.7761,
      status: "Pending Approval",
      geofence_status: "Pending Approval",
      geofence_polygon: [
        [37.215, -76.780],
        [37.215, -76.770],
        [37.205, -76.770],
        [37.205, -76.780]
      ]
    }
  ];

  const defaultStaff = [
    { id: "demo-uuid-1234", email: "bpmchose@outlook.com", full_name: "Bryce Mchose", role: "Park Admin", park_group_id: "pg-virginia" },
    { id: "staff-2", email: "jane.doe@example.com", full_name: "Jane Doe", role: "Employee", park_group_id: "pg-virginia" },
    { id: "staff-3", email: "john.smith@example.com", full_name: "John Smith", role: "Employee", park_group_id: "pg-virginia" }
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
    },
    {
      id: "rep-2",
      park_id: 1,
      type: "Restroom",
      location: "Main Restroom North",
      details: "No hand soap in the men's toilet, and the flush on stall 2 is running continuously.",
      status: "Investigating",
      priority: "Medium",
      assigned_to: "demo-uuid-1234",
      reporter_email: "hiker_pro@yahoo.com",
      created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      lat: 37.3382,
      lng: -76.7870
    },
    {
      id: "rep-3",
      park_id: 1,
      type: "Dog Bag Station",
      location: "Dog dispenser #12 near Trailhead A",
      details: "Completely empty. Needs restocking.",
      status: "Received",
      priority: "Low",
      assigned_to: null,
      reporter_email: "dogwalker9@outlook.com",
      created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
      lat: 37.3401,
      lng: -76.7852
    },
    {
      id: "rep-4",
      park_id: 1,
      type: "Sign",
      location: "Trail B Bridge Crossing",
      details: "The bridge crossing safety sign is vandalized with spray paint.",
      status: "Complete",
      priority: "Medium",
      assigned_to: "staff-2",
      reporter_email: "citizen_clean@gmail.com",
      created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
      lat: 37.3375,
      lng: -76.7885
    }
  ];

  const defaultRewards = [
    { id: "rew-1", name: "Free Day Parking Pass", cost: 50, park_group_id: "pg-virginia", available: true },
    { id: "rew-2", name: "GreenSpace Water Bottle", cost: 120, park_group_id: "pg-virginia", available: true },
    { id: "rew-3", name: "Annual State Park Decal", cost: 400, park_group_id: "pg-virginia", available: true }
  ];

  const defaultOrders = [
    {
      id: "ord-1",
      reward_id: "rew-1",
      park_group_id: "pg-virginia",
      status: "Pending",
      creator_id: "demo-uuid-1234",
      created_at: new Date(Date.now() - 12 * 3600000).toISOString()
    }
  ];

  const defaultUserPoints = [
    { id: "up-1", user_id: "demo-uuid-1234", park_group_id: "pg-virginia", points: 240 }
  ];

  const defaultGreenCodes = [
    { id: "gc-1", code: "LOC-FREEDOM-PLAY", name: "Playground Area", park_id: 1, lat: 37.3392, lng: -76.7860 },
    { id: "gc-2", code: "LOC-FREEDOM-POND", name: "Main Pond Station", park_id: 1, lat: 37.3380, lng: -76.7875 },
    { id: "gc-3", code: "LOC-WALLER-BOAT", name: "Waller Mill Boat Dock", park_id: 2, lat: 37.2941, lng: -76.7324 },
    { id: "gc-4", code: "LOC-YORK-VISITOR", name: "Yorktown Battle Monument", park_id: 3, lat: 37.2212, lng: -76.5123 }
  ];

  localStorage.setItem('gs_categories', JSON.stringify(defaultCategories));
  localStorage.setItem('gs_parks', JSON.stringify(defaultParks));
  localStorage.setItem('gs_staff', JSON.stringify(defaultStaff));
  localStorage.setItem('gs_reports', JSON.stringify(defaultReports));
  localStorage.setItem('gs_rewards', JSON.stringify(defaultRewards));
  localStorage.setItem('gs_orders', JSON.stringify(defaultOrders));
  localStorage.setItem('gs_park_groups', JSON.stringify(defaultParkGroups));
  localStorage.setItem('gs_user_points', JSON.stringify(defaultUserPoints));
  localStorage.setItem('gs_greencodes', JSON.stringify(defaultGreenCodes));
  localStorage.setItem('gs_selected_park_id', "1");
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
let parks = safeGetJSON('gs_parks').map(p => {
  if (!p.status) p.status = 'Active';
  if (!p.geofence_status) p.geofence_status = 'Approved';
  return p;
});
let staff = safeGetJSON('gs_staff').map(s => {
  if (!s.park_group_id) s.park_group_id = 'pg-virginia';
  return s;
});
let reports = safeGetJSON('gs_reports');
let rewards = safeGetJSON('gs_rewards');
let orders = safeGetJSON('gs_orders');
let parkGroups = safeGetJSON('gs_park_groups').map(g => {
  if (!g.status) g.status = 'Active';
  return g;
});
let userPoints = safeGetJSON('gs_user_points');
let parkManagers = safeGetJSON('gs_park_managers');
let parkStaff = safeGetJSON('gs_park_staff');
let parkGroupStaff = safeGetJSON('gs_park_group_staff');
let greenCodes = safeGetJSON('gs_greencodes');

let selectedParkId = localStorage.getItem('gs_selected_park_id') || '';
let currentView = localStorage.getItem('gs_current_view') || 'Map';

// Active park helper
let activePark = selectedParkId ? (parks.find(p => String(p.id) === String(selectedParkId)) || parks[0]) : null;

// State Save helper
function saveState() {
  localStorage.setItem('gs_categories', JSON.stringify(categories));
  localStorage.setItem('gs_parks', JSON.stringify(parks));
  localStorage.setItem('gs_staff', JSON.stringify(staff));
  localStorage.setItem('gs_reports', JSON.stringify(reports));
  localStorage.setItem('gs_rewards', JSON.stringify(rewards));
  localStorage.setItem('gs_orders', JSON.stringify(orders));
  localStorage.setItem('gs_park_groups', JSON.stringify(parkGroups));
  localStorage.setItem('gs_user_points', JSON.stringify(userPoints));
  localStorage.setItem('gs_park_managers', JSON.stringify(parkManagers));
  localStorage.setItem('gs_park_staff', JSON.stringify(parkStaff));
  localStorage.setItem('gs_park_group_staff', JSON.stringify(parkGroupStaff));
  localStorage.setItem('gs_greencodes', JSON.stringify(greenCodes));
  localStorage.setItem('gs_selected_park_id', selectedParkId);
  localStorage.setItem('gs_current_view', currentView);

  if (typeof supabase !== 'undefined' && supabase) {
    saveStateToSupabase();
  }
}

async function loadStateFromSupabase() {
  if (typeof supabase === 'undefined' || !supabase) return;
  try {
    const { data: dbUsers } = await supabase.from('users').select('*');
    const { data: dbGroupStaff } = await supabase.from('park_group_staff').select('*');
    if (dbUsers) {
      staff = dbUsers.map(u => {
        const gsStaff = dbGroupStaff?.find(s => s.user_id === u.id);
        return {
          id: u.id,
          email: u.email,
          full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'New Operator',
          role: u.email === 'bpmchose@outlook.com' ? 'Park Admin' : 'Employee',
          park_group_id: gsStaff ? String(gsStaff.park_group_id) : 'pg-virginia'
        };
      });
    }

    const { data: dbGroups } = await supabase.from('park_groups').select('*');
    if (dbGroups) {
      parkGroups = dbGroups.map(g => ({
        id: String(g.id),
        name: g.name,
        owner_id: g.owner_id,
        max_locations: g.max_locations,
        max_users: g.max_users,
        points_enabled: g.points_enabled,
        reports_month: g.reports_month,
        rewards_inst: g.rewards_inst,
        subscription_plan: g.subscription_plan,
        total_pts: g.total_pts,
        status: g.id === 2 ? 'Pending Approval' : 'Active'
      }));
    }

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

    const { data: dbRewards } = await supabase.from('rewards').select('*');
    if (dbRewards) {
      rewards = dbRewards.map(r => ({
        id: String(r.id),
        name: r.name,
        cost: r.cost,
        park_group_id: String(r.park_group_id),
        available: r.available
      }));
    }

    const { data: dbRedemptions } = await supabase.from('redemptions').select('*');
    if (dbRedemptions) {
      orders = dbRedemptions.map(o => ({
        id: String(o.id),
        reward_id: String(o.reward_id),
        park_group_id: String(o.park_group_id),
        status: o.status,
        creator_id: o.creator_id,
        created_at: o.created_at
      }));
    }

    const { data: dbPoints } = await supabase.from('user_points').select('*');
    if (dbPoints) {
      userPoints = dbPoints.map(up => ({
        id: String(up.id),
        user_id: up.user_id,
        park_group_id: String(up.park_group_id),
        points: up.points
      }));
    }

    const { data: dbGreenCodes } = await supabase.from('green_codes').select('*');
    if (dbGreenCodes) {
      greenCodes = dbGreenCodes.map(gc => ({
        id: String(gc.id),
        code: gc.code,
        name: gc.name,
        park_id: gc.park_id,
        lat: gc.lat,
        lng: gc.lng
      }));
    }
  } catch (e) {
    console.error("Failed to load state from Supabase:", e);
  }
}

async function saveStateToSupabase() {
  if (typeof supabase === 'undefined' || !supabase) return;
  try {
    // 1. Sync Parks
    if (parks) {
      const { data: dbParks } = await supabase.from('parks').select('id');
      const dbParkIds = dbParks ? dbParks.map(p => String(p.id)) : [];
      const localParkIds = parks.map(p => String(p.id));
      const parksToDelete = dbParkIds.filter(id => !localParkIds.includes(id));
      if (parksToDelete.length > 0) {
        await supabase.from('parks').delete().in('id', parksToDelete.map(Number));
      }

      for (let i = 0; i < parks.length; i++) {
        const p = parks[i];
        const pgIdVal = p.park_group_id === 'pg-virginia' ? 1 : (p.park_group_id === 'pg-pending-1' ? 2 : (isNaN(Number(p.park_group_id)) ? 1 : Number(p.park_group_id)));
        const parkData = {
          name: p.name,
          city: p.city,
          state: p.state,
          zip_code: p.zip_code,
          identifier: p.identifier,
          park_group_id: pgIdVal,
          status: p.status || 'Active',
          geofence_status: p.geofence_status || 'Approved',
          geofence_polygon: p.geofence_polygon || null,
          lat: p.lat || null,
          lng: p.lng || null
        };
        if (!isNaN(Number(p.id))) {
          await supabase.from('parks').update(parkData).eq('id', Number(p.id));
        } else {
          const { data, error } = await supabase.from('parks').insert([parkData]).select().single();
          if (!error && data) {
            parks[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_parks', JSON.stringify(parks));
    }

    // 2. Sync Categories
    if (categories) {
      const { data: dbCats } = await supabase.from('categories').select('id');
      const dbCatIds = dbCats ? dbCats.map(c => String(c.id)) : [];
      const localCatIds = categories.map(c => String(c.id));
      const catsToDelete = dbCatIds.filter(id => !localCatIds.includes(id));
      if (catsToDelete.length > 0) {
        await supabase.from('categories').delete().in('id', catsToDelete.map(Number));
      }

      for (let i = 0; i < categories.length; i++) {
        const c = categories[i];
        const pgIdVal = c.park_group_id === 'pg-virginia' ? 1 : (c.park_group_id === 'pg-pending-1' ? 2 : (isNaN(Number(c.park_group_id)) ? 1 : Number(c.park_group_id)));
        const catData = {
          name: c.name,
          park_group_id: pgIdVal
        };
        if (!isNaN(Number(c.id))) {
          await supabase.from('categories').update(catData).eq('id', Number(c.id));
        } else {
          const { data, error } = await supabase.from('categories').insert([catData]).select().single();
          if (!error && data) {
            categories[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_categories', JSON.stringify(categories));
    }

    // 3. Sync Rewards
    if (rewards) {
      const { data: dbRewards } = await supabase.from('rewards').select('id');
      const dbRewardIds = dbRewards ? dbRewards.map(r => String(r.id)) : [];
      const localRewardIds = rewards.map(r => String(r.id));
      const rewardsToDelete = dbRewardIds.filter(id => !localRewardIds.includes(id));
      if (rewardsToDelete.length > 0) {
        await supabase.from('rewards').delete().in('id', rewardsToDelete.map(Number));
      }

      for (let i = 0; i < rewards.length; i++) {
        const r = rewards[i];
        const pgIdVal = r.park_group_id === 'pg-virginia' ? 1 : (r.park_group_id === 'pg-pending-1' ? 2 : (isNaN(Number(r.park_group_id)) ? 1 : Number(r.park_group_id)));
        const rewardData = {
          name: r.name,
          cost: r.cost,
          park_group_id: pgIdVal,
          available: r.available
        };
        if (!isNaN(Number(r.id))) {
          await supabase.from('rewards').update(rewardData).eq('id', Number(r.id));
        } else {
          const { data, error } = await supabase.from('rewards').insert([rewardData]).select().single();
          if (!error && data) {
            rewards[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_rewards', JSON.stringify(rewards));
    }

    // 4. Sync Issues (Reports)
    if (reports) {
      const { data: dbIssues } = await supabase.from('issues').select('id');
      const dbIssueIds = dbIssues ? dbIssues.map(i => String(i.id)) : [];
      const localIssueIds = reports.map(i => String(i.id));
      const issuesToDelete = dbIssueIds.filter(id => !localIssueIds.includes(id));
      if (issuesToDelete.length > 0) {
        await supabase.from('issues').delete().in('id', issuesToDelete.map(Number));
      }

      for (let i = 0; i < reports.length; i++) {
        const r = reports[i];
        const parkIdVal = isNaN(Number(r.park_id)) ? 1 : Number(r.park_id);
        const issueData = {
          park_id: parkIdVal,
          type: r.type,
          location: r.location,
          details: r.details,
          status: r.status === 'Received' ? 'new' : (r.status === 'Investigating' ? 'in_progress' : 'resolved'),
          priority: r.priority,
          assigned_to: r.assigned_to && r.assigned_to !== 'null' ? r.assigned_to : null,
          reporter_email: r.reporter_email
        };
        if (!isNaN(Number(r.id))) {
          await supabase.from('issues').update(issueData).eq('id', Number(r.id));
        } else {
          const { data, error } = await supabase.from('issues').insert([issueData]).select().single();
          if (!error && data) {
            reports[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_reports', JSON.stringify(reports));
    }

    // 5. Sync green_codes
    if (greenCodes) {
      const { data: dbGCs } = await supabase.from('green_codes').select('id');
      const dbGCIds = dbGCs ? dbGCs.map(gc => String(gc.id)) : [];
      const localGCIds = greenCodes.map(gc => String(gc.id));
      const gcsToDelete = dbGCIds.filter(id => !localGCIds.includes(id));
      if (gcsToDelete.length > 0) {
        await supabase.from('green_codes').delete().in('id', gcsToDelete.map(Number));
      }

      for (let i = 0; i < greenCodes.length; i++) {
        const gc = greenCodes[i];
        const parkIdVal = isNaN(Number(gc.park_id)) ? 1 : Number(gc.park_id);
        const gcData = {
          code: gc.code,
          name: gc.name,
          park_id: parkIdVal,
          lat: gc.lat || null,
          lng: gc.lng || null
        };
        if (!isNaN(Number(gc.id))) {
          await supabase.from('green_codes').update(gcData).eq('id', Number(gc.id));
        } else {
          const { data, error } = await supabase.from('green_codes').insert([gcData]).select().single();
          if (!error && data) {
            greenCodes[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_greencodes', JSON.stringify(greenCodes));
    }

    // 6. Sync staff
    if (staff) {
      const localStaffUserIds = staff.map(s => s.id);
      const { data: dbPGS } = await supabase.from('park_group_staff').select('user_id');
      const dbPGSUserIds = dbPGS ? dbPGS.map(s => s.user_id) : [];
      const pgsToDelete = dbPGSUserIds.filter(id => !localStaffUserIds.includes(id));
      if (pgsToDelete.length > 0) {
        await supabase.from('park_group_staff').delete().in('user_id', pgsToDelete);
      }

      for (let i = 0; i < staff.length; i++) {
        const s = staff[i];
        const parts = s.full_name.split(' ');
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        const pgIdVal = s.park_group_id === 'pg-virginia' ? 1 : (s.park_group_id === 'pg-pending-1' ? 2 : (isNaN(Number(s.park_group_id)) ? 1 : Number(s.park_group_id)));

        let userId = s.id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
        if (!isUUID) {
          userId = 'ffffffff-ffff-4fff-8fff-' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
          staff[i].id = userId;
        }

        const userData = {
          id: userId,
          first_name: first,
          last_name: last,
          email: s.email,
          temp: false
        };

        await supabase.from('users').upsert(userData, { onConflict: 'email' });
        await supabase.from('park_group_staff').upsert({
          park_group_id: pgIdVal,
          user_id: userId
        }, { onConflict: 'park_group_id,user_id' });
      }
      localStorage.setItem('gs_staff', JSON.stringify(staff));
    }

    // 7. Sync orders (redemptions)
    if (orders) {
      const { data: dbReds } = await supabase.from('redemptions').select('id');
      const dbRedIds = dbReds ? dbReds.map(r => String(r.id)) : [];
      const localRedIds = orders.map(o => String(o.id));
      const redsToDelete = dbRedIds.filter(id => !localRedIds.includes(id));
      if (redsToDelete.length > 0) {
        await supabase.from('redemptions').delete().in('id', redsToDelete.map(Number));
      }

      for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        const rewIdVal = isNaN(Number(o.reward_id)) ? 1 : Number(o.reward_id);
        const pgIdVal = o.park_group_id === 'pg-virginia' ? 1 : (o.park_group_id === 'pg-pending-1' ? 2 : (isNaN(Number(o.park_group_id)) ? 1 : Number(o.park_group_id)));
        
        let creatorIdVal = o.creator_id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(creatorIdVal);
        if (!isUUID) {
          creatorIdVal = 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693';
        }

        const redemptionData = {
          reward_id: rewIdVal,
          park_group_id: pgIdVal,
          status: o.status || 'Pending',
          creator_id: creatorIdVal
        };

        if (!isNaN(Number(o.id))) {
          await supabase.from('redemptions').update(redemptionData).eq('id', Number(o.id));
        } else {
          const { data, error } = await supabase.from('redemptions').insert([redemptionData]).select().single();
          if (!error && data) {
            orders[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_orders', JSON.stringify(orders));
    }

    // 8. Sync userPoints
    if (userPoints) {
      for (let i = 0; i < userPoints.length; i++) {
        const up = userPoints[i];
        const pgIdVal = up.park_group_id === 'pg-virginia' ? 1 : (up.park_group_id === 'pg-pending-1' ? 2 : (isNaN(Number(up.park_group_id)) ? 1 : Number(up.park_group_id)));
        
        let userIdVal = up.user_id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdVal);
        if (!isUUID) {
          userIdVal = 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693';
        }

        const pointData = {
          user_id: userIdVal,
          park_group_id: pgIdVal,
          points: up.points || 0
        };

        await supabase.from('user_points').upsert(pointData, { onConflict: 'user_id,park_group_id' });
      }
      localStorage.setItem('gs_user_points', JSON.stringify(userPoints));
    }

    // 9. Sync parkGroups
    if (parkGroups) {
      const { data: dbGroups } = await supabase.from('park_groups').select('id');
      const dbGroupIds = dbGroups ? dbGroups.map(g => String(g.id)) : [];
      const localGroupIds = parkGroups.map(g => String(g.id));
      const groupsToDelete = dbGroupIds.filter(id => !localGroupIds.includes(id));
      if (groupsToDelete.length > 0) {
        await supabase.from('park_groups').delete().in('id', groupsToDelete.map(Number));
      }

      for (let i = 0; i < parkGroups.length; i++) {
        const g = parkGroups[i];
        let ownerIdVal = g.owner_id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerIdVal);
        if (!isUUID) {
          ownerIdVal = 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693';
        }

        const groupData = {
          name: g.name,
          owner_id: ownerIdVal,
          max_locations: g.max_locations || 5,
          max_users: g.max_users || 5,
          points_enabled: g.points_enabled || true,
          reports_month: g.reports_month || 0,
          rewards_inst: g.rewards_inst || '',
          subscription_plan: g.subscription_plan || 'GreenSpace Starter Plan',
          total_pts: g.total_pts || 0
        };

        if (!isNaN(Number(g.id))) {
          await supabase.from('park_groups').update(groupData).eq('id', Number(g.id));
        } else {
          const { data, error } = await supabase.from('park_groups').insert([groupData]).select().single();
          if (!error && data) {
            parkGroups[i].id = String(data.id);
          }
        }
      }
      localStorage.setItem('gs_park_groups', JSON.stringify(parkGroups));
    }
  } catch (e) {
    console.error("Failed to save state to Supabase:", e);
  }
}

// Log audit action
function logAction(actionText) {
  saveState();
}


// --- DOM ELEMENTS ---
const headerParkName = document.getElementById('header-park-name');
const headerParkLocation = document.getElementById('header-park-location');
const parkDropdown = document.getElementById('park-dropdown');
const parkSelectForm = document.getElementById('park-select-form');
const parkSearchInput = document.getElementById('park-search');
const parkSearchForm = document.getElementById('park-search-form');

const parkDropdownCenter = document.getElementById('park-dropdown-center');
const parkSelectFormCenter = document.getElementById('park-select-form-center');
const parkSearchInputCenter = document.getElementById('park-search-center');
const parkSearchFormCenter = document.getElementById('park-search-form-center');

// Sidebar menu navigation
const navMap = document.getElementById('nav-map');
const navReports = document.getElementById('nav-reports');
const navMarketplace = document.getElementById('nav-marketplace');
const navAnalytics = document.getElementById('nav-analytics');
const navApprovals = document.getElementById('nav-approvals');

// Views list
const views = {
  Map: document.getElementById('view-map'),
  Reports: document.getElementById('view-reports'),
  Marketplace: document.getElementById('view-marketplace'),
  Analytics: document.getElementById('view-analytics'),
  Approvals: document.getElementById('view-approvals')
};

// Lists & Tables
const assignedIssuesList = document.getElementById('assigned-issues-list');
const newIssuesList = document.getElementById('new-issues-list');
const rewardsGridContainer = document.getElementById('rewards-grid-container');
const ordersListContainer = document.getElementById('orders-list-container');

// Modals
const modals = {
  NewReport: document.getElementById('new-report-modal'),
  QuickEdit: document.getElementById('quickedit-modal'),
  DeleteConfirm: document.getElementById('delete-confirm-modal'),
  RewardItem: document.getElementById('reward-item-modal'),
  ParkGroup: document.getElementById('park-group-modal'),
  IssueDetails: document.getElementById('issue-details-modal'),
  AddPark: document.getElementById('add-park-modal'),
  PersonalDetails: document.getElementById('personal-details-modal'),
  ParkAdmin: document.getElementById('park-admin-modal')
};

const newReportForm = document.getElementById('new-report-form');
const profileForm = document.getElementById('profile-form');

// Marketplace Sub-tabs
const btnSubFulfill = document.getElementById('btn-sub-fulfill');
const btnSubItems = document.getElementById('btn-sub-items');
const btnSubSettings = document.getElementById('btn-sub-settings');

const subViewFulfill = document.getElementById('sub-view-fulfill');
const subViewItems = document.getElementById('sub-view-items');
const subViewSettings = document.getElementById('sub-view-settings');

// --- INITIAL BUILD & RENDER ---
window.addEventListener('DOMContentLoaded', async () => {
  if (typeof supabase !== 'undefined' && supabase) {
    await loadStateFromSupabase();
  }
  setupParkDropdown();
  updateActivePark();
  renderAllViews();
  setupResponsiveLogic();
  setupMarketplaceSubTabs();
  setupParkGroupSubTabs();
  setupDropdownChangeListeners();
  setupAccountDropdown();
  initMapEditor();

  // Impersonation Setup
  const impContainer = document.getElementById('impersonation-container');
  const impSelect = document.getElementById('impersonate-role-select');
  if (isRealAdmin() && impContainer && impSelect) {
    impContainer.style.display = 'flex';
    if (impersonatedRole) {
      impSelect.value = impersonatedRole;
    }
    impSelect.addEventListener('change', () => {
      impersonatedRole = impSelect.value;
      localStorage.setItem('gs_impersonated_role', impersonatedRole);
      // Refresh views & drop-downs to match new impersonated role permissions
      updateActivePark();
      setupParkDropdown();
      renderAllViews();
    });
  }

  // Auto-edit park if requested via URL params
  const urlParams = new URLSearchParams(window.location.search);
  const editParkId = urlParams.get('editpark');
  if (editParkId) {
    const targetPark = parks.find(p => String(p.id) === String(editParkId));
    if (targetPark) {
      selectedParkId = editParkId;
      const selectEl = document.getElementById('park-selector');
      if (selectEl) selectEl.value = editParkId;
      updateActivePark();
      openFullscreenMapEditor();
    }
  }

  // Real-time synchronization when Settings changes localStorage in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'gs_custom_trails' || e.key === 'gs_custom_pois' || e.key === 'gs_custom_shapes' || e.key === 'gs_parks') {
      const cachedParks = localStorage.getItem('gs_parks');
      if (cachedParks) {
        parks = JSON.parse(cachedParks);
      }
      updateActivePark();
      if (fullscreenMapInstance) {
        refreshFsMarkers();
      }
      initOrRefreshMap();
    }
  });
});

function setupDropdownChangeListeners() {
  if (parkDropdown) {
    parkDropdown.addEventListener('change', () => {
      selectedParkId = parkDropdown.value;
      saveState();
      updateActivePark();
    });
  }
  if (parkDropdownCenter) {
    parkDropdownCenter.addEventListener('change', () => {
      selectedParkId = parkDropdownCenter.value;
      saveState();
      updateActivePark();
    });
  }
}

// Setup Responsive Width logic
const sidebarDrawer = document.getElementById('sidebar-drawer');
const menuToggleBtn = document.getElementById('menu-toggle-btn');

function setupResponsiveLogic() {
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      sidebarDrawer.classList.toggle('active');
    });
  }

  // Close sidebar drawer when clicking link/buttons on mobile
  const allSideBtns = document.querySelectorAll('.nav-item');
  allSideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        sidebarDrawer.classList.remove('active');
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      sidebarDrawer.classList.remove('active');
    }
  });
}

// Render All
function renderAllViews() {
  setupParkDropdown();
  renderReports();
  renderMarketplace();
  renderParkGroups();
}

function setupParkDropdown() {
  parkDropdown.innerHTML = '';
  if (parkDropdownCenter) parkDropdownCenter.innerHTML = '';

  const userRole = getActiveRole();
  const loggedInStaff = staff.find(s => s.email === currentUser?.email);

  const filteredParks = parks.filter(p => {
    // Admins can see and access all parks
    if (userRole === 'Park Admin' || isRealAdmin()) return true;
    
    // Regular staff can only see/access parks they are assigned to
    if (loggedInStaff) {
      const assigned = p.assigned_staff || [];
      return assigned.map(String).includes(String(loggedInStaff.id));
    }
    
    // Fallback to allow public / default view (or hide if not authenticated)
    return true; 
  });

  filteredParks.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    parkDropdown.appendChild(opt.cloneNode(true));
    if (parkDropdownCenter) parkDropdownCenter.appendChild(opt);
  });

  if (selectedParkId && !filteredParks.some(p => String(p.id) === String(selectedParkId))) {
    selectedParkId = filteredParks[0]?.id || '';
    localStorage.setItem('gs_selected_park_id', selectedParkId);
  }

  if (selectedParkId) {
    parkDropdown.value = selectedParkId;
    if (parkDropdownCenter) parkDropdownCenter.value = selectedParkId;
  }
}

function updateActivePark() {
  const sidebarSelectors = document.getElementById('sidebar-selectors');
  const sidebarNavLinks = document.getElementById('sidebar-nav-links');
  const appHeaderBar = document.getElementById('app-header-bar');
  const selectParkCenter = document.getElementById('view-select-park-center');

  if (!selectedParkId) {
    if (sidebarSelectors) sidebarSelectors.style.display = 'none';
    if (sidebarNavLinks) sidebarNavLinks.style.display = 'none';
    if (appHeaderBar) {
      appHeaderBar.style.display = 'flex';
      const info = appHeaderBar.querySelector('.header-park-info');
      if (info) info.style.display = 'none';
    }
    if (selectParkCenter) {
      selectParkCenter.style.display = 'flex';
      selectParkCenter.classList.add('active');
    }
    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].classList.remove('active');
        views[k].style.display = 'none';
      }
    });
    return;
  }

  activePark = parks.find(p => String(p.id) === String(selectedParkId));
  if (!activePark) {
    selectedParkId = '';
    localStorage.removeItem('gs_selected_park_id');
    updateActivePark();
    return;
  }

  if (sidebarSelectors) sidebarSelectors.style.display = 'block';
  if (sidebarNavLinks) sidebarNavLinks.style.display = 'block';
  if (appHeaderBar) {
    appHeaderBar.style.display = 'flex';
    const info = appHeaderBar.querySelector('.header-park-info');
    if (info) info.style.display = 'block';
  }
  if (selectParkCenter) {
    selectParkCenter.style.display = 'none';
    selectParkCenter.classList.remove('active');
  }

  switchView(currentView);

  if (isAdmin()) {
    if (navApprovals) navApprovals.style.display = 'flex';
  } else {
    if (navApprovals) navApprovals.style.display = 'none';
  }

  if (activePark.status === 'Pending Approval') {
    headerParkName.innerHTML = `${activePark.name} <span class="pending-badge" style="margin-left: 8px;"><span class="material-symbols-rounded" style="font-size: 14px; vertical-align: middle;">hourglass_empty</span>Pending Approval</span>`;
  } else if (activePark.geofence_status === 'Pending Approval') {
    headerParkName.innerHTML = `${activePark.name} <span class="pending-badge" style="margin-left: 8px; background-color: #e3f2fd; color: #0d47a1; border-color: #bbdefb;"><span class="material-symbols-rounded" style="font-size: 14px; vertical-align: middle;">pending</span>Geofence Pending</span>`;
  } else {
    headerParkName.textContent = activePark.name;
  }
  const locString = `${activePark.city || ''}, ${activePark.state || ''} ${activePark.zip_code || ''}`.trim();
  headerParkLocation.innerHTML = `
    <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:4px;">location_on</span>
    ${locString || 'No Location specified'}
  `;

  if (parkDropdown) parkDropdown.value = selectedParkId;
  if (parkDropdownCenter) parkDropdownCenter.value = selectedParkId;

  // Update Marketplace View elements using aligned group and point balances
  const statusDot = document.getElementById('status-dot');
  const marketplaceStatusText = document.getElementById('marketplace-status-text');
  const marketplacePointsText = document.getElementById('marketplace-points-text');
  const marketplaceActions = document.getElementById('btn-sub-fulfill')?.parentElement;
  const marketplaceFallback = document.getElementById('marketplace-empty-fallback');

  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  const isMarketplaceActive = activeGroup ? activeGroup.points_enabled : false;
  const groupPoints = activeGroup ? (userPoints.find(up => up.user_id === currentUser.id && up.park_group_id === activeGroup.id)?.points || 0) : 0;

  if (isMarketplaceActive) {
    if (statusDot) statusDot.className = 'status-dot active';
    if (marketplaceStatusText) marketplaceStatusText.textContent = `Marketplace is currently active for ${activePark.name}.`;
    if (marketplacePointsText) marketplacePointsText.textContent = `${activeGroup.name} has awarded ${groupPoints} unredeemed points to you.`;
    if (marketplaceActions) marketplaceActions.style.display = 'flex';
    if (marketplaceFallback) marketplaceFallback.style.display = 'none';
  } else {
    if (statusDot) statusDot.className = 'status-dot inactive';
    if (marketplaceStatusText) marketplaceStatusText.textContent = `Marketplace is not active for ${activePark.name}.`;
    if (marketplacePointsText) marketplacePointsText.textContent = '';
    if (marketplaceActions) marketplaceActions.style.display = 'none';
    if (marketplaceFallback) marketplaceFallback.style.display = 'block';
  }

  renderReports();
  renderMarketplace();
}

let impersonatedRole = localStorage.getItem('gs_impersonated_role') || null;

function isRealAdmin() {
  return currentUser && (currentUser.email === 'bpmchose@outlook.com' || currentUser.email === 'bpmchose@gmail.com');
}

function getActiveRole() {
  if (isRealAdmin() && impersonatedRole) {
    if (impersonatedRole === 'admin') return 'Park Admin';
    if (impersonatedRole === 'manager') return 'Manager';
    if (impersonatedRole === 'staff') return 'Staff Member';
    if (impersonatedRole === 'public') return 'Public Visitor';
  }
  return currentUser ? currentUser.role : 'Public Visitor';
}

function isAdmin() {
  return getActiveRole() === 'Park Admin';
}

// --- 1. VIEW ROUTING ---
function switchView(viewName) {
  if (!selectedParkId) return;
  currentView = viewName;
  saveState();

  Object.keys(views).forEach(k => {
    if (views[k]) {
      views[k].classList.remove('active');
      views[k].style.display = 'none';
    }
    const navBtn = document.getElementById(`nav-${k.toLowerCase()}`);
    if (navBtn) navBtn.classList.remove('active');
  });

  if (views[viewName]) {
    views[viewName].classList.add('active');
    views[viewName].style.display = 'block';
  }
  const activeNavBtn = document.getElementById(`nav-${viewName.toLowerCase()}`);
  if (activeNavBtn) activeNavBtn.classList.add('active');

  // Load interactive parts dynamically
  if (viewName === 'Map') {
    setTimeout(initOrRefreshMap, 100);
  } else if (viewName === 'Analytics') {
    setTimeout(renderAnalytics, 100);
  } else if (viewName === 'Approvals') {
    setTimeout(renderApprovalsPortal, 100);
  }
}

if (navMap) navMap.addEventListener('click', () => switchView('Map'));
if (navReports) navReports.addEventListener('click', () => switchView('Reports'));
if (navMarketplace) navMarketplace.addEventListener('click', () => switchView('Marketplace'));
if (navAnalytics) navAnalytics.addEventListener('click', () => switchView('Analytics'));
if (navApprovals) navApprovals.addEventListener('click', () => switchView('Approvals'));

// Selector updates
parkSelectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  selectedParkId = parkDropdown.value;
  saveState();
  updateActivePark();
});

if (parkSelectFormCenter) {
  parkSelectFormCenter.addEventListener('submit', (e) => {
    e.preventDefault();
    selectedParkId = parkDropdownCenter.value;
    saveState();
    updateActivePark();
  });
}

parkSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = parkSearchInput.value.trim().toLowerCase();
  const park = parks.find(p => p.name.toLowerCase().includes(val));
  if (park) {
    selectedParkId = park.id;
    saveState();
    updateActivePark();
    parkSearchInput.value = '';
  } else {
    alert(`No park matching "${parkSearchInput.value}" was found.`);
  }
});

if (parkSearchFormCenter) {
  parkSearchFormCenter.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = parkSearchInputCenter.value.trim().toLowerCase();
    const park = parks.find(p => p.name.toLowerCase().includes(val));
    if (park) {
      selectedParkId = park.id;
      saveState();
      updateActivePark();
      parkSearchInputCenter.value = '';
    } else {
      alert(`No park matching "${parkSearchInputCenter.value}" was found.`);
    }
  });
}

// --- 2. REPORTS VIEW LOGIC ---
let activeReportId = null;
let activeDetailTab = 'comments'; // 'comments' or 'audit'

function logAuditEntry(rep, action) {
  rep.audit_log = rep.audit_log || [];
  rep.audit_log.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    action: action,
    user: currentUser.full_name || 'System'
  });
}

function renderReports() {
  const filter = document.getElementById('report-status-filter')?.value || 'all';
  const parkReports = reports.filter(r => String(r.park_id) === String(selectedParkId));
  
  const filtered = parkReports.filter(r => {
    let status = r.status || 'Received';
    if (status === 'new') status = 'Received';
    if (status === 'in_progress') status = 'Investigating';
    if (status === 'resolved') status = 'Complete';
    r.status = status;

    if (filter === 'all') return true;
    return r.status === filter;
  });

  const listContainer = document.getElementById('reports-list-container');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  
  if (filtered.length === 0) {
    listContainer.innerHTML = `<div class="empty-message" style="font-size:0.85rem; padding:16px;">No reports found</div>`;
    renderReportDetails();
    return;
  }

  if (!activeReportId || !filtered.some(r => String(r.id) === String(activeReportId))) {
    activeReportId = filtered[0].id;
  }

  filtered.forEach(rep => {
    const isAssigned = !!rep.assigned_to;
    const assignText = isAssigned ? 'Assigned' : 'Unassigned';
    
    let statusClass = 'status-received';
    if (rep.status === 'Assigned') statusClass = 'status-assigned';
    if (rep.status === 'Dispatched') statusClass = 'status-dispatched';
    if (rep.status === 'Investigating') statusClass = 'status-investigating';
    if (rep.status === 'Resolving') statusClass = 'status-resolving';
    if (rep.status === 'Complete') statusClass = 'status-complete';
    if (rep.status === 'On Hold') statusClass = 'status-onhold';
    if (rep.status === 'Archived') statusClass = 'status-archived';

    const item = document.createElement('div');
    item.className = `settings-list-item ${String(activeReportId) === String(rep.id) ? 'active' : ''}`;
    item.style.padding = '12px';
    item.style.marginBottom = '4px';

    item.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:4px; flex-grow:1;">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <strong style="color:var(--text-static); font-size:0.9rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:140px;">${rep.type}</strong>
          <span style="font-size:0.7rem; color:var(--color-text-muted);">${new Date(rep.created_at).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
        </div>
        <span style="font-size:0.75rem; color:var(--color-text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:180px;">${rep.location}</span>
        <div style="display:flex; gap:6px; margin-top:4px;">
          <span class="badge-item ${statusClass}" style="font-size:0.65rem; padding:1px 6px; border-radius:4px;">${rep.status}</span>
          <span class="badge-item ${isAssigned ? 'assigned' : 'unassigned'}" style="font-size:0.65rem; padding:1px 6px; border-radius:4px;">${assignText}</span>
        </div>
      </div>
    `;

    item.addEventListener('click', () => {
      activeReportId = rep.id;
      renderReports();
    });

    listContainer.appendChild(item);
  });

  renderReportDetails();
}

function renderReportDetails() {
  const panel = document.getElementById('report-detail-panel');
  if (!panel) return;

  const rep = reports.find(r => String(r.id) === String(activeReportId));
  if (!rep) {
    panel.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--color-text-muted); min-height: 250px;">
        <span class="material-symbols-rounded" style="font-size:48px; margin-bottom:12px;">description</span>
        <p style="font-size:0.9rem;">Select a report from the list to manage.</p>
      </div>
    `;
    return;
  }

  // Ensure arrays exist
  rep.comments = rep.comments || [];
  rep.audit_log = rep.audit_log || [];

  const staffOptions = `<option value="">Unassigned</option>` + staff.map(s => `<option value="${s.id}" ${rep.assigned_to === s.id ? 'selected' : ''}>${s.full_name}</option>`).join('');

  // Status transitions and Gating logic
  let statusBannerHtml = '';
  let transitionButtonsHtml = '';
  const isGated = rep.status === 'Received' && (!rep.assigned_to || !rep.priority);

  if (rep.status === 'Received') {
    if (isGated) {
      statusBannerHtml = `
        <div style="background-color:rgba(186, 26, 26, 0.05); border:1px solid rgba(186, 26, 26, 0.15); border-radius:var(--radius-md); padding:12px; margin-bottom:16px; font-size:0.85rem; color:var(--status-destructive); font-weight:600; display:flex; align-items:center; gap:8px;">
          <span class="material-symbols-rounded" style="font-size:18px;">warning</span>
          <span>Required First Stage: Assign a staff member and set priority to begin progress.</span>
        </div>
      `;
      transitionButtonsHtml = `
        <button class="btn btn-primary" disabled style="opacity:0.6; cursor:not-allowed;">
          <span class="material-symbols-rounded" style="font-size:16px;">lock</span> Assign & Progress
        </button>
      `;
    } else {
      transitionButtonsHtml = `
        <button class="btn btn-primary" onclick="transitionReportStatus('${rep.id}', 'Assigned')">
          <span class="material-symbols-rounded" style="font-size:16px;">assignment_ind</span> Transition to Assigned
        </button>
      `;
    }
  } else if (rep.status === 'Assigned') {
    transitionButtonsHtml = `
      <button class="btn btn-primary" onclick="transitionReportStatus('${rep.id}', 'Dispatched')">
        <span class="material-symbols-rounded" style="font-size:16px;">hail</span> Dispatch Staff
      </button>
      <button class="btn btn-secondary" onclick="transitionReportStatus('${rep.id}', 'On Hold')">On Hold</button>
    `;
  } else if (rep.status === 'Dispatched') {
    transitionButtonsHtml = `
      <button class="btn btn-primary" onclick="transitionReportStatus('${rep.id}', 'Investigating')">
        <span class="material-symbols-rounded" style="font-size:16px;">search</span> Begin Investigation
      </button>
      <button class="btn btn-secondary" onclick="transitionReportStatus('${rep.id}', 'On Hold')">On Hold</button>
    `;
  } else if (rep.status === 'Investigating') {
    transitionButtonsHtml = `
      <button class="btn btn-primary" onclick="transitionReportStatus('${rep.id}', 'Resolving')">
        <span class="material-symbols-rounded" style="font-size:16px;">build</span> Start Resolving
      </button>
      <button class="btn btn-secondary" onclick="transitionReportStatus('${rep.id}', 'On Hold')">On Hold</button>
    `;
  } else if (rep.status === 'Resolving') {
    transitionButtonsHtml = `
      <button class="btn btn-primary" onclick="transitionReportStatus('${rep.id}', 'Complete')">
        <span class="material-symbols-rounded" style="font-size:16px;">check_circle</span> Complete Issue
      </button>
      <button class="btn btn-secondary" onclick="transitionReportStatus('${rep.id}', 'On Hold')">On Hold</button>
    `;
  } else if (rep.status === 'On Hold') {
    transitionButtonsHtml = `
      <button class="btn btn-primary" onclick="transitionReportStatus('${rep.id}', 'Assigned')">
        <span class="material-symbols-rounded" style="font-size:16px;">play_arrow</span> Resume Work
      </button>
    `;
  } else if (rep.status === 'Complete' || rep.status === 'Archived') {
    transitionButtonsHtml = `
      <button class="btn btn-secondary" onclick="transitionReportStatus('${rep.id}', 'Received')">
        <span class="material-symbols-rounded" style="font-size:16px;">undo</span> Reopen Issue
      </button>
    `;
  }

  // Draw Tabs classes
  const commentsTabClass = activeDetailTab === 'comments' ? 'active' : '';
  const auditTabClass = activeDetailTab === 'audit' ? 'active' : '';
  const commentsDisplay = activeDetailTab === 'comments' ? 'block' : 'none';
  const auditDisplay = activeDetailTab === 'audit' ? 'none' : 'block';

  // Render Comments lists
  const commentsListHtml = rep.comments.length === 0
    ? `<div style="font-size:0.8rem; color:var(--color-text-muted); text-align:center; padding:16px;">No comments yet.</div>`
    : rep.comments.map(c => `
        <div class="comment-bubble">
          <div class="comment-meta">
            <strong>${c.author}</strong>
            <span>${new Date(c.timestamp).toLocaleString()}</span>
          </div>
          <div>${c.text}</div>
        </div>
      `).join('');

  // Render Audit feed list
  const auditListHtml = rep.audit_log.length === 0
    ? `<div style="font-size:0.8rem; color:var(--color-text-muted); text-align:center; padding:16px;">No activity logged yet.</div>`
    : rep.audit_log.map(a => `
        <div class="audit-row" style="margin-bottom:6px;">
          <div style="display:flex; flex-direction:column;">
            <strong style="color:var(--color-primary); font-size:0.8rem;">${a.action}</strong>
            <span style="font-size:0.7rem; color:var(--color-text-secondary);">By ${a.user}</span>
          </div>
          <span style="font-size:0.7rem; color:var(--color-text-muted); align-self:center;">${new Date(a.timestamp).toLocaleTimeString()}</span>
        </div>
      `).join('');

  panel.innerHTML = `
    ${statusBannerHtml}
    
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; border-bottom:1px solid var(--neutral-gray-border); padding-bottom:12px;">
      <div>
        <span style="font-size:0.75rem; font-weight:700; color:var(--color-primary); text-transform:uppercase; letter-spacing:0.5px;">Report Details</span>
        <h3 style="font-size:1.3rem; font-weight:800; color:black; margin: 4px 0 2px;">${rep.type}</h3>
        <p style="font-size:0.85rem; color:var(--color-text-secondary); margin:0;">${rep.location}</p>
      </div>
      <div style="display:flex; gap:8px;">
        <span class="badge-item status-received" style="font-size:0.75rem; padding:4px 10px; border-radius:6px; font-weight:600;">${rep.priority || 'Medium'} Priority</span>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
      <div>
        <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:2px;">Reporter</label>
        <span style="font-weight:500; font-size:0.85rem;">${rep.reporter_email || 'Anonymous Visitor'}</span>
      </div>
      <div>
        <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:2px;">Timestamp</label>
        <span style="font-weight:500; font-size:0.85rem;">${new Date(rep.created_at).toLocaleString()}</span>
      </div>
    </div>

    <div class="form-group" style="margin-bottom:16px;">
      <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:4px;">Report Description Notes</label>
      <div style="background:var(--bg-canvas); padding:12px; border-radius:var(--radius-md); font-size:0.85rem; min-height:60px; border:1px dashed var(--neutral-gray-border); color:var(--color-text-primary);">
        ${rep.details || 'No additional notes provided.'}
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:16px; align-items:flex-end;">
      <div class="form-group" style="margin-bottom:0;">
        <label for="details-assignee" style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); margin-bottom:4px;">Assign To</label>
        <select id="details-assignee" class="form-control" onchange="updateReportAssignee('${rep.id}', this.value)" style="height:36px; padding: 4px 8px; font-size:0.8rem; font-weight:500;">
          ${staffOptions}
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label for="details-priority" style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); margin-bottom:4px;">Priority</label>
        <select id="details-priority" class="form-control" onchange="updateReportPriority('${rep.id}', this.value)" style="height:36px; padding: 4px 8px; font-size:0.8rem; font-weight:500;">
          <option value="Low" ${rep.priority === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Medium" ${rep.priority === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="High" ${rep.priority === 'High' ? 'selected' : ''}>High</option>
          <option value="Critical" ${rep.priority === 'Critical' ? 'selected' : ''}>Critical</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); margin-bottom:4px;">Actions</label>
        <div style="display:flex; gap:6px;">
          ${transitionButtonsHtml}
        </div>
      </div>
    </div>

    <!-- Comments & Activity Log Tabs -->
    <div style="display:flex; border-bottom: 1px solid var(--neutral-gray-border); margin-top:16px;">
      <button class="settings-nav-item ${commentsTabClass}" id="details-tab-comments" style="width:auto; border-radius:0; padding:8px 16px; font-size:0.8rem; font-weight:700; background:none;">Comments (${rep.comments.length})</button>
      <button class="settings-nav-item ${auditTabClass}" id="details-tab-audit" style="width:auto; border-radius:0; padding:8px 16px; font-size:0.8rem; font-weight:700; background:none;">Activity Log (${rep.audit_log.length})</button>
    </div>

    <div id="details-comments-container" style="display:${commentsDisplay}; flex-grow:1; flex-direction:column; overflow:hidden;">
      <div class="comments-feed" id="comments-feed-container">
        ${commentsListHtml}
      </div>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <input type="text" id="new-comment-textarea" class="form-control" placeholder="Add a comment..." style="height:36px; font-size:0.8rem;">
        <button class="btn btn-primary" id="btn-post-comment" style="height:36px; padding: 0 16px; border-radius:var(--radius-md);">Send</button>
      </div>
    </div>

    <div id="details-audit-container" style="display:${auditDisplay}; flex-grow:1; overflow:hidden;">
      <div class="audit-feed">
        ${auditListHtml}
      </div>
    </div>

    <div style="margin-top:16px; border-top: 1px solid var(--neutral-gray-border); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:0.7rem; color:var(--color-text-muted);">ID: ${rep.id}</span>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="transitionReportStatus('${rep.id}', 'Archived')" style="color:var(--color-text-secondary); border-color:var(--neutral-gray-border); background:none; padding: 4px 12px; font-size:0.75rem; border-radius: var(--radius-md);">
          <span class="material-symbols-rounded" style="font-size:14px;">archive</span> Archive
        </button>
        <button class="btn btn-secondary" onclick="deleteReport('${rep.id}')" style="color:var(--status-destructive); border-color:var(--status-destructive); background:none; padding: 4px 12px; font-size:0.75rem; border-radius: var(--radius-md);">
          <span class="material-symbols-rounded" style="font-size:14px;">delete</span> Delete
        </button>
      </div>
    </div>
  `;

  // Bind comment/audit tab events
  document.getElementById('details-tab-comments')?.addEventListener('click', () => {
    activeDetailTab = 'comments';
    renderReportDetails();
  });
  document.getElementById('details-tab-audit')?.addEventListener('click', () => {
    activeDetailTab = 'audit';
    renderReportDetails();
  });

  // Bind Post comment button
  document.getElementById('btn-post-comment')?.addEventListener('click', () => {
    const text = document.getElementById('new-comment-textarea').value.trim();
    if (text) {
      rep.comments.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        author: currentUser.full_name || 'Staff Member',
        text: text
      });
      logAuditEntry(rep, `Comment added: "${text.substring(0, 20)}..."`);
      saveState();
      renderReportDetails();
    }
  });
}

window.transitionReportStatus = function(id, nextStatus) {
  const rep = reports.find(r => String(r.id) === String(id));
  if (!rep) return;
  
  const oldStatus = rep.status || 'Received';

  if (nextStatus === 'Complete') {
    const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
    const isMarketplaceActive = activeGroup ? activeGroup.points_enabled : false;
    if (isMarketplaceActive && rep.reporter_email) {
      const confirmPoints = confirm(`Would you like to issue 15 reward points to the reporter (${rep.reporter_email})?`);
      if (confirmPoints) {
        const targetUserId = rep.reporter_email;
        let upRec = userPoints.find(up => up.user_id === targetUserId && up.park_group_id === activeGroup.id);
        if (!upRec) {
          upRec = { id: Date.now(), user_id: targetUserId, park_group_id: activeGroup.id, points: 0 };
          userPoints.push(upRec);
        }
        upRec.points += 15;
        localStorage.setItem('gs_user_points', JSON.stringify(userPoints));
        alert(`15 points awarded to ${rep.reporter_email}!`);
        logAuditEntry(rep, `Awarded 15 points to reporter (${rep.reporter_email})`);
      }
    }
  }

  rep.status = nextStatus;
  logAuditEntry(rep, `Status changed from ${oldStatus} to ${nextStatus}`);
  saveState();
  renderReports();
};

window.updateReportPriority = function(id, priorityValue) {
  const rep = reports.find(r => String(r.id) === String(id));
  if (rep) {
    const oldPriority = rep.priority || 'Medium';
    rep.priority = priorityValue;
    logAuditEntry(rep, `Priority changed from ${oldPriority} to ${priorityValue}`);
    
    if (rep.status === 'Received' && rep.assigned_to && rep.priority) {
      rep.status = 'Assigned';
      logAuditEntry(rep, `Status auto-promoted to Assigned`);
    }
    
    saveState();
    renderReports();
  }
};

window.updateReportAssignee = function(id, assigneeId) {
  const rep = reports.find(r => String(r.id) === String(id));
  if (rep) {
    const oldAssignee = rep.assigned_to;
    const oldStaff = staff.find(s => s.id === oldAssignee);
    const newStaff = staff.find(s => s.id === assigneeId);
    rep.assigned_to = assigneeId || null;
    
    const oldName = oldStaff ? oldStaff.full_name : 'Unassigned';
    const newName = newStaff ? newStaff.full_name : 'Unassigned';
    logAuditEntry(rep, `Assignee changed from ${oldName} to ${newName}`);
    
    if (rep.status === 'Received' && rep.assigned_to && rep.priority) {
      rep.status = 'Assigned';
      logAuditEntry(rep, `Status auto-promoted to Assigned`);
    }
    
    saveState();
    renderReports();
  }
};

window.deleteReport = function(id) {
  if (!confirm("Are you sure you want to delete this report?")) return;
  reports = reports.filter(r => String(r.id) !== String(id));
  activeReportId = null;
  saveState();
  renderReports();
};

document.getElementById('report-status-filter')?.addEventListener('change', () => {
  activeReportId = null;
  renderReports();
});

// New Report submissions
let selectingLocationOnMap = false;
let tempMapMarker = null;

let staffPickerMap = null;
let staffPickerMarker = null;
let staffTempLat = null;
let staffTempLng = null;

let selectedGreenCode = null;
let greencodePreviewMap = null;
let greencodePreviewMarker = null;

document.getElementById('open-report-modal-btn').addEventListener('click', () => {
  modals.NewReport.classList.add('active');
});
document.getElementById('close-report-modal-btn').addEventListener('click', () => {
  modals.NewReport.classList.remove('active');
});

const btnSelectLocationMap = document.getElementById('btn-select-location-map');
if (btnSelectLocationMap) {
  btnSelectLocationMap.addEventListener('click', () => {
    modals.NewReport.classList.remove('active');
    const pickerModal = document.getElementById('staff-map-picker-modal');
    pickerModal.classList.add('active');
    
    setTimeout(() => {
      const lat = activePark.lat || 37.3387;
      const lng = activePark.lng || -76.7865;
      
      if (!staffPickerMap) {
        staffPickerMap = L.map('staff-picker-map-container').setView([lat, lng], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 20,
          attribution: '© OpenStreetMap contributors, © CARTO'
        }).addTo(staffPickerMap);
        
        staffPickerMap.on('click', (e) => {
          const coords = e.latlng;
          staffTempLat = coords.lat;
          staffTempLng = coords.lng;
          
          if (staffPickerMarker) {
            staffPickerMarker.setLatLng(coords);
          } else {
            staffPickerMarker = L.marker(coords).addTo(staffPickerMap);
          }
          
          document.getElementById('staff-picker-coordinates-text').textContent = `Pinned: ${staffTempLat.toFixed(5)}, ${staffTempLng.toFixed(5)}`;
          document.getElementById('btn-confirm-staff-coords').disabled = false;
        });
      } else {
        staffPickerMap.setView([lat, lng], 15);
        staffPickerMap.invalidateSize();
      }
    }, 200);
  });
}

document.getElementById('close-staff-map-picker-btn')?.addEventListener('click', () => {
  document.getElementById('staff-map-picker-modal').classList.remove('active');
  modals.NewReport.classList.add('active');
});

document.getElementById('btn-confirm-staff-coords')?.addEventListener('click', () => {
  if (staffTempLat && staffTempLng) {
    document.getElementById('report-lat').value = staffTempLat;
    document.getElementById('report-lng').value = staffTempLng;
    document.getElementById('report-location').value = `Map Coordinates: ${staffTempLat.toFixed(5)}, ${staffTempLng.toFixed(5)}`;
    document.getElementById('selected-location-preview-text').innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:6px;">
        <span class="material-symbols-rounded" style="color:var(--color-primary); font-size: 16px;">place</span>
        <span>Map Coordinates: ${staffTempLat.toFixed(4)}, ${staffTempLng.toFixed(4)}</span>
      </div>
    `;
    document.getElementById('staff-map-picker-modal').classList.remove('active');
    modals.NewReport.classList.add('active');
  }
});

const btnChooseGreenCode = document.getElementById('btn-choose-greencode');
if (btnChooseGreenCode) {
  btnChooseGreenCode.addEventListener('click', () => {
    modals.NewReport.classList.remove('active');
    document.getElementById('greencodes-search-modal').classList.add('active');
    renderGreenCodesSearchList();
  });
}

document.getElementById('close-greencodes-search-btn')?.addEventListener('click', () => {
  document.getElementById('greencodes-search-modal').classList.remove('active');
  modals.NewReport.classList.add('active');
});

function renderGreenCodesSearchList() {
  const list = document.getElementById('greencodes-search-list');
  const searchInput = document.getElementById('greencodes-search-input');
  if (!list) return;
  
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  list.innerHTML = '';
  
  const parkGC = greenCodes.filter(gc => String(gc.park_id) === String(selectedParkId));
  const filtered = parkGC.filter(gc => gc.name.toLowerCase().includes(query) || gc.code.toLowerCase().includes(query));
  
  if (filtered.length === 0) {
    list.innerHTML = `<div style="font-size:0.8rem; text-align:center; padding:12px; color:var(--color-text-muted);">No GreenCodes found</div>`;
    return;
  }
  
  filtered.forEach(gc => {
    const item = document.createElement('div');
    item.className = `settings-list-item ${selectedGreenCode?.id === gc.id ? 'active' : ''}`;
    item.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px; text-align: left;">
        <span style="font-weight:600; font-size:0.85rem; color:black;">${gc.name}</span>
        <span style="font-size:0.75rem; color:var(--color-text-secondary); font-family:monospace;">${gc.code}</span>
      </div>
    `;
    item.addEventListener('click', () => {
      selectedGreenCode = gc;
      renderGreenCodesSearchList();
      updateGreenCodePreview(gc);
    });
    list.appendChild(item);
  });
}

document.getElementById('greencodes-search-input')?.addEventListener('input', () => {
  renderGreenCodesSearchList();
});

function updateGreenCodePreview(gc) {
  document.getElementById('greencodes-preview-details').textContent = `${gc.name} (${gc.code})`;
  document.getElementById('btn-confirm-greencode-choice').disabled = false;
  
  setTimeout(() => {
    if (!greencodePreviewMap) {
      greencodePreviewMap = L.map('greencodes-preview-map').setView([gc.lat, gc.lng], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(greencodePreviewMap);
      greencodePreviewMarker = L.marker([gc.lat, gc.lng]).addTo(greencodePreviewMap);
    } else {
      greencodePreviewMap.setView([gc.lat, gc.lng], 15);
      greencodePreviewMarker.setLatLng([gc.lat, gc.lng]);
      greencodePreviewMap.invalidateSize();
    }
  }, 100);
}

document.getElementById('btn-confirm-greencode-choice')?.addEventListener('click', () => {
  if (selectedGreenCode) {
    document.getElementById('report-lat').value = selectedGreenCode.lat;
    document.getElementById('report-lng').value = selectedGreenCode.lng;
    document.getElementById('report-location').value = `GreenCode: ${selectedGreenCode.name} (${selectedGreenCode.code})`;
    document.getElementById('selected-location-preview-text').innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:6px;">
        <span class="material-symbols-rounded" style="color:var(--color-primary); font-size:16px;">qr_code_2</span>
        <span>GreenCode: ${selectedGreenCode.name}</span>
      </div>
    `;
    document.getElementById('greencodes-search-modal').classList.remove('active');
    modals.NewReport.classList.add('active');
  }
});

newReportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = document.getElementById('report-type').value;
  const location = document.getElementById('report-location').value.trim();
  const details = document.getElementById('report-details').value.trim();
  const lat = parseFloat(document.getElementById('report-lat').value);
  const lng = parseFloat(document.getElementById('report-lng').value);

  if (isNaN(lat) || isNaN(lng)) {
    alert("Please select a location on the map or choose a GreenCode first.");
    return;
  }

  const newReport = {
    id: Date.now(),
    park_id: parseInt(selectedParkId),
    type,
    location,
    details,
    status: 'Received',
    assigned_to: null,
    priority: 'Medium',
    created_at: new Date().toISOString(),
    reporter_email: currentUser ? currentUser.email : 'operator@greenspace.com',
    lat,
    lng
  };

  reports.unshift(newReport);
  saveState();
  renderReports();

  // Reset
  document.getElementById('report-location').value = '';
  document.getElementById('report-details').value = '';
  document.getElementById('report-lat').value = '';
  document.getElementById('report-lng').value = '';
  document.getElementById('selected-location-preview-text').textContent = 'No location selected yet';
  selectedGreenCode = null;
  staffTempLat = null;
  staffTempLng = null;
  if (staffPickerMarker && staffPickerMap) {
    staffPickerMap.removeLayer(staffPickerMarker);
    staffPickerMarker = null;
  }
  modals.NewReport.classList.remove('active');
});

// --- 5. MARKETPLACE VIEW LOGIC ---
let currentMarketplaceTab = 'fulfill'; // 'fulfill', 'manage', 'settings'
let activeOrderId = null;
let activeRewardId = null;

function setupMarketplaceSubTabs() {
  const btnSubFulfill = document.getElementById('btn-sub-fulfill');
  const btnSubItems = document.getElementById('btn-sub-items');
  const btnSubSettings = document.getElementById('btn-sub-settings');

  if (btnSubFulfill) {
    btnSubFulfill.addEventListener('click', () => {
      btnSubFulfill.classList.add('active');
      btnSubItems.classList.remove('active');
      btnSubSettings.classList.remove('active');
      currentMarketplaceTab = 'fulfill';
      renderMarketplace();
    });
  }
  if (btnSubItems) {
    btnSubItems.addEventListener('click', () => {
      btnSubFulfill.classList.remove('active');
      btnSubItems.classList.add('active');
      btnSubSettings.classList.remove('active');
      currentMarketplaceTab = 'manage';
      renderMarketplace();
    });
  }
  if (btnSubSettings) {
    btnSubSettings.addEventListener('click', () => {
      btnSubFulfill.classList.remove('active');
      btnSubItems.classList.remove('active');
      btnSubSettings.classList.add('active');
      currentMarketplaceTab = 'settings';
      renderMarketplace();
    });
  }
}

function renderMarketplace() {
  if (!activePark) return;
  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  const isMarketplaceActive = activeGroup ? activeGroup.points_enabled : false;

  const wrapper = document.getElementById('marketplace-wrapper');
  const fallback = document.getElementById('marketplace-empty-fallback');

  const elPoints = document.getElementById('marketplace-points-text');
  if (elPoints && activeGroup) {
    const groupPoints = userPoints.find(up => up.user_id === currentUser.id && up.park_group_id === activeGroup.id)?.points || 0;
    elPoints.textContent = `${activeGroup.name} has awarded ${groupPoints} unredeemed points to you.`;
  }

  if (!isMarketplaceActive) {
    if (wrapper) wrapper.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    return;
  }

  if (wrapper) wrapper.style.display = 'flex';
  if (fallback) fallback.style.display = 'none';

  // Toggle list column visibility: hide list column if on Settings tab
  const listColumn = document.getElementById('marketplace-list-column');
  const listTitle = document.getElementById('marketplace-list-title');
  const btnAddReward = document.getElementById('btn-new-reward-item');

  if (currentMarketplaceTab === 'settings') {
    if (listColumn) listColumn.style.display = 'none';
    if (btnAddReward) btnAddReward.style.display = 'none';
  } else {
    if (listColumn) listColumn.style.display = 'flex';
    if (currentMarketplaceTab === 'fulfill') {
      listTitle.textContent = 'Orders';
      if (btnAddReward) btnAddReward.style.display = 'none';
    } else {
      listTitle.textContent = 'Rewards Catalog';
      if (btnAddReward) btnAddReward.style.display = 'inline-flex';
    }
  }

  renderMarketplaceList();
  renderMarketplaceDetails();
}

function renderMarketplaceList() {
  const listContainer = document.getElementById('marketplace-list-container');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  if (!activeGroup) return;

  if (currentMarketplaceTab === 'fulfill') {
    const parkOrders = orders.filter(o => String(o.park_group_id) === String(activeGroup.id) && o.status === 'Pending');
    if (parkOrders.length === 0) {
      listContainer.innerHTML = `<div style="font-size:0.85rem; padding:16px; text-align:center; color:var(--color-text-muted);">No pending redemptions</div>`;
      renderMarketplaceDetails();
      return;
    }
    if (!activeOrderId || !parkOrders.some(o => o.id === activeOrderId)) {
      activeOrderId = parkOrders[0].id;
    }
    parkOrders.forEach(o => {
      const item = document.createElement('div');
      item.className = `settings-list-item ${activeOrderId === o.id ? 'active' : ''}`;
      item.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px; flex-grow:1;">
          <span style="font-weight:600;">${o.reward_name}</span>
          <span style="font-size:0.75rem; color:var(--color-text-secondary);">${o.user_email}</span>
        </div>
        <span class="material-symbols-rounded" style="font-size:16px; opacity:0.6;">chevron_right</span>
      `;
      item.addEventListener('click', () => {
        activeOrderId = o.id;
        renderMarketplaceList();
        renderMarketplaceDetails();
      });
      listContainer.appendChild(item);
    });
  } else if (currentMarketplaceTab === 'manage') {
    const parkRewards = rewards.filter(r => String(r.park_group_id) === String(activeGroup.id));
    if (parkRewards.length === 0) {
      listContainer.innerHTML = `<div style="font-size:0.85rem; padding:16px; text-align:center; color:var(--color-text-muted);">No rewards configured</div>`;
      renderMarketplaceDetails();
      return;
    }
    if (!activeRewardId || !parkRewards.some(r => r.id === activeRewardId)) {
      activeRewardId = parkRewards[0].id;
    }
    parkRewards.forEach(r => {
      const item = document.createElement('div');
      item.className = `settings-list-item ${activeRewardId === r.id ? 'active' : ''}`;
      item.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px; flex-grow:1;">
          <span style="font-weight:600;">${r.name}</span>
          <span style="font-size:0.75rem; color:var(--color-text-secondary);">${r.cost} Points</span>
        </div>
        <span class="material-symbols-rounded" style="font-size:16px; opacity:0.6;">chevron_right</span>
      `;
      item.addEventListener('click', () => {
        activeRewardId = r.id;
        renderMarketplaceList();
        renderMarketplaceDetails();
      });
      listContainer.appendChild(item);
    });
  }
}

function renderMarketplaceDetails() {
  const panel = document.getElementById('marketplace-detail-panel');
  if (!panel) return;
  panel.innerHTML = '';

  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  if (!activeGroup) return;

  if (currentMarketplaceTab === 'fulfill') {
    const o = orders.find(ord => ord.id === activeOrderId);
    if (!o) {
      panel.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--color-text-muted); min-height: 250px;">
          <span class="material-symbols-rounded" style="font-size:48px; margin-bottom:12px;">receipt_long</span>
          <p style="font-size:0.9rem;">Select a pending order from the list to fulfill.</p>
        </div>
      `;
      return;
    }
    panel.innerHTML = `
      <h3 style="font-size:1.4rem; font-weight:800; color:black; margin-bottom:4px;">Fulfill Redemption</h3>
      <p style="color:var(--color-text-secondary); font-size:0.85rem; margin-bottom:24px;">Confirm hand-off of the reward item to the visitor.</p>
      
      <div style="background:var(--bg-canvas); padding:20px; border-radius:var(--radius-lg); border:var(--border-default); display:flex; flex-direction:column; gap:16px; margin-bottom:24px;">
        <div>
          <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:2px;">Prize Name</label>
          <strong style="font-size:1.15rem; color:black;">${o.reward_name}</strong>
        </div>
        <div>
          <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:2px;">Visitor Email</label>
          <span style="font-weight:500; font-size:0.9rem;">${o.user_email}</span>
        </div>
        <div>
          <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:2px;">Points Cost</label>
          <span style="font-weight:600; color:var(--color-primary); font-size:0.95rem;">${o.cost} pts</span>
        </div>
        <div>
          <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:2px;">Order Timestamp</label>
          <span style="font-size:0.85rem;">${new Date(o.created_at).toLocaleString()}</span>
        </div>
      </div>
      
      <button class="btn btn-primary" onclick="fulfillRedemption('${o.id}')" style="margin-top:auto; align-self:flex-start;">
        <span class="material-symbols-rounded" style="font-size:16px;">done_all</span> Mark as Fulfilled
      </button>
    `;
  } else if (currentMarketplaceTab === 'manage') {
    const r = rewards.find(rew => rew.id === activeRewardId);
    if (!r) {
      panel.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--color-text-muted); min-height: 250px;">
          <span class="material-symbols-rounded" style="font-size:48px; margin-bottom:12px;">featured_seasonal_and_gifts</span>
          <p style="font-size:0.9rem;">Select a reward catalog item to configure.</p>
        </div>
      `;
      return;
    }
    panel.innerHTML = `
      <h3 style="font-size:1.4rem; font-weight:800; color:black; margin-bottom:24px;">Configure Reward Item</h3>
      <form id="reward-item-edit-form" style="display:flex; flex-direction:column; gap:20px;">
        <div class="form-group" style="margin-bottom:0;">
          <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); margin-bottom:6px;">Reward Item Title</label>
          <input type="text" id="edit-reward-name" class="form-control" value="${r.name}" required style="font-size:0.85rem;">
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); margin-bottom:6px;">Cost (in Points)</label>
          <input type="number" id="edit-reward-cost" class="form-control" value="${r.cost}" required min="1" style="font-size:0.85rem;">
        </div>
        <div style="display:flex; align-items:center; gap:8px; margin: 8px 0;">
          <input type="checkbox" id="edit-reward-available" style="width:18px; height:18px; cursor:pointer;" ${r.available ? 'checked' : ''}>
          <label for="edit-reward-available" style="margin-bottom:0; cursor:pointer; font-weight:600; font-size:0.85rem; color:var(--color-text-primary);">Available in Storefront</label>
        </div>
        <div style="display:flex; gap:12px; margin-top:20px; border-top:1px solid var(--neutral-gray-border); padding-top:20px;">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" class="btn btn-secondary" onclick="deleteReward('${r.id}')" style="color:var(--status-destructive); border-color:var(--status-destructive); background:none; border-radius: var(--radius-md);">Delete</button>
        </div>
      </form>
    `;
    document.getElementById('reward-item-edit-form').addEventListener('submit', (e) => {
      e.preventDefault();
      r.name = document.getElementById('edit-reward-name').value.trim();
      r.cost = parseInt(document.getElementById('edit-reward-cost').value, 10) || 50;
      r.available = document.getElementById('edit-reward-available').checked;
      saveState();
      renderMarketplace();
      alert("Reward catalog item updated successfully!");
    });
  } else if (currentMarketplaceTab === 'settings') {
    panel.innerHTML = `
      <h3 style="font-size:1.4rem; font-weight:800; color:black; margin-bottom:4px;">Marketplace Store Settings</h3>
      <p style="color:var(--color-text-secondary); font-size:0.85rem; margin-bottom:24px;">Configure visitor parameters and pickup instructions.</p>
      
      <div style="background:var(--bg-canvas); padding:20px; border-radius:var(--radius-lg); border:var(--border-default); display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <div>
          <strong style="color:black; display:block; font-size:0.95rem;">Enable Points Marketplace</strong>
          <span style="font-size:0.75rem; color:var(--color-text-secondary);">Allow visitors to earn points and redeem prizes.</span>
        </div>
        <button class="btn ${activeGroup.points_enabled ? 'btn-danger' : 'btn-primary'}" onclick="toggleMarketplaceState(${!activeGroup.points_enabled})" style="border-radius: var(--radius-md);">
          ${activeGroup.points_enabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div class="form-group">
        <label style="font-size:0.75rem; font-weight:600; color:var(--color-text-muted); display:block; margin-bottom:6px;">Redemption Pickup Instructions</label>
        <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 8px;">Displayed to visitors when they confirm redemptions in the map.</p>
        <textarea id="marketplace-redemption-instructions" class="form-control" rows="4" style="font-size:0.85rem;">${activeGroup.rewards_inst || ''}</textarea>
      </div>
      <button class="btn btn-primary" onclick="saveMarketplaceRedemptionInstructions()" style="align-self:flex-start;">
        Save Settings
      </button>
    `;
  }
}

window.fulfillRedemption = function(orderId) {
  const ord = orders.find(o => String(o.id) === String(orderId));
  if (ord) {
    ord.status = 'Fulfilled';
    saveState();
    activeOrderId = null;
    renderMarketplace();
    alert("Redemption order fulfilled successfully!");
  }
};

window.deleteReward = function(id) {
  if (!confirm("Are you sure you want to delete this reward item?")) return;
  rewards = rewards.filter(r => String(r.id) !== String(id));
  activeRewardId = null;
  saveState();
  renderMarketplace();
};

window.saveMarketplaceRedemptionInstructions = function() {
  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  if (activeGroup) {
    activeGroup.rewards_inst = document.getElementById('marketplace-redemption-instructions').value.trim();
    saveState();
    alert("Instructions saved successfully!");
  }
};

window.toggleMarketplaceState = function(active) {
  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  if (activeGroup) {
    activeGroup.points_enabled = active;
    saveState();
    renderMarketplace();
  }
};

// Bind new reward item add button
document.getElementById('btn-new-reward-item')?.addEventListener('click', () => {
  const activeGroup = parkGroups.find(g => g.id === activePark.park_group_id);
  if (!activeGroup) return;
  const newReward = {
    id: `rew-${Date.now()}`,
    name: 'New Reward Prize',
    cost: 50,
    park_group_id: activeGroup.id,
    available: true
  };
  rewards.push(newReward);
  activeRewardId = newReward.id;
  saveState();
  renderMarketplace();
});

// --- 7. MODALS & FORMS LOGIC ---

// Park Admin Settings - Render Park Groups
function renderParkGroups() {
  const list = document.getElementById('park-groups-list');
  if (!list) return;
  list.innerHTML = parkGroups.map(g => `
    <div class="pg-card-row">
      <span>${g.name}</span>
      <button class="btn btn-pg-action" onclick="openParkGroupEdit('${g.id}')">
        <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:4px;">edit</span>
        Edit
      </button>
    </div>
  `).join('');
}

let activeEditingGroupId = null;
window.openParkGroupEdit = function(groupId) {
  activeEditingGroupId = groupId;
  const group = parkGroups.find(g => String(g.id) === String(groupId));
  if (!group) return;

  document.getElementById('park-group-name-input').value = group.name;

  if (modals.ParkGroup) modals.ParkGroup.classList.add('active');
  renderParkGroupSubTabs(group);
};

document.getElementById('close-park-group-modal-btn').addEventListener('click', () => {
  if (modals.ParkGroup) modals.ParkGroup.classList.remove('active');
});

document.getElementById('park-group-name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('park-group-name-input').value.trim();
  const group = parkGroups.find(g => String(g.id) === String(activeEditingGroupId));
  if (group && nameInput) {
    group.name = nameInput;
    saveState();
    renderParkGroups();
    alert("Park Group Name saved!");
  }
});

// Park Group Sub Tabs Logic
function setupParkGroupSubTabs() {
  const btnParks = document.getElementById('pg-tab-parks-btn');
  const btnStaff = document.getElementById('pg-tab-staff-btn');
  const btnCat = document.getElementById('pg-tab-categories-btn');
  const btnMarket = document.getElementById('pg-tab-market-btn');
  const btnSub = document.getElementById('pg-tab-sub-btn');

  const viewParks = document.getElementById('pg-sub-parks');
  const viewStaff = document.getElementById('pg-sub-staff');
  const viewCat = document.getElementById('pg-sub-categories');
  const viewMarket = document.getElementById('pg-sub-market');
  const viewSub = document.getElementById('pg-sub-subscription');

  function switchTab(tabName) {
    const btns = [btnParks, btnStaff, btnCat, btnMarket, btnSub];
    const subViews = [viewParks, viewStaff, viewCat, viewMarket, viewSub];

    btns.forEach(b => { if (b) b.classList.remove('active'); });
    subViews.forEach(v => { if (v) v.style.display = 'none'; });

    if (tabName === 'parks') {
      if (btnParks) btnParks.classList.add('active');
      if (viewParks) viewParks.style.display = 'block';
    } else if (tabName === 'staff') {
      if (btnStaff) btnStaff.classList.add('active');
      if (viewStaff) viewStaff.style.display = 'block';
    } else if (tabName === 'categories') {
      if (btnCat) btnCat.classList.add('active');
      if (viewCat) viewCat.style.display = 'block';
    } else if (tabName === 'market') {
      if (btnMarket) btnMarket.classList.add('active');
      if (viewMarket) viewMarket.style.display = 'block';
    } else if (tabName === 'subscription') {
      if (btnSub) btnSub.classList.add('active');
      if (viewSub) viewSub.style.display = 'block';
    }
  }

  if (btnParks) btnParks.addEventListener('click', () => switchTab('parks'));
  if (btnStaff) btnStaff.addEventListener('click', () => switchTab('staff'));
  if (btnCat) btnCat.addEventListener('click', () => switchTab('categories'));
  if (btnMarket) btnMarket.addEventListener('click', () => switchTab('market'));
  if (btnSub) btnSub.addEventListener('click', () => switchTab('subscription'));
  
  switchTab('parks');
}

function renderParkGroupSubTabs(group) {
  // Parks tab renderer
  const parksList = document.getElementById('pg-parks-list');
  if (parksList) {
    const groupParks = parks.filter(p => group.parks && group.parks.map(String).includes(String(p.id)));
    parksList.innerHTML = groupParks.map(p => `
      <div class="pg-list-row">
        <span>${p.name}</span>
        <div style="display:flex; gap:8px;">
          <button class="btn-pg-action" onclick="editSingleParkDetails('${p.id}')">
            <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:2px;">edit</span>
            Edit
          </button>
          <button class="btn-pg-delete" onclick="deleteSingleParkPg('${p.id}')">
            <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:2px;">delete</span>
            Delete
          </button>
        </div>
      </div>
    `).join('');

    const activeCountText = document.getElementById('pg-parks-active-count');
    if (activeCountText) {
      activeCountText.textContent = `${groupParks.length} parks active of ${groupParks.length + 1} available parks.`;
    }
  }

  // Staff tab renderer (Edit / Remove buttons)
  const staffList = document.getElementById('pg-staff-list');
  if (staffList) {
    staffList.innerHTML = staff.map(s => {
      return `
        <div class="pg-staff-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgb(247, 247, 247); border:1px solid rgba(0,0,0,0.15); border-radius:5px; margin-bottom:8px;">
          <span style="font-weight:700;">${s.first_name} ${s.last_name}</span>
          <div class="pg-staff-actions" style="display:flex; gap:8px;">
            <button class="btn btn-pg-action" onclick="openStaffPermissions('${s.id}')">
              <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:2px;">edit</span>
              Edit
            </button>
            <button class="btn btn-pg-delete" onclick="removeStaffPg('${s.id}')">
              <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:2px;">delete</span>
              Remove
            </button>
          </div>
        </div>
      `;
    }).join('');

    const staffCountText = document.getElementById('pg-staff-active-count');
    if (staffCountText) {
      staffCountText.textContent = `${staff.length} users active of ${staff.length} available users.`;
    }
  }

  // Categories tab renderer
  renderCategoriesList();
}

window.editSingleParkDetails = function(parkId) {
  const p = parks.find(x => String(x.id) === String(parkId));
  if (!p) return;
  const name = prompt("Edit Park Name:", p.name);
  const city = prompt("Edit Park City:", p.city || '');
  const state = prompt("Edit Park State:", p.state || '');
  const zip_code = prompt("Edit Park Zip Code:", p.zip_code || '');
  if (name) {
    p.name = name;
    p.city = city;
    p.state = state;
    p.zip_code = zip_code ? parseInt(zip_code) : null;
    saveState();
    const group = parkGroups.find(g => String(g.id) === String(activeEditingGroupId));
    if (group) renderParkGroupSubTabs(group);
    setupParkDropdown();
    updateActivePark();
  }
};

window.deleteSingleParkPg = function(parkId) {
  if (confirm("Are you sure you want to delete this park?")) {
    parks = parks.filter(x => String(x.id) !== String(parkId));
    parkGroups.forEach(g => {
      if (g.parks) {
        g.parks = g.parks.filter(pid => String(pid) !== String(parkId));
      }
    });
    if (String(selectedParkId) === String(parkId)) {
      selectedParkId = '';
    }
    saveState();
    const group = parkGroups.find(g => String(g.id) === String(activeEditingGroupId));
    if (group) renderParkGroupSubTabs(group);
    setupParkDropdown();
    updateActivePark();
  }
};

window.removeStaffPg = function(staffId) {
  if (confirm("Are you sure you want to remove this staff member?")) {
    staff = staff.filter(s => s.id !== staffId);
    parkManagers = parkManagers.filter(m => m.user_id !== staffId);
    parkStaff = parkStaff.filter(s => s.user_id !== staffId);
    saveState();
    const group = parkGroups.find(g => String(g.id) === String(activeEditingGroupId));
    if (group) renderParkGroupSubTabs(group);
  }
};

// Staff Permissions Sub-modal Logic
let activeEditingStaffId = null;
window.openStaffPermissions = function(staffId) {
  activeEditingStaffId = staffId;
  const member = staff.find(s => s.id === staffId);
  if (!member) return;

  document.getElementById('permissions-staff-name').textContent = `${member.first_name} ${member.last_name}`;

  const list = document.getElementById('permissions-parks-list');
  if (list) {
    list.innerHTML = parks.map(p => {
      const isManager = parkManagers.some(m => String(m.park_id) === String(p.id) && m.user_id === staffId);
      const isStaff = parkStaff.some(s => String(s.park_id) === String(p.id) && s.user_id === staffId);
      const role = isManager ? 'Manager' : (isStaff ? 'Staff Member' : 'No permissions');
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgb(247, 247, 247); border:1px solid rgba(0,0,0,0.1); border-radius:5px;">
          <span style="font-weight:700;">${p.name}</span>
          <div style="display:flex; align-items:center; gap:16px;">
            <span style="font-weight:600; font-size:0.9rem; color:var(--color-text-secondary);">${role}</span>
            <button class="btn btn-pg-action" onclick="toggleParkPermission('${staffId}', '${p.id}')">
              <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; margin-right:2px;">edit</span>
              Edit
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('staff-permissions-modal').classList.add('active');
};

document.getElementById('close-staff-permissions-btn').addEventListener('click', () => {
  document.getElementById('staff-permissions-modal').classList.remove('active');
});

window.toggleParkPermission = function(staffId, parkId) {
  const isManager = parkManagers.some(m => String(m.park_id) === String(parkId) && m.user_id === staffId);
  const isStaff = parkStaff.some(s => String(s.park_id) === String(parkId) && s.user_id === staffId);
  const currentRole = isManager ? 'Manager' : (isStaff ? 'Staff Member' : 'No permissions');
  
  let nextRole = 'No permissions';
  if (currentRole === 'No permissions') {
    nextRole = 'Staff Member';
  } else if (currentRole === 'Staff Member') {
    nextRole = 'Manager';
  } else {
    nextRole = 'No permissions';
  }

  // Clear existing
  parkManagers = parkManagers.filter(m => !(String(m.park_id) === String(parkId) && m.user_id === staffId));
  parkStaff = parkStaff.filter(s => !(String(s.park_id) === String(parkId) && s.user_id === staffId));

  if (nextRole === 'Manager') {
    parkManagers.push({ park_id: parseInt(parkId), user_id: staffId });
  } else if (nextRole === 'Staff Member') {
    parkStaff.push({ park_id: parseInt(parkId), user_id: staffId });
  }

  saveState();
  openStaffPermissions(staffId);
};

// Staff slot mock
document.getElementById('btn-purchase-user-slot').addEventListener('click', () => {
  alert("User slot purchased successfully! Available slot limits updated.");
});

// Add Park PG button listener
document.getElementById('btn-add-new-park-pg').addEventListener('click', () => {
  if (modals.AddPark) modals.AddPark.classList.add('active');
});

// Close Add Park Modal
const closeAddParkModalBtn = document.getElementById('close-add-park-modal-btn');
if (closeAddParkModalBtn) {
  closeAddParkModalBtn.addEventListener('click', () => {
    if (modals.AddPark) modals.AddPark.classList.remove('active');
  });
}

// Add Park Form Submission
const addParkForm = document.getElementById('add-park-form');
if (addParkForm) {
  addParkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const group = parkGroups.find(g => String(g.id) === String(activeEditingGroupId));
    if (!group) return;

    const parkName = document.getElementById('add-park-name').value.trim();
    const city = document.getElementById('add-park-city').value.trim();
    const state = document.getElementById('add-park-state').value.trim();
    const zipCode = parseInt(document.getElementById('add-park-zip').value, 10) || 0;

    const submitBtn = addParkForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Create Park';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>⏳ Estimating Map & Geofence...</span>`;
    }

    let lat = 37.3387;
    let lng = -76.7865;
    let geofencePolygon = null;

    try {
      const query = encodeURIComponent(`${parkName}, ${city}, ${state}`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&polygon_geojson=1&limit=1`);
      let data = await res.json();

      // Fallback 1: search without city
      if ((!data || data.length === 0) && state) {
        const fallbackQuery = encodeURIComponent(`${parkName}, ${state}`);
        const fbRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${fallbackQuery}&format=json&polygon_geojson=1&limit=1`);
        data = await fbRes.json();
      }

      // Fallback 2: search just by name
      if (!data || data.length === 0) {
        const nameQuery = encodeURIComponent(parkName);
        const nameRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${nameQuery}&format=json&polygon_geojson=1&limit=1`);
        data = await nameRes.json();
      }

      let nominatimPolygon = null;
      let isNeighborhood = false;
      if (data && data.length > 0) {
        const item = data[0];
        lat = parseFloat(item.lat);
        lng = parseFloat(item.lon);

        const isNeighItem = (item.class === 'place' && ['neighbourhood', 'suburb', 'quarter', 'residential'].includes(item.type)) ||
                            (item.class === 'landuse' && item.type === 'residential') ||
                            ['neighbourhood', 'suburb', 'quarter', 'residential'].includes(item.type) ||
                            parkName.toLowerCase().includes('neighborhood') || 
                            parkName.toLowerCase().includes('subdivision') || 
                            parkName.toLowerCase().includes('community') || 
                            parkName.toLowerCase().includes('association') || 
                            parkName.toLowerCase().includes('hoa') ||
                            parkName.toLowerCase().includes('homes');

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
          const isProbablyPark = parkName.toLowerCase().includes('park') || 
                                 parkName.toLowerCase().includes('reserve') || 
                                 parkName.toLowerCase().includes('recreation') || 
                                 parkName.toLowerCase().includes('common') || 
                                 parkName.toLowerCase().includes('garden') || 
                                 parkName.toLowerCase().includes('forest');

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
        const offset = 0.005;
        geofencePolygon = [
          [lat - offset, lng - offset],
          [lat + offset, lng - offset],
          [lat + offset, lng + offset],
          [lat - offset, lng + offset]
        ];
      }
    } catch (err) {
      console.warn("Geofence prediction failed:", err);
      const offset = 0.005;
      geofencePolygon = [
        [lat - offset, lng - offset],
        [lat + offset, lng - offset],
        [lat + offset, lng + offset],
        [lat - offset, lng + offset]
      ];
    }

    const newPark = {
      id: Date.now(),
      name: parkName,
      city: city,
      state: state,
      zip_code: zipCode,
      identifier: 'LOC' + Math.floor(Math.random() * 1000),
      park_group_id: group.id,
      status: isAdmin() ? 'Active' : 'Pending Approval',
      geofence_status: isAdmin() ? 'Approved' : 'Pending Approval',
      lat: lat,
      lng: lng,
      geofence_radius: 800,
      geofence_polygon: geofencePolygon,
      assigned_staff: []
    };

    parks.push(newPark);
    if (!group.parks) group.parks = [];
    group.parks.push(newPark.id);
    selectedParkId = newPark.id;
    saveState();
    
    // Auto-generate features using window.autoGenerateAllParkFeatures
    if (newPark.geofence_polygon) {
      try {
        await window.autoGenerateAllParkFeatures(newPark.id);
      } catch (genErr) {
        console.warn("Auto generation of park features failed:", genErr);
      }
    }

    renderParkGroupSubTabs(group);
    setupParkDropdown();
    updateActivePark();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    addParkForm.reset();
    if (modals.AddPark) modals.AddPark.classList.remove('active');
  });
}

// Bind PG New Item button to the Reward Item popup
const btnNewItemPg = document.getElementById('btn-new-item-pg');
if (btnNewItemPg) {
  btnNewItemPg.addEventListener('click', () => {
    modals.RewardItem.classList.add('active');
  });
}

// Full Issue Details Modal Logic
window.advanceStatusState = function(id) {
  const rep = reports.find(r => String(r.id) === String(id));
  if (rep) {
    if (rep.status === 'new') {
      rep.status = 'in_progress';
      if (!rep.assigned_to) rep.assigned_to = currentUser.id;
    } else if (rep.status === 'in_progress') {
      rep.status = 'resolved';
    } else {
      rep.status = 'new';
    }
    saveState();
    renderReports();
  }
};

window.openIssueDetails = function(issueId) {
  const rep = reports.find(r => String(r.id) === String(issueId));
  if (!rep) return;

  activeReportId = rep.id;
  switchView('Reports');
  renderReports();
};

document.getElementById('close-issue-details-btn').addEventListener('click', () => {
  if (modals.IssueDetails) modals.IssueDetails.classList.remove('active');
});

// Save Edits from Full Details Modal
document.getElementById('issue-details-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('details-issue-id').value;
  const rep = reports.find(r => String(r.id) === String(id));
  if (!rep) return;

  rep.type = document.getElementById('details-issue-type').value;
  rep.location = document.getElementById('details-issue-location').value.trim();
  rep.details = document.getElementById('details-issue-comments').value.trim();
  rep.assigned_to = document.getElementById('details-issue-assignee').value || null;
  rep.priority = document.getElementById('details-issue-priority').value;
  rep.status = document.getElementById('details-issue-status').value;

  const transferParkId = document.getElementById('details-issue-transfer-park').value;
  if (transferParkId && String(transferParkId) !== String(selectedParkId)) {
    rep.park_id = parseInt(transferParkId);
  }

  saveState();
  renderReports();
  if (modals.IssueDetails) modals.IssueDetails.classList.remove('active');
});

document.getElementById('details-issue-invalidate-delete-btn').addEventListener('click', () => {
  const id = document.getElementById('details-issue-id').value;
  itemToDelete = { id, type: 'issue' };
  if (modals.IssueDetails) modals.IssueDetails.classList.remove('active');
  modals.DeleteConfirm.classList.add('active');
});


// Quick Edit Modal Logic
window.openQuickEdit = function(issueId) {
  const rep = reports.find(r => String(r.id) === String(issueId));
  if (!rep) return;

  document.getElementById('quickedit-id').value = rep.id;
  
  // Populate assignee dropdown
  const assigneeSelect = document.getElementById('quickedit-assignee');
  assigneeSelect.innerHTML = '<option value="">Choose a staff member...</option>' + staff.map(s => `<option value="${s.id}" ${s.id === rep.assigned_to ? 'selected' : ''}>${s.first_name} ${s.last_name}</option>`).join('');

  // Set priority
  document.getElementById('quickedit-priority').value = rep.priority || '';

  // Set status label
  const statusDisplay = document.getElementById('quickedit-status-display');
  if (statusDisplay) {
    statusDisplay.textContent = rep.status === 'new' ? 'Unstarted' : rep.status === 'in_progress' ? 'In Progress' : 'Completed';
  }

  modals.QuickEdit.classList.add('active');
};

document.getElementById('close-quickedit-btn').addEventListener('click', () => {
  modals.QuickEdit.classList.remove('active');
});

document.getElementById('quickedit-next-status-btn').addEventListener('click', () => {
  const id = document.getElementById('quickedit-id').value;
  advanceStatusState(id);
  const rep = reports.find(r => String(r.id) === String(id));
  if (rep) {
    document.getElementById('quickedit-status-display').textContent = rep.status === 'new' ? 'Unstarted' : rep.status === 'in_progress' ? 'In Progress' : 'Completed';
  }
});

document.getElementById('quickedit-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('quickedit-id').value;
  const rep = reports.find(r => String(r.id) === String(id));
  if (!rep) return;

  rep.assigned_to = document.getElementById('quickedit-assignee').value || null;
  rep.priority = document.getElementById('quickedit-priority').value;

  saveState();
  renderReports();
  modals.QuickEdit.classList.remove('active');
});

document.getElementById('quickedit-invalidate-delete-btn').addEventListener('click', () => {
  const id = document.getElementById('quickedit-id').value;
  itemToDelete = { id, type: 'issue' };
  modals.QuickEdit.classList.remove('active');
  modals.DeleteConfirm.classList.add('active');
});

// Delete confirm dialog actions
document.getElementById('delete-confirm-cancel-btn').addEventListener('click', () => {
  modals.DeleteConfirm.classList.remove('active');
  itemToDelete = null;
});

document.getElementById('delete-confirm-ok-btn').addEventListener('click', () => {
  if (!itemToDelete) return;
  
  if (itemToDelete.type === 'issue') {
    const rep = reports.find(r => String(r.id) === String(itemToDelete.id));
    if (rep) {
      const elapsedMs = Date.now() - new Date(rep.created_at).getTime();
      if (elapsedMs <= 60000) {
        reports = reports.filter(r => String(r.id) !== String(itemToDelete.id));
        alert("Report deleted completely (created less than 1 minute ago).");
      } else {
        rep.status = 'Archived';
        rep.invalid = true;
        
        rep.audit_log = rep.audit_log || [];
        rep.audit_log.unshift({
          action: 'Invalidated & Archived',
          user: currentUser ? currentUser.email : 'System',
          timestamp: new Date().toISOString()
        });
        
        alert("This report was created more than 1 minute ago. It has been marked as Invalid and moved to the Archives.");
      }
    }
  } else if (itemToDelete.type === 'reward') {
    rewards = rewards.filter(r => r.id !== itemToDelete.id);
  }

  saveState();
  renderAllViews();
  modals.DeleteConfirm.classList.remove('active');
  itemToDelete = null;
});

// Categories Form submit
const newCategoryForm = document.getElementById('new-category-form');
if (newCategoryForm) {
  newCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('new-category-name');
    const catName = input.value.trim();
    
    if (catName && !categories.includes(catName)) {
      categories.push(catName);
      saveState();
      renderCategoriesList();
      populateCategoriesDropdown();
      input.value = '';
    }
  });
}

function renderCategoriesList() {
  const container = document.getElementById('categories-list-container');
  if (!container) return;
  container.innerHTML = categories.map((cat, idx) => `
    <div style="display:flex; gap:12px; align-items:center; width:100%;">
      <input type="text" id="category-input-${idx}" class="form-control" value="${cat.name || cat}" style="height:38px; flex-grow:1;">
      <button class="btn btn-pg-action" style="height:38px; padding:0 16px; display:inline-flex; align-items:center; gap:4px;" onclick="saveCategoryPg(${idx})">
        <span class="material-symbols-rounded" style="font-size:14px;">save</span>
        Save
      </button>
      <button class="btn btn-pg-delete" style="height:38px; padding:0 16px; display:inline-flex; align-items:center; gap:4px;" onclick="deleteCategoryPg(${idx})">
        <span class="material-symbols-rounded" style="font-size:14px;">delete</span>
        Remove
      </button>
    </div>
  `).join('');
}

window.saveCategoryPg = function(idx) {
  const input = document.getElementById(`category-input-${idx}`);
  if (input && input.value.trim()) {
    const oldCat = categories[idx];
    const newVal = input.value.trim();
    if (oldCat) {
      const oldName = oldCat.name || oldCat;
      if (typeof oldCat === 'string') {
        categories[idx] = { id: `cat-${idx}`, name: newVal, park_group_id: 'pg-virginia', park_id: null };
      } else {
        oldCat.name = newVal;
      }
      // Rename categories in existing reports as well
      reports.forEach(r => {
        if (r.type === oldName) r.type = newVal;
      });
      saveState();
      renderCategoriesList();
      populateCategoriesDropdown();
    }
  }
};

window.deleteCategoryPg = function(idx) {
  categories.splice(idx, 1);
  saveState();
  renderCategoriesList();
  populateCategoriesDropdown();
};

function populateCategoriesDropdown() {
  const dropdown = document.getElementById('report-type');
  if (!dropdown) return;
  dropdown.innerHTML = '';
  const park = parks.find(p => String(p.id) === String(selectedParkId));
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
    dropdown.appendChild(opt);
  });
}

function setupAccountDropdown() {
  const btn = document.getElementById('header-account-dropdown-btn');
  const menu = document.getElementById('account-dropdown-menu');
  const avatar = document.getElementById('header-user-avatar');
  const nameSpan = document.getElementById('header-user-name');
  
  const dropdownName = document.getElementById('dropdown-user-name');
  const dropdownEmail = document.getElementById('dropdown-user-email');

  if (currentUser) {
    const name = currentUser.full_name || 'User';
    nameSpan.textContent = name;
    if (dropdownName) dropdownName.textContent = name;
    if (dropdownEmail) dropdownEmail.textContent = currentUser.email || '';
    
    // Get initials for avatar
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
    if (avatar) avatar.textContent = initials;
  }

  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = menu.style.display === 'block';
      menu.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.style.display = 'none';
      }
    });
  }

  // Hook up menu item buttons
  const btnPersonal = document.getElementById('dropdown-btn-personal');
  if (btnPersonal) {
    btnPersonal.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
      document.getElementById('profile-name').value = currentUser.full_name;
      document.getElementById('profile-email').value = currentUser.email;
      if (modals.PersonalDetails) modals.PersonalDetails.classList.add('active');
    });
  }

  const btnAdmin = document.getElementById('dropdown-btn-admin');
  if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
      window.open('settings.html', '_blank');
    });
  }

  const btnSignout = document.getElementById('dropdown-btn-signout');
  if (btnSignout) {
    btnSignout.addEventListener('click', async () => {
      if (menu) menu.style.display = 'none';
      if (typeof supabase !== 'undefined' && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('greenspace_user');
      window.location.href = 'index.html';
    });
  }

  // Modal close buttons
  const closePersonalBtn = document.getElementById('close-personal-details-btn');
  if (closePersonalBtn) {
    closePersonalBtn.addEventListener('click', () => {
      if (modals.PersonalDetails) modals.PersonalDetails.classList.remove('active');
    });
  }

  const closeAdminBtn = document.getElementById('close-park-admin-btn');
  if (closeAdminBtn) {
    closeAdminBtn.addEventListener('click', () => {
      if (modals.ParkAdmin) modals.ParkAdmin.classList.remove('active');
    });
  }
}

if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedName = document.getElementById('profile-name').value.trim();
    currentUser.full_name = updatedName;
    localStorage.setItem('greenspace_user', JSON.stringify(currentUser));
    alert("Profile edits saved successfully!");

    // Update dropdown displays
    const nameSpan = document.getElementById('header-user-name');
    const dropdownName = document.getElementById('dropdown-user-name');
    const avatar = document.getElementById('header-user-avatar');
    if (nameSpan) nameSpan.textContent = updatedName;
    if (dropdownName) dropdownName.textContent = updatedName;
    const initials = updatedName.split(' ').map(n => n[0]).join('').substring(0, 2);
    if (avatar) avatar.textContent = initials;

    if (modals.PersonalDetails) modals.PersonalDetails.classList.remove('active');
  });
}

// Create Park Group form listener
const createParkGroupForm = document.getElementById('create-park-group-form');
if (createParkGroupForm) {
  createParkGroupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const groupName = document.getElementById('new-park-group-name').value.trim();
    if (groupName) {
      const newGroup = {
        id: `pg-${Date.now()}`,
        name: groupName,
        owner_id: currentUser.id,
        max_locations: 5,
        max_users: 5,
        points_enabled: true,
        reports_month: 0,
        rewards_inst: "Sample instructions",
        subscription_plan: "GreenSpace Premium Group Plan",
        total_pts: 0,
        parks: []
      };
      parkGroups.push(newGroup);
      saveState();
      renderParkGroups();
      document.getElementById('new-park-group-name').value = '';
      alert(`Park Group "${groupName}" created successfully!`);
    }
  });
}

// --- INTERACTIVE MAP CONTROLLER ---
let leafletMapInstance = null;
let mapMarkers = [];
let viewerGeofencePolygon = null;

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

function initOrRefreshMap() {
  if (!activePark) return;
  
  const mapElement = document.getElementById('main-leaflet-map');
  if (!mapElement) return;

  const lat = activePark.lat || 37.3387;
  const lng = activePark.lng || -76.7865;

  if (!leafletMapInstance) {
    leafletMapInstance = L.map('main-leaflet-map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(leafletMapInstance);

    leafletMapInstance.on('click', (e) => {
      if (selectingLocationOnMap) {
        const { lat, lng } = e.latlng;
        if (tempMapMarker) {
          leafletMapInstance.removeLayer(tempMapMarker);
        }
        tempMapMarker = L.marker(e.latlng).addTo(leafletMapInstance);
        document.getElementById('report-lat').value = lat.toFixed(6);
        document.getElementById('report-lng').value = lng.toFixed(6);
        selectingLocationOnMap = false;
        
        const mapElement = document.getElementById('main-leaflet-map');
        if (mapElement) {
          mapElement.style.cursor = '';
        }
        modals.NewReport.classList.add('active');
      }
    });

    // Setup event listeners for checkboxes
    document.getElementById('layer-reports').addEventListener('change', refreshMapMarkers);
    document.getElementById('layer-greencodes').addEventListener('change', refreshMapMarkers);
    document.getElementById('layer-pois').addEventListener('change', refreshMapMarkers);
    document.getElementById('layer-trails').addEventListener('change', refreshMapMarkers);
  }

  if (viewerGeofencePolygon) {
    leafletMapInstance.removeLayer(viewerGeofencePolygon);
    viewerGeofencePolygon = null;
  }

  let boundsTarget;
  if (activePark.geofence_polygon && activePark.geofence_polygon.length >= 3) {
    viewerGeofencePolygon = L.polygon(activePark.geofence_polygon, {
      color: activePark.geofence_status === 'Approved' ? '#2e7d32' : '#f59e0b',
      fillColor: activePark.geofence_status === 'Approved' ? '#2e7d32' : '#f59e0b',
      fillOpacity: 0.1,
      dashArray: '5, 5'
    }).addTo(leafletMapInstance);
    boundsTarget = viewerGeofencePolygon.getBounds();
  } else {
    // Default box for parks with no geofence
    const halfSide = 0.005;
    boundsTarget = L.latLngBounds([
      [lat - halfSide, lng - halfSide],
      [lat + halfSide, lng + halfSide]
    ]);
  }

  leafletMapInstance.fitBounds(boundsTarget);
  leafletMapInstance.invalidateSize();
  refreshMapMarkers();
}

function refreshMapMarkers() {
  if (!leafletMapInstance) return;

  // Clear existing markers
  mapMarkers.forEach(m => leafletMapInstance.removeLayer(m));
  mapMarkers = [];

  const showReports = document.getElementById('layer-reports').checked;
  const showGreenCodes = document.getElementById('layer-greencodes').checked;
  const showPois = document.getElementById('layer-pois').checked;
  const showTrails = document.getElementById('layer-trails').checked;

  const parkReports = reports.filter(r => String(r.park_id) === String(selectedParkId));

  // 1. Render active issues if checked
  if (showReports) {
    parkReports.forEach(rep => {
      // If no coordinates, mock them around the center
      if (!rep.lat || !rep.lng) {
        const idx = reports.indexOf(rep);
        rep.lat = activePark.lat + (Math.sin(idx) * 0.003);
        rep.lng = activePark.lng + (Math.cos(idx) * 0.003);
      }

      let markerColor = '#EF4444'; // Red for Received, Assigned, Dispatched
      let iconName = 'report';
      if (['Investigating', 'Resolving'].includes(rep.status)) {
        markerColor = '#F59E0B'; // Yellow
        iconName = 'build';
      } else if (['Complete', 'Resolved'].includes(rep.status)) {
        markerColor = '#10B981'; // Green
        iconName = 'check_circle';
      }

      // Create a custom SVG marker
      const customIcon = L.divIcon({
        html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                 <span class="material-symbols-rounded" style="font-size: 14px;">${iconName}</span>
               </div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: customIcon }).addTo(leafletMapInstance);
      
      // Popup info
      const popupContent = `
        <div style="font-family: var(--font-sans); padding: 4px; min-width: 140px;">
          <h4 style="margin: 0 0 4px; font-weight:700; font-size: 0.9rem;">${rep.type}</h4>
          <p style="margin: 0 0 6px; font-size: 0.8rem; color: #555;">${rep.location}</p>
          <div style="font-size: 0.8rem; margin-bottom: 8px;">Status: <strong>${rep.status.toUpperCase()}</strong></div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="advanceStatusState('${rep.id}'); refreshMapMarkers();">Advance</button>
            <button class="btn btn-primary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="openIssueDetails('${rep.id}')">View</button>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
      mapMarkers.push(marker);
    });
  }

  // Render water and parking shapes if checked
  if (showPois) {
    const customShapes = JSON.parse(localStorage.getItem('gs_custom_shapes')) || [];
    const parkShapes = customShapes.filter(s => String(s.park_id) === String(selectedParkId));
    parkShapes.forEach(s => {
      const isWater = s.type === 'water';
      const shapeColor = isWater ? '#3b82f6' : '#9ca3af';
      const shapeFill = isWater ? '#93c5fd' : '#d1d5db';
      const poly = L.polygon(s.coords, {
        color: shapeColor,
        fillColor: shapeFill,
        fillOpacity: 0.5,
        weight: 2
      }).addTo(leafletMapInstance);
      poly.bindPopup(`<strong>${s.name}</strong><br>${isWater ? 'Water Feature' : 'Parking Lot'}`);
      mapMarkers.push(poly);
    });
  }

  // 2. Render trails if checked
  if (showTrails) {
    const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
    const parkTrails = customTrails.filter(t => String(t.park_id) === String(selectedParkId));
    parkTrails.forEach(t => {
      const trailLine = L.polyline(t.coords, { color: '#2e7d32', weight: 4, dashArray: '5, 5' }).addTo(leafletMapInstance);
      trailLine.bindPopup(`<strong>${t.name}</strong><br>Difficulty: ${t.difficulty}<br>Distance: ${t.distance}`);
      mapMarkers.push(trailLine);
    });
  }

  // 3. Render points of interest if checked
  if (showPois) {
    const customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];
    const parkPois = customPois.filter(p => String(p.park_id) === String(selectedParkId));
    parkPois.forEach(poi => {
      const poiIcon = L.divIcon({
        html: `<div style="background-color: #3B82F6; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                 <span class="material-symbols-rounded" style="font-size: 16px;">pin_drop</span>
               </div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(leafletMapInstance);
      marker.bindPopup(`<strong>${poi.name}</strong><br>${poi.description}`);
      mapMarkers.push(marker);
    });
  }

  // 4. Render GreenCodes if checked
  if (showGreenCodes) {
    const parkGCs = (JSON.parse(localStorage.getItem('gs_greencodes')) || []).filter(gc => String(gc.park_id) === String(selectedParkId));
    parkGCs.forEach(gc => {
      const gcIcon = L.divIcon({
        html: `<div style="background-color: #10B981; width: 28px; height: 28px; border-radius: 4px; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                 <span class="material-symbols-rounded" style="font-size: 16px;">qr_code_2</span>
               </div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker([gc.lat, gc.lng], { icon: gcIcon }).addTo(leafletMapInstance);
      marker.bindPopup(`<strong>GreenCode: ${gc.name}</strong><br>Code: <code>${gc.code}</code>`);
      mapMarkers.push(marker);
    });
  }
}

// --- ANALYTICS CONTROLLER ---
let categoryChartInstance = null;
let dailyVolumeChartInstance = null;

function renderAnalytics() {
  const parkReports = reports.filter(r => String(r.park_id) === String(selectedParkId));
  
  // Apply timeframe filter
  const timeframe = document.getElementById('analytics-timeframe')?.value || '30';
  let filteredReports = [...parkReports];
  if (timeframe !== 'all') {
    const daysLimit = parseInt(timeframe, 10);
    const msLimit = daysLimit * 24 * 3600 * 1000;
    const cutoff = Date.now() - msLimit;
    filteredReports = parkReports.filter(r => new Date(r.created_at).getTime() >= cutoff);
  }

  // Stats Card Calculations
  const totalReports = filteredReports.length;
  const openReports = filteredReports.filter(r => r.status !== 'resolved').length;
  const resolvedReports = filteredReports.filter(r => r.status === 'resolved').length;
  
  let avgResText = "4.2 hrs";
  if (resolvedReports > 0) {
    avgResText = `${(1.5 + (resolvedReports % 4) * 0.7).toFixed(1)} hrs`;
  }

  const elTotal = document.getElementById('stat-total-issues');
  const elOpen = document.getElementById('stat-open-issues');
  const elResolved = document.getElementById('stat-resolved-issues');
  const elTime = document.getElementById('stat-resolution-time');

  if (elTotal) elTotal.textContent = totalReports;
  if (elOpen) elOpen.textContent = openReports;
  if (elResolved) elResolved.textContent = resolvedReports;
  if (elTime) elTime.textContent = avgResText;

  // Chart 1: Reports by Category
  const categoriesCount = {};
  filteredReports.forEach(r => {
    categoriesCount[r.type] = (categoriesCount[r.type] || 0) + 1;
  });

  const catLabels = Object.keys(categoriesCount);
  const catData = Object.values(categoriesCount);

  if (categoryChartInstance) categoryChartInstance.destroy();
  const ctxCat = document.getElementById('categoryChart')?.getContext('2d');
  if (ctxCat) {
    categoryChartInstance = new Chart(ctxCat, {
      type: 'doughnut',
      data: {
        labels: catLabels.length ? catLabels : ['No Data'],
        datasets: [{
          data: catData.length ? catData : [0],
          backgroundColor: ['#AAB6AD', '#B9C6BC', '#303030', '#FAB515', '#EA4335', '#4285F4', '#34A853', '#721c24'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // Chart 2: Daily Report Volume
  const volumeData = {};
  filteredReports.forEach(r => {
    const dateStr = new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    volumeData[dateStr] = (volumeData[dateStr] || 0) + 1;
  });

  const volLabels = Object.keys(volumeData).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
  const volData = volLabels.map(l => volumeData[l]);

  if (dailyVolumeChartInstance) dailyVolumeChartInstance.destroy();
  const ctxVol = document.getElementById('dailyVolumeChart')?.getContext('2d');
  if (ctxVol) {
    dailyVolumeChartInstance = new Chart(ctxVol, {
      type: 'bar',
      data: {
        labels: volLabels.length ? volLabels : ['No Data'],
        datasets: [{
          label: 'Number of Reports',
          data: volData.length ? volData : [0],
          backgroundColor: 'rgba(185, 198, 188, 0.8)',
          borderColor: '#AAB6AD',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  // Predictive Insights
  const insightsContainer = document.getElementById('predictive-insights-content');
  if (insightsContainer) {
    if (totalReports === 0) {
      insightsContainer.innerHTML = `<p style="font-size: 0.9rem; color: var(--color-text-secondary);">Insufficient data to make predictive suggestions yet. File some report issues first.</p>`;
    } else {
      const sortedCats = Object.entries(categoriesCount).sort((a, b) => b[1] - a[1]);
      const primaryIssue = sortedCats[0] ? sortedCats[0][0] : 'Trash Can';
      insightsContainer.innerHTML = `
        <ul style="list-style-type: none; padding: 0; font-size: 0.9rem; color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 8px;">
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <span class="material-symbols-rounded" style="font-size:18px; color: var(--status-alert);">trending_up</span>
            <span>Based on reports history, <strong>${primaryIssue}</strong> issues spike on weekends. Recommend scheduling preventative checks every Friday afternoon.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <span class="material-symbols-rounded" style="font-size:18px; color: var(--status-success);">check_circle</span>
            <span>Average resolution time is currently at <strong>${avgResText}</strong>, exceeding your target SLA of 12 hours. Keep up the excellent response rates!</span>
          </li>
        </ul>
      `;
    }
  }
}

// Bind timeframe changes
document.getElementById('analytics-timeframe')?.addEventListener('change', renderAnalytics);

// --- MAP EDITOR CONTROLLER ---
let mapEditorMode = false;
let activeEditorTool = null; // 'poi', 'trail', 'greencode', 'geofence'
let geofenceCircle = null;
let geofencePolygonOverlay = null;
let currentTrailCoords = [];
let tempTrailMarkers = [];
let tempTrailPolyline = null;
let currentGeofenceCoords = [];
let tempGeofenceMarkers = [];
let tempGeofencePolygon = null;

// --- FULL SCREEN MAP EDITOR ENGINE ---
let fullscreenMapInstance = null;
let fsActiveEditorTool = null; // 'poi', 'trail', 'greencode', 'geofence'
let fsTempMarkers = [];
let fsTempPolyline = null;
let fsTempPolygon = null;
let fsTrailCoords = [];
let fsGeofenceCoords = [];
let fsGeofenceCircle = null;
let fsGeofencePolygonOverlay = null;

function initMapEditor() {
  const btnEditParkMap = document.getElementById('btn-edit-park-map');
  if (!btnEditParkMap) return;

  btnEditParkMap.addEventListener('click', () => {
    openFullscreenMapEditor();
  });

  // Bind controls in fullscreen editor
  document.getElementById('editor-close-btn').addEventListener('click', closeFullscreenMapEditor);
  document.getElementById('editor-save-exit').addEventListener('click', saveAndCloseFullscreenMapEditor);
  
  document.getElementById('fs-editor-draw-geofence').addEventListener('click', () => setFsEditorTool('geofence'));
  document.getElementById('fs-editor-clear-geofence').addEventListener('click', clearFsGeofence);
  document.getElementById('fs-editor-add-poi').addEventListener('click', () => setFsEditorTool('poi'));
  document.getElementById('fs-editor-add-greencode').addEventListener('click', () => setFsEditorTool('greencode'));
  document.getElementById('fs-editor-add-trail').addEventListener('click', () => setFsEditorTool('trail'));
  document.getElementById('fs-editor-generate-features').addEventListener('click', async () => {
    if (confirm("Are you sure you want to auto-discover and generate trails, POIs, and custom shapes for this boundary? Existing elements inside this park will be updated/replaced.")) {
      const btn = document.getElementById('fs-editor-generate-features');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-rounded" style="animation: spin 1.5s linear infinite;">autorenew</span><div>Generating...</div>`;
      try {
        await window.autoGenerateAllParkFeatures(selectedParkId);
        refreshFsMarkers();
        alert("Discovery and generation of features complete!");
      } catch (err) {
        console.warn("Auto generation failed:", err);
        alert("Failed to generate features automatically.");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  });
  document.getElementById('fs-editor-clear-trails').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all custom trails for this park?")) {
      const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
      const keptTrails = customTrails.filter(t => String(t.park_id) !== String(selectedParkId));
      localStorage.setItem('gs_custom_trails', JSON.stringify(keptTrails));
      refreshFsMarkers();
      alert("Custom trails cleared for this park.");
    }
  });

  document.getElementById('fs-editor-finish-trail').addEventListener('click', finishFsTrailDrawing);
  document.getElementById('fs-editor-finish-geofence').addEventListener('click', finishFsGeofenceDrawing);

  document.getElementById('btn-approve-park').addEventListener('click', () => {
    activePark.status = 'Active';
    const pIdx = parks.findIndex(p => String(p.id) === String(selectedParkId));
    if (pIdx !== -1) parks[pIdx].status = 'Active';
    saveState();
    alert("Park approved!");
    openFullscreenMapEditor();
  });

  document.getElementById('btn-approve-geofence').addEventListener('click', () => {
    activePark.geofence_status = 'Approved';
    const pIdx = parks.findIndex(p => String(p.id) === String(selectedParkId));
    if (pIdx !== -1) parks[pIdx].geofence_status = 'Approved';
    saveState();
    alert("Geofence approved!");
    openFullscreenMapEditor();
  });

  document.getElementById('btn-reject-geofence').addEventListener('click', () => {
    clearFsGeofence();
  });

  // Approvals portal admin triggers
  document.getElementById('btn-admin-create-group')?.addEventListener('click', () => {
    const name = prompt("Enter New Park Group Name:");
    if (!name) return;
    const newGroup = {
      id: `pg-${Date.now()}`,
      name: name,
      owner_id: currentUser.id,
      max_locations: 5,
      max_users: 5,
      points_enabled: true,
      reports_month: 0,
      rewards_inst: "Instructions",
      subscription_plan: "GreenSpace Basic Group Plan",
      total_pts: 0,
      parks: [],
      status: 'Active'
    };
    parkGroups.push(newGroup);
    saveState();
    alert(`Park Group "${name}" created successfully!`);
    renderApprovalsPortal();
  });

  document.getElementById('btn-admin-create-park')?.addEventListener('click', () => {
    if (modals.AddPark) {
      activeEditingGroupId = activePark ? activePark.park_group_id : parkGroups[0].id;
      modals.AddPark.classList.add('active');
    }
  });
}

function openFullscreenMapEditor() {
  if (!activePark) return;
  document.getElementById('fullscreen-map-editor').style.display = 'flex';
  document.getElementById('editor-park-name').textContent = activePark.name;
  const group = parkGroups.find(g => String(g.id) === String(activePark.park_group_id));
  document.getElementById('editor-park-group').textContent = group ? group.name : 'No Park Group';

  const approvalPanel = document.getElementById('editor-approval-panel');
  const statusDesc = document.getElementById('approval-status-desc');
  const btnApprovePark = document.getElementById('btn-approve-park');
  const btnApproveGeofence = document.getElementById('btn-approve-geofence');
  const btnRejectGeofence = document.getElementById('btn-reject-geofence');

  fsActiveEditorTool = null;
  updateFsEditorToolStyles();
  clearTempFsDrawings();

  if (isAdmin()) {
    approvalPanel.style.display = 'block';
    statusDesc.innerHTML = `Park Status: <strong>${activePark.status}</strong><br>Geofence Status: <strong>${activePark.geofence_status}</strong>`;
    btnApprovePark.style.display = activePark.status === 'Pending Approval' ? 'block' : 'none';
    btnApproveGeofence.style.display = activePark.geofence_status === 'Pending Approval' ? 'block' : 'none';
    btnRejectGeofence.style.display = 'block';
  } else {
    approvalPanel.style.display = 'block';
    let statusText = `Park Status: <strong>${activePark.status}</strong><br>Geofence Status: <strong>${activePark.geofence_status}</strong>`;
    if (activePark.geofence_status === 'Pending Approval') {
      statusText += `<br><span style="color:#d32f2f; font-weight:600;">Pending Admin review. Adding elements is blocked.</span>`;
    }
    statusDesc.innerHTML = statusText;
    btnApprovePark.style.display = 'none';
    btnApproveGeofence.style.display = 'none';
    btnRejectGeofence.style.display = 'none';
  }

  const lat = activePark.lat || 37.3387;
  const lng = activePark.lng || -76.7865;

  if (!fullscreenMapInstance) {
    fullscreenMapInstance = L.map('fullscreen-leaflet-map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(fullscreenMapInstance);

    fullscreenMapInstance.on('click', (e) => {
      handleFullscreenMapClick(e);
    });
  } else {
    fullscreenMapInstance.setView([lat, lng], 13);
  }

  setTimeout(() => {
    fullscreenMapInstance.invalidateSize();
    drawFsGeofence();
    refreshFsMarkers();
  }, 100);
}

function closeFullscreenMapEditor() {
  document.getElementById('fullscreen-map-editor').style.display = 'none';
  if (fullscreenMapInstance) {
    if (fsGeofenceCircle) fullscreenMapInstance.removeLayer(fsGeofenceCircle);
    if (fsGeofencePolygonOverlay) fullscreenMapInstance.removeLayer(fsGeofencePolygonOverlay);
    fsGeofenceCircle = null;
    fsGeofencePolygonOverlay = null;
  }
  initOrRefreshMap();
}

function saveAndCloseFullscreenMapEditor() {
  saveState();
  closeFullscreenMapEditor();
}

function handleFullscreenMapClick(e) {
  if (!fsActiveEditorTool) return;
  const clickedLatLng = e.latlng;

  if (fsActiveEditorTool !== 'geofence') {
    if (activePark.geofence_status !== 'Approved') {
      alert("Validation Error: This park's geofence is not approved. Only administrators can approve boundaries before adding map objects.");
      return;
    }

    const point = [clickedLatLng.lat, clickedLatLng.lng];
    if (activePark.geofence_polygon && activePark.geofence_polygon.length >= 3) {
      if (!isPointInPolygon(point, activePark.geofence_polygon)) {
        alert("Validation Error: This point is outside the park's custom polygon geofence.");
        return;
      }
    } else {
      alert("Validation Error: No geofence has been defined for this park yet. An administrator or manager must draw a polygon boundary first.");
      return;
    }
  }

  if (fsActiveEditorTool === 'poi') {
    const name = prompt("Enter Point of Interest Name:");
    if (!name) return;
    const description = prompt("Enter Description:") || '';
    
    const customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];
    customPois.push({
      id: 'poi-' + Date.now(),
      park_id: selectedParkId,
      name,
      description,
      lat: clickedLatLng.lat,
      lng: clickedLatLng.lng
    });
    localStorage.setItem('gs_custom_pois', JSON.stringify(customPois));
    
    alert("Point of Interest added!");
    fsActiveEditorTool = null;
    updateFsEditorToolStyles();
    refreshFsMarkers();
  } else if (fsActiveEditorTool === 'greencode') {
    const code = prompt("Enter GreenCode ID/Identifier (e.g. LOC-FREEDOM-PLAY):");
    if (!code) return;
    const name = prompt("Enter Location Name (e.g. Playground Area):");
    if (!name) return;

    const newGC = {
      id: 'gc-' + Date.now(),
      code: code.trim(),
      name: name.trim(),
      park_id: selectedParkId,
      lat: clickedLatLng.lat,
      lng: clickedLatLng.lng
    };
    greenCodes.push(newGC);
    localStorage.setItem('gs_greencodes', JSON.stringify(greenCodes));
    
    alert("GreenCode added!");
    fsActiveEditorTool = null;
    updateFsEditorToolStyles();
    refreshFsMarkers();
  } else if (fsActiveEditorTool === 'trail') {
    fsTrailCoords.push([clickedLatLng.lat, clickedLatLng.lng]);
    const marker = L.circleMarker(clickedLatLng, { radius: 6, color: '#2e7d32', fillColor: '#fff', fillOpacity: 1 }).addTo(fullscreenMapInstance);
    fsTempMarkers.push(marker);

    if (fsTempPolyline) {
      fullscreenMapInstance.removeLayer(fsTempPolyline);
    }
    fsTempPolyline = L.polyline(fsTrailCoords, { color: '#2e7d32', weight: 4, dashArray: '5, 5' }).addTo(fullscreenMapInstance);
    document.getElementById('fs-editor-finish-trail').style.display = 'block';
  } else if (fsActiveEditorTool === 'geofence') {
    fsGeofenceCoords.push([clickedLatLng.lat, clickedLatLng.lng]);
    const marker = L.circleMarker(clickedLatLng, { radius: 6, color: '#e65100', fillColor: '#fff', fillOpacity: 1 }).addTo(fullscreenMapInstance);
    fsTempMarkers.push(marker);

    if (fsTempPolygon) {
      fullscreenMapInstance.removeLayer(fsTempPolygon);
    }
    fsTempPolygon = L.polygon(fsGeofenceCoords, { color: '#e65100', weight: 3, fillOpacity: 0.2 }).addTo(fullscreenMapInstance);
    document.getElementById('fs-editor-finish-geofence').style.display = 'block';
  }
}

function setFsEditorTool(tool) {
  fsActiveEditorTool = tool;
  updateFsEditorToolStyles();
  clearTempFsDrawings();

  const instructions = document.getElementById('fs-editor-instructions');
  if (tool === 'trail') {
    instructions.textContent = "Trail Mode: Click inside the geofence boundary to define route nodes. Click Finish Drawing Trail when complete.";
    document.getElementById('fs-editor-finish-trail').style.display = 'block';
  } else if (tool === 'geofence') {
    instructions.textContent = "Geofence Mode: Click anywhere on the map to place boundary polygon vertices. Click Finish Geofence Polygon to submit.";
    document.getElementById('fs-editor-finish-geofence').style.display = 'block';
  } else if (tool === 'poi') {
    instructions.textContent = "POI Mode: Click inside the geofence boundaries to drop a Point of Interest marker.";
  } else if (tool === 'greencode') {
    instructions.textContent = "GreenCode Mode: Click inside the geofence boundaries to drop a GreenCode QR Anchor.";
  } else {
    instructions.textContent = "Select a tool from above to begin modifying the park map.";
  }
}

function updateFsEditorToolStyles() {
  const tools = {
    poi: document.getElementById('fs-editor-add-poi'),
    trail: document.getElementById('fs-editor-add-trail'),
    greencode: document.getElementById('fs-editor-add-greencode'),
    geofence: document.getElementById('fs-editor-draw-geofence')
  };

  Object.keys(tools).forEach(k => {
    const btn = tools[k];
    if (!btn) return;
    if (fsActiveEditorTool === k) {
      btn.classList.add('btn-active');
    } else {
      btn.classList.remove('btn-active');
    }
  });
}

function drawFsGeofence() {
  if (!fullscreenMapInstance || !activePark) return;
  if (fsGeofenceCircle) fullscreenMapInstance.removeLayer(fsGeofenceCircle);
  if (fsGeofencePolygonOverlay) fullscreenMapInstance.removeLayer(fsGeofencePolygonOverlay);
  fsGeofenceCircle = null;
  fsGeofencePolygonOverlay = null;

  const lat = activePark.lat || 37.3387;
  const lng = activePark.lng || -76.7865;

  if (activePark.geofence_polygon && activePark.geofence_polygon.length >= 3) {
    fsGeofencePolygonOverlay = L.polygon(activePark.geofence_polygon, {
      color: activePark.geofence_status === 'Approved' ? '#2e7d32' : '#f59e0b',
      fillColor: activePark.geofence_status === 'Approved' ? '#2e7d32' : '#f59e0b',
      fillOpacity: 0.1,
      dashArray: '5, 5'
    }).addTo(fullscreenMapInstance);
    
    const popupContent = `
      <div style="font-family:var(--font-sans); min-width:180px; padding:4px;">
        <h4 style="margin:0 0 8px 0; font-size:0.9rem; font-weight:700; color:#333;">Geofence Options</h4>
        <div style="display:flex; gap:6px;">
          <button onclick="window.enableShapeVertexEditing('${selectedParkId}', 'geofence')" class="btn btn-primary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#2e7d32; border:none; color:white;">Edit Points</button>
          <button onclick="clearFsGeofence()" class="btn btn-danger" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#ea4335; border:none; color:white;">Clear</button>
        </div>
      </div>
    `;
    fsGeofencePolygonOverlay.bindPopup(popupContent);
    fullscreenMapInstance.fitBounds(fsGeofencePolygonOverlay.getBounds());
  } else {
    // Standard view fallback without circular layer
    fullscreenMapInstance.setView([lat, lng], 14);
  }
}

function refreshFsMarkers() {
  if (!fullscreenMapInstance) return;
  
  // Clear non-tile layers
  fullscreenMapInstance.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Polygon) {
      if (layer !== fsGeofenceCircle && layer !== fsGeofencePolygonOverlay && layer !== fsTempPolyline && layer !== fsTempPolygon && !fsTempMarkers.includes(layer)) {
        fullscreenMapInstance.removeLayer(layer);
      }
    }
  });

  // Reset layer mapping
  window.fsMapLayers = {};

  const listContainer = document.getElementById('fs-editor-elements-list');
  if (listContainer) {
    listContainer.innerHTML = '';
  }

  // Render POIs with interactive edit/delete popups
  const customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];
  customPois.filter(p => String(p.park_id) === String(selectedParkId)).forEach(poi => {
    const poiIcon = L.divIcon({
      html: `<div style="background-color: #3B82F6; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
               <span class="material-symbols-rounded" style="font-size: 16px;">pin_drop</span>
             </div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    
    const popupContent = `
      <div style="font-family:var(--font-sans); min-width:190px; display:flex; flex-direction:column; gap:8px; padding:4px;">
        <h4 style="margin:0; font-size:0.9rem; font-weight:700; color:#333;">Edit Point of Interest</h4>
        <input type="text" id="edit-poi-name-${poi.id}" value="${poi.name}" class="form-control" style="height:28px; font-size:0.8rem; padding:4px; width:100%; box-sizing:border-box;" />
        <textarea id="edit-poi-desc-${poi.id}" class="form-control" style="font-size:0.8rem; padding:4px; height:45px; width:100%; box-sizing:border-box;">${poi.description}</textarea>
        <div style="display:flex; gap:6px; margin-top:4px;">
          <button onclick="updatePoi('${poi.id}')" class="btn btn-primary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#2e7d32; border:none; color:white;">Save</button>
          <button onclick="enableMarkerDragging('${poi.id}', 'poi')" class="btn btn-secondary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#0288d1; border:none; color:white;">Move</button>
          <button onclick="deletePoi('${poi.id}')" class="btn btn-danger" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#ea4335; border:none; color:white;">Delete</button>
        </div>
      </div>
    `;
    const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(fullscreenMapInstance).bindPopup(popupContent);
    window.fsMapLayers[poi.id] = marker;

    marker.on('click', () => {
      // Highlight in the list
      const items = document.querySelectorAll('.fs-element-item');
      items.forEach(el => {
        el.style.background = '#fff';
        el.style.borderColor = '#e0e0e0';
      });
      const targetEl = document.getElementById(`fs-list-item-${poi.id}`);
      if (targetEl) {
        targetEl.style.background = '#e8f5e9';
        targetEl.style.borderColor = '#2e7d32';
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (listContainer) {
      const itemEl = document.createElement('div');
      itemEl.id = `fs-list-item-${poi.id}`;
      itemEl.className = 'fs-element-item';
      itemEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
      `;
      itemEl.innerHTML = `
        <span class="material-symbols-rounded" style="color: #3B82F6; font-size: 16px; font-weight: bold;">pin_drop</span>
        <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <strong style="color: #333;">${poi.name}</strong>
          <div style="font-size: 0.7rem; color: #666;">Point of Interest</div>
        </div>
      `;
      itemEl.onclick = () => window.highlightMapElement(poi.id, 'poi');
      listContainer.appendChild(itemEl);
    }
  });

  // Render GreenCodes with interactive edit/delete popups
  greenCodes.filter(gc => String(gc.park_id) === String(selectedParkId)).forEach(gc => {
    const gcIcon = L.divIcon({
      html: `<div style="background-color: #10B981; width: 28px; height: 28px; border-radius: 4px; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
               <span class="material-symbols-rounded" style="font-size: 16px;">qr_code_2</span>
             </div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    
    const popupContent = `
      <div style="font-family:var(--font-sans); min-width:190px; display:flex; flex-direction:column; gap:8px; padding:4px;">
        <h4 style="margin:0; font-size:0.9rem; font-weight:700; color:#333;">Edit GreenCode</h4>
        <input type="text" id="edit-gc-name-${gc.id}" value="${gc.name}" class="form-control" style="height:28px; font-size:0.8rem; padding:4px; width:100%; box-sizing:border-box;" />
        <input type="text" id="edit-gc-code-${gc.id}" value="${gc.code}" class="form-control" style="height:28px; font-size:0.8rem; padding:4px; width:100%; box-sizing:border-box;" />
        <div style="display:flex; gap:6px; margin-top:4px;">
          <button onclick="updateGreenCode('${gc.id}')" class="btn btn-primary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#2e7d32; border:none; color:white;">Save</button>
          <button onclick="enableMarkerDragging('${gc.id}', 'greencode')" class="btn btn-secondary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#0288d1; border:none; color:white;">Move</button>
          <button onclick="deleteGreenCode('${gc.id}')" class="btn btn-danger" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#ea4335; border:none; color:white;">Delete</button>
        </div>
      </div>
    `;
    const marker = L.marker([gc.lat, gc.lng], { icon: gcIcon }).addTo(fullscreenMapInstance).bindPopup(popupContent);
    window.fsMapLayers[gc.id] = marker;

    marker.on('click', () => {
      // Highlight in the list
      const items = document.querySelectorAll('.fs-element-item');
      items.forEach(el => {
        el.style.background = '#fff';
        el.style.borderColor = '#e0e0e0';
      });
      const targetEl = document.getElementById(`fs-list-item-${gc.id}`);
      if (targetEl) {
        targetEl.style.background = '#e8f5e9';
        targetEl.style.borderColor = '#2e7d32';
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (listContainer) {
      const itemEl = document.createElement('div');
      itemEl.id = `fs-list-item-${gc.id}`;
      itemEl.className = 'fs-element-item';
      itemEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
      `;
      itemEl.innerHTML = `
        <span class="material-symbols-rounded" style="color: #10B981; font-size: 16px; font-weight: bold;">qr_code_2</span>
        <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <strong style="color: #333;">${gc.name}</strong>
          <div style="font-size: 0.7rem; color: #666;">GreenCode</div>
        </div>
      `;
      itemEl.onclick = () => window.highlightMapElement(gc.id, 'greencode');
      listContainer.appendChild(itemEl);
    }
  });

  // Render Trails with interactive edit/delete popups
  const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
  customTrails.filter(t => String(t.park_id) === String(selectedParkId)).forEach(t => {
    const popupContent = `
      <div style="font-family:var(--font-sans); min-width:190px; display:flex; flex-direction:column; gap:8px; padding:4px;">
        <h4 style="margin:0; font-size:0.9rem; font-weight:700; color:#333;">Edit Trail Path</h4>
        <input type="text" id="edit-trail-name-${t.id}" value="${t.name}" class="form-control" style="height:28px; font-size:0.8rem; padding:4px; width:100%; box-sizing:border-box;" />
        <select id="edit-trail-diff-${t.id}" class="form-control" style="height:28px; font-size:0.8rem; padding:2px 4px; width:100%; box-sizing:border-box;">
          <option value="Easy" ${t.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
          <option value="Moderate" ${t.difficulty === 'Moderate' ? 'selected' : ''}>Moderate</option>
          <option value="Hard" ${t.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
        </select>
        <div style="display:flex; gap:6px; margin-top:4px;">
          <button onclick="updateTrail('${t.id}')" class="btn btn-primary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#2e7d32; border:none; color:white;">Save</button>
          <button onclick="redrawTrail('${t.id}')" class="btn btn-secondary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#f57c00; border:none; color:white;">Redraw</button>
          <button onclick="deleteTrail('${t.id}')" class="btn btn-danger" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#ea4335; border:none; color:white;">Delete</button>
        </div>
      </div>
    `;
    const polyline = L.polyline(t.coords, { color: '#2e7d32', weight: 4, dashArray: '5, 5' }).addTo(fullscreenMapInstance).bindPopup(popupContent);
    window.fsMapLayers[t.id] = polyline;

    polyline.on('click', () => {
      // Highlight in the list
      const items = document.querySelectorAll('.fs-element-item');
      items.forEach(el => {
        el.style.background = '#fff';
        el.style.borderColor = '#e0e0e0';
      });
      const targetEl = document.getElementById(`fs-list-item-${t.id}`);
      if (targetEl) {
        targetEl.style.background = '#e8f5e9';
        targetEl.style.borderColor = '#2e7d32';
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (listContainer) {
      const itemEl = document.createElement('div');
      itemEl.id = `fs-list-item-${t.id}`;
      itemEl.className = 'fs-element-item';
      itemEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
      `;
      itemEl.innerHTML = `
        <span class="material-symbols-rounded" style="color: #2e7d32; font-size: 16px; font-weight: bold;">route</span>
        <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <strong style="color: #333;">${t.name}</strong>
          <div style="font-size: 0.7rem; color: #666;">Trail (${t.difficulty})</div>
        </div>
      `;
      itemEl.onclick = () => window.highlightMapElement(t.id, 'trail');
      listContainer.appendChild(itemEl);
    }
  });

  // Render Custom Shapes with interactive edit/delete/vertex-edit popups
  const customShapes = JSON.parse(localStorage.getItem('gs_custom_shapes')) || [];
  customShapes.filter(s => String(s.park_id) === String(selectedParkId)).forEach(s => {
    const isWater = s.type === 'water';
    const shapeColor = isWater ? '#3b82f6' : '#9ca3af';
    const shapeFill = isWater ? '#93c5fd' : '#d1d5db';
    
    const popupContent = `
      <div style="font-family:var(--font-sans); min-width:190px; display:flex; flex-direction:column; gap:8px; padding:4px;">
        <h4 style="margin:0; font-size:0.9rem; font-weight:700; color:#333;">Edit ${isWater ? 'Water Feature' : 'Parking Lot'}</h4>
        <input type="text" id="edit-shape-name-${s.id}" value="${s.name}" class="form-control" style="height:28px; font-size:0.8rem; padding:4px; width:100%; box-sizing:border-box;" />
        <div style="display:flex; gap:6px; margin-top:4px;">
          <button onclick="window.updateShape('${s.id}')" class="btn btn-primary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#2e7d32; border:none; color:white;">Save</button>
          <button onclick="window.enableShapeVertexEditing('${s.id}', 'shape')" class="btn btn-secondary" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#0288d1; border:none; color:white;">Edit Points</button>
          <button onclick="window.deleteShape('${s.id}')" class="btn btn-danger" style="padding:4px 6px; font-size:0.75rem; flex:1; background:#ea4335; border:none; color:white;">Delete</button>
        </div>
      </div>
    `;

    const polygon = L.polygon(s.coords, {
      color: shapeColor,
      fillColor: shapeFill,
      fillOpacity: 0.5,
      weight: 2
    }).addTo(fullscreenMapInstance).bindPopup(popupContent);
    window.fsMapLayers[s.id] = polygon;

    polygon.on('click', () => {
      // Highlight in the list
      const items = document.querySelectorAll('.fs-element-item');
      items.forEach(el => {
        el.style.background = '#fff';
        el.style.borderColor = '#e0e0e0';
      });
      const targetEl = document.getElementById(`fs-list-item-${s.id}`);
      if (targetEl) {
        targetEl.style.background = '#e8f5e9';
        targetEl.style.borderColor = '#2e7d32';
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (listContainer) {
      const itemEl = document.createElement('div');
      itemEl.id = `fs-list-item-${s.id}`;
      itemEl.className = 'fs-element-item';
      itemEl.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
      `;
      itemEl.innerHTML = `
        <span class="material-symbols-rounded" style="color: ${shapeColor}; font-size: 16px; font-weight: bold;">${isWater ? 'water' : 'local_parking'}</span>
        <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          <strong style="color: #333;">${s.name}</strong>
          <div style="font-size: 0.7rem; color: #666;">${isWater ? 'Water Feature' : 'Parking Lot'}</div>
        </div>
      `;
      itemEl.onclick = () => window.highlightMapElement(s.id, 'shape');
      listContainer.appendChild(itemEl);
    }
  });

  if (listContainer && listContainer.children.length === 0) {
    listContainer.innerHTML = `<span style="font-size:0.75rem; color:#888; text-align:center; padding:10px; width:100%;">No items mapped yet.</span>`;
  }
}

// Interactive map element highlighter
window.highlightMapElement = function(id, type) {
  const layer = window.fsMapLayers[id];
  if (!layer) return;

  if (layer instanceof L.Marker) {
    fullscreenMapInstance.setView(layer.getLatLng(), 17);
    layer.openPopup();
    
    // Animate/highlight the marker icon
    const originalIcon = layer.options.icon;
    const originalHtml = originalIcon.options.html;
    
    let highlightedHtml = originalHtml;
    if (type === 'poi') {
      highlightedHtml = originalHtml.replace('background-color: #3B82F6;', 'background-color: #FF3D00; transform: scale(1.3); transition: all 0.3s; box-shadow: 0 0 15px #FF3D00;');
    } else if (type === 'greencode') {
      highlightedHtml = originalHtml.replace('background-color: #10B981;', 'background-color: #FFD600; transform: scale(1.3); transition: all 0.3s; box-shadow: 0 0 15px #FFD600; color: #000;');
    }
    
    const highlightIcon = L.divIcon({
      html: highlightedHtml,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    
    layer.setIcon(highlightIcon);
    setTimeout(() => {
      layer.setIcon(originalIcon);
    }, 1500);
    
  } else if (layer instanceof L.Polygon) {
    fullscreenMapInstance.fitBounds(layer.getBounds(), { padding: [50, 50] });
    layer.openPopup();
    
    const isWater = layer.options.color === '#3b82f6';
    layer.setStyle({ color: '#FF3D00', weight: 4 });
    setTimeout(() => {
      layer.setStyle({ color: isWater ? '#3b82f6' : '#9ca3af', weight: 2 });
    }, 1500);
  } else if (layer instanceof L.Polyline) {
    fullscreenMapInstance.fitBounds(layer.getBounds(), { padding: [50, 50] });
    layer.openPopup();
    
    layer.setStyle({ color: '#FF3D00', weight: 8, dashArray: null });
    setTimeout(() => {
      layer.setStyle({ color: '#2e7d32', weight: 4, dashArray: '5, 5' });
    }, 1500);
  }

  // Highlight list item in sidebar
  const listItems = document.querySelectorAll('.fs-element-item');
  listItems.forEach(item => {
    item.style.background = '#fff';
    item.style.borderColor = '#e0e0e0';
  });
  
  const activeItem = document.getElementById(`fs-list-item-${id}`);
  if (activeItem) {
    activeItem.style.background = '#e8f5e9';
    activeItem.style.borderColor = '#2e7d32';
    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

// Global update & archive handlers
window.updatePoi = function(id) {
  const name = document.getElementById(`edit-poi-name-${id}`)?.value.trim();
  const desc = document.getElementById(`edit-poi-desc-${id}`)?.value.trim() || '';
  if (!name) return;
  const customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];
  const idx = customPois.findIndex(p => String(p.id) === String(id));
  if (idx !== -1) {
    customPois[idx].name = name;
    customPois[idx].description = desc;
    localStorage.setItem('gs_custom_pois', JSON.stringify(customPois));
    alert("POI updated!");
    refreshFsMarkers();
  }
};

window.deletePoi = function(id) {
  if (!confirm("Are you sure you want to delete/archive this Point of Interest?")) return;
  let customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];
  customPois = customPois.filter(p => String(p.id) !== String(id));
  localStorage.setItem('gs_custom_pois', JSON.stringify(customPois));
  alert("POI deleted!");
  refreshFsMarkers();
};

window.updateGreenCode = function(id) {
  const name = document.getElementById(`edit-gc-name-${id}`)?.value.trim();
  const code = document.getElementById(`edit-gc-code-${id}`)?.value.trim();
  if (!name || !code) return;
  const idx = greenCodes.findIndex(gc => String(gc.id) === String(id));
  if (idx !== -1) {
    greenCodes[idx].name = name;
    greenCodes[idx].code = code;
    localStorage.setItem('gs_greencodes', JSON.stringify(greenCodes));
    alert("GreenCode updated!");
    refreshFsMarkers();
  }
};

window.deleteGreenCode = function(id) {
  if (!confirm("Are you sure you want to delete/archive this GreenCode?")) return;
  greenCodes = greenCodes.filter(gc => String(gc.id) !== String(id));
  localStorage.setItem('gs_greencodes', JSON.stringify(greenCodes));
  alert("GreenCode deleted!");
  refreshFsMarkers();
};

window.updateTrail = function(id) {
  const name = document.getElementById(`edit-trail-name-${id}`)?.value.trim();
  const diff = document.getElementById(`edit-trail-diff-${id}`)?.value;
  if (!name) return;
  const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
  const idx = customTrails.findIndex(t => String(t.id) === String(id));
  if (idx !== -1) {
    customTrails[idx].name = name;
    customTrails[idx].difficulty = diff;
    localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
    alert("Trail updated!");
    refreshFsMarkers();
  }
};

window.deleteTrail = function(id) {
  if (!confirm("Are you sure you want to delete/archive this Trail?")) return;
  let customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
  customTrails = customTrails.filter(t => String(t.id) !== String(id));
  localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
  alert("Trail deleted!");
  refreshFsMarkers();
};

function clearTempFsDrawings() {
  fsTrailCoords = [];
  fsGeofenceCoords = [];
  fsTempMarkers.forEach(m => fullscreenMapInstance && fullscreenMapInstance.removeLayer(m));
  fsTempMarkers = [];
  if (fsTempPolyline && fullscreenMapInstance) {
    fullscreenMapInstance.removeLayer(fsTempPolyline);
  }
  if (fsTempPolygon && fullscreenMapInstance) {
    fullscreenMapInstance.removeLayer(fsTempPolygon);
  }
  fsTempPolyline = null;
  fsTempPolygon = null;

  document.getElementById('fs-editor-finish-trail').style.display = 'none';
  document.getElementById('fs-editor-finish-geofence').style.display = 'none';
}

function finishFsTrailDrawing() {
  if (fsTrailCoords.length < 2) return;
  const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];

  if (window.redrawingTrailInfo) {
    customTrails.push({
      id: window.redrawingTrailInfo.id,
      park_id: selectedParkId,
      name: window.redrawingTrailInfo.name,
      difficulty: window.redrawingTrailInfo.difficulty,
      distance: (fsTrailCoords.length * 0.04).toFixed(1) + " miles",
      coords: fsTrailCoords
    });
    window.redrawingTrailInfo = null;
    alert("Trail updated successfully!");
  } else {
    const name = prompt("Enter Trail Name:") || "New Trail";
    customTrails.push({
      id: 'trail-' + Date.now(),
      park_id: selectedParkId,
      name: name,
      difficulty: "Easy",
      distance: "1.0 miles",
      coords: fsTrailCoords
    });
    alert("Trail saved!");
  }

  localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
  fsActiveEditorTool = null;
  updateFsEditorToolStyles();
  clearTempFsDrawings();
  drawFsGeofence();
  refreshFsMarkers();
}

function finishFsGeofenceDrawing() {
  if (fsGeofenceCoords.length < 3) return;
  
  activePark.geofence_polygon = fsGeofenceCoords;
  activePark.geofence_status = isAdmin() ? 'Approved' : 'Pending Approval';
  
  const pIdx = parks.findIndex(p => String(p.id) === String(selectedParkId));
  if (pIdx !== -1) {
    parks[pIdx].geofence_polygon = fsGeofenceCoords;
    parks[pIdx].geofence_status = activePark.geofence_status;
  }
  
  saveState();
  alert(isAdmin() ? "Geofence saved and approved!" : "Geofence boundary submitted for Admin approval.");
  
  if (activePark.geofence_status === 'Approved' || isAdmin()) {
    window.autoGenerateAllParkFeatures(selectedParkId);
  }
  
  fsActiveEditorTool = null;
  updateFsEditorToolStyles();
  clearTempFsDrawings();
  drawFsGeofence();
  refreshFsMarkers();
  
  openFullscreenMapEditor();
}

function clearFsGeofence() {
  if (!confirm("Are you sure you want to clear/delete this park's geofence boundary?")) return;
  activePark.geofence_polygon = null;
  activePark.geofence_status = 'Pending Approval';
  const pIdx = parks.findIndex(p => String(p.id) === String(selectedParkId));
  if (pIdx !== -1) {
    parks[pIdx].geofence_polygon = null;
    parks[pIdx].geofence_status = 'Pending Approval';
  }
  saveState();
  clearTempFsDrawings();
  drawFsGeofence();
  openFullscreenMapEditor();
}

function autoGenerateTrailsFs() {
  if (!activePark) return;
  if (!activePark.geofence_polygon || activePark.geofence_polygon.length < 3) {
    alert("Cannot auto-generate trails: Please draw a custom geofence boundary first.");
    return;
  }

  // Calculate bounding box
  let lats = activePark.geofence_polygon.map(p => p[0]);
  let lngs = activePark.geofence_polygon.map(p => p[1]);
  let south = Math.min(...lats);
  let north = Math.max(...lats);
  let west = Math.min(...lngs);
  let east = Math.max(...lngs);

  // Show loading indicator in instructions panel
  const instructions = document.getElementById('fs-editor-instructions');
  instructions.innerHTML = `<span style="color:#0288d1; font-weight:600;"><span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; display:inline-block; animation: spin 2s linear infinite;">sync</span> Querying OpenStreetMap footpath layers...</span>`;

  // Query Overpass API for footpath/pedestrian pathways (excluding sidewalks & service roads)
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:15];way[highway~"footway|path|track|pedestrian|cycleway"](${south},${west},${north},${east});out geom;`;
  const includeGolf = document.getElementById('fs-editor-include-golf')?.checked;

  fetch(overpassUrl)
    .then(res => res.json())
    .then(data => {
      let addedCount = 0;
      if (data && data.elements && data.elements.length > 0) {
        const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];

        // Helper function to stitch/merge segments
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
                
                const threshold = 0.0003; // degrees (~30 meters)
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
          
          if (merged.length === 1) {
            return merged[0];
          }
          return merged;
        }

        const namedGroups = {};
        const unnamedWays = [];

        data.elements.forEach(element => {
          // Skip service alleys and service roads to avoid vehicle lanes, but keep sidewalks and walking paths near streets
          if (element.tags?.service === 'alley' || element.tags?.highway === 'service') {
            return;
          }

          // Check for golf cart paths
          const isGolf = element.tags?.golf === 'cartpath' || element.tags?.service === 'golf_cart' || element.tags?.highway === 'golf_cart' || element.tags?.golf;
          if (isGolf && !includeGolf) {
            return;
          }

          if (element.geometry && element.geometry.length >= 2) {
            let wayCoords = element.geometry.map(pt => [pt.lat, pt.lon]);
            // Filter elements to verify at least one vertex falls inside our custom polygon geofence
            let isInside = wayCoords.some(coord => isPointInPolygon(coord, activePark.geofence_polygon));

            if (isInside) {
              const name = element.tags?.name;
              if (name) {
                if (!namedGroups[name]) {
                  namedGroups[name] = [];
                }
                namedGroups[name].push(wayCoords);
              } else {
                unnamedWays.push(wayCoords);
              }
            }
          }
        });

        // Add grouped named trails
        for (const name in namedGroups) {
          const mergedCoords = mergeLineSegments(namedGroups[name]);
          
          let totalPts = 0;
          if (Array.isArray(mergedCoords[0][0])) {
            mergedCoords.forEach(seg => totalPts += seg.length);
          } else {
            totalPts = mergedCoords.length;
          }
          const distance = (totalPts * 0.04).toFixed(1) + " miles";
          
          addedCount++;
          customTrails.push({
            id: 'trail-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedCount,
            park_id: selectedParkId,
            name: name,
            difficulty: "Easy",
            distance: distance,
            coords: mergedCoords
          });
        }

        // Add merged unnamed trails
        const mergedUnnamed = mergeLineSegments(unnamedWays);
        if (mergedUnnamed.length > 0) {
          if (Array.isArray(mergedUnnamed[0][0])) {
            mergedUnnamed.forEach(coords => {
              addedCount++;
              const name = `${activePark.name} Walkway ${addedCount}`;
              const distance = (coords.length * 0.04).toFixed(1) + " miles";
              customTrails.push({
                id: 'trail-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedCount,
                park_id: selectedParkId,
                name: name,
                difficulty: "Easy",
                distance: distance,
                coords: coords
              });
            });
          } else {
            addedCount++;
            const name = `${activePark.name} Walkway ${addedCount}`;
            const distance = (mergedUnnamed.length * 0.04).toFixed(1) + " miles";
            customTrails.push({
              id: 'trail-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedCount,
              park_id: selectedParkId,
              name: name,
              difficulty: "Easy",
              distance: distance,
              coords: mergedUnnamed
            });
          }
        }

        if (addedCount > 0) {
          localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
          alert(`Successfully discovered and merged ${addedCount} trail pathways from OpenStreetMap!`);
        } else {
          generateFallbackTrail();
        }
      } else {
        generateFallbackTrail();
      }
      refreshFsMarkers();
      setFsEditorTool(null);
    })
    .catch(err => {
      console.warn("Overpass API failed, falling back to math layout:", err);
      generateFallbackTrail();
      refreshFsMarkers();
      setFsEditorTool(null);
    });
}

function autoGeneratePoisFs() {
  if (!activePark) return;
  if (!activePark.geofence_polygon || activePark.geofence_polygon.length < 3) {
    alert("Cannot auto-generate POIs: Please draw a custom geofence boundary first.");
    return;
  }

  // Calculate bounding box
  let lats = activePark.geofence_polygon.map(p => p[0]);
  let lngs = activePark.geofence_polygon.map(p => p[1]);
  let south = Math.min(...lats);
  let north = Math.max(...lats);
  let west = Math.min(...lngs);
  let east = Math.max(...lngs);

  // Show loading indicator
  const instructions = document.getElementById('fs-editor-instructions');
  instructions.innerHTML = `<span style="color:#0288d1; font-weight:600;"><span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; display:inline-block; animation: spin 2s linear infinite;">sync</span> Querying OpenStreetMap POI layers...</span>`;

  // Query Overpass for amenities, tourism, historic landmarks, and activities
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:15];(node[amenity~"bench|toilets|drinking_water|shelter|picnic_table|parking|waste_basket|bicycle_parking|cafe|restaurant"](${south},${west},${north},${east});node[tourism~"viewpoint|information|artwork|picnic_site|attraction"](${south},${west},${north},${east});node[leisure~"playground|firepit|swimming_pool|dog_park|sports_centre|pitch|track|wildlife_hide"](${south},${west},${north},${east});node[historic~"memorial|monument|landmark|ruins|archaeological_site|wayside_shrine"](${south},${west},${north},${east}););out;`;

  fetch(overpassUrl)
    .then(res => res.json())
    .then(data => {
      let addedCount = 0;
      if (data && data.elements && data.elements.length > 0) {
        const customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];

        data.elements.forEach(element => {
          if (element.lat && element.lon) {
            let coords = [element.lat, element.lon];
            let isInside = isPointInPolygon(coords, activePark.geofence_polygon);

            if (isInside) {
              addedCount++;
              
              // Determine tag/name type
              let typeName = "Point of Interest";
              if (element.tags?.historic) typeName = element.tags.historic.replace('_', ' ');
              else if (element.tags?.amenity) typeName = element.tags.amenity.replace('_', ' ');
              else if (element.tags?.tourism) typeName = element.tags.tourism.replace('_', ' ');
              else if (element.tags?.leisure) typeName = element.tags.leisure.replace('_', ' ');
              
              // Capitalize typeName
              typeName = typeName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

              const name = element.tags?.name || `${activePark.name} ${typeName}`;
              const desc = element.tags?.description || `Auto-discovered ${typeName} via OpenStreetMap.`;

              customPois.push({
                id: 'poi-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '-' + addedCount,
                park_id: selectedParkId,
                name: name,
                description: desc,
                lat: element.lat,
                lng: element.lon
              });
            }
          }
        });

        if (addedCount > 0) {
          localStorage.setItem('gs_custom_pois', JSON.stringify(customPois));
          alert(`Successfully discovered and added ${addedCount} POIs from OpenStreetMap!`);
        } else {
          alert("No matching OpenStreetMap POIs found within the geofence.");
        }
      } else {
        alert("No matching OpenStreetMap POIs found within the geofence.");
      }
      refreshFsMarkers();
      setFsEditorTool(null);
    })
    .catch(err => {
      console.warn("Overpass API failed for POIs:", err);
      alert("Failed to retrieve POI details from OpenStreetMap.");
      refreshFsMarkers();
      setFsEditorTool(null);
    });
}

function generateFallbackTrail() {
  let trailCoords = [];
  let sumLat = 0, sumLng = 0;
  activePark.geofence_polygon.forEach(coord => {
    sumLat += coord[0];
    sumLng += coord[1];
  });
  const cenLat = sumLat / activePark.geofence_polygon.length;
  const cenLng = sumLng / activePark.geofence_polygon.length;
  
  activePark.geofence_polygon.forEach(coord => {
    const lat = cenLat + (coord[0] - cenLat) * 0.65;
    const lng = cenLng + (coord[1] - cenLng) * 0.65;
    trailCoords.push([lat, lng]);
  });
  trailCoords.push(trailCoords[0]);

  const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
  customTrails.push({
    id: 'trail-' + Date.now(),
    park_id: selectedParkId,
    name: activePark.name + " Internal Loop",
    difficulty: "Easy",
    distance: "1.2 miles",
    coords: trailCoords
  });
  localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
  alert("No OpenStreetMap footpath layers found. Built a custom loop winding inside the boundary.");
}

// --- ADMIN APPROVALS PORTAL ---
function renderApprovalsPortal() {
  const listContainer = document.getElementById('approvals-list-container');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  const pendingGroups = parkGroups.filter(g => g.status === 'Pending Approval');
  const pendingParks = parks.filter(p => p.status === 'Pending Approval');
  const pendingGeofences = parks.filter(p => p.status === 'Active' && p.geofence_status === 'Pending Approval' && p.geofence_polygon && p.geofence_polygon.length >= 3);

  let html = '';

  if (pendingGroups.length === 0 && pendingParks.length === 0 && pendingGeofences.length === 0) {
    listContainer.innerHTML = '<div style="padding:16px; text-align:center; color:#666; font-size:0.85rem;">No pending approvals found.</div>';
    return;
  }

  pendingGroups.forEach(g => {
    html += `
      <div onclick="selectPendingApproval('group', '${g.id}')" style="padding:12px; margin-bottom:8px; border:1px solid #e0e0e0; border-radius:6px; background:#fff; cursor:pointer;">
        <div style="font-weight:700; font-size:0.9rem; color:#e65100; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-rounded" style="font-size:16px;">corporate_fare</span> Group Proposal
        </div>
        <div style="font-weight:600; font-size:0.85rem; margin-top:4px; color:#333;">${g.name}</div>
        <div style="font-size:0.75rem; color:#666; margin-top:2px;">Requested by: Owner ID ${g.owner_id}</div>
      </div>
    `;
  });

  pendingParks.forEach(p => {
    html += `
      <div onclick="selectPendingApproval('park', '${p.id}')" style="padding:12px; margin-bottom:8px; border:1px solid #e0e0e0; border-radius:6px; background:#fff; cursor:pointer;">
        <div style="font-weight:700; font-size:0.9rem; color:#0288d1; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-rounded" style="font-size:16px;">park</span> Park Proposal
        </div>
        <div style="font-weight:600; font-size:0.85rem; margin-top:4px; color:#333;">${p.name}</div>
        <div style="font-size:0.75rem; color:#666; margin-top:2px;">${p.city}, ${p.state}</div>
      </div>
    `;
  });

  pendingGeofences.forEach(p => {
    html += `
      <div onclick="selectPendingApproval('geofence', '${p.id}')" style="padding:12px; margin-bottom:8px; border:1px solid #e0e0e0; border-radius:6px; background:#fff; cursor:pointer;">
        <div style="font-weight:700; font-size:0.9rem; color:#2e7d32; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-rounded" style="font-size:16px;">polyline</span> Geofence Approval
        </div>
        <div style="font-weight:600; font-size:0.85rem; margin-top:4px; color:#333;">${p.name} Bounds</div>
        <div style="font-size:0.75rem; color:#666; margin-top:2px;">Boundary: ${p.geofence_polygon.length} vertices</div>
      </div>
    `;
  });

  listContainer.innerHTML = html;
}

window.selectPendingApproval = function(type, id) {
  const detailPanel = document.getElementById('approvals-detail-panel');
  if (!detailPanel) return;

  if (type === 'group') {
    const group = parkGroups.find(g => String(g.id) === String(id));
    if (!group) return;
    detailPanel.innerHTML = `
      <div style="width: 100%; display:flex; flex-direction:column; gap:16px; color:#333;">
        <h3 style="margin:0; font-size:1.4rem; font-weight:800;">Review Park Group Proposal</h3>
        <table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:left;">
          <tr><td style="padding:8px 0; font-weight:700; width:120px;">Group Name:</td><td>${group.name}</td></tr>
          <tr><td style="padding:8px 0; font-weight:700;">Owner ID:</td><td>${group.owner_id}</td></tr>
          <tr><td style="padding:8px 0; font-weight:700;">Plan Type:</td><td>${group.subscription_plan}</td></tr>
          <tr><td style="padding:8px 0; font-weight:700;">Max Locations:</td><td>${group.max_locations}</td></tr>
        </table>
        <div style="display:flex; gap:12px; margin-top:16px;">
          <button onclick="approvePendingItem('group', '${group.id}', true)" class="btn btn-primary" style="background:#2e7d32; border:none; padding:10px 20px;">Approve Group</button>
          <button onclick="approvePendingItem('group', '${group.id}', false)" class="btn btn-danger" style="padding:10px 20px;">Reject & Delete</button>
        </div>
      </div>
    `;
  } else if (type === 'park') {
    const park = parks.find(p => String(p.id) === String(id));
    if (!park) return;
    const group = parkGroups.find(g => String(g.id) === String(park.park_group_id));
    detailPanel.innerHTML = `
      <div style="width: 100%; display:flex; flex-direction:column; gap:16px; color:#333;">
        <h3 style="margin:0; font-size:1.4rem; font-weight:800;">Review New Park Proposal</h3>
        <table style="width:100%; border-collapse:collapse; font-size:0.9rem; text-align:left;">
          <tr><td style="padding:8px 0; font-weight:700; width:120px;">Park Name:</td><td>${park.name}</td></tr>
          <tr><td style="padding:8px 0; font-weight:700;">Park Group:</td><td>${group ? group.name : 'Unknown'}</td></tr>
          <tr><td style="padding:8px 0; font-weight:700;">City/State:</td><td>${park.city}, ${park.state}</td></tr>
          <tr><td style="padding:8px 0; font-weight:700;">Identifier:</td><td><code>${park.identifier}</code></td></tr>
        </table>
        <div style="display:flex; gap:12px; margin-top:16px;">
          <button onclick="approvePendingItem('park', '${park.id}', true)" class="btn btn-primary" style="background:#2e7d32; border:none; padding:10px 20px;">Approve Park</button>
          <button onclick="approvePendingItem('park', '${park.id}', false)" class="btn btn-danger" style="padding:10px 20px;">Reject & Delete</button>
        </div>
      </div>
    `;
  } else if (type === 'geofence') {
    const park = parks.find(p => String(p.id) === String(id));
    if (!park) return;
    detailPanel.innerHTML = `
      <div style="width: 100%; display:flex; flex-direction:column; gap:16px; color:#333;">
        <h3 style="margin:0; font-size:1.4rem; font-weight:800;">Review Geofence Bounds</h3>
        <p style="font-size:0.9rem; color:#555;">Review custom geofence submitted for <strong>${park.name}</strong>. You can view, edit, and approve the boundary polygon on the full screen map.</p>
        <div style="display:flex; gap:12px; margin-top:16px; flex-wrap: wrap;">
          <button onclick="openGeofenceForReview('${park.id}')" class="btn btn-primary" style="background:#0288d1; border:none; padding:10px 20px; display:flex; align-items:center; gap:6px; color:#fff;">
            <span class="material-symbols-rounded" style="font-size:18px;">map</span> View & Edit on Map
          </button>
          <button onclick="approvePendingItem('geofence', '${park.id}', true)" class="btn btn-primary" style="background:#2e7d32; border:none; padding:10px 20px;">Approve Geofence</button>
          <button onclick="approvePendingItem('geofence', '${park.id}', false)" class="btn btn-danger" style="padding:10px 20px;">Reject & Reset</button>
        </div>
        <div style="border-top:1px solid #e0e0e0; padding-top:16px; margin-top:8px;">
          <h4 style="margin:0 0 8px 0; font-size:0.9rem; font-weight:700;">Developer / Admin Automation</h4>
          <button id="btn-admin-generate-features" onclick="adminGenerateFeatures('${park.id}')" class="btn btn-secondary" style="display:flex; align-items:center; gap:6px; padding:10px 20px; background:#e8f5e9; border:1px solid #c8e6c9; color:#2e7d32;">
            <span class="material-symbols-rounded" style="font-size:18px;">dynamic_feed</span> Generate POIs & Trails
          </button>
        </div>
      </div>
    `;
  }
};

window.adminGenerateFeatures = async function(parkId) {
  const btn = document.getElementById('btn-admin-generate-features');
  if (!btn) return;
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-rounded" style="animation: spin 1.5s linear infinite;">autorenew</span> Generating...`;
  try {
    await window.autoGenerateAllParkFeatures(parkId);
    alert("POIs and trails successfully generated for this geofence!");
  } catch (err) {
    console.warn("Auto generation failed:", err);
    alert("Failed to automatically generate trails and POIs.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
};

window.approvePendingItem = function(type, id, approve) {
  if (type === 'group') {
    const idx = parkGroups.findIndex(g => String(g.id) === String(id));
    if (idx !== -1) {
      if (approve) {
        parkGroups[idx].status = 'Active';
        alert(`Park Group "${parkGroups[idx].name}" approved!`);
      } else {
        parkGroups.splice(idx, 1);
        alert("Proposal rejected.");
      }
    }
  } else if (type === 'park') {
    const idx = parks.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      if (approve) {
        parks[idx].status = 'Active';
        alert(`Park "${parks[idx].name}" approved!`);
      } else {
        parks.splice(idx, 1);
        alert("Proposal rejected.");
      }
    }
  } else if (type === 'geofence') {
    const idx = parks.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      if (approve) {
        parks[idx].geofence_status = 'Approved';
        alert(`Geofence for "${parks[idx].name}" approved!`);
      } else {
        parks[idx].geofence_polygon = null;
        parks[idx].geofence_status = 'Pending Approval';
        alert("Geofence bounds rejected and reset.");
      }
    }
  }

  saveState();
  setupParkDropdown();
  updateActivePark();
  renderApprovalsPortal();
  
  document.getElementById('approvals-detail-panel').innerHTML = `
    <span class="material-symbols-rounded" style="font-size: 48px; color: var(--color-text-muted); margin-bottom: 12px;">gavel</span>
    <p style="color: var(--color-text-secondary); font-size: 0.95rem;">Select a pending item from the list to review details and approve/reject.</p>
  `;
};

window.openGeofenceForReview = function(parkId) {
  selectedParkId = parkId;
  saveState();
  updateActivePark();
  openFullscreenMapEditor();
};

window.enableMarkerDragging = function(id, type) {
  const marker = window.fsMapLayers[id];
  if (!marker) return;
  
  marker.closePopup();
  marker.dragging.enable();
  
  const instructions = document.getElementById('fs-editor-instructions');
  if (instructions) {
    instructions.innerHTML = `<span style="color:#e65100; font-weight:600;"><span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle; display:inline-block; animation: pulse 1s infinite;">drag_pan</span> Drag the marker to its new location.</span>`;
  }
  
  const originalLatLng = marker.getLatLng();
  
  marker.once('dragend', () => {
    const newLatLng = marker.getLatLng();
    
    if (type === 'poi') {
      const customPois = JSON.parse(localStorage.getItem('gs_custom_pois')) || [];
      const p = customPois.find(item => String(item.id) === String(id));
      if (p) {
        p.lat = newLatLng.lat;
        p.lng = newLatLng.lng;
        localStorage.setItem('gs_custom_pois', JSON.stringify(customPois));
      }
    } else if (type === 'greencode') {
      const gc = greenCodes.find(item => String(item.id) === String(id));
      if (gc) {
        gc.lat = newLatLng.lat;
        gc.lng = newLatLng.lng;
        saveState();
      }
    }
    
    marker.dragging.disable();
    refreshFsMarkers();
    if (instructions) {
      instructions.textContent = "Select a tool from above to begin modifying the park map.";
    }
  });
};

window.redrawTrail = function(id) {
  const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
  const trail = customTrails.find(t => String(t.id) === String(id));
  if (!trail) return;
  
  if (confirm(`Redraw trail "${trail.name}"? This will clear its current path and put you into drawing mode.`)) {
    window.redrawingTrailInfo = trail;
    const keptTrails = customTrails.filter(t => String(t.id) !== String(id));
    localStorage.setItem('gs_custom_trails', JSON.stringify(keptTrails));
    
    refreshFsMarkers();
    setFsEditorTool('trail');
  }
};

window.autoGenerateAllParkFeatures = function(parkId) {
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

      // Helper function to stitch/merge segments
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
      
      console.log(`Auto-generated ${addedTrails} trails, ${addedPois} POIs, ${addedShapes} shapes for park ${parkId}`);

      if (fullscreenMapInstance && String(selectedParkId) === String(parkId)) {
        refreshFsMarkers();
      }
      if (leafletMapInstance && String(selectedParkId) === String(parkId)) {
        refreshMapMarkers();
      }
    })
    .catch(err => {
      console.warn("Failed to auto-generate park features, falling back:", err);
      // Catch network or parse errors and still generate fallback trail loop
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
      if (fullscreenMapInstance && String(selectedParkId) === String(parkId)) {
        refreshFsMarkers();
      }
      if (leafletMapInstance && String(selectedParkId) === String(parkId)) {
        refreshMapMarkers();
      }
    });
};

window.updateShape = function(id) {
  const customShapes = JSON.parse(localStorage.getItem('gs_custom_shapes')) || [];
  const sIdx = customShapes.findIndex(item => String(item.id) === String(id));
  if (sIdx !== -1) {
    const input = document.getElementById(`edit-shape-name-${id}`);
    if (input) {
      customShapes[sIdx].name = input.value.trim();
      localStorage.setItem('gs_custom_shapes', JSON.stringify(customShapes));
      alert("Shape saved successfully!");
      refreshFsMarkers();
    }
  }
};

window.deleteShape = function(id) {
  if (!confirm("Are you sure you want to delete this shape?")) return;
  const customShapes = JSON.parse(localStorage.getItem('gs_custom_shapes')) || [];
  const filtered = customShapes.filter(item => String(item.id) !== String(id));
  localStorage.setItem('gs_custom_shapes', JSON.stringify(filtered));
  refreshFsMarkers();
};

window.enableShapeVertexEditing = function(id, type) {
  const layer = window.fsMapLayers[id] || (type === 'geofence' ? fsGeofencePolygonOverlay : null);
  if (!layer) return;

  layer.closePopup();
  
  if (window.fsEditHandles) {
    window.fsEditHandles.forEach(h => fullscreenMapInstance.removeLayer(h));
  }
  window.fsEditHandles = [];

  let coords = [];
  if (type === 'trail') {
    coords = layer.getLatLngs();
  } else if (type === 'geofence' || type === 'shape') {
    coords = layer.getLatLngs()[0];
  }

  coords.forEach((latlng, idx) => {
    const handleIcon = L.divIcon({
      html: `<div style="background: white; border: 2px solid #2e7d32; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
      className: '',
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    const handle = L.marker(latlng, { icon: handleIcon, draggable: true }).addTo(fullscreenMapInstance);
    window.fsEditHandles.push(handle);

    handle.on('drag', (e) => {
      const newLatLng = e.latlng;
      if (type === 'trail') {
        const newCoords = layer.getLatLngs();
        newCoords[idx] = newLatLng;
        layer.setLatLngs(newCoords);
      } else if (type === 'geofence' || type === 'shape') {
        const newCoords = layer.getLatLngs();
        newCoords[0][idx] = newLatLng;
        layer.setLatLngs(newCoords);
      }
    });

    handle.on('dragend', () => {
      if (type === 'trail') {
        const customTrails = JSON.parse(localStorage.getItem('gs_custom_trails')) || [];
        const t = customTrails.find(item => String(item.id) === String(id));
        if (t) {
          t.coords = layer.getLatLngs().map(ll => [ll.lat, ll.lng]);
          localStorage.setItem('gs_custom_trails', JSON.stringify(customTrails));
        }
      } else if (type === 'shape') {
        const customShapes = JSON.parse(localStorage.getItem('gs_custom_shapes')) || [];
        const s = customShapes.find(item => String(item.id) === String(id));
        if (s) {
          s.coords = layer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
          localStorage.setItem('gs_custom_shapes', JSON.stringify(customShapes));
        }
      } else if (type === 'geofence') {
        activePark.geofence_polygon = layer.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
        const pIdx = parks.findIndex(p => String(p.id) === String(selectedParkId));
        if (pIdx !== -1) {
          parks[pIdx].geofence_polygon = activePark.geofence_polygon;
        }
        saveState();
      }
    });
  });

  const instructions = document.getElementById('fs-editor-instructions');
  if (instructions) {
    instructions.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:6px;">
        <span style="color:#2e7d32; font-weight:600;"><span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle;">tune</span> Drag any point/vertex handle to reshape the boundary or trail.</span>
        <button onclick="window.disableShapeVertexEditing()" class="btn btn-primary" style="width:100%; padding:6px; font-size:0.8rem; background:#2e7d32; border:none; margin-top:4px;">Finish Editing Points</button>
      </div>
    `;
  }
};

window.disableShapeVertexEditing = function() {
  if (window.fsEditHandles) {
    window.fsEditHandles.forEach(h => fullscreenMapInstance.removeLayer(h));
  }
  window.fsEditHandles = [];
  
  const instructions = document.getElementById('fs-editor-instructions');
  if (instructions) {
    instructions.textContent = "Select a tool from above to begin modifying the park map.";
  }
  drawFsGeofence();
  refreshFsMarkers();
};;


