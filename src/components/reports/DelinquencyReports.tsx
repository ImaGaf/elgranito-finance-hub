import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, FileDown, Search, Users } from 'lucide-react';
import { creditService } from '@/lib/credits';
import { User } from '@/lib/auth';

interface DelinquencyReportsProps {
  user: User;
}

interface DelinquencyClient {
  id: string;
  name: string;
  cedula: string;
  email: string;
  overdueAmount: number;
  overdueInvoices: number;
  daysOverdue: number;
  lastPaymentDate: string;
}

export const DelinquencyReports = ({ user }: DelinquencyReportsProps) => {
  const [delinquencyData, setDelinquencyData] = useState<DelinquencyClient[]>([]);
  const [filteredData, setFilteredData] = useState<DelinquencyClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [amountFilter, setAmountFilter] = useState('');

  useEffect(() => {
    loadDelinquencyData();
  }, []);

  useEffect(() => {
    filterData();
  }, [delinquencyData, searchTerm, amountFilter]);

  const loadDelinquencyData = () => {
    const payments = creditService.getAllPayments();
    const clients = creditService.getAllClients();
    
    const delinquencyClients: DelinquencyClient[] = [];
    
    clients.forEach(client => {
      const clientPayments = payments.filter(p => p.clientId === client.id);
      const overduePayments = clientPayments.filter(p => p.status === 'overdue');
      
      if (overduePayments.length > 0) {
        const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);
        const oldestPayment = overduePayments.sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )[0];
        
        const daysOverdue = Math.floor(
          (new Date().getTime() - new Date(oldestPayment.dueDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const lastPayment = clientPayments
          .filter(p => p.status === 'paid')
          .sort((a, b) => new Date(b.paidDate || '').getTime() - new Date(a.paidDate || '').getTime())[0];

        delinquencyClients.push({
          id: client.id,
          name: client.name,
          cedula: client.cedula,
          email: client.email,
          overdueAmount: totalOverdue,
          overdueInvoices: overduePayments.length,
          daysOverdue,
          lastPaymentDate: lastPayment?.date || 'Sin pagos registrados'
        });
      }
    });

    setDelinquencyData(delinquencyClients);
  };

  const filterData = () => {
    let filtered = delinquencyData;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cedula.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (amountFilter) {
      const amount = parseFloat(amountFilter);
      filtered = filtered.filter(client => client.overdueAmount >= amount);
    }

    setFilteredData(filtered);
  };

  const getRiskLevel = (daysOverdue: number) => {
    if (daysOverdue >= 30) return { level: 'Crítico', variant: 'destructive' as const };
    if (daysOverdue >= 15) return { level: 'Alto', variant: 'warning' as const };
    return { level: 'Medio', variant: 'outline' as const };
  };

  const exportReport = (format: 'pdf' | 'xlsx' | 'csv') => {
    // Simular exportación
    const data = filteredData.map(client => ({
      'Nombre': client.name,
      'Cédula/RUC': client.cedula,
      'Correo': client.email,
      'Monto Adeudado': `$${client.overdueAmount.toFixed(2)}`,
      'Facturas Vencidas': client.overdueInvoices,
      'Días de Mora': client.daysOverdue,
      'Último Pago': client.lastPaymentDate
    }));

    console.log(`Exportando reporte de morosidad en formato ${format}:`, data);
    alert(`Reporte exportado en formato ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Reportes de Morosidad</h1>
        <p className="opacity-90">Clientes que requieren atención inmediata por pagos vencidos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes en Mora</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{delinquencyData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total Vencido</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${delinquencyData.reduce((sum, c) => sum + c.overdueAmount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <FileDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {delinquencyData.reduce((sum, c) => sum + c.overdueInvoices, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Input
              type="number"
              placeholder="Monto mínimo adeudado"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes en Morosidad</CardTitle>
          <CardDescription>
            {filteredData.length === 0 ? 
              'No existen clientes en riesgo de morosidad' : 
              `${filteredData.length} cliente(s) con pagos vencidos`
            }
          </CardDescription>
          {filteredData.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport('xlsx')}>
                Exportar Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                Exportar CSV
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Cédula/RUC</TableHead>
                    <TableHead>Monto Adeudado</TableHead>
                    <TableHead>Facturas Vencidas</TableHead>
                    <TableHead>Días en Mora</TableHead>
                    <TableHead>Último Pago</TableHead>
                    <TableHead>Riesgo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((client) => {
                    const risk = getRiskLevel(client.daysOverdue);
                    return (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{client.cedula}</TableCell>
                        <TableCell className="text-destructive font-semibold">
                          ${client.overdueAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>{client.overdueInvoices}</TableCell>
                        <TableCell>{client.daysOverdue} días</TableCell>
                        <TableCell className="text-sm">{client.lastPaymentDate}</TableCell>
                        <TableCell>
                          <Badge variant={risk.variant}>{risk.level}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron clientes que coincidan con los filtros
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};