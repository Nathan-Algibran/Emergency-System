-- Insert some sample patients for testing the triage system
INSERT INTO public.patients (nama, usia, jenis_kelamin, alamat, no_hp, waktu_datang) VALUES
('Budi Santoso', 45, 'L', 'Jl. Merdeka No. 123, Jakarta', '08123456789', NOW() - INTERVAL '2 hours'),
('Sari Wijaya', 32, 'P', 'Jl. Sudirman No. 456, Jakarta', '08198765432', NOW() - INTERVAL '1 hour'),
('Ahmad Fauzi', 28, 'L', 'Jl. Gatot Subroto No. 789, Jakarta', '08111222333', NOW() - INTERVAL '30 minutes'),
('Dewi Sartika', 55, 'P', 'Jl. Thamrin No. 321, Jakarta', '08222333444', NOW() - INTERVAL '15 minutes'),
('Rudi Hermawan', 67, 'L', 'Jl. Kuningan No. 654, Jakarta', '08333444555', NOW() - INTERVAL '45 minutes');

-- Note: Triage data and system users will be created when users sign up and use the system
-- The system is ready to accept new user registrations and patient inputs