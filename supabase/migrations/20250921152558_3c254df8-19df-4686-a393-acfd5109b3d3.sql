-- Insert demo users into system_users table
-- Note: These user_ids are placeholders and will need to be updated with real auth user IDs

-- Insert demo system users with different roles
INSERT INTO public.system_users (user_id, username, nama_user, role) VALUES
('11111111-1111-1111-1111-111111111111', 'perawat1', 'Siti Nurhaliza', 'perawat'),
('22222222-2222-2222-2222-222222222222', 'dokter1', 'Dr. Ahmad Rahman', 'dokter'),
('33333333-3333-3333-3333-333333333333', 'admin1', 'Admin Rumah Sakit', 'admin');

-- Insert some sample patients for testing
INSERT INTO public.patients (nama, usia, jenis_kelamin, alamat, no_hp, waktu_datang) VALUES
('Budi Santoso', 45, 'L', 'Jl. Merdeka No. 123, Jakarta', '08123456789', NOW() - INTERVAL '2 hours'),
('Sari Wijaya', 32, 'P', 'Jl. Sudirman No. 456, Jakarta', '08198765432', NOW() - INTERVAL '1 hour'),
('Ahmad Fauzi', 28, 'L', 'Jl. Gatot Subroto No. 789, Jakarta', '08111222333', NOW() - INTERVAL '30 minutes'),
('Dewi Sartika', 55, 'P', 'Jl. Thamrin No. 321, Jakarta', '08222333444', NOW() - INTERVAL '15 minutes'),
('Rudi Hermawan', 67, 'L', 'Jl. Kuningan No. 654, Jakarta', '08333444555', NOW() - INTERVAL '45 minutes');