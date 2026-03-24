INSERT INTO users (uid, email, name, password)
VALUES (1, 'user@example.com', 'John Doe', '1234');

INSERT INTO types (name, manual, imageDir, description, availability)
VALUES ('Stopwatch', 'link here', 'stopwatch.jpeg', 'tells the time', 'Available');

INSERT INTO items (itemID, status, name)
VALUES (1, 'Available', 'Stopwatch');

INSERT INTO bookings (bookingID, itemID, uid, bookingDate, returnDate, status)
VALUES (1, 1, '1', '2000-01-01', '2026-01-01', 'On loan');
