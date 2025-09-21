import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

interface Patient {
  nama: string;
  usia: number;
  jenis_kelamin: string;
}

interface Diagnosis {
  id: string;
  patient_id: string;
  diagnosis: string;
  tindakan: string;
  created_at: string;
  patients: Patient; // relasi ke tabel patients
}

const DoctorDiagnosis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      const { data, error } = await supabase
        .from("patient_history")
        .select(
          `
          id,
          patient_id,
          diagnosis,
          tindakan,
          created_at,
          patients (
            nama,
            usia,
            jenis_kelamin
          )
        `
        )
        .eq("patient_id", id)
        .order("created_at", { ascending: false }) // ambil diagnosa terbaru
        .maybeSingle();

      if (error) {
        console.error("Error fetching diagnosis:", error);
      } else {
        setDiagnosis(data as Diagnosis);
      }
    };

    if (id) fetchDiagnosis();
  }, [id]);

  if (!diagnosis) {
    return <p className="text-center mt-10">Memuat data diagnosa...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Kembali
      </Button>

      {/* Biodata Pasien */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-l-4 border-green-500 shadow-lg mb-6 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <User /> Biodata Pasien
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nama:</strong> {diagnosis.patients?.nama}</p>
            <p><strong>Usia:</strong> {diagnosis.patients?.usia} tahun</p>
            <p><strong>Jenis Kelamin:</strong> {diagnosis.patients?.jenis_kelamin}</p>
            <p><strong>ID Pasien:</strong> {diagnosis.patient_id}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Diagnosa & Tindakan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="border-l-4 border-blue-500 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Stethoscope /> Diagnosa & Tindakan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Diagnosis:</strong> {diagnosis.diagnosis}</p>
            <p><strong>Tindakan:</strong> {diagnosis.tindakan}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              📅 {new Date(diagnosis.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DoctorDiagnosis;
