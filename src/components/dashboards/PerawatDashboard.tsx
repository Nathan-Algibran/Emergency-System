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
  Stethoscope
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
}

const PerawatDashboard = () => {
  const { user, signOut } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    needTriage: 0,
    triaged: 0
  });
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          triage (
            kategori_triage,
            keluhan_utama,
            waktu_input
          )
        `)
        .order('waktu_datang', { ascending: false });

      if (error) throw error;

      setPatients(data || []);
      
      const total = data?.length || 0;
      const needTriage = data?.filter(p => !p.triage || p.triage.length === 0).length || 0;
      const triaged = total - needTriage;
      
      setStats({ total, needTriage, triaged });
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pasien",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
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
      default: return 'PERLU TRIAGE';
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
                <Stethoscope className="h-6 w-6" />
                Dashboard Perawat
              </h1>
              <p className="text-muted-foreground">
                Selamat datang, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* FIXED Tambah Pasien Button tanpa hover */}
              <Button 
                onClick={() => window.location.href = '/patient-input'}
                className="bg-green-600 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pasien
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
        {/* Stats Cards for Nurses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pasien Hari ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-medical-green mr-2" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-waiting">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-status-waiting">
                Perlu Triage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-status-waiting mr-2" />
                <span className="text-2xl font-bold text-status-waiting">{stats.needTriage}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-completed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-status-completed">
                Sudah Triage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-status-completed mr-2" />
                <span className="text-2xl font-bold text-status-completed">{stats.triaged}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List - Focus on patients needing triage */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pasien - Prioritas Triage</CardTitle>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada data pasien</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patients
                  .sort((a, b) => {
                    const aHasTriage = a.triage && a.triage.length > 0;
                    const bHasTriage = b.triage && b.triage.length > 0;
                    if (!aHasTriage && bHasTriage) return -1;
                    if (aHasTriage && !bHasTriage) return 1;
                    
                    const priority = { 'merah': 0, 'kuning': 1, 'hijau': 2, 'hitam': 3 };
                    const aPriority = priority[a.triage?.[0]?.kategori_triage as keyof typeof priority] ?? 4;
                    const bPriority = priority[b.triage?.[0]?.kategori_triage as keyof typeof priority] ?? 4;
                    return aPriority - bPriority;
                  })
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        !patient.triage || patient.triage.length === 0 
                          ? 'border-status-waiting bg-status-waiting/5' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={getTriageColor(patient.triage?.[0]?.kategori_triage || '')}
                          >
                            {getTriageLabel(patient.triage?.[0]?.kategori_triage || '')}
                          </Badge>
                          <h3 className="font-semibold text-lg">{patient.nama}</h3>
                        </div>
                        {!patient.triage || patient.triage.length === 0 ? (
                          <Button 
                            onClick={() => window.location.href = '/patient-input'}
                            size="sm"
                            className="bg-green-600 text-white"
                          >
                            Input Triage
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => window.location.href = `/patient/${patient.id}`} 
                              variant="outline" 
                              size="sm"
                              >
                              Detail
                            </Button>

                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Usia & Jenis Kelamin</p>
                          <p className="font-medium">{patient.usia} tahun ({patient.jenis_kelamin})</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Waktu Datang</p>
                          <p className="font-medium">{formatTime(patient.waktu_datang)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Keluhan Utama</p>
                          <p className="font-medium">
                            {patient.triage?.[0]?.keluhan_utama || 'Belum ada triage'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerawatDashboard;
