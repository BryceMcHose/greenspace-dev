-- Ensure park groups and parks exist for the foreign keys
INSERT INTO park_groups (id, name, subscription_plan) VALUES 
(1, 'Virginia Historic Parks', 'GreenSpace Premium Group Plan') 
ON CONFLICT (id) DO NOTHING;

INSERT INTO parks (id, name, park_group_id, status, geofence_status) VALUES 
(1, 'Freedom Park', 1, 'Active', 'Approved'),
(2, 'Waller Mill Park', 1, 'Active', 'Approved'),
(3, 'Yorktown Battlefield Trail', 1, 'Active', 'Approved')
ON CONFLICT (id) DO NOTHING;

-- Seed green_codes
INSERT INTO green_codes (id, code, name, park_id, lat, lng) VALUES
(1, 'LOC-FREEDOM-PLAY', 'Playground Area', 1, 37.3392, -76.7860),
(2, 'LOC-FREEDOM-POND', 'Main Pond Station', 1, 37.3380, -76.7875),
(3, 'LOC-WALLER-BOAT', 'Waller Mill Boat Dock', 2, 37.2941, -76.7324),
(4, 'LOC-YORK-VISITOR', 'Yorktown Battle Monument', 3, 37.2212, -76.5123)
ON CONFLICT (code) DO NOTHING;

-- Reset SERIAL sequence for green_codes
SELECT setval(pg_get_serial_sequence('green_codes', 'id'), coalesce(max(id), 1)) FROM green_codes;
