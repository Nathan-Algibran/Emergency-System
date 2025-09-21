import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-green-light via-background to-medical-green-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Heart className="h-12 w-12 text-triage-red" />
              <Stethoscope className="h-8 w-8 text-medical-green absolute -bottom-2 -right-2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistem Triage
          </h1>
          <p className="text-muted-foreground">
            Emergency Room Management System
          </p>
        </div>

        <Card className="shadow-medical border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-medical-green">
              Login
            </CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                  className="focus:ring-medical-green"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="focus:ring-medical-green"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-medical hover:shadow-medical transition-all duration-300"
              >
                {loading ? 'Memproses...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-xs text-center text-muted-foreground">
              <p>Demo Credentials:</p>
              <p>Perawat: nurse@hospital.com / password123</p>
              <p>Dokter: doctor@hospital.com / password123</p>
              <p>Admin: admin@hospital.com / password123</p>
            </div>

            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/register'}
                className="text-sm text-medical-green hover:text-medical-green-dark"
              >
                Belum punya akun? Daftar di sini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;