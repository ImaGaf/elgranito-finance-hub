import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Navbar } from '@/components/layout/Navbar';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { authService, initializeDefaultUsers, User } from '@/lib/auth';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar usuarios por defecto
    initializeDefaultUsers();
    
    // Verificar si hay usuario logueado
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSection('dashboard');
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const renderContent = () => {
    if (!user) return null;

    switch (currentSection) {
      case 'dashboard':
        if (user.role === 'cliente') {
          return <ClientDashboard user={user} onNavigate={handleNavigate} />;
        }
        // TODO: Implementar dashboards para asistente y gerente
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Bienvenido, {user.name}</h2>
            <p className="text-muted-foreground">
              Dashboard para {user.role} en desarrollo...
            </p>
          </div>
        );

      case 'pagos':
        if (user.role === 'cliente') {
          return <PaymentForm user={user} />;
        }
        break;

      case 'mis-creditos':
        if (user.role === 'cliente') {
          // TODO: Implementar componente de créditos del cliente
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Mis Créditos</h2>
              <p className="text-muted-foreground">
                Consulta de créditos en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'certificados':
        if (user.role === 'cliente') {
          // TODO: Implementar componente de certificados
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Certificados de Pago</h2>
              <p className="text-muted-foreground">
                Generación de certificados en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'creditos':
        if (user.role === 'gerente') {
          // TODO: Implementar gestión de créditos para gerente
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Gestión de Créditos</h2>
              <p className="text-muted-foreground">
                Gestión de créditos en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'usuarios':
        if (user.role === 'gerente') {
          // TODO: Implementar gestión de usuarios
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
              <p className="text-muted-foreground">
                Gestión de usuarios en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'reportes':
        if (user.role === 'gerente') {
          // TODO: Implementar reportes para gerente
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Reportes</h2>
              <p className="text-muted-foreground">
                Módulo de reportes en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'reportes-morosidad':
        if (user.role === 'asistente') {
          // TODO: Implementar reportes de morosidad
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Reportes de Morosidad</h2>
              <p className="text-muted-foreground">
                Reportes de morosidad en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'clientes':
        if (user.role === 'asistente' || user.role === 'gerente') {
          // TODO: Implementar consulta de clientes
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Consulta de Clientes</h2>
              <p className="text-muted-foreground">
                Consulta de clientes en desarrollo...
              </p>
            </div>
          );
        }
        break;

      case 'auditoria':
        if (user.role === 'gerente') {
          // TODO: Implementar auditoría
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Auditoría del Sistema</h2>
              <p className="text-muted-foreground">
                Módulo de auditoría en desarrollo...
              </p>
            </div>
          );
        }
        break;

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Sección no encontrada</h2>
            <p className="text-muted-foreground">
              La sección solicitada no existe o no tiene permisos para acceder.
            </p>
          </div>
        );
    }

    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p className="text-muted-foreground">
          No tiene permisos para acceder a esta sección.
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    ) : (
      <RegisterForm 
        onRegisterSuccess={() => setAuthMode('login')}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentSection={currentSection}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;