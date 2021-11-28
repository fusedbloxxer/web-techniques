SELECT *
FROM product;

BEGIN TRANSACTION;

INSERT INTO product(
	id,
	name,
	description,
	image,
	category,
	price,
	stock,
	battery_capacity,
	available_since,
	os,
	device_type,
	technologies,
	has_phone_jack
)
VALUES
	(1, 'Macpac 2', 'Macpac 2 tablet is designed for everyone.', '/static/resources/images/content/gallery/macpac-2.jpg', 'casual', 1244.99, 10, 2400, '2016-05-14', 'ios', 'tablet', '2G,3G,4G,5G', FALSE),
	(2, 'Hua Mars 2', 'Hua Mars 2 tablet is designed for artists.', '/static/resources/images/content/gallery/hua-mars-2.jpg', 'office', 2133.89, 3, 3000, '2018-09-23', 'ios', 'tablet', 'stylus,paperscreen,5G,4K', FALSE),
	(3, 'Hua Moon Ops', 'One of the most comfortable phones to use!', '/static/resources/images/content/gallery/hua-moon-ops.jpg', 'casual', 3421.99, 16, 1800, '2020-12-30', 'ios', 'smartphone', 'faceid,touchid,5G,2K', FALSE),
	(4, 'Menthos OPX 2', 'The elitists'' go-to tablet. It''s remarkable.', '/static/resources/images/content/gallery/menthos-opx-2.jpg', 'office', 3999.99, 5, 2800, '2021-11-28', 'ios', 'tablet', 'touchid,faceid,5G,4K,144Hz,stylus', FALSE),
	(5, 'Menthos XLP', 'The ultimate phone in the industry.', '/static/resources/images/content/gallery/menthos-xlp.jpg', 'gaming', 2499.99, 17, 2200, '2021-09-18', 'ios', 'smartphone', 'faceid,5G', FALSE),
	(6, 'Palle 3', 'The casual user''s go to phone. Cheap and useful.', '/static/resources/images/content/gallery/palle-3.jpg', 'casual', 699.99, 8, 1600, '2015-02-05', 'ios', 'smartphone', 'touchid,3G,60hz', TRUE),
	(7, 'Palle Pro', 'Working can''t be easier than when using a Palle 3.', '/static/resources/images/content/gallery/palle-pro.jpg', 'office', 999.99, 4, 1840, '2017-07-22', 'windows', 'tablet', '2G,3G,4G,msoffice,1080p,wifi', TRUE),
	(8, 'Pogol 5', 'This small and simple tablet will be your daily driver in all areas.', '/static/resources/images/content/gallery/pogol-5.jpg', 'gaming', 1999.99, 4, 1840, '2018-11-29', 'android', 'tablet', '144hz,4G,2K,turbo', TRUE),
	(9, 'Pogol Max 5', 'Fastest tablet on the market. The data proves it.', '/static/resources/images/content/gallery/pogol-max-5.jpg', 'gaming', 1499.99, 2, 2100, '2020-09-11', 'android', 'tablet', 'pogol-assistant,5G,facescan,ai', FALSE),
	(10, 'Pogol Sto 5', 'This tablet is very fast amoung its competitors while being affordable!', '/static/resources/images/content/gallery/pogol-sto-5.jpg', 'casual', 799.99, 13, 2600, '2019-04-05', 'android', 'tablet', 'pogol-assistant,4G,turbo-charge', FALSE),
	(11, 'Spear Figgle Ultra', 'When being on at all times is of utmost importance!', '/static/resources/images/content/gallery/spear-figgle-ultra.jpg', 'casual', 599.99, 7, 1400, '2012-02-01', 'linux', 'smartphone', 'vpn,gms,3G', TRUE),
	(12, 'Thord Dock SO', 'Cheap and simple. Can''t get any better than this.', '/static/resources/images/content/gallery/thorn-dock-so.jpg', 'casual', 699.99, 6, 1500, '2014-10-12', 'android', 'smartphone', '4G,support', TRUE),
	(13, 'Thorn Dock', 'The base version of Thorn Dock SO. Smaller performance for better price and battery.', '/static/resources/images/content/gallery/thorn-dock.jpg', 'casual', 499.99, 3, 1800, '2015-11-22', 'android', 'smartphone', '4G,support,turbo-charge', TRUE),
	(14, 'Spear Figgle Dox', 'When you need robustness at all times.', '/static/resources/images/content/gallery/spear-figgle-dox.jpg', 'casual', 999.99, 3, 1900, '2017-08-16', 'linux', 'smartphone', '4G,vpn,gms,lts,cloud,root', TRUE),
	(15, 'Hua Mars 1', 'The basic tool for an artist on the move.', '/static/resources/images/content/gallery/hua-two-in-one.jpg', 'office', 899.99, 7, 2100, '2015-04-13', 'android', 'smartphone', 'stylus,wifi,4G,turbo-charge', TRUE);

COMMIT TRANSACTION;