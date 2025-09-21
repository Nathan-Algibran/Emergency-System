import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [namaUser, setNamaUser] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'perawat' | 'dokter' | 'admin'>('perawat');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create system user record
        const { error: systemUserError } = await supabase
          .from('system_users')
          .insert([{
            user_id: authData.user.id,
            username,
            nama_user: namaUser,
            role
          }]);

        if (systemUserError) {
          throw systemUserError;
        }

        toast({
          title: "Registrasi Berhasil",
          description: "Akun Anda telah dibuat. Silakan login untuk mengakses sistem.",
        });

        // Reset form
        setEmail('');
        setPassword('');
        setNamaUser('');
        setUsername('');
        setRole('perawat');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registrasi Gagal",
        description: error.message || "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
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
            Daftar Akun Baru
          </p>
        </div>

        <Card className="shadow-medical border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-medical-green">
              Registrasi
            </CardTitle>
            <CardDescription>
              Buat akun baru untuk akses ke sistem triage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="namaUser">Nama Lengkap *</Label>
                <Input
                  id="namaUser"
                  value={namaUser}
                  onChange={(e) => setNamaUser(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password (min. 6 karakter)"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={role} onValueChange={(value: 'perawat' | 'dokter' | 'admin') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perawat">Perawat</SelectItem>
                    <SelectItem value="dokter">Dokter</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-medical hover:shadow-medical transition-all duration-300"
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'}
                className="text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sudah punya akun? Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;