import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, FileDown, CalendarIcon, Filter, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { creditService } from '@/lib/credits';
import { User } from '@/lib/auth';

interface PaymentReportsProps {
  user: User;
}

interface PaymentReport {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientId: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

export const PaymentReports = ({ user }: PaymentReportsProps) => {
  const [reportType, setReportType] = useState<'client' | 'dateRange'>('client');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reportData, setReportData] = useState<PaymentReport[]>([]);
  const [filteredData, setFilteredData] = useState<PaymentReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    filterData();
  }, [reportData, methodFilter, statusFilter]);

  const generateClientReport = () => {
    if (!searchTerm.trim()) {
      alert('Por favor ingrese el nombre o cédula del cliente');
      return;
    }

    setIsGenerating(true);
    
    const clients = creditService.getAllClients();
    const payments = creditService.getAllPayments();
    
    const client = clients.find(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cedula.includes(searchTerm)
    );

    if (!client) {
      setTimeout(() => {
        setIsGenerating(false);
        setReportData([]);
        alert('Los datos ingresados no corresponden a ningún cliente existente');
      }, 500);
      return;
    }

    const clientPayments = payments
      .filter(p => p.clientId === client.id)
      .map(payment => ({
        id: payment.id,
        invoiceNumber: `INV-${payment.id.slice(-6).toUpperCase()}`,
        clientName: client.name,
        clientId: client.id,
        date: payment.date,
        amount: payment.amount,
        method: payment.method,
        status: payment.status
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTimeout(() => {
      setReportData(clientPayments);
      setIsGenerating(false);
    }, 800);
  };

  const generateDateRangeReport = () => {
    if (!startDate || !endDate) {
      alert('Por favor seleccione el rango de fechas');
      return;
    }

    if (startDate > endDate) {
      alert('El rango de fechas es incorrecto');
      return;
    }

    if (startDate > new Date()) {
      alert('El rango de fechas es incorrecto');
      return;
    }

    setIsGenerating(true);

    const clients = creditService.getAllClients();
    const payments = creditService.getAllPayments();
    
    const dateRangePayments = payments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate && paymentDate <= endDate;
      })
      .map(payment => {
        const client = clients.find(c => c.id === payment.clientId);
        return {
          id: payment.id,
          invoiceNumber: `INV-${payment.id.slice(-6).toUpperCase()}`,
          clientName: client?.name || 'Cliente no encontrado',
          clientId: payment.clientId,
          date: payment.date,
          amount: payment.amount,
          method: payment.method,
          status: payment.status
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTimeout(() => {
      if (dateRangePayments.length === 0) {
        alert('No hay pagos de la fecha inicial a la fecha final');
      }
      setReportData(dateRangePayments);
      setIsGenerating(false);
    }, 800);
  };

  const filterData = () => {
    let filtered = reportData;

    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredData(filtered);
  };

  const exportReport = (format: 'pdf' | 'xlsx' | 'csv') => {
    const data = filteredData.map(payment => ({
      'Número de Factura': payment.invoiceNumber,
      'Cliente': payment.clientName,
      'Fecha': payment.date,
      'Monto': `$${payment.amount.toFixed(2)}`,
      'Método': payment.method,
      'Estado': payment.status === 'paid' ? 'Pagado' : 
                payment.status === 'pending' ? 'Pendiente' : 'Vencido'
    }));

    console.log(`Exportando reporte de pagos en formato ${format}:`, data);
    alert(`Reporte exportado en formato ${format.toUpperCase()}`);
  };

  const getTotalAmount = () => {
    return filteredData.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getStatusStats = () => {
    const paid = filteredData.filter(p => p.status === 'paid').length;
    const pending = filteredData.filter(p => p.status === 'pending').length;
    const overdue = filteredData.filter(p => p.status === 'overdue').length;
    return { paid, pending, overdue };
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Reportes de Pagos</h1>
        <p className="opacity-90">Genere reportes detallados de pagos por cliente o rango de fechas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tipo de Reporte</CardTitle>
          <CardDescription>
            Seleccione el tipo de reporte que desea generar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              variant={reportType === 'client' ? 'default' : 'outline'}
              onClick={() => setReportType('client')}
            >
              Reporte por Cliente
            </Button>
            <Button 
              variant={reportType === 'dateRange' ? 'default' : 'outline'}
              onClick={() => setReportType('dateRange')}
            >
              Reporte por Fechas
            </Button>
          </div>

          {reportType === 'client' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o cédula del cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={generateClientReport} disabled={isGenerating || !searchTerm.trim()}>
                  {isGenerating ? 'Generando...' : 'Generar Reporte'}
                </Button>
              </div>
            </div>
          )}

          {reportType === 'dateRange' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Fecha Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium">Fecha Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date > new Date() || (startDate && date < startDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button onClick={generateDateRangeReport} disabled={isGenerating || !startDate || !endDate} className="w-full">
                    {isGenerating ? 'Generando...' : 'Generar Reporte'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {reportData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
                <FileDown className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${getTotalAmount().toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos Exitosos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{getStatusStats().paid}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{getStatusStats().overdue}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de Pagos</CardTitle>
              <CardDescription>
                Resultados del reporte generado ({filteredData.length} registros)
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2">
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los métodos</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="paid">Pagado</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="overdue">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 ml-auto">
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Factura</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                        <TableCell>{payment.clientName}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payment.method}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              payment.status === 'paid' ? 'success' : 
                              payment.status === 'pending' ? 'warning' : 'destructive'
                            }
                          >
                            {payment.status === 'paid' ? 'Pagado' : 
                             payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};