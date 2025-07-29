
import { ClientSearch } from '@/components/clients/ClientSearch';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  AlertTriangle, 
  FileText,
  Search,
  Clock,
  Phone
} from 'lucide-react';
import { User } from '@/lib/auth';
import { creditService } from '@/lib/credits';

interface AssistantDashboardProps {
  user: User;
  onNavigate: (section: string) => void;
}

export const AssistantDashboard = ({ user, onNavigate }: AssistantDashboardProps) => {
  const [stats, setStats] = useState({
    overduePayments: 0,
    pendingContacts: 0,
    reportsGenerated: 0,
    clientsToday: 0
  });

  useEffect(() => {
    loadAssistantStats();
  }, []);

  const loadAssistantStats = () => {
    const payments = creditService.getAllPayments();
    const overduePayments = payments.filter(p => p.status === 'overdue').length;

    setStats({
      overduePayments,
      pendingContacts: 5, // Mock data
      reportsGenerated: 12, // Mock data
      clientsToday: 8 // Mock data
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
        <h1 className="text-2xl font-bold mb-2">Panel de Asistente</h1>
        <p className="opacity-90">Bienvenido, {user.name}. Gestiona consultas de clientes y reportes de morosidad.</p>
      </div>

      {/* Buscador de clientes */}
      <div className="p-6 bg-gray-50 rounded-lg shadow mb-6">
        <ClientSearch user={user} />
      </div>

      {/* Métricas del día */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overduePayments}</div>
              <p className="text-xs text-red-600">Requieren seguimiento</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contactos Pendientes</CardTitle>
              <Phone className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.pendingContacts}</div>
              <p className="text-xs text-green-600">Por contactar hoy</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas Hoy</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientsToday}</div>
              <p className="text-xs text-green-600">Clientes atendidos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.reportsGenerated}</div>
              <p className="text-xs text-green-600">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Herramientas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Reportes de Morosidad</span>
              </CardTitle>
              <CardDescription>Consultar clientes con pagos vencidos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('reportes-morosidad')} className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:shadow-lg">
                Ver Morosidad
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-green-600" />
                <span>Consulta de Clientes</span>
              </CardTitle>
              <CardDescription>Buscar información de clientes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('clientes')} className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg">
                Buscar Clientes
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Reportes de Pagos</span>
              </CardTitle>
              <CardDescription>Generar reportes de pagos y seguimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('reportes')} className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg">
                Generar Reportes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tareas pendientes */}
        <Card className="hover:shadow-lg transition-all duration-300 border-green-100 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
            <CardDescription>Actividades programadas para hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Contactar a María González</p>
                    <p className="text-sm text-gray-600">Pago vencido desde hace 3 días</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">Urgente</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left" style={{ animationDelay: '1.1s' }}>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Seguimiento Luis Rodríguez</p>
                    <p className="text-sm text-gray-600">Recordatorio de pago próximo</p>
                  </div>
                </div>
                <Badge variant="outline">Programado</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Generar reporte mensual</p>
                    <p className="text-sm text-gray-600">Reporte de morosidad de julio</p>
                  </div>
                </div>
                <Badge variant="secondary">En curso</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas de morosidad */}
        <Card className="hover:shadow-lg transition-all duration-300 border-green-100 animate-fade-in" style={{ animationDelay: '1.3s' }}>
          <CardHeader>
            <CardTitle>Alertas de Morosidad</CardTitle>
            <CardDescription>Clientes que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 animate-slide-in-right" style={{ animationDelay: '1.4s' }}>
                <div>
                  <p className="font-medium text-red-700">Carlos Mendoza</p>
                  <p className="text-sm text-gray-600">30 días de mora - $2,500</p>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200">Crítico</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-200 animate-slide-in-right" style={{ animationDelay: '1.5s' }}>
                <div>
                  <p className="font-medium text-orange-700">Ana López</p>
                  <p className="text-sm text-gray-600">15 días de mora - $1,800</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Alto</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors duration-200 animate-slide-in-right" style={{ animationDelay: '1.6s' }}>
                <div>
                  <p className="font-medium text-yellow-700">Roberto Silva</p>
                  <p className="text-sm text-gray-600">7 días de mora - $3,200</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medio</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};