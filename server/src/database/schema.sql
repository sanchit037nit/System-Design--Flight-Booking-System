CREATE DATABASE IF NOT EXISTS flight_booking;

USE flight_booking;

CREATE TABLE airports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,

    flight_number VARCHAR(20) NOT NULL UNIQUE,

    departure_airport_id INT NOT NULL,
    arrival_airport_id INT NOT NULL,

    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,

    total_seats INT NOT NULL,

    FOREIGN KEY (departure_airport_id)
        REFERENCES airports(id),

    FOREIGN KEY (arrival_airport_id)
        REFERENCES airports(id)
);

CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,

    flight_id INT NOT NULL,

    seat_number VARCHAR(10) NOT NULL,

    status ENUM('AVAILABLE', 'BOOKED')
        DEFAULT 'AVAILABLE',

    FOREIGN KEY (flight_id)
        REFERENCES flights(id),

    UNIQUE(flight_id, seat_number)
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_id INT NOT NULL,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (flight_id)
        REFERENCES flights(id),

    FOREIGN KEY (seat_id)
        REFERENCES seats(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED'
    ) DEFAULT 'PENDING',

    transaction_id VARCHAR(100) UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);


-- Flight search
CREATE INDEX idx_flights_route
ON flights(departure_airport_id, arrival_airport_id);

-- Flight date/time search
CREATE INDEX idx_flights_departure_time
ON flights(departure_time);

-- Find user's bookings
CREATE INDEX idx_bookings_user_id
ON bookings(user_id);

-- Find bookings for a flight
CREATE INDEX idx_bookings_flight_id
ON bookings(flight_id);

-- Find seats belonging to a flight
CREATE INDEX idx_seats_flight_id
ON seats(flight_id);