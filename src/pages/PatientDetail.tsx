import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity } from "lucide-react";
import { motion } from "framer-motion";

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

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const getTriageColor = (category?: string) => {
    switch (category) {
      case "merah": return "text-red-600";
      case "kuning": return "text-yellow-600";
      case "hijau": return "text-green-600";
      case "hitam": return "text-gray-700";
      default: return "text-muted-foreground";
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select(`
          *,
          triage (
            kategori_triage,
            keluhan_utama,
            waktu_input
          )
        `)
        .eq("id", id)
        .single();

      if (!error) setPatient(data);
      setLoading(false);
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <Activity className="h-10 w-10 animate-spin text-medical-green mb-4" />
        <p className="text-muted-foreground">Memuat data pasien...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-500 font-semibold">Data pasien tidak ditemukan.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
            <CardTitle className="text-xl font-bold">
              Detail Pasien: {patient.nama}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-muted-foreground">Usia</p>
                <p className="font-semibold">{patient.usia} tahun</p>
              </div>
              <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-muted-foreground">Jenis Kelamin</p>
                <p className="font-semibold">{patient.jenis_kelamin}</p>
              </div>
              <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-muted-foreground">Waktu Datang</p>
                <p className="font-semibold">
                  {new Date(patient.waktu_datang).toLocaleString("id-ID")}
                </p>
              </div>
              <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <p className="text-muted-foreground">Keluhan Utama</p>
                <p className="font-semibold">
                  {patient.triage?.[0]?.keluhan_utama || "Belum ada"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 border rounded-xl shadow-md bg-gray-50 text-center"
            >
              <p className="text-muted-foreground">Kategori Triage</p>
              <p className={`text-xl font-bold uppercase ${getTriageColor(patient.triage?.[0]?.kategori_triage)}`}>
                {patient.triage?.[0]?.kategori_triage || "Belum ada"}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PatientDetail;
