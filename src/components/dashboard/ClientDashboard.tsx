import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { User } from '@/lib/auth';
import { creditService, Credit, Payment } from '@/lib/credits';

interface ClientDashboardProps {
  user: User;
  onNavigate: (section: string) => void;
}

export const ClientDashboard = ({ user, onNavigate }: ClientDashboardProps) => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, [user.id]);

  const loadClientData = () => {
    setLoading(true);
    const clientCredits = creditService.getClientCredits(user.id);
    const clientPendingPayments = creditService.getClientPendingPayments(user.id);
    
    setCredits(clientCredits);
    setPendingPayments(clientPendingPayments);
    setLoading(false);
  };

  const activeCredit = credits.find(credit => credit.status === 'active');
  const totalDebt = activeCredit ? activeCredit.remainingBalance : 0;
  const nextPayment = pendingPayments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fondo animado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-600/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400/5 rounded-full animate-glow-pulse"></div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Encabezado de bienvenida */}
        <div className="bg-granito-hero p-6 rounded-lg shadow-elegant text-white animate-slide-in-left">
          <h1 className="text-2xl font-bold mb-2">¡Bienvenido, {user.name}!</h1>
          <p className="opacity-90">
            Gestiona tus créditos y pagos de manera fácil y segura
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
          <Card className="card-granito-gradient hover-granito-glow hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-granito-green-700">Crédito Activo</CardTitle>
              <CreditCard className="h-4 w-4 text-granito-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-granito-green-800">
                {activeCredit ? '$' + activeCredit.amount.toLocaleString() : 'Sin crédito'}
              </div>
              <p className="text-xs text-granito-green-600">
                {activeCredit ? `${activeCredit.term} meses` : 'No hay crédito activo'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-granito-gradient hover-granito-glow hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-granito-green-700">Saldo Pendiente</CardTitle>
              <DollarSign className="h-4 w-4 text-granito-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalDebt.toLocaleString()}
              </div>
              <p className="text-xs text-granito-green-600">
                {activeCredit ? `Pagado: $${activeCredit.totalPaid.toLocaleString()}` : 'Sin deuda'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-granito-gradient hover-granito-glow hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-granito-green-700">Próximo Pago</CardTitle>
              <Calendar className="h-4 w-4 text-granito-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {nextPayment ? '$' + nextPayment.amount.toLocaleString() : '-'}
              </div>
              <p className="text-xs text-green-600">
                {nextPayment 
                  ? new Date(nextPayment.dueDate).toLocaleDateString()
                  : 'Sin pagos pendientes'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-scale-in border-green-100" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeCredit 
                  ? Math.round((activeCredit.totalPaid / activeCredit.amount) * 100)
                  : 0
                }%
              </div>
              <p className="text-xs text-green-600">Completado</p>
            </CardContent>
          </Card>
        </div>

        {/* Progreso del crédito */}
        {activeCredit && (
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Progreso del Crédito</CardTitle>
              <CardDescription>
                Estado actual de su crédito y pagos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Pagado: ${activeCredit.totalPaid.toLocaleString()}</span>
                  <span>Total: ${activeCredit.amount.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(activeCredit.totalPaid / activeCredit.amount) * 100} 
                  className="h-2 animate-scale-in" 
                  style={{ animationDelay: '0.6s' }}
                />
                <div className="flex justify-between text-xs text-green-600">
                  <span>Inicio: {new Date(activeCredit.startDate).toLocaleDateString()}</span>
                  <span>Cuota mensual: ${activeCredit.monthlyPayment.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-right" style={{ animationDelay: '0.7s' }}>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>Realizar Pago</span>
              </CardTitle>
              <CardDescription>
                Pague sus cuotas de forma rápida y segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate('pagos')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg"
              >
                Ir a Pagos
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Mis Créditos</span>
              </CardTitle>
              <CardDescription>
                Consulte el estado y condiciones de sus créditos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate('mis-creditos')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg"
              >
                Ver Créditos
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-green-100 animate-bounce-in" style={{ animationDelay: '1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-green-600" />
                <span>Certificados</span>
              </CardTitle>
              <CardDescription>
                Genere y descargue certificados de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate('certificados')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg"
              >
                Generar Certificados
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pagos pendientes */}
        {pendingPayments.length > 0 && (
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100 animate-fade-in" style={{ animationDelay: '1.1s' }}>
            <CardHeader>
              <CardTitle>Pagos Pendientes</CardTitle>
              <CardDescription>
                Sus próximos pagos programados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayments.slice(0, 5).map((payment, index) => (
                  <div 
                    key={payment.id} 
                    className="flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 animate-slide-in-left"
                    style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                  >
                    <div>
                      <p className="font-medium">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">
                        Vence: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={payment.status === 'overdue' ? 'destructive' : 'outline'}
                      className={payment.status === 'overdue' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}
                    >
                      {payment.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
                
                {pendingPayments.length > 5 && (
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('pagos')}
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300"
                  >
                    Ver todos los pagos ({pendingPayments.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado sin crédito */}
        {!activeCredit && (
          <Card className="hover:shadow-lg transition-all duration-300 border-green-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>No tiene créditos activos</CardTitle>
              <CardDescription>
                Póngase en contacto con nuestro equipo para solicitar un crédito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-16 w-16 text-green-400 mx-auto mb-4 animate-bounce-in" style={{ animationDelay: '0.6s' }} />
                <p className="text-gray-600 mb-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                  Actualmente no tiene créditos registrados en el sistema.
                </p>
                <p className="text-sm text-green-600 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  Para solicitar un crédito, contacte a nuestro equipo de atención al cliente.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};