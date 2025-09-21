import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Heart, Thermometer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientData {
  nama: string;
  usia: number;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  no_hp: string;
}

interface TriageData {
  keluhan_utama: string;
  tekanan_darah_systolic: number;
  tekanan_darah_diastolic: number;
  denyut_nadi: number;
  suhu_tubuh: number;
  tingkat_kesadaran: 'sadar' | 'somnolen' | 'sopor' | 'koma';
}

const PatientInput = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const [patientData, setPatientData] = useState<PatientData>({
    nama: '',
    usia: 0,
    jenis_kelamin: 'L',
    alamat: '',
    no_hp: ''
  });

  const [triageData, setTriageData] = useState<TriageData>({
    keluhan_utama: '',
    tekanan_darah_systolic: 120,
    tekanan_darah_diastolic: 80,
    denyut_nadi: 80,
    suhu_tubuh: 36.5,
    tingkat_kesadaran: 'sadar'
  });

  // Triage Algorithm
  const calculateTriageCategory = (triage: TriageData): 'merah' | 'kuning' | 'hijau' | 'hitam' => {
    const { tekanan_darah_systolic, tekanan_darah_diastolic, denyut_nadi, suhu_tubuh, tingkat_kesadaran } = triage;
    
    // Critical conditions (RED)
    if (
      tingkat_kesadaran === 'koma' ||
      tingkat_kesadaran === 'sopor' ||
      tekanan_darah_systolic < 90 ||
      tekanan_darah_systolic > 180 ||
      denyut_nadi < 50 ||
      denyut_nadi > 120 ||
      suhu_tubuh < 35 ||
      suhu_tubuh > 39
    ) {
      return 'merah';
    }
    
    // Urgent conditions (YELLOW)
    if (
      tingkat_kesadaran === 'somnolen' ||
      tekanan_darah_systolic < 100 ||
      tekanan_darah_systolic > 160 ||
      denyut_nadi < 60 ||
      denyut_nadi > 100 ||
      suhu_tubuh > 38 ||
      suhu_tubuh < 36
    ) {
      return 'kuning';
    }
    
    // Less urgent (GREEN)
    return 'hijau';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, insert patient data
      const { data: patientInsert, error: patientError } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (patientError) {
        throw patientError;
      }

      // Get current user from system_users table
      const { data: currentUser, error: userError } = await supabase
        .from('system_users')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (userError) {
        throw userError;
      }

      // Calculate triage category
      const kategori_triage = calculateTriageCategory(triageData);

      // Insert triage data
      const { error: triageError } = await supabase
        .from('triage')
        .insert([{
          ...triageData,
          patient_id: patientInsert.id,
          perawat_id: currentUser.id,
          kategori_triage
        }]);

      if (triageError) {
        throw triageError;
      }

      toast({
        title: "Berhasil",
        description: `Pasien berhasil didaftarkan dengan kategori triage: ${kategori_triage.toUpperCase()}`,
      });

      // Reset form
      setPatientData({
        nama: '',
        usia: 0,
        jenis_kelamin: 'L',
        alamat: '',
        no_hp: ''
      });
      setTriageData({
        keluhan_utama: '',
        tekanan_darah_systolic: 120,
        tekanan_darah_diastolic: 80,
        denyut_nadi: 80,
        suhu_tubuh: 36.5,
        tingkat_kesadaran: 'sadar'
      });
      setStep(1);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data pasien",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTriageColor = (category: string) => {
    switch (category) {
      case 'merah': return 'text-triage-red';
      case 'kuning': return 'text-triage-yellow';
      case 'hijau': return 'text-triage-green';
      default: return 'text-muted-foreground';
    }
  };

  if (userRole !== 'perawat' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Anda tidak memiliki akses untuk halaman ini.</p>
            <Button onClick={() => window.location.href = '/'} className="mt-4">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const previewCategory = calculateTriageCategory(triageData);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-medical-green">
                Input Data Pasien
              </h1>
              <p className="text-muted-foreground">
                Langkah {step} dari 2 - {step === 1 ? 'Data Pasien' : 'Data Triage'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-medical-green" />
                  Data Pasien Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap *</Label>
                    <Input
                      id="nama"
                      value={patientData.nama}
                      onChange={(e) => setPatientData({...patientData, nama: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usia">Usia *</Label>
                    <Input
                      id="usia"
                      type="number"
                      value={patientData.usia || ''}
                      onChange={(e) => setPatientData({...patientData, usia: parseInt(e.target.value) || 0})}
                      placeholder="Masukkan usia"
                      min="0"
                      max="150"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                  <Select 
                    value={patientData.jenis_kelamin} 
                    onValueChange={(value: 'L' | 'P') => setPatientData({...patientData, jenis_kelamin: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={patientData.alamat}
                    onChange={(e) => setPatientData({...patientData, alamat: e.target.value})}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_hp">Nomor HP/Telepon</Label>
                  <Input
                    id="no_hp"
                    value={patientData.no_hp}
                    onChange={(e) => setPatientData({...patientData, no_hp: e.target.value})}
                    placeholder="Masukkan nomor HP"
                  />
                </div>

                <Button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-medical hover:shadow-medical"
                  disabled={!patientData.nama || !patientData.usia}
                >
                  Lanjut ke Data Triage
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-triage-red" />
                    Data Triage & Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keluhan_utama">Keluhan Utama *</Label>
                    <Textarea
                      id="keluhan_utama"
                      value={triageData.keluhan_utama}
                      onChange={(e) => setTriageData({...triageData, keluhan_utama: e.target.value})}
                      placeholder="Jelaskan keluhan utama pasien"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tekanan_darah_systolic">Tekanan Darah Sistol (mmHg) *</Label>
                      <Input
                        id="tekanan_darah_systolic"
                        type="number"
                        value={triageData.tekanan_darah_systolic}
                        onChange={(e) => setTriageData({...triageData, tekanan_darah_systolic: parseInt(e.target.value) || 0})}
                        min="50"
                        max="250"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tekanan_darah_diastolic">Tekanan Darah Diastol (mmHg) *</Label>
                      <Input
                        id="tekanan_darah_diastolic"
                        type="number"
                        value={triageData.tekanan_darah_diastolic}
                        onChange={(e) => setTriageData({...triageData, tekanan_darah_diastolic: parseInt(e.target.value) || 0})}
                        min="30"
                        max="150"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="denyut_nadi">Denyut Nadi (bpm) *</Label>
                      <Input
                        id="denyut_nadi"
                        type="number"
                        value={triageData.denyut_nadi}
                        onChange={(e) => setTriageData({...triageData, denyut_nadi: parseInt(e.target.value) || 0})}
                        min="30"
                        max="200"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="suhu_tubuh">Suhu Tubuh (°C) *</Label>
                      <Input
                        id="suhu_tubuh"
                        type="number"
                        step="0.1"
                        value={triageData.suhu_tubuh}
                        onChange={(e) => setTriageData({...triageData, suhu_tubuh: parseFloat(e.target.value) || 0})}
                        min="30"
                        max="45"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tingkat_kesadaran">Tingkat Kesadaran *</Label>
                    <Select 
                      value={triageData.tingkat_kesadaran} 
                      onValueChange={(value: 'sadar' | 'somnolen' | 'sopor' | 'koma') => 
                        setTriageData({...triageData, tingkat_kesadaran: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sadar">Sadar</SelectItem>
                        <SelectItem value="somnolen">Somnolen (Mengantuk)</SelectItem>
                        <SelectItem value="sopor">Sopor (Tidur Dalam)</SelectItem>
                        <SelectItem value="koma">Koma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Triage Preview */}
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-medical-green" />
                    Preview Hasil Triage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getTriageColor(previewCategory)}`}>
                      {previewCategory.toUpperCase()}
                    </div>
                    <p className="text-muted-foreground">
                      Kategori triage berdasarkan data vital signs
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !triageData.keluhan_utama}
                  className="flex-1 bg-gradient-medical hover:shadow-medical"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Pasien'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientInput;