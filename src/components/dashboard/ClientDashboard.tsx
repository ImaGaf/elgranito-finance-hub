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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado de bienvenida */}
      <div className="bg-granito-hero p-6 rounded-lg shadow-elegant text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido, {user.name}!</h1>
        <p className="opacity-90">
          Gestiona tus créditos y pagos de manera fácil y segura
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-granito-gradient hover-granito-glow">
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

        <Card className="card-granito-gradient hover-granito-glow">
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

        <Card className="card-granito-gradient hover-granito-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-granito-green-700">Próximo Pago</CardTitle>
            <Calendar className="h-4 w-4 text-granito-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextPayment ? '$' + nextPayment.amount.toLocaleString() : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextPayment 
                ? new Date(nextPayment.dueDate).toLocaleDateString()
                : 'Sin pagos pendientes'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCredit 
                ? Math.round((activeCredit.totalPaid / activeCredit.amount) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">Completado</p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso del crédito */}
      {activeCredit && (
        <Card>
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
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Inicio: {new Date(activeCredit.startDate).toLocaleDateString()}</span>
                <span>Cuota mensual: ${activeCredit.monthlyPayment.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-card transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Realizar Pago</span>
            </CardTitle>
            <CardDescription>
              Pague sus cuotas de forma rápida y segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('pagos')} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Ir a Pagos
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-card transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>Mis Créditos</span>
            </CardTitle>
            <CardDescription>
              Consulte el estado y condiciones de sus créditos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('mis-creditos')} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Ver Créditos
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-card transition-shadow">
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
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Generar Certificados
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pagos pendientes */}
      {pendingPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pagos Pendientes</CardTitle>
            <CardDescription>
              Sus próximos pagos programados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPayments.slice(0, 5).map((payment) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Vence: {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={payment.status === 'overdue' ? 'destructive' : 'outline'}
                  >
                    {payment.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                  </Badge>
                </div>
              ))}
              
              {pendingPayments.length > 5 && (
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('pagos')}
                  className="w-full"
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
        <Card>
          <CardHeader>
            <CardTitle>No tiene créditos activos</CardTitle>
            <CardDescription>
              Póngase en contacto con nuestro equipo para solicitar un crédito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Actualmente no tiene créditos registrados en el sistema.
              </p>
              <p className="text-sm text-muted-foreground">
                Para solicitar un crédito, contacte a nuestro equipo de atención al cliente.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};