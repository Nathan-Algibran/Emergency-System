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
  LogOut,
  FileText,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

const DokterDashboard = () => {
  const { user, signOut } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    emergency: 0,
    needDiagnosis: 0,
    completed: 0
  });
  const { toast } = useToast();
  const navigate = useNavigate();

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
          ),
          patient_history (
            status,
            diagnosis,
            tindakan
          )
        `)
        .order('waktu_datang', { ascending: false });

      if (error) throw error;

      const triagedPatients = data?.filter(p => p.triage && p.triage.length > 0) || [];
      setPatients(triagedPatients);
      
      const total = triagedPatients.length;
      const emergency = triagedPatients.filter(p => p.triage?.[0]?.kategori_triage === 'merah').length;
      const needDiagnosis = triagedPatients.filter(p => !p.patient_history || p.patient_history.length === 0).length;
      const completed = triagedPatients.filter(p => p.patient_history && p.patient_history.length > 0).length;
      
      setStats({ total, emergency, needDiagnosis, completed });
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
      default: return 'PENDING';
    }
  };

  const getStatusBadge = (patient: Patient) => {
    if (!patient.patient_history || patient.patient_history.length === 0) {
      return <Badge variant="outline" className="text-status-waiting border-status-waiting">Perlu Diagnosis</Badge>;
    }
    return <Badge className="bg-status-completed text-white">Sudah Ditangani</Badge>;
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
                <UserCheck className="h-6 w-6" />
                Dashboard Dokter
              </h1>
              <p className="text-muted-foreground">
                Selamat datang, Dr. {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pasien Triage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-medical-green mr-2" />
                <span className="text-2xl font-bold">{stats.total}</span>
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
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-triage-red mr-2" />
                <span className="text-2xl font-bold text-triage-red">{stats.emergency}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-waiting">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-status-waiting">
                Perlu Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-status-waiting mr-2" />
                <span className="text-2xl font-bold text-status-waiting">{stats.needDiagnosis}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-status-completed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-status-completed">
                Sudah Ditangani
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-status-completed mr-2" />
                <span className="text-2xl font-bold text-status-completed">{stats.completed}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pasien - Prioritas Medis</CardTitle>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada pasien yang sudah triage</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patients
                  .sort((a, b) => {
                    const priority = { 'merah': 0, 'kuning': 1, 'hijau': 2, 'hitam': 3 };
                    const aPriority = priority[a.triage?.[0]?.kategori_triage as keyof typeof priority] ?? 4;
                    const bPriority = priority[b.triage?.[0]?.kategori_triage as keyof typeof priority] ?? 4;
                    
                    const aHasHistory = a.patient_history && a.patient_history.length > 0;
                    const bHasHistory = b.patient_history && b.patient_history.length > 0;
                    if (!aHasHistory && bHasHistory) return -1;
                    if (aHasHistory && !bHasHistory) return 1;
                    
                    return aPriority - bPriority;
                  })
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        patient.triage?.[0]?.kategori_triage === 'merah' 
                          ? 'border-triage-red bg-triage-red/5' 
                          : (!patient.patient_history || patient.patient_history.length === 0)
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
                          {getStatusBadge(patient)}
                          <h3 className="font-semibold text-lg">{patient.nama}</h3>
                        </div>
                        <div className="flex gap-2">
                          {!patient.patient_history || patient.patient_history.length === 0 ? (
                            <Button 
                              onClick={() => navigate(`/dokter/tangani/${patient.id}`)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Tangani
                            </Button>
                          ) : (
                            <>
                              <Button 
                                disabled
                                className="bg-gray-400 text-white"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Selesai
                              </Button>
                              <Button 
                                onClick={() => navigate(`/dokter/diagnosa/${patient.id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Diagnosa
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
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
                          <p className="font-medium">{patient.triage?.[0]?.keluhan_utama}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium">
                            {patient.patient_history?.[0]?.diagnosis || 'Belum ada diagnosis'}
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

export default DokterDashboard;
