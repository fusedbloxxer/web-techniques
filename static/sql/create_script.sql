DROP TABLE IF EXISTS user_has_permission;
DROP TABLE IF EXISTS role_has_permission;
DROP TABLE IF EXISTS permission;
DROP TABLE IF EXISTS entity;
DROP TABLE IF EXISTS has_role;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS app_user;
DROP TABLE IF EXISTS user_preference;
DROP TYPE IF EXISTS theme;
DROP TABLE IF EXISTS page;
DROP TABLE IF EXISTS product;
DROP TYPE IF EXISTS device_type;
DROP TYPE IF EXISTS operating_system;
DROP TYPE IF EXISTS category;

-- PRODUCT TABLE
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

CREATE TABLE product(
    product_id serial PRIMARY KEY UNIQUE NOT NULL,
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

CREATE TABLE page(
	page_id SERIAL PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	description VARCHAR(1024) DEFAULT '' NOT NULL
);

-- USER TABLE
CREATE TYPE theme AS ENUM(
	'dark',
	'light',
	'mountain'
);

CREATE TABLE user_preference(
	preference_id SERIAL PRIMARY KEY,
	theme theme DEFAULT 'light' NOT NULL
);

CREATE TABLE app_user(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	first_name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	chat_color VARCHAR(50) DEFAULT 'red' NOT NULL,
	password_hash VARCHAR(1024) NOT NULL,
	password_salt VARCHAR(1024) NOT NULL,
	sight_issue BOOLEAN DEFAULT FALSE NOT NULL,
	preference_id INT REFERENCES user_preference(preference_id) NOT NULL UNIQUE,
	time_token VARCHAR(80) NOT NULL,
	activate_token VARCHAR(80) NOT NULL,
	account_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
	photo VARCHAR(300)
);

-- A general entity, that can be mapped one-to-one to a table
-- used to specify general permissions, and not create hundreds
-- of tables for each permission relation
-- USER <-> PERMISSION <-> GENERAL_TABLE*
CREATE TABLE entity(
	entity_id SERIAL PRIMARY KEY,
	product_id INT REFERENCES product(product_id),
	user_id INT REFERENCES app_user(user_id),
	page_id INT REFERENCES page(page_id),
	CONSTRAINT one_to_one CHECK(
		(product_id IS NOT NULL)::INTEGER +
		(page_id IS NOT NULL)::INTEGER +
		(user_id IS NOT NULL)::INTEGER
		= 1
	)
);

CREATE TABLE permission(
	permission_id SERIAL PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	description VARCHAR(1024) DEFAULT '' NOT NULL,
	add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3-Type Table allowing users permissions over multiple entities
CREATE TABLE user_has_permission(
	user_id INT NOT NULL REFERENCES app_user(user_id),
	permission_id INT NOT NULL REFERENCES permission(permission_id),
	entity_id INT NOT NULL REFERENCES entity(entity_id),
	PRIMARY KEY(user_id, permission_id, entity_id)
);

CREATE TABLE user_role(
	role_id SERIAL PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	description VARCHAR(1024) DEFAULT '' NOT NULL
);

CREATE TABLE has_role(
	user_id INT NOT NULL REFERENCES app_user(user_id),
	role_id INT NOT NULL REFERENCES user_role(role_id),
	add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(user_id, role_id)
);

CREATE TABLE role_has_permission(
	role_id INT NOT NULL REFERENCES user_role(role_id),
	permission_id INT NOT NULL REFERENCES permission(permission_id),
	entity_id INT REFERENCES entity(entity_id)
);
