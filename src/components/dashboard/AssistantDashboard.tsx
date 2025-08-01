
import { ClientSearch } from '@/components/clients/ClientSearch';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  AlertTriangle, 
  FileText,
  Search,
  Clock,
  Phone,
  BarChart3,
  PieChart,
  Activity,
  Target,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { User } from '@/lib/auth';
import { creditService } from '@/lib/credits';
import { paymentsService } from '@/lib/payments';

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

  // Obtener datos de estadísticas y gráficos (mismo acceso que el gerente)
  const statistics = paymentsService.getStatistics();
  const monthlyData = paymentsService.getMonthlyData();
  const creditDistribution = paymentsService.getCreditDistribution();

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
      <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-white animate-slide-in-left">
        <h1 className="text-2xl font-bold mb-2">Panel de Asistente</h1>
        <p className="opacity-90">Bienvenido, {user.name}. Gestiona consultas de clientes y accede a reportes completos.</p>
      </div>

      {/* Pestañas principales */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-green-50 border border-green-200">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            Analíticas
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <PieChart className="h-4 w-4" />
            Portafolio
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Search className="h-4 w-4" />
            Búsqueda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
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
      {/* Tarea 1: Contactar a María González */}
      <div className="flex flex-col p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left" style={{ animationDelay: '1s' }}>
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="h-4 w-4 text-green-600" />
          <div>
            <p className="font-medium">Contactar a María González</p>
            <p className="text-sm text-gray-600">Pago vencido desde hace 3 días</p>
          </div>
          <Badge className="ml-auto bg-red-100 text-red-800 border-red-200">Urgente</Badge>
        </div>
        <div className="pl-7 text-sm text-gray-700">
          <p>📞 <strong>Teléfono:</strong> 0991234567</p>
          <p>🏠 <strong>Dirección:</strong> Calle los Cipreses #123, Quito</p>
        </div>
      </div>

      {/* Tarea 2: Seguimiento Luis Rodríguez */}
      <div className="flex flex-col p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left" style={{ animationDelay: '1.1s' }}>
        <div className="flex items-center space-x-3 mb-2">
          <Phone className="h-4 w-4 text-green-600" />
          <div>
            <p className="font-medium">Seguimiento Luis Rodríguez</p>
            <p className="text-sm text-gray-600">Recordatorio de pago próximo</p>
          </div>
          <Badge variant="outline" className="ml-auto">Programado</Badge>
        </div>
        <div className="pl-7 text-sm text-gray-700">
          <p>📞 <strong>Teléfono:</strong> 0987654321</p>
          <p>🏠 <strong>Dirección:</strong> Av. Amazonas y Colón, Quito</p>
        </div>
      </div>

      {/* Tarea 3: Generar reporte mensual */}
      <div className="flex flex-col p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left" style={{ animationDelay: '1.2s' }}>
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="h-4 w-4 text-green-600" />
          <div>
            <p className="font-medium">Generar reporte mensual</p>
            <p className="text-sm text-gray-600">Reporte de morosidad de julio</p>
          </div>
          <Badge variant="secondary" className="ml-auto">En curso</Badge>
        </div>
        {/* Este no es de cliente, así que no añadimos contacto */}
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Métricas ejecutivas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
            <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{statistics.totalClients}</div>
                <p className="text-xs text-green-600">+{statistics.newClientsThisMonth} este mes</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portafolio Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">${statistics.totalPortfolio.toLocaleString()}</div>
                <p className="text-xs text-green-600">Capital activo</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cobranza Mensual</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">${statistics.monthlyCollection.toLocaleString()}</div>
                <p className="text-xs text-green-600">{statistics.collectionsThisMonth}% del objetivo</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Morosidad</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statistics.delinquencyRate}%</div>
                <p className="text-xs text-red-600">Requiere monitoreo</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de evolución mensual */}
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Evolución Mensual de Cobranza
              </CardTitle>
              <CardDescription>Ingresos y desembolsos de los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-green-600">${data.collections.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">Ingresos:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(data.collections / 60000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-20">Préstamos:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(data.disbursements / 60000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Distribución de créditos */}
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Distribución del Portafolio por Rango
              </CardTitle>
              <CardDescription>Análisis de créditos por monto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditDistribution.map((range, index) => (
                  <div key={range.range} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{range.range}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{range.count} créditos</div>
                        <div className="text-xs text-gray-600">${range.amount.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(range.count / 45) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Indicadores de performance */}
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Indicadores de Rendimiento
              </CardTitle>
              <CardDescription>Métricas clave de cobranza</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Eficiencia de Cobranza</span>
                  <span className="text-sm text-green-600">{statistics.collectionsThisMonth}%</span>
                </div>
                <Progress value={statistics.collectionsThisMonth} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Calidad de Cartera</span>
                  <span className="text-sm text-blue-600">{100 - statistics.delinquencyRate}%</span>
                </div>
                <Progress value={100 - statistics.delinquencyRate} className="h-2" />
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ticket Promedio:</span>
                  <span className="font-semibold">${statistics.averageTicket.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ganancia del Mes:</span>
                  <span className="font-semibold text-green-700">${statistics.profitThisMonth.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {/* Buscador de clientes */}
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Búsqueda de Clientes
              </CardTitle>
              <CardDescription>Consulte información detallada de clientes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientSearch user={user} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);
};