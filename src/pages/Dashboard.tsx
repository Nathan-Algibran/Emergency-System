import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PerawatDashboard from '@/components/dashboards/PerawatDashboard';
import DokterDashboard from '@/components/dashboards/DokterDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Activity } from 'lucide-react';

const Dashboard = () => {
  const { userRole, loading } = useAuth();

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

  // Route to role-specific dashboard
  switch (userRole) {
    case 'perawat':
      return <PerawatDashboard />;
    case 'dokter':
      return <DokterDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-destructive mb-2">Role Tidak Dikenali</h2>
            <p className="text-muted-foreground">
              Hubungi administrator untuk memperbaiki role Anda.
            </p>
          </div>
        </div>
      );
  }
};

export default Dashboard;