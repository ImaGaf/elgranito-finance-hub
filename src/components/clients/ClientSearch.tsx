import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, User, Phone, Mail, MapPin, CreditCard, Calendar } from 'lucide-react';
import { creditService } from '@/lib/credits';
import { User as UserType } from '@/lib/auth';

interface ClientSearchProps {
  user: UserType;
}

interface ClientData {
  id: string;
  name: string;
  cedula: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  totalCredits: number;
  activeCredits: number;
  totalPayments: number;
  lastPaymentDate: string;
}

export const ClientSearch = ({ user }: ClientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchClients = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simular búsqueda con datos mock
    const allClients = creditService.getAllClients();
    const payments = creditService.getAllPayments();
    const credits = creditService.getAllCredits();

    const results = allClients
      .filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cedula.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(client => {
        const clientCredits = credits.filter(c => c.clientId === client.id);
        const clientPayments = payments.filter(p => p.clientId === client.id);
        const lastPayment = clientPayments
          .filter(p => p.status === 'paid')
          .sort((a, b) => new Date(b.paidDate || '').getTime() - new Date(a.paidDate || '').getTime())[0];

        return {
          id: client.id,
          name: client.name,
          cedula: client.cedula,
          email: client.email,
          phone: client.phone,
          address: client.address,
          status: 'active' as const,
          registrationDate: client.registrationDate,
          totalCredits: clientCredits.length,
          activeCredits: clientCredits.filter(c => c.status === 'active').length,
          totalPayments: clientPayments.filter(p => p.status === 'paid').length,
          lastPaymentDate: lastPayment?.paidDate || 'Sin pagos registrados'
        };
      });

    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 500); // Simular latencia de búsqueda
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchClients();
  };

  const selectClient = (client: ClientData) => {
    setSelectedClient(client);
  };

  const getPaymentHistory = (clientId: string) => {
    const payments = creditService.getAllPayments().filter(p => p.clientId === clientId);
    return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-hero p-6 rounded-lg shadow-glow text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Consulta de Clientes</h1>
        <p className="opacity-90">Buscar información completa de clientes registrados</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Búsqueda de Cliente</CardTitle>
          <CardDescription>
            Ingrese nombre, cédula o RUC para buscar un cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, cédula o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isSearching || !searchTerm.trim()}>
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </form>

          {searchResults.length === 0 && searchTerm && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              Los datos ingresados no corresponden a ningún cliente existente
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Resultados de Búsqueda ({searchResults.length})</h3>
              <div className="grid gap-4">
                {searchResults.map((client) => (
                  <Card key={client.id} className="cursor-pointer hover:shadow-card transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{client.name}</h4>
                            <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                              {client.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>Cédula/RUC: {client.cedula}</div>
                            <div>Créditos Activos: {client.activeCredits}</div>
                            <div>Total Pagos: {client.totalPayments}</div>
                            <div>Último Pago: {client.lastPaymentDate}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => selectClient(client)}>
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClient && (
        <Card>
          <CardHeader>
            <CardTitle>Información Detallada del Cliente</CardTitle>
            <CardDescription>
              Datos completos y historial de {selectedClient.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Datos Personales
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Nombre:</strong> {selectedClient.name}</div>
                  <div><strong>Cédula/RUC:</strong> {selectedClient.cedula}</div>
                  <div><strong>Correo:</strong> {selectedClient.email}</div>
                  <div><strong>Teléfono:</strong> {selectedClient.phone}</div>
                  <div><strong>Dirección:</strong> {selectedClient.address}</div>
                  <div><strong>Fecha de Registro:</strong> {selectedClient.registrationDate}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Resumen Financiero
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Total Créditos:</strong> {selectedClient.totalCredits}</div>
                  <div><strong>Créditos Activos:</strong> {selectedClient.activeCredits}</div>
                  <div><strong>Total Pagos Realizados:</strong> {selectedClient.totalPayments}</div>
                  <div><strong>Último Pago:</strong> {selectedClient.lastPaymentDate}</div>
                  <div>
                    <strong>Estado:</strong> 
                    <Badge variant={selectedClient.status === 'active' ? 'success' : 'secondary'} className="ml-2">
                      {selectedClient.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4" />
                Historial de Pagos Recientes
              </h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Método</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaymentHistory(selectedClient.id).slice(0, 5).map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
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
                        <TableCell>{payment.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};