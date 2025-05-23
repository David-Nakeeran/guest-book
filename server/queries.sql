-- Table
CREATE TABLE messages (
    id bigint generated always as identity primary key,
    first_name VARCHAR(255),
    surname VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    likes INTEGER
);