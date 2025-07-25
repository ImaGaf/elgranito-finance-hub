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
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Panel de Asistente</h1>
        <p className="opacity-90">Bienvenido, {user.name}. Gestiona consultas de clientes y reportes de morosidad.</p>
      </div>

      {/* Métricas del día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overduePayments}</div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contactos Pendientes</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.pendingContacts}</div>
            <p className="text-xs text-muted-foreground">Por contactar hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientsToday}</div>
            <p className="text-xs text-muted-foreground">Clientes atendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.reportsGenerated}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Herramientas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-card transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Reportes de Morosidad</span>
            </CardTitle>
            <CardDescription>Consultar clientes con pagos vencidos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('reportes-morosidad')} className="w-full" variant="destructive">
              Ver Morosidad
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-card transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-green-600" />
              <span>Consulta de Clientes</span>
            </CardTitle>
            <CardDescription>Buscar información de clientes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('clientes')} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Buscar Clientes
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-card transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Reportes de Pagos</span>
            </CardTitle>
            <CardDescription>Generar reportes de pagos y seguimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('reportes')} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Generar Reportes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de tareas pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas Pendientes</CardTitle>
          <CardDescription>Actividades programadas para hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Contactar a María González</p>
                  <p className="text-sm text-muted-foreground">Pago vencido desde hace 3 días</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Urgente</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Seguimiento Luis Rodríguez</p>
                  <p className="text-sm text-muted-foreground">Recordatorio de pago próximo</p>
                </div>
              </div>
              <Badge variant="outline">Programado</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Generar reporte mensual</p>
                  <p className="text-sm text-muted-foreground">Reporte de morosidad de julio</p>
                </div>
              </div>
              <Badge variant="secondary">En curso</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de morosidad */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Morosidad</CardTitle>
          <CardDescription>Clientes que requieren atención inmediata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div>
                <p className="font-medium text-destructive">Carlos Mendoza</p>
                <p className="text-sm text-muted-foreground">30 días de mora - $2,500</p>
              </div>
              <Badge variant="destructive">Crítico</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-green-700">Ana López</p>
                <p className="text-sm text-muted-foreground">15 días de mora - $1,800</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Alto</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-green-700">Roberto Silva</p>
                <p className="text-sm text-muted-foreground">7 días de mora - $3,200</p>
              </div>
              <Badge variant="outline">Medio</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};