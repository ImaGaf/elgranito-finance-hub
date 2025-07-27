import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CreditCard,
  FileText,
  UserPlus
} from 'lucide-react';
import { User } from '@/lib/auth';
import { creditService } from '@/lib/credits';

interface ManagerDashboardProps {
  user: User;
  onNavigate: (section: string) => void;
}

export const ManagerDashboard = ({ user, onNavigate }: ManagerDashboardProps) => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeCredits: 0,
    totalLent: 0,
    overduePayments: 0,
    monthlyRevenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    loadManagerStats();
  }, []);

  const loadManagerStats = () => {
    const credits = creditService.getAllCredits();
    const payments = creditService.getAllPayments();
    
    // Calcular estadísticas
    const activeCredits = credits.filter(c => c.status === 'active').length;
    const totalLent = credits.reduce((sum, c) => sum + c.amount, 0);
    const overduePayments = payments.filter(p => p.status === 'overdue').length;
    const thisMonth = new Date().getMonth();
    const monthlyRevenue = payments
      .filter(p => p.status === 'paid' && p.paidDate && new Date(p.paidDate).getMonth() === thisMonth)
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    setStats({
      totalClients: new Set(credits.map(c => c.clientId)).size,
      activeCredits,
      totalLent,
      overduePayments,
      monthlyRevenue,
      pendingPayments
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-600/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/5 rounded-full animate-glow-pulse"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Encabezado */}
        <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-primary-foreground animate-slide-in-left">
          <h1 className="text-2xl font-bold mb-2">Panel de Gerencia</h1>
          <p className="opacity-90">Bienvenido, {user.name}. Aquí tienes el resumen ejecutivo del sistema.</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-green-600">Clientes registrados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créditos Activos</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCredits}</div>
              <p className="text-xs text-green-600">En curso</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prestado</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalLent.toLocaleString()}</div>
              <p className="text-xs text-green-600">Capital total</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
              <p className="text-xs text-red-600">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>Gestión de Créditos</span>
              </CardTitle>
              <CardDescription>Otorgar, modificar y supervisar créditos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('creditos')} className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg">
                Administrar Créditos
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-green-600" />
                <span>Gestión de Usuarios</span>
              </CardTitle>
              <CardDescription>Registrar asistentes y gestionar accesos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('usuarios')} className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg">
                Gestionar Usuarios
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Reportes</span>
              </CardTitle>
              <CardDescription>Generar reportes financieros y de gestión</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('reportes')} className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg">
                Ver Reportes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resumen financiero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100">
            <CardHeader>
              <CardTitle>Ingresos Mensuales</CardTitle>
              <CardDescription>Pagos recibidos este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2 animate-bounce-in" style={{ animationDelay: '1s' }}>
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+15% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-green-100">
            <CardHeader>
              <CardTitle>Alertas Pendientes</CardTitle>
              <CardDescription>Situaciones que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '1.1s' }}>
                  <span className="text-sm">Pagos vencidos</span>
                  <Badge variant="destructive">{stats.overduePayments}</Badge>
                </div>
                <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <span className="text-sm">Pagos pendientes</span>
                  <Badge variant="outline">{stats.pendingPayments}</Badge>
                </div>
                <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '1.3s' }}>
                  <span className="text-sm">Créditos por vencer</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};