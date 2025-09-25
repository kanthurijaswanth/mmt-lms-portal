-- Seed users: admin, faculty, student(rahul)
-- Password hashes will be filled by the server script / or replace with your own.
-- For dev convenience, we'll insert plain and let server adjust if needed.
INSERT INTO users (role, name, email, phone, password_hash) VALUES
('admin', 'Admin User', 'admin@mmt.local', '0000000000', '$2a$10$Qb0lE7m/pEnxQ6Eo6T2V6eQ3oSFOk5w6m0K2z8M6wOG5zJd9G0c4K'), -- admin123
('faculty', 'Faculty User', 'faculty@mmt.local', '0000000001', '$2a$10$8b6u5QnG6E6H4bS6KpYQ4eK2wQkK5pW6Y5xA2gqH4QyR2JgB1mE8S'), -- faculty123
('student', 'Rahul', 'rahul@mmt.local', '9999999999', '$2a$10$z7gE4P6nV7b8Q5e2Hc1vUuB3FZxJYcZt8r1U7rGk4yQwJd1h0fQm6'); -- rahulmmt@123

-- Example experiment
INSERT INTO experiments (title, slug, description, instructions_md, knowledge_md, grc_filename, max_marks) VALUES
('AM Modulation Basics', 'am-modulation-basics',
 'Perform amplitude modulation and observe spectrum/time domain changes.',
 '1. Open the GRC file.\n2. Set carrier and message frequency.\n3. Run and capture screenshots.',
 'AM is a method where the amplitude of the carrier is varied according to the message signal...',
 'AM_Modulation.grc',
 20
);

-- Assign the experiment to Rahul
INSERT INTO student_experiments (student_id, experiment_id, status) VALUES
((SELECT id FROM users WHERE email='rahul@mmt.local'),
 (SELECT id FROM experiments WHERE slug='am-modulation-basics'),
 'pending');
