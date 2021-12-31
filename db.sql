--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

-- Started on 2021-12-06 09:58:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 826 (class 1247 OID 24752)
-- Name: category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.category AS ENUM (
    'gaming',
    'office',
    'casual'
);


ALTER TYPE public.category OWNER TO postgres;

--
-- TOC entry 823 (class 1247 OID 24747)
-- Name: device_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.device_type AS ENUM (
    'smartphone',
    'tablet'
);


ALTER TYPE public.device_type OWNER TO postgres;

--
-- TOC entry 829 (class 1247 OID 24760)
-- Name: operating_system; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.operating_system AS ENUM (
    'android',
    'ios',
    'windows',
    'linux'
);


ALTER TYPE public.operating_system OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 24770)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(256) NOT NULL,
    description text,
    image character varying(1024) NOT NULL,
    category public.category NOT NULL,
    price real NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    battery_capacity integer NOT NULL,
    available_since date DEFAULT CURRENT_DATE NOT NULL,
    os public.operating_system NOT NULL,
    device_type public.device_type NOT NULL,
    technologies character varying(1024) NOT NULL,
    has_phone_jack boolean DEFAULT true NOT NULL,
    CONSTRAINT product_battery_capacity_check CHECK ((battery_capacity >= 0)),
    CONSTRAINT product_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24769)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 3328 (class 0 OID 0)
-- Dependencies: 209
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 3173 (class 2604 OID 24773)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 3321 (class 0 OID 24770)
-- Dependencies: 210
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (1, 'Macpac 2', 'Macpac 2 tablet is designed for everyone.', '/static/resources/images/content/gallery/macpac-2.jpg', 'casual', 1244.99, 10, 2400, '2016-05-14', 'ios', 'tablet', '2G,3G,4G,5G', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (2, 'Hua Mars 2', 'Hua Mars 2 tablet is designed for artists.', '/static/resources/images/content/gallery/hua-mars-2.jpg', 'office', 2133.89, 3, 3000, '2018-09-23', 'ios', 'tablet', 'stylus,paperscreen,5G,4K', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (3, 'Hua Moon Ops', 'One of the most comfortable phones to use!', '/static/resources/images/content/gallery/hua-moon-ops.jpg', 'casual', 3421.99, 16, 1800, '2020-12-30', 'ios', 'smartphone', 'faceid,touchid,5G,2K', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (4, 'Menthos OPX 2', 'The elitists'' go-to tablet. It''s remarkable.', '/static/resources/images/content/gallery/menthos-opx-2.jpg', 'office', 3999.99, 5, 2800, '2021-11-28', 'ios', 'tablet', 'touchid,faceid,5G,4K,144Hz,stylus', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (5, 'Menthos XLP', 'The ultimate phone in the industry.', '/static/resources/images/content/gallery/menthos-xlp.jpg', 'gaming', 2499.99, 17, 2200, '2021-09-18', 'ios', 'smartphone', 'faceid,5G', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (6, 'Palle 3', 'The casual user''s go to phone. Cheap and useful.', '/static/resources/images/content/gallery/palle-3.jpg', 'casual', 699.99, 8, 1600, '2015-02-05', 'ios', 'smartphone', 'touchid,3G,60hz', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (7, 'Palle Pro', 'Working can''t be easier than when using a Palle 3.', '/static/resources/images/content/gallery/palle-pro.jpg', 'office', 999.99, 4, 1840, '2017-07-22', 'windows', 'tablet', '2G,3G,4G,msoffice,1080p,wifi', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (8, 'Pogol 5', 'This small and simple tablet will be your daily driver in all areas.', '/static/resources/images/content/gallery/pogol-5.jpg', 'gaming', 1999.99, 4, 1840, '2018-11-29', 'android', 'tablet', '144hz,4G,2K,turbo', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (9, 'Pogol Max 5', 'Fastest tablet on the market. The data proves it.', '/static/resources/images/content/gallery/pogol-max-5.jpg', 'gaming', 1499.99, 2, 2100, '2020-09-11', 'android', 'tablet', 'pogol-assistant,5G,facescan,ai', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (10, 'Pogol Sto 5', 'This tablet is very fast amoung its competitors while being affordable!', '/static/resources/images/content/gallery/pogol-sto-5.jpg', 'casual', 799.99, 13, 2600, '2019-04-05', 'android', 'tablet', 'pogol-assistant,4G,turbo-charge', false);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (11, 'Spear Figgle Ultra', 'When being on at all times is of utmost importance!', '/static/resources/images/content/gallery/spear-figgle-ultra.jpg', 'casual', 599.99, 7, 1400, '2012-02-01', 'linux', 'smartphone', 'vpn,gms,3G', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (12, 'Thord Dock SO', 'Cheap and simple. Can''t get any better than this.', '/static/resources/images/content/gallery/thorn-dock-so.jpg', 'casual', 699.99, 6, 1500, '2014-10-12', 'android', 'smartphone', '4G,support', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (13, 'Thorn Dock', 'The base version of Thorn Dock SO. Smaller performance for better price and battery.', '/static/resources/images/content/gallery/thorn-dock.jpg', 'casual', 499.99, 3, 1800, '2015-11-22', 'android', 'smartphone', '4G,support,turbo-charge', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (14, 'Spear Figgle Dox', 'When you need robustness at all times.', '/static/resources/images/content/gallery/spear-figgle-dox.jpg', 'casual', 999.99, 3, 1900, '2017-08-16', 'linux', 'smartphone', '4G,vpn,gms,lts,cloud,root', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (15, 'Hua Mars 1', 'The basic tool for an artist on the move.', '/static/resources/images/content/gallery/hua-two-in-one.jpg', 'office', 899.99, 7, 2100, '2015-04-13', 'android', 'smartphone', 'stylus,wifi,4G,turbo-charge', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (16, 'Hua Mars 1', 'The basic tool for an artist on the move.', '/static/resources/images/content/gallery/hua-two-in-one.jpg', 'office', 799.99, 7, 2100, '2015-04-13', 'android', 'smartphone', 'stylus,wifi,4G,turbo-charge', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (17, 'Hua Mars 1', 'The basic tool for an artist on the move.', '/static/resources/images/content/gallery/hua-two-in-one.jpg', 'office', 2099.99, 7, 2100, '2015-04-13', 'android', 'smartphone', 'stylus,wifi,4G,turbo-charge', true);
INSERT INTO public.product (id, name, description, image, category, price, stock, battery_capacity, available_since, os, device_type, technologies, has_phone_jack) VALUES (18, 'Hua Mars 1', 'The basic tool for an artist on the move.', '/static/resources/images/content/gallery/hua-two-in-one.jpg', 'office', 499.99, 7, 2100, '2015-04-13', 'android', 'smartphone', 'stylus,wifi,4G,turbo-charge', true);


--
-- TOC entry 3330 (class 0 OID 0)
-- Dependencies: 209
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 1, false);


--
-- TOC entry 3180 (class 2606 OID 24782)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE product; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product TO andrei;


--
-- TOC entry 3329 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE product_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.product_id_seq TO andrei;


-- Completed on 2021-12-06 09:58:15

--
-- PostgreSQL database dump complete
--

