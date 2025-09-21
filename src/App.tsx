import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PatientInput from "./pages/PatientInput";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PatientDetail from "./pages/PatientDetail";
import DoctorHandle from "./pages/DoctorHandle";
import DokterDashboard from "./components/dashboards/DokterDashboard"; // ✅ tambahkan import
import DoctorDiagnosis from "./pages/DoctorDiagnosis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Dashboard umum */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Dokter */}
            <Route
              path="/dokter/dashboard"
              element={
                <ProtectedRoute allowedRoles={["dokter"]}>
                  <DokterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Input pasien (perawat & admin) */}
            <Route
              path="/patient-input"
              element={
                <ProtectedRoute allowedRoles={["perawat", "admin"]}>
                  <PatientInput />
                </ProtectedRoute>
              }
            />

            {/* Detail pasien */}
            <Route path="/patient/:id" element={<PatientDetail />} />

            {/* Halaman dokter menangani pasien */}
            <Route
              path="/dokter/tangani/:id"
              element={
                <ProtectedRoute allowedRoles={["dokter"]}>
                  <DoctorHandle />
                </ProtectedRoute>
              }
            />
            <Route path="/dokter/diagnosa/:id" element={<DoctorDiagnosis />} />

            {/* Register */}
            <Route path="/register" element={<Register />} />

            {/* Catch-all Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
