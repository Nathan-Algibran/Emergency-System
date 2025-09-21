import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const DoctorHandle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase.from("patient_history").insert({
      patient_id: id,
      diagnosis,
      tindakan,
      created_at: new Date().toISOString(),
    });

    setLoading(false);

    if (!error) {
      alert("Data berhasil disimpan!");
      navigate("/dokter/dashboard");
    } else {
      alert("Gagal menyimpan data!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-6"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl font-bold">Tangani Pasien</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="text-sm font-medium">Diagnosis</label>
            <Textarea 
              placeholder="Masukkan diagnosis pasien..." 
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tindakan</label>
            <Textarea 
              placeholder="Masukkan tindakan medis..." 
              value={tindakan}
              onChange={(e) => setTindakan(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorHandle;
