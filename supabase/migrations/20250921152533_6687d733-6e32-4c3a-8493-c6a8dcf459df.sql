-- Insert demo users into system_users table
-- First, we need to create some auth users and then link them to system_users

-- Create demo system users (these will need to be linked to actual auth users)
-- Note: In production, these should be created through the proper signup flow

-- Insert demo system users with different roles
INSERT INTO public.system_users (user_id, username, nama_user, role) VALUES
-- These user_ids should match actual auth users - for demo purposes using placeholder UUIDs
('11111111-1111-1111-1111-111111111111', 'perawat1', 'Siti Nurhaliza', 'perawat'),
('22222222-2222-2222-2222-222222222222', 'dokter1', 'Dr. Ahmad Rahman', 'dokter'),
('33333333-3333-3333-3333-333333333333', 'admin1', 'Admin Rumah Sakit', 'admin')
ON CONFLICT (user_id) DO NOTHING;

-- Insert some sample patients for testing
INSERT INTO public.patients (nama, usia, jenis_kelamin, alamat, no_hp, waktu_datang) VALUES
('Budi Santoso', 45, 'L', 'Jl. Merdeka No. 123, Jakarta', '08123456789', NOW() - INTERVAL '2 hours'),
('Sari Wijaya', 32, 'P', 'Jl. Sudirman No. 456, Jakarta', '08198765432', NOW() - INTERVAL '1 hour'),
('Ahmad Fauzi', 28, 'L', 'Jl. Gatot Subroto No. 789, Jakarta', '08111222333', NOW() - INTERVAL '30 minutes'),
('Dewi Sartika', 55, 'P', 'Jl. Thamrin No. 321, Jakarta', '08222333444', NOW() - INTERVAL '15 minutes'),
('Rudi Hermawan', 67, 'L', 'Jl. Kuningan No. 654, Jakarta', '08333444555', NOW() - INTERVAL '45 minutes')
ON CONFLICT (id) DO NOTHING;

-- Get the patient IDs for triage insertion
-- Insert sample triage data for the patients
WITH patient_ids AS (
  SELECT id, nama FROM public.patients 
  WHERE nama IN ('Budi Santoso', 'Sari Wijaya', 'Ahmad Fauzi', 'Dewi Sartika', 'Rudi Hermawan')
),
nurse_id AS (
  SELECT id FROM public.system_users WHERE role = 'perawat' LIMIT 1
)
INSERT INTO public.triage (
  patient_id, 
  perawat_id, 
  keluhan_utama, 
  tekanan_darah_systolic, 
  tekanan_darah_diastolic,
  denyut_nadi,
  suhu_tubuh,
  tingkat_kesadaran,
  kategori_triage,
  waktu_input
)
SELECT 
  p.id,
  n.id,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 'Nyeri dada hebat, sesak nafas'
    WHEN 'Sari Wijaya' THEN 'Demam tinggi, sakit kepala'
    WHEN 'Ahmad Fauzi' THEN 'Luka ringan di tangan kanan'
    WHEN 'Dewi Sartika' THEN 'Tekanan darah tinggi, pusing'
    WHEN 'Rudi Hermawan' THEN 'Kesulitan bernapas, nyeri dada'
  END,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 85  -- Low BP (Red)
    WHEN 'Sari Wijaya' THEN 140  -- High BP (Yellow)
    WHEN 'Ahmad Fauzi' THEN 120  -- Normal (Green)
    WHEN 'Dewi Sartika' THEN 170 -- Very high BP (Red)
    WHEN 'Rudi Hermawan' THEN 80 -- Very low BP (Red)
  END,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 60
    WHEN 'Sari Wijaya' THEN 90
    WHEN 'Ahmad Fauzi' THEN 80
    WHEN 'Dewi Sartika' THEN 95
    WHEN 'Rudi Hermawan' THEN 50
  END,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 125  -- High pulse (Red)
    WHEN 'Sari Wijaya' THEN 105   -- High pulse (Yellow)
    WHEN 'Ahmad Fauzi' THEN 75    -- Normal (Green)
    WHEN 'Dewi Sartika' THEN 110  -- High pulse (Yellow)
    WHEN 'Rudi Hermawan' THEN 45  -- Low pulse (Red)
  END,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 36.8
    WHEN 'Sari Wijaya' THEN 39.2  -- High fever (Red)
    WHEN 'Ahmad Fauzi' THEN 36.5  -- Normal
    WHEN 'Dewi Sartika' THEN 37.1
    WHEN 'Rudi Hermawan' THEN 36.3
  END,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 'sadar'
    WHEN 'Sari Wijaya' THEN 'somnolen'  -- Drowsy (Yellow)
    WHEN 'Ahmad Fauzi' THEN 'sadar'     -- Alert (Green)
    WHEN 'Dewi Sartika' THEN 'sadar'
    WHEN 'Rudi Hermawan' THEN 'sopor'   -- Stupor (Red)
  END,
  CASE p.nama
    WHEN 'Budi Santoso' THEN 'merah'    -- Emergency
    WHEN 'Sari Wijaya' THEN 'merah'     -- Emergency (high fever)
    WHEN 'Ahmad Fauzi' THEN 'hijau'     -- Less urgent
    WHEN 'Dewi Sartika' THEN 'merah'    -- Emergency (very high BP)
    WHEN 'Rudi Hermawan' THEN 'merah'   -- Emergency (multiple critical signs)
  END,
  NOW() - INTERVAL '30 minutes'
FROM patient_ids p, nurse_id n
ON CONFLICT (patient_id) DO NOTHING;

-- Insert some patient history records
WITH patient_and_doctor AS (
  SELECT 
    p.id as patient_id,
    d.id as doctor_id
  FROM public.patients p, public.system_users d
  WHERE p.nama = 'Ahmad Fauzi' AND d.role = 'dokter'
  LIMIT 1
)
INSERT INTO public.patient_history (patient_id, dokter_id, diagnosis, tindakan, status, waktu_update)
SELECT 
  patient_id,
  doctor_id,
  'Luka superficial pada ekstremitas atas',
  'Pembersihan luka, pemberian antiseptik, dan penutupan luka',
  'selesai',
  NOW()
FROM patient_and_doctor
ON CONFLICT (id) DO NOTHING;