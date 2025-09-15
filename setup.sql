-- Enable the pgcrypto extension to use gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade TEXT
);

-- Create the reading_tests table
CREATE TABLE IF NOT EXISTS reading_tests (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    words_per_minute INTEGER NOT NULL,
    test_date TIMESTAMP NOT NULL DEFAULT now()
);

-- Create an index on the student_id column for faster lookups
CREATE INDEX IF NOT EXISTS idx_reading_tests_student_id ON reading_tests(student_id);
