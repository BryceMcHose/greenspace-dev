-- GreenSpace PostgreSQL Schema Definitions for Cloud SQL

-- Enable UUID extension if we want to use UUIDs for user IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (matches Bubble User)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    temp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast lookups during sign-in
CREATE INDEX idx_users_email ON users(email);

-- 2. Park Groups Table (matches Bubble Park Group)
CREATE TABLE park_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    max_locations INTEGER,
    max_users INTEGER,
    points_enabled BOOLEAN DEFAULT TRUE,
    reports_month INTEGER DEFAULT 0,
    rewards_inst TEXT,
    subscription_plan VARCHAR(100),
    total_pts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Parks Table (matches Bubble Park)
CREATE TABLE parks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code INTEGER,
    identifier VARCHAR(100),
    park_group_id INTEGER REFERENCES park_groups(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Pending Approval'
    geofence_status VARCHAR(50) DEFAULT 'Approved', -- 'Approved', 'Pending Approval'
    geofence_polygon JSONB, -- Coordinates array
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parks_group ON parks(park_group_id);

-- 4. Categories Table (matches Bubble Category)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    park_group_id INTEGER REFERENCES park_groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, park_group_id)
);

CREATE INDEX idx_categories_group ON categories(park_group_id);

-- 5. UserPoints Table (matches Bubble UserPoint)
CREATE TABLE user_points (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    park_group_id INTEGER REFERENCES park_groups(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, park_group_id)
);

CREATE INDEX idx_user_points_user ON user_points(user_id);
CREATE INDEX idx_user_points_group ON user_points(park_group_id);

-- 6. Rewards Table (matches Bubble Reward)
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost INTEGER NOT NULL CHECK (cost >= 0),
    park_group_id INTEGER REFERENCES park_groups(id) ON DELETE CASCADE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rewards_group ON rewards(park_group_id);

-- 7. Redemptions Table (matches Bubble Redemption)
CREATE TABLE redemptions (
    id SERIAL PRIMARY KEY,
    reward_id INTEGER REFERENCES rewards(id) ON DELETE CASCADE,
    park_group_id INTEGER REFERENCES park_groups(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Pending', -- e.g., 'Pending', 'Fulfilled'
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_redemptions_group ON redemptions(park_group_id);
CREATE INDEX idx_redemptions_creator ON redemptions(creator_id);

-- 8. Issues / Reports Table (matches Bubble Issue/Report)
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- Matches Category Name
    location TEXT NOT NULL,
    details TEXT,
    status VARCHAR(50) DEFAULT 'new', -- e.g., 'new', 'in_progress', 'resolved'
    priority VARCHAR(50) DEFAULT 'Medium', -- e.g., 'Low', 'Medium', 'High'
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issues_park ON issues(park_id);
CREATE INDEX idx_issues_assigned ON issues(assigned_to);

-- --- Many-to-Many Relationship Tables ---

-- Park Managers (Managers of specific Parks)
CREATE TABLE park_managers (
    park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (park_id, user_id)
);

-- Park Staff (Staff assigned to specific Parks)
CREATE TABLE park_staff (
    park_id INTEGER REFERENCES parks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (park_id, user_id)
);

-- Park Group Staff (Staff assigned to a Park Group)
CREATE TABLE park_group_staff (
    park_group_id INTEGER REFERENCES park_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (park_group_id, user_id)
);
