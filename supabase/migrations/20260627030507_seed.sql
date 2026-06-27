-- Seed Data for GreenSpace

-- 1. Insert Users
INSERT INTO users (id, first_name, last_name, email, temp) VALUES
('d6c06df9-bb23-455b-9d4b-bfdf0d12e693', 'Bryce', 'Mchose', 'bpmchose@outlook.com', FALSE),
('e6c06df9-bb23-455b-9d4b-bfdf0d12e693', 'Jane', 'Doe', 'jane.doe@example.com', FALSE),
('f6c06df9-bb23-455b-9d4b-bfdf0d12e693', 'John', 'Smith', 'john.smith@example.com', FALSE)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Park Groups
INSERT INTO park_groups (id, name, owner_id, max_locations, max_users, points_enabled, reports_month, rewards_inst, subscription_plan, total_pts) VALUES
(1, 'Virginia Historic Parks', 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693', 10, 10, TRUE, 4, 'Collect your rewards at the main visitor center. Bring your digital voucher code.', 'GreenSpace Premium Group Plan', 240),
(2, 'Blue Ridge Trail Group (Pending)', 'e6c06df9-bb23-455b-9d4b-bfdf0d12e693', 5, 5, TRUE, 0, 'Visitor center rewards.', 'GreenSpace Basic Group Plan', 0)
ON CONFLICT (id) DO NOTHING;

-- Reset SERIAL sequence for park_groups
SELECT setval(pg_get_serial_sequence('park_groups', 'id'), coalesce(max(id), 1)) FROM park_groups;

-- 3. Insert Parks
INSERT INTO parks (id, name, city, state, zip_code, identifier, park_group_id, status, geofence_status, lat, lng, geofence_polygon) VALUES
(1, 'Freedom Park', 'Williamsburg', 'VA', 23188, 'LOC-FREEDOM', 1, 'Active', 'Approved', 37.3387, -76.7865, '[[37.342, -76.790], [37.342, -76.780], [37.334, -76.780], [37.334, -76.790]]'::jsonb),
(2, 'Waller Mill Park', 'Williamsburg', 'VA', 23185, 'LOC-WALLER', 1, 'Active', 'Approved', 37.2941, -76.7324, NULL),
(3, 'Yorktown Battlefield Trail', 'Yorktown', 'VA', 23690, 'LOC-YORKTOWN', 1, 'Active', 'Approved', 37.2212, -76.5123, NULL),
(4, 'Colonial Park (Pending Approval)', 'Jamestown', 'VA', 23081, 'LOC-COLONIAL', 1, 'Pending Approval', 'Pending Approval', 37.2104, -76.7761, '[[37.215, -76.780], [37.215, -76.770], [37.205, -76.770], [37.205, -76.780]]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Reset SERIAL sequence for parks
SELECT setval(pg_get_serial_sequence('parks', 'id'), coalesce(max(id), 1)) FROM parks;

-- 4. Insert Categories
INSERT INTO categories (id, name, park_group_id) VALUES
(1, 'Trash Can', 1),
(2, 'Recycle Bin', 1),
(3, 'Dog Bag Station', 1),
(4, 'Restroom', 1),
(5, 'Water Fountain', 1),
(6, 'Trailhead', 1),
(7, 'Sign', 1),
(8, 'Lighting', 1)
ON CONFLICT (id) DO NOTHING;

-- Reset SERIAL sequence for categories
SELECT setval(pg_get_serial_sequence('categories', 'id'), coalesce(max(id), 1)) FROM categories;

-- 5. Insert UserPoints
INSERT INTO user_points (id, user_id, park_group_id, points) VALUES
(1, 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693', 1, 240)
ON CONFLICT (user_id, park_group_id) DO NOTHING;

-- Reset SERIAL sequence for user_points
SELECT setval(pg_get_serial_sequence('user_points', 'id'), coalesce(max(id), 1)) FROM user_points;

-- 6. Insert Rewards
INSERT INTO rewards (id, name, cost, park_group_id, available) VALUES
(1, 'Free Day Parking Pass', 50, 1, TRUE),
(2, 'GreenSpace Water Bottle', 120, 1, TRUE),
(3, 'Annual State Park Decal', 400, 1, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Reset SERIAL sequence for rewards
SELECT setval(pg_get_serial_sequence('rewards', 'id'), coalesce(max(id), 1)) FROM rewards;

-- 7. Insert Redemptions (Orders)
INSERT INTO redemptions (id, reward_id, park_group_id, status, creator_id) VALUES
(1, 1, 1, 'Pending', 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693')
ON CONFLICT (id) DO NOTHING;

-- Reset SERIAL sequence for redemptions
SELECT setval(pg_get_serial_sequence('redemptions', 'id'), coalesce(max(id), 1)) FROM redemptions;

-- 8. Insert Issues (Reports)
INSERT INTO issues (id, park_id, type, location, details, status, priority, assigned_to, reporter_email) VALUES
(1, 1, 'Trash Can', 'Trash Can #4 near Playground', 'Overflowing with plastic bottles and pizza boxes. Bees are gathering.', 'new', 'High', NULL, 'visitor1@gmail.com'),
(2, 1, 'Restroom', 'Main Restroom North', 'No hand soap in the men''s toilet, and the flush on stall 2 is running continuously.', 'in_progress', 'Medium', 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693', 'hiker_pro@yahoo.com'),
(3, 1, 'Dog Bag Station', 'Dog dispenser #12 near Trailhead A', 'Completely empty. Needs restocking.', 'new', 'Low', NULL, 'dogwalker9@outlook.com'),
(4, 1, 'Sign', 'Trail B Bridge Crossing', 'The bridge crossing safety sign is vandalized with spray paint.', 'resolved', 'Medium', 'e6c06df9-bb23-455b-9d4b-bfdf0d12e693', 'citizen_clean@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Reset SERIAL sequence for issues
SELECT setval(pg_get_serial_sequence('issues', 'id'), coalesce(max(id), 1)) FROM issues;

-- 9. Insert Park Group Staff
INSERT INTO park_group_staff (park_group_id, user_id) VALUES
(1, 'd6c06df9-bb23-455b-9d4b-bfdf0d12e693'),
(1, 'e6c06df9-bb23-455b-9d4b-bfdf0d12e693'),
(1, 'f6c06df9-bb23-455b-9d4b-bfdf0d12e693')
ON CONFLICT (park_group_id, user_id) DO NOTHING;
