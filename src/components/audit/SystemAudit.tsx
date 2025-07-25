import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, FileDown, CalendarIcon, Shield, Activity, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User } from '@/lib/auth';

interface SystemAuditProps {
  user: User;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  status: 'success' | 'error' | 'warning';
}

export const SystemAudit = ({ user }: SystemAuditProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, userFilter, moduleFilter, statusFilter, startDate, endDate]);

  const loadAuditLogs = () => {
    // Generar datos de auditoría simulados
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        userId: 'user-1',
        userName: 'Juan Pérez',
        action: 'Inicio de sesión',
        module: 'Autenticación',
        timestamp: '2024-01-25 08:30:15',
        ipAddress: '192.168.1.100',
        details: 'Login exitoso desde navegador Chrome',
        status: 'success'
      },
      {
        id: '2',
        userId: 'user-manager',
        userName: 'Carlos Administrador',
        action: 'Otorgar crédito',
        module: 'Gestión de Créditos',
        timestamp: '2024-01-25 09:15:30',
        ipAddress: '192.168.1.50',
        details: 'Crédito de $5000 otorgado a cliente María González',
        status: 'success'
      },
      {
        id: '3',
        userId: 'user-assistant',
        userName: 'Ana Asistente',
        action: 'Generar reporte',
        module: 'Reportes',
        timestamp: '2024-01-25 10:45:20',
        ipAddress: '192.168.1.75',
        details: 'Reporte de morosidad generado para enero 2024',
        status: 'success'
      },
      {
        id: '4',
        userId: 'user-2',
        userName: 'Luis Rodríguez',
        action: 'Intento de pago',
        module: 'Pagos',
        timestamp: '2024-01-25 11:20:45',
        ipAddress: '192.168.1.110',
        details: 'Pago rechazado - Tarjeta sin fondos',
        status: 'error'
      },
      {
        id: '5',
        userId: 'user-manager',
        userName: 'Carlos Administrador',
        action: 'Registrar asistente',
        module: 'Gestión de Usuarios',
        timestamp: '2024-01-25 12:00:10',
        ipAddress: '192.168.1.50',
        details: 'Nuevo asistente registrado: Pedro García',
        status: 'success'
      },
      {
        id: '6',
        userId: 'user-3',
        userName: 'María González',
        action: 'Realizar pago',
        module: 'Pagos',
        timestamp: '2024-01-25 13:15:35',
        ipAddress: '192.168.1.120',
        details: 'Pago de cuota mensual $250.00 procesado exitosamente',
        status: 'success'
      },
      {
        id: '7',
        userId: 'user-assistant',
        userName: 'Ana Asistente',
        action: 'Consultar cliente',
        module: 'Consulta de Clientes',
        timestamp: '2024-01-25 14:30:22',
        ipAddress: '192.168.1.75',
        details: 'Consulta de información del cliente Roberto Silva',
        status: 'success'
      },
      {
        id: '8',
        userId: 'unknown',
        userName: 'Usuario no identificado',
        action: 'Intento de acceso',
        module: 'Autenticación',
        timestamp: '2024-01-25 15:45:18',
        ipAddress: '203.154.78.92',
        details: 'Intento de acceso con credenciales inválidas',
        status: 'error'
      },
      {
        id: '9',
        userId: 'user-1',
        userName: 'Juan Pérez',
        action: 'Generar certificado',
        module: 'Certificados',
        timestamp: '2024-01-25 16:20:55',
        ipAddress: '192.168.1.100',
        details: 'Certificado de pago generado para factura INV-2024-001',
        status: 'success'
      },
      {
        id: '10',
        userId: 'user-manager',
        userName: 'Carlos Administrador',
        action: 'Exportar reporte',
        module: 'Reportes',
        timestamp: '2024-01-25 17:10:40',
        ipAddress: '192.168.1.50',
        details: 'Reporte de pagos exportado en formato PDF',
        status: 'success'
      }
    ];

    setAuditLogs(mockLogs);
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por usuario
    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.userId === userFilter);
    }

    // Filtro por módulo
    if (moduleFilter !== 'all') {
      filtered = filtered.filter(log => log.module === moduleFilter);
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Filtro por rango de fechas
    if (startDate && endDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    setFilteredLogs(filtered);
  };

  const exportAuditReport = (format: 'pdf' | 'xlsx' | 'csv') => {
    const data = filteredLogs.map(log => ({
      'Usuario': log.userName,
      'Acción': log.action,
      'Módulo': log.module,
      'Fecha y Hora': log.timestamp,
      'IP': log.ipAddress,
      'Estado': log.status === 'success' ? 'Éxito' : 
                log.status === 'error' ? 'Error' : 'Advertencia',
      'Detalles': log.details
    }));

    console.log(`Exportando auditoría en formato ${format}:`, data);
    alert(`Reporte de auditoría exportado en formato ${format.toUpperCase()}`);
  };

  const getUniqueUsers = () => {
    const users = Array.from(new Set(auditLogs.map(log => log.userId)))
      .map(userId => {
        const log = auditLogs.find(l => l.userId === userId);
        return { id: userId, name: log?.userName || 'Usuario desconocido' };
      });
    return users;
  };

  const getUniqueModules = () => {
    return Array.from(new Set(auditLogs.map(log => log.module)));
  };

  const getStats = () => {
    const totalLogs = filteredLogs.length;
    const successLogs = filteredLogs.filter(log => log.status === 'success').length;
    const errorLogs = filteredLogs.filter(log => log.status === 'error').length;
    const warningLogs = filteredLogs.filter(log => log.status === 'warning').length;
    const uniqueUsers = new Set(filteredLogs.map(log => log.userId)).size;
    
    return { totalLogs, successLogs, errorLogs, warningLogs, uniqueUsers };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Auditoría del Sistema</h1>
        <p className="opacity-90">Registro detallado de todas las acciones realizadas en el sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acciones Exitosas</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.successLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.errorLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.warningLogs}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Auditoría</CardTitle>
          <CardDescription>
            Filtre los registros de auditoría por diferentes criterios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en registros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                {getUniqueUsers().map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los módulos</SelectItem>
                {getUniqueModules().map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="success">Éxito</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd/MM/yyyy', { locale: es }) : 'Fecha inicial'}
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

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd/MM/yyyy', { locale: es }) : 'Fecha final'}
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

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportAuditReport('pdf')}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportAuditReport('xlsx')}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportAuditReport('csv')}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría</CardTitle>
          <CardDescription>
            {filteredLogs.length} registro(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.userName}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.module}</TableCell>
                    <TableCell className="text-sm">{log.timestamp}</TableCell>
                    <TableCell className="text-sm font-mono">{log.ipAddress}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          log.status === 'success' ? 'success' : 
                          log.status === 'error' ? 'destructive' : 'warning'
                        }
                      >
                        {log.status === 'success' ? 'Éxito' : 
                         log.status === 'error' ? 'Error' : 'Advertencia'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={log.details}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};