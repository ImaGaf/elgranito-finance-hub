import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, ArrowLeft, Send, Key, Eye, EyeOff } from 'lucide-react';
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
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Código quemado para verificación
  const VERIFICATION_CODE = '123456';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validar que el email existe en el sistema
      const users = JSON.parse(localStorage.getItem('el_granito_users') || '[]');
      const userExists = users.find((user: any) => user.email === resetEmail);
      
      if (!userExists) {
        setError('El correo electrónico no está registrado en el sistema.');
        return;
      }

      // Simulación de envío de email con código
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Se ha enviado un código de verificación a ${resetEmail}. Código: ${VERIFICATION_CODE}`);
      
      // Cambiar a pantalla de verificación después de 3 segundos
      setTimeout(() => {
        setShowVerification(true);
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Error al enviar el código de verificación. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode !== VERIFICATION_CODE) {
        setError('Código de verificación incorrecto. Intente nuevamente.');
        return;
      }

      setSuccess('Código verificado correctamente. Ahora puede establecer su nueva contraseña.');
      
      // Cambiar a pantalla de nueva contraseña después de 2 segundos
      setTimeout(() => {
        setShowNewPassword(true);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Error al verificar el código. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validar contraseñas
      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden. Intente nuevamente.');
        setIsLoading(false);
        return;
      }

      // Validar fortaleza de contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
        setIsLoading(false);
        return;
      }

      // Actualizar contraseña en localStorage
      const users = JSON.parse(localStorage.getItem('el_granito_users') || '[]');
      const userIndex = users.findIndex((user: any) => user.email === resetEmail);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('el_granito_users', JSON.stringify(users));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess('Contraseña cambiada exitosamente. Redirigiendo al login...');
        
        // Volver al login después de 3 segundos
        setTimeout(() => {
          resetAllStates();
        }, 3000);
      } else {
        setError('Error al actualizar la contraseña. Usuario no encontrado.');
      }
    } catch (err) {
      setError('Error al cambiar la contraseña. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAllStates = () => {
    setShowForgotPassword(false);
    setShowVerification(false);
    setShowNewPassword(false);
    setError('');
    setSuccess('');
    setResetEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setFormData({ email: '', password: '' });
  };

  const goToForgotPassword = () => {
    setShowForgotPassword(true);
    setShowVerification(false);
    setShowNewPassword(false);
    setError('');
    setSuccess('');
    setResetEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
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
              {showForgotPassword 
                ? showNewPassword 
                  ? 'Nueva Contraseña'
                  : showVerification 
                    ? 'Verificar Código'
                    : 'Recuperar Contraseña'
                : 'Bienvenido a El Granito'
              }
            </CardTitle>
            <CardDescription className="text-green-700 text-base animate-fade-in animation-delay-500">
              {showForgotPassword 
                ? showNewPassword
                  ? 'Establezca su nueva contraseña'
                  : showVerification
                    ? 'Ingrese el código enviado a su correo'
                    : 'Ingrese su correo para recibir un código'
                : 'Su plataforma financiera de confianza'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {!showForgotPassword ? (
            // Formulario de Login
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

              <div className="text-right animate-fade-in animation-delay-600">
                <Button
                  type="button"
                  variant="link"
                  onClick={goToForgotPassword}
                  className="text-sm text-green-600 hover:text-green-700 p-0 h-auto font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Button>
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
          ) : showVerification ? (
            // Formulario de Verificación de Código
            <form onSubmit={handleVerifyCode} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-fade-in border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="animate-fade-in border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3 animate-slide-in animation-delay-300">
                <Label htmlFor="verification-code" className="text-green-700 font-medium">Código de Verificación</Label>
                <div className="relative group">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-green-500 group-focus-within:text-green-600 transition-colors duration-200" />
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-12 h-12 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:border-green-300 text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-sm text-green-600">
                  Hemos enviado un código de 6 dígitos a <strong>{resetEmail}</strong>
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-5 w-5" />
                      Verificar Código
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowVerification(false);
                    setShowForgotPassword(true);
                    setVerificationCode('');
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </div>
            </form>
          ) : showNewPassword ? (
            // Formulario de Nueva Contraseña
            <form onSubmit={handleChangePassword} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-fade-in border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="animate-fade-in border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-3 animate-slide-in animation-delay-300">
                  <Label htmlFor="new-password" className="text-green-700 font-medium">Nueva Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-green-500 group-focus-within:text-green-600 transition-colors duration-200" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:border-green-300"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-10 w-10 text-green-500 hover:text-green-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 animate-slide-in animation-delay-500">
                  <Label htmlFor="confirm-password" className="text-green-700 font-medium">Confirmar Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-green-500 group-focus-within:text-green-600 transition-colors duration-200" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:border-green-300"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-10 w-10 text-green-500 hover:text-green-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-green-600 bg-green-50 p-3 rounded border border-green-200">
                  <p className="font-medium mb-1">La contraseña debe contener:</p>
                  <ul className="space-y-1 text-green-700">
                    <li>• Al menos 8 caracteres</li>
                    <li>• Una letra mayúscula</li>
                    <li>• Una letra minúscula</li>
                    <li>• Un número</li>
                    <li>• Un carácter especial (@$!%*?&)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => resetAllStates()}
                  className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            // Formulario de Recuperar Contraseña (Solicitar Código)
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-fade-in border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="animate-fade-in border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3 animate-slide-in animation-delay-300">
                <Label htmlFor="reset-email" className="text-green-700 font-medium">Correo Electrónico</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-green-500 group-focus-within:text-green-600 transition-colors duration-200" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-12 h-12 border-green-200 focus:border-green-500 focus:ring-green-500 transition-all duration-200 hover:border-green-300"
                    required
                  />
                </div>
                <p className="text-sm text-green-600">
                  Ingrese su correo electrónico y le enviaremos un código de verificación.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Código
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetAllStates();
                  }}
                  className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Login
                </Button>
              </div>
            </form>
          )}

          {!showForgotPassword && !showVerification && !showNewPassword && (
            <div className="text-center animate-fade-in animation-delay-1000">
              <Button
                variant="link"
                onClick={onSwitchToRegister}
                className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
              >
                ¿No tienes cuenta? Regístrate aquí
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};