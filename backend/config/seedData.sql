-- Seed Data for Job Portal Database
-- Run this after creating the database with database.sql

-- Insert Settings
INSERT INTO settings (platform_name, company_email, company_phone, address)
VALUES ('Shnoor Job Portal', 'support@shnoorjobportal.com', '+1 (555) 123-4567', '123 Business Street, Suite 100, New York, NY 10001')
ON CONFLICT DO NOTHING;

-- Insert Super Admin, Company Managers, and Users
INSERT INTO users (id, name, email, password, role, is_blocked, created_at, updated_at)
VALUES 
  (1, 'Super Admin', 'superadmin@shnoorjobportal.com', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'superadmin', FALSE, '2026-01-01 08:00:00', '2026-01-01 08:00:00'),
  (2, 'Priya Nair', 'priya.nair@northstarstudio.com', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'company_manager', FALSE, '2026-01-03 09:00:00', '2026-01-03 09:00:00'),
  (3, 'Omar Hassan', 'omar.hassan@brightlaneapps.com', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'company_manager', FALSE, '2026-01-06 09:30:00', '2026-01-06 09:30:00'),
  (4, 'Elena Rivera', 'elena.rivera@cloudorbit.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'company_manager', FALSE, '2026-01-10 10:00:00', '2026-01-10 10:00:00'),
  (5, 'Jason Lee', 'jason.lee@pixelcraftlabs.com', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'company_manager', FALSE, '2026-01-14 10:30:00', '2026-01-14 10:30:00'),
  (6, 'Hannah Adams', 'hannah.adams@meridianops.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'company_manager', FALSE, '2026-01-18 11:00:00', '2026-01-18 11:00:00'),
  (7, 'Marcus Brown', 'marcus.brown@atlasgrowth.io', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'company_manager', FALSE, '2026-01-22 11:30:00', '2026-01-22 11:30:00'),
  (8, 'Olivia Reed', 'olivia.reed@jobmail.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'user', FALSE, '2026-02-01 08:30:00', '2026-02-01 08:30:00'),
  (9, 'Ethan Clark', 'ethan.clark@careermail.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'user', FALSE, '2026-02-04 09:00:00', '2026-02-04 09:00:00'),
  (10, 'Sophia Turner', 'sophia.turner@workmail.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'user', TRUE, '2026-02-08 09:30:00', '2026-02-08 09:30:00'),
  (11, 'Liam Scott', 'liam.scott@seekmail.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'user', FALSE, '2026-02-12 10:00:00', '2026-02-12 10:00:00'),
  (12, 'Ava Mitchell', 'ava.mitchell@talentmail.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'user', FALSE, '2026-02-16 10:30:00', '2026-02-16 10:30:00'),
  (13, 'Noah White', 'noah.white@hiremail.co', '$2a$10$Y0sH.XH9KGt8V9Z6ZrzM.O7ZI8NxJH9Z6C6V4R3D7Q8F8K6Y9E7Z6', 'user', FALSE, '2026-02-20 11:00:00', '2026-02-20 11:00:00')
ON CONFLICT (id) DO NOTHING;
-- Reset user id sequence
SELECT setval('users_id_seq', (SELECT max(id) FROM users));

-- Insert Admin User (password: 'admin123')
INSERT INTO users (name, email, password, role)
VALUES ('Official Admin', 'admin@hirehub.com', '$2b$10$Capc9Pa2mw7Ad4CG2qj1hOl2n7KkLKZxCiGypbWeRo/qNF.QFkpJm', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Companies
INSERT INTO companies (name, owner_id, email, phone, website, status, description)
VALUES 
  ('Northstar Studio', 2, 'hello@northstarstudio.com', '+1 (555) 001-0001', 'https://northstarstudio.com', 'approved', 'Creative product design and software studio'),
  ('BrightLane Apps', 3, 'contact@brightlaneapps.com', '+1 (555) 001-0002', 'https://brightlaneapps.com', 'pending', 'Mobile and web app development team'),
  ('Cloud Orbit', 4, 'info@cloudorbit.co', '+1 (555) 001-0003', 'https://cloudorbit.co', 'approved', 'Cloud engineering and infrastructure experts'),
  ('PixelCraft Labs', 5, 'team@pixelcraftlabs.com', '+1 (555) 001-0004', 'https://pixelcraftlabs.com', 'blocked', 'Digital product engineering studio'),
  ('Meridian Ops', 6, 'hello@meridianops.co', '+1 (555) 001-0005', 'https://meridianops.co', 'approved', 'Operations and business systems consulting'),
  ('Atlas Growth', 7, 'support@atlasgrowth.io', '+1 (555) 001-0006', 'https://atlasgrowth.io', 'pending', 'Growth marketing and analytics services')
ON CONFLICT DO NOTHING;

-- Insert Sample Users
INSERT INTO users (name, email, password, role)
VALUES 
  ('John Developer', 'john@example.com', '$2b$10$X7GmPbLh6asS4x3x0f5d8efkUFYRPuA9G0J0rXGXNq35p3xNmPR9G', 'user'),
  ('Sarah Designer', 'sarah@example.com', '$2b$10$X7GmPbLh6asS4x3x0f5d8efkUFYRPuA9G0J0rXGXNq35p3xNmPR9G', 'user'),
  ('Michael Manager', 'michael@example.com', '$2b$10$X7GmPbLh6asS4x3x0f5d8efkUFYRPuA9G0J0rXGXNq35p3xNmPR9G', 'user'),
  ('Portal Manager', 'manager@hirehub.com', '$2b$10$tjv/DCqxM6Hc4gCxymyOyOyqlYKPyvGVTiy8R/x7o4BvjCd1AMyju', 'manager')
ON CONFLICT (email) DO NOTHING;
-- Insert Sample Jobs
INSERT INTO jobs (company_id, title, description, salary_min, salary_max, location, status)
VALUES 
  (1, 'Senior Full Stack Developer', 'Looking for experienced full stack developer', 100000, 150000, 'New York, NY', 'open'),
  (2, 'Frontend Developer', 'React and Vue.js specialist needed', 80000, 120000, 'Remote', 'open'),
  (3, 'UI/UX Designer', 'Creative designer for web and mobile projects', 70000, 100000, 'Los Angeles, CA', 'open'),
  (4, 'Cloud Architect', 'AWS and Azure certification preferred', 120000, 160000, 'San Francisco, CA', 'closed'),
  (5, 'SEO Specialist', 'Digital marketing and SEO expertise', 60000, 90000, 'Chicago, IL', 'open'),
  (6, 'Operations Analyst', 'Support business process and reporting workflows', 65000, 95000, 'Austin, TX', 'open')
ON CONFLICT DO NOTHING;

-- Insert Sample Applications
INSERT INTO applications (job_id, user_id, status)
SELECT j.id, u.id, v.status
FROM (
  VALUES
    ('Senior Full Stack Developer', 'john@example.com', 'applied'),
    ('Senior Full Stack Developer', 'sarah@example.com', 'selected'),
    ('Frontend Developer', 'john@example.com', 'applied'),
    ('UI/UX Designer', 'sarah@example.com', 'rejected'),
    ('SEO Specialist', 'michael@example.com', 'applied')
) AS v(job_title, user_email, status)
JOIN jobs j ON j.title = v.job_title
JOIN users u ON u.email = v.user_email
WHERE NOT EXISTS (
  SELECT 1
  FROM applications a
  WHERE a.job_id = j.id AND a.user_id = u.id
);

INSERT INTO applications (job_id, user_id, status)
VALUES 
  (1, 8, 'applied'),
  (2, 9, 'selected'),
  (3, 10, 'applied'),
  (4, 11, 'rejected'),
  (5, 12, 'applied'),
  (6, 13, 'applied')
ON CONFLICT DO NOTHING;

-- Insert Sample Subscriptions
INSERT INTO subscriptions (company_id, plan_name, amount, payment_date, expiry_date, status)
VALUES 
  (1, 'Pro', 79.00, '2024-01-15', '2024-02-15', 'active'),
  (2, 'Basic', 29.00, '2024-01-10', '2024-02-10', 'inactive'),
  (3, 'Enterprise', 199.00, '2024-01-01', '2024-04-01', 'active'),
  (4, 'Basic', 29.00, '2023-12-20', '2024-01-20', 'inactive'),
  (5, 'Pro', 79.00, '2024-02-01', '2024-03-01', 'active'),
  (6, 'Basic', 29.00, '2024-02-15', '2024-03-15', 'inactive')
ON CONFLICT DO NOTHING;

-- Insert Manager Test Links
INSERT INTO manager_test_links (application_id, job_id, candidate_email, link_url, notes, link_status, created_by, updated_by)
SELECT a.id, j.id, u.email, v.link_url, v.notes, v.link_status, manager_user.id, manager_user.id
FROM (
  VALUES
    ('Senior Full Stack Developer', 'john@example.com', 'https://tests.hirehub.com/assessment/001', 'Initial coding assessment link', 'sent'),
    ('Senior Full Stack Developer', 'sarah@example.com', 'https://tests.hirehub.com/assessment/002', 'UI review assignment', 'completed')
) AS v(job_title, user_email, link_url, notes, link_status)
JOIN jobs j ON j.title = v.job_title
JOIN users u ON u.email = v.user_email
JOIN applications a ON a.job_id = j.id AND a.user_id = u.id
JOIN users manager_user ON manager_user.email = 'manager@hirehub.com'
WHERE NOT EXISTS (
  SELECT 1
  FROM manager_test_links tl
  WHERE tl.application_id = a.id AND tl.link_url = v.link_url
);
