import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { authService } from '@/lib/auth';
import logo from '@/assets/el-granito-logo.png';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-granito p-4 relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-fade-in relative z-10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="El Granito" 
                className="h-20 w-20 animate-granito-pulse hover:scale-110 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-granito-gradient bg-clip-text animate-slide-in">
              Bienvenido a El Granito
            </CardTitle>
            <CardDescription className="text-green-700 text-base animate-fade-in animation-delay-500">
              Su plataforma financiera de confianza
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-fade-in border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3 animate-slide-in animation-delay-300">
              <Label htmlFor="email" className="text-green-700 font-medium">Correo Electrónico</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-green-500 group-focus-within:text-green-600 transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 h-12 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:border-green-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 animate-slide-in animation-delay-500">
              <Label htmlFor="password" className="text-green-700 font-medium">Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-green-500 group-focus-within:text-green-600 transition-colors duration-200" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 h-12 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:border-green-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-in animation-delay-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </>
              )}
            </Button>
          </form>

          <div className="text-center animate-fade-in animation-delay-1000">
            <Button
              variant="link"
              onClick={onSwitchToRegister}
              className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Button>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg border border-green-200 animate-fade-in animation-delay-1200">
            <p className="text-sm font-semibold mb-3 text-green-800">🔐 Cuentas de prueba:</p>
            <div className="text-xs space-y-2 text-green-700">
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span><strong>Gerente:</strong> gerente@elgranito.com</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span><strong>Contraseña:</strong> Gerente123!</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};