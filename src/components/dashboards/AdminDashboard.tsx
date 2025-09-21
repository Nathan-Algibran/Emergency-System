import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  Activity, 
  AlertTriangle,
  UserPlus,
  LogOut,
  Settings,
  BarChart3,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  nama: string;
  usia: number;
  jenis_kelamin: string;
  waktu_datang: string;
  triage?: {
    kategori_triage: string;
    keluhan_utama: string;
    waktu_input: string;
  }[];
  patient_history?: {
    status: string;
    diagnosis: string;
    tindakan: string;
  }[];
}

interface SystemUser {
  id: string;
  nama_user: string;
  username: string;
  role: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalUsers: 0,
    red: 0,
    yellow: 0,
    green: 0,
    black: 0,
    perawat: 0,
    dokter: 0,
    admin: 0
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select(`
          *,
          triage (
            kategori_triage,
            keluhan_utama,
            waktu_input
          ),
          patient_history (
            status,
            diagnosis,
            tindakan
          )
        `)
        .order('waktu_datang', { ascending: false });

      if (patientsError) throw patientsError;

      // Fetch system users
      const { data: usersData, error: usersError } = await supabase
        .from('system_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setPatients(patientsData || []);
      setSystemUsers(usersData || []);
      
      // Calculate comprehensive stats
      const totalPatients = patientsData?.length || 0;
      const totalUsers = usersData?.length || 0;
      const red = patientsData?.filter(p => p.triage?.[0]?.kategori_triage === 'merah').length || 0;
      const yellow = patientsData?.filter(p => p.triage?.[0]?.kategori_triage === 'kuning').length || 0;
      const green = patientsData?.filter(p => p.triage?.[0]?.kategori_triage === 'hijau').length || 0;
      const black = patientsData?.filter(p => p.triage?.[0]?.kategori_triage === 'hitam').length || 0;
      
      const perawat = usersData?.filter(u => u.role === 'perawat').length || 0;
      const dokter = usersData?.filter(u => u.role === 'dokter').length || 0;
      const admin = usersData?.filter(u => u.role === 'admin').length || 0;
      
      setStats({ totalPatients, totalUsers, red, yellow, green, black, perawat, dokter, admin });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTriageColor = (category: string) => {
    switch (category) {
      case 'merah': return 'bg-triage-red text-white';
      case 'kuning': return 'bg-triage-yellow text-black';
      case 'hijau': return 'bg-triage-green text-white';
      case 'hitam': return 'bg-triage-black text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTriageLabel = (category: string) => {
    switch (category) {
      case 'merah': return 'EMERGENCY';
      case 'kuning': return 'URGENT';
      case 'hijau': return 'LESS URGENT';
      case 'hitam': return 'DECEASED';
      default: return 'PENDING';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-status-completed text-white">Admin</Badge>;
      case 'dokter': return <Badge className="bg-status-in-progress text-white">Dokter</Badge>;
      case 'perawat': return <Badge className="bg-status-waiting text-white">Perawat</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-medical-green mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-medical-green flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Dashboard Admin
              </h1>
              <p className="text-muted-foreground">
                Administrator - {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.location.href = '/patient-input'}
                className="bg-gradient-medical hover:shadow-medical"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pasien
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Pengaturan
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pasien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-medical-green mr-2" />
                <span className="text-2xl font-bold">{stats.totalPatients}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-medical-green mr-2" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-triage-red">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-triage-red">
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-triage-red">{stats.red}</span>
            </CardContent>
          </Card>

          <Card className="border-triage-yellow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-triage-yellow">
                Urgent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-triage-yellow">{stats.yellow}</span>
            </CardContent>
          </Card>

          <Card className="border-triage-green">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-triage-green">
                Less Urgent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-triage-green">{stats.green}</span>
            </CardContent>
          </Card>

          <Card className="border-triage-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-triage-black">
                Deceased
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-triage-black">{stats.black}</span>
            </CardContent>
          </Card>

          <Card className="border-medical-green">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-medical-green">
                Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs">
                <p>P: {stats.perawat} | D: {stats.dokter} | A: {stats.admin}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pasien Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum ada data pasien</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {patients.slice(0, 10).map((patient) => (
                    <div
                      key={patient.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={getTriageColor(patient.triage?.[0]?.kategori_triage || '')}
                          >
                            {getTriageLabel(patient.triage?.[0]?.kategori_triage || '')}
                          </Badge>
                          <h4 className="font-medium">{patient.nama}</h4>
                        </div>
                        <Button variant="outline" size="sm">
                          <Activity className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.usia} tahun • {formatTime(patient.waktu_datang)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Users */}
          <Card>
            <CardHeader>
              <CardTitle>Manajemen User</CardTitle>
            </CardHeader>
            <CardContent>
              {systemUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum ada user</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {systemUsers.map((user) => (
                    <div
                      key={user.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          <h4 className="font-medium">{user.nama_user}</h4>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;