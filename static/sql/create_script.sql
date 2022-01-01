-- Drop Tables
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS app_user;

-- Drop Types
DROP TYPE IF EXISTS device_type;
DROP TYPE IF EXISTS operating_system;
DROP TYPE IF EXISTS category;
DROP TYPE IF EXISTS role;

-- Create Types
CREATE TYPE device_type AS ENUM (
    'smartphone',
    'tablet'
);

CREATE TYPE category AS ENUM(
    'gaming',
    'office',
    'casual'
);

CREATE TYPE operating_system AS ENUM(
    'android',
    'ios',
    'windows',
    'linux'
);

-- Create Tables
CREATE TABLE product (
    id serial PRIMARY KEY UNIQUE NOT NULL,
    name character varying(256) NOT NULL,
    description text,
    image character varying(1024) NOT NULL,
    category category NOT NULL,
    price real NOT NULL,
	stock integer DEFAULT 0 CHECK(stock >= 0) NOT NULL,
	battery_capacity integer CHECK(battery_capacity >= 0) NOT NULL,
	available_since DATE NOT NULL DEFAULT CURRENT_DATE,
    os operating_system NOT NULL,
    device_type device_type NOT NULL,
	technologies character varying(1024) NOT NULL,
    has_phone_jack boolean DEFAULT true NOT NULL
);

CREATE TYPE role
AS
ENUM('admin', 'moderator', 'common');

CREATE TABLE IF NOT EXISTS app_user (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	first_name VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	role role NOT NULL DEFAULT 'common',
	email VARCHAR(100) NOT NULL,
	chat_color VARCHAR(50) NOT NULL,
	add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);