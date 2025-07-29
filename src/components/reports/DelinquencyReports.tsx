import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, FileDown, Search, Users } from 'lucide-react';

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

export const DelinquencyReports = () => {
  // Datos quemados (hardcoded)
  const clientesHardcoded: DelinquencyClient[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      cedula: '0102030405',
      email: 'juan.perez@email.com',
      overdueAmount: 350.75,
      overdueInvoices: 3,
      daysOverdue: 20,
      lastPaymentDate: '2025-06-10',
    },
    {
      id: '2',
      name: 'María Gómez',
      cedula: '0203040506',
      email: 'maria.gomez@email.com',
      overdueAmount: 1200.00,
      overdueInvoices: 5,
      daysOverdue: 35,
      lastPaymentDate: '2025-05-01',
    },
    {
      id: '3',
      name: 'Carlos Ruiz',
      cedula: '0304050607',
      email: 'carlos.ruiz@email.com',
      overdueAmount: 0,
      overdueInvoices: 0,
      daysOverdue: 0,
      lastPaymentDate: '2025-07-10',
    },
  ];

  const [delinquencyData, setDelinquencyData] = useState<DelinquencyClient[]>([]);
  const [filteredData, setFilteredData] = useState<DelinquencyClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [amountFilter, setAmountFilter] = useState('');

  useEffect(() => {
    // Solo cargar clientes con deuda (overdueAmount > 0)
    const clientesConMora = clientesHardcoded.filter(c => c.overdueAmount > 0);
    setDelinquencyData(clientesConMora);
  }, []);

  useEffect(() => {
    filterData();
  }, [delinquencyData, searchTerm, amountFilter]);

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
      if (!isNaN(amount)) {
        filtered = filtered.filter(client => client.overdueAmount >= amount);
      }
    }

    setFilteredData(filtered);
  };

  const getRiskLevel = (daysOverdue: number) => {
    if (daysOverdue >= 30) return { level: 'Crítico', variant: 'destructive' as const };
    if (daysOverdue >= 15) return { level: 'Alto', variant: 'warning' as const };
    return { level: 'Medio', variant: 'outline' as const };
  };

  const exportReport = (format: 'pdf' | 'xlsx' | 'csv') => {
    const data = filteredData.map(client => ({
      'Nombre': client.name,
      'Cédula/RUC': client.cedula,
      'Correo': client.email,
      'Monto Adeudado': `$${client.overdueAmount.toFixed(2)}`,
      'Facturas Vencidas': client.overdueInvoices,
      'Días en Mora': client.daysOverdue,
      'Último Pago': client.lastPaymentDate,
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
