import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { User } from '@/lib/auth';
import { creditService, Payment } from '@/lib/credits';
import { useToast } from '@/hooks/use-toast';

interface CertificatesViewProps {
  user: User;
}

export const CertificatesView = ({ user }: CertificatesViewProps) => {
  const [paidPayments, setPaidPayments] = useState<Payment[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPaidPayments();
  }, [user.id]);

  const loadPaidPayments = () => {
    const allPayments = creditService.getAllPayments();
    const credits = creditService.getClientCredits(user.id);
    const creditIds = credits.map(c => c.id);
    
    const clientPaidPayments = allPayments.filter(p => 
      creditIds.includes(p.creditId) && p.status === 'paid'
    );
    
    setPaidPayments(clientPaidPayments);
  };

  const handlePaymentSelect = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(paidPayments.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const generateCertificate = async () => {
    if (selectedPayments.length === 0) {
      toast({
        title: "Selección requerida",
        description: "Debe seleccionar al menos un pago para generar el certificado.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);

    try {
      // Simular generación del certificado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = creditService.generatePaymentCertificate(selectedPayments);
      
      if (result.success) {
        // Simular descarga
        const blob = new Blob(['Certificado de Pago PDF simulado'], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `certificado-${result.certificate.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: "Certificado generado",
          description: `Se ha descargado el certificado con ${selectedPayments.length} pago(s).`,
        });

        setSelectedPayments([]);
      }
    } catch (error) {
      toast({
        title: "Error al generar certificado",
        description: "No se pudo generar el certificado. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const selectedTotal = paidPayments
    .filter(p => selectedPayments.includes(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  if (paidPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No hay pagos registrados</h2>
        <p className="text-muted-foreground text-center">
          No tiene pagos realizados para generar certificados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Certificados de Pago</h1>
          <p className="text-muted-foreground">
            Genere y descargue certificados de sus pagos realizados
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={generateCertificate}
            disabled={selectedPayments.length === 0 || generating}
            variant="gradient"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generar Certificado
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Resumen de selección */}
      {selectedPayments.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {selectedPayments.length} pago(s) seleccionado(s)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: ${selectedTotal.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedPayments([])}
                variant="outline"
                size="sm"
              >
                Limpiar selección
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de pagos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>
                Seleccione los pagos para incluir en el certificado
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedPayments.length === paidPayments.length}
                onCheckedChange={handleSelectAll}
              />
              <label className="text-sm font-medium">Seleccionar todos</label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paidPayments.map((payment) => (
              <div 
                key={payment.id}
                className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <Checkbox
                  checked={selectedPayments.includes(payment.id)}
                  onCheckedChange={(checked) => handlePaymentSelect(payment.id, checked as boolean)}
                />
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-success" />
                    <div>
                      <p className="font-medium">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Monto pagado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">
                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                      </p>
                      <p className="text-sm text-muted-foreground">Fecha de pago</p>
                    </div>
                  </div>
                  
                  <div>
                    <Badge variant="success" className="mb-1">
                      {payment.method === 'card' ? 'Tarjeta' : 
                       payment.method === 'transfer' ? 'Transferencia' : 'Efectivo'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Método</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-xs font-mono">
                      {payment.transactionId || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">ID Transacción</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Printer className="h-5 w-5" />
            <span>Información del Certificado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Los certificados incluyen información detallada de cada pago: fecha, monto, método de pago y número de transacción.
            </p>
            <p>
              • El certificado será generado en formato PDF y se descargará automáticamente.
            </p>
            <p>
              • Puede seleccionar múltiples pagos para generar un certificado consolidado.
            </p>
            <p>
              • Los certificados tienen validez legal y pueden ser utilizados como comprobante de pago.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};