import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, FileDown, Search, Users, Download, FileSpreadsheet } from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Logo mejorado en base64 (puedes reemplazarlo por tu logo real)
const logoBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAADa4j0PAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGnklEQVR4nO2da4hcVRjHf5PEJjGJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiX/wP1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVrAAEidJhKAAAAAElFTkSuQmCC';

interface DelinquencyClient {
  id: string;
  name: string;
  cedula: string;
  email: string;
  overdueAmount: number;
  overdueInvoices: number;
  daysOverdue: number;
  lastPaymentDate: string;
  interesCalculado?: number;
}

// Función para detectar clientes irregulares
const esIrregular = (client: DelinquencyClient) => {
  return client.daysOverdue >= 60 && client.overdueAmount > 0;
};

// Función para crear y descargar archivo Excel
const exportToExcel = (data: DelinquencyClient[], filename: string = 'reporte-morosidad') => {
  // Crear el contenido CSV manualmente
  const headers = [
    'Cliente',
    'Correo Electrónico',
    'Cédula/RUC',
    'Monto Adeudado (USD)',
    'Facturas Vencidas',
    'Días en Mora',
    'Último Pago',
    'Interés por Mora (USD)',
    'Nivel de Riesgo',
    'Estado'
  ];

  const getRiskLevel = (daysOverdue: number) => {
    if (daysOverdue >= 30) return 'Crítico';
    if (daysOverdue >= 15) return 'Alto';
    return 'Medio';
  };

  const csvRows = [
    headers.join(','),
    ...data.map(client => [
      `"${client.name}"`,
      `"${client.email}"`,
      client.cedula,
      client.overdueAmount.toFixed(2),
      client.overdueInvoices,
      client.daysOverdue,
      client.lastPaymentDate,
      (client.interesCalculado ?? 0).toFixed(2),
      `"${getRiskLevel(client.daysOverdue)}"`,
      esIrregular(client) ? '"Irregular"' : '"Regular"'
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  
  // Crear y descargar el archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const DelinquencyReports = () => {
  const clientesHardcoded: DelinquencyClient[] = [
    {
      id: '1',
      name: 'Juan Pérez García',
      cedula: '0102030405',
      email: 'juan.perez@email.com',
      overdueAmount: 350.75,
      overdueInvoices: 3,
      daysOverdue: 20,
      lastPaymentDate: '2025-06-10',
      interesCalculado: 11.69,
    },
    {
      id: '2',
      name: 'María Elena Gómez',
      cedula: '0203040506',
      email: 'maria.gomez@email.com',
      overdueAmount: 1200.0,
      overdueInvoices: 5,
      daysOverdue: 65,
      lastPaymentDate: '2025-05-01',
      interesCalculado: 70.0,
    },
    {
      id: '3',
      name: 'Carlos Alberto Ruiz',
      cedula: '0304050607',
      email: 'carlos.ruiz@email.com',
      overdueAmount: 0,
      overdueInvoices: 0,
      daysOverdue: 0,
      lastPaymentDate: '2025-07-10',
      interesCalculado: 0.0,
    },
    {
      id: '4',
      name: 'Ana Lucía Morales',
      cedula: '0405060708',
      email: 'ana.morales@email.com',
      overdueAmount: 2500.50,
      overdueInvoices: 8,
      daysOverdue: 45,
      lastPaymentDate: '2025-04-15',
      interesCalculado: 125.25,
    },
    {
      id: '5',
      name: 'Roberto Silva Mendoza',
      cedula: '1234567890001',
      email: 'roberto.silva@empresa.com',
      overdueAmount: 750.25,
      overdueInvoices: 2,
      daysOverdue: 12,
      lastPaymentDate: '2025-07-05',
      interesCalculado: 18.75,
    }
  ];

  const [delinquencyData, setDelinquencyData] = useState<DelinquencyClient[]>([]);
  const [filteredData, setFilteredData] = useState<DelinquencyClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [amountFilter, setAmountFilter] = useState('');

  useEffect(() => {
    setDelinquencyData(clientesHardcoded.filter((c) => c.overdueAmount > 0));
  }, []);

  useEffect(() => {
    let filtered = delinquencyData;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.cedula.includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (amountFilter.trim() !== '') {
      const amount = parseFloat(amountFilter);
      if (!isNaN(amount)) {
        filtered = filtered.filter((client) => client.overdueAmount >= amount);
      }
    }

    setFilteredData(filtered);
  }, [delinquencyData, searchTerm, amountFilter]);

  const getRiskLevel = (daysOverdue: number) => {
    if (daysOverdue >= 30) return { level: 'Crítico', variant: 'destructive' as const };
    if (daysOverdue >= 15) return { level: 'Alto', variant: 'warning' as const };
    return { level: 'Medio', variant: 'outline' as const };
  };

  const generarPDFProfesional = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 20;

    // Función para agregar una nueva página si es necesario
    const checkPageBreak = (neededSpace: number) => {
      if (y + neededSpace > pageHeight - 30) {
        doc.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    // Header con logo y título
    doc.setFillColor(59, 130, 246); // bg-blue-600
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE MOROSIDAD', pageWidth / 2, 25, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión Financiera', pageWidth / 2, 35, { align: 'center' });
    
    // Fecha del reporte
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Fecha del Reporte: ${fechaActual}`, pageWidth / 2, 45, { align: 'center' });

    y = 80;

    // Resumen ejecutivo
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN EJECUTIVO', margin, y);
    y += 15;

    // Estadísticas en cajas
    const totalClientes = filteredData.length;
    const montoTotal = filteredData.reduce((sum, c) => sum + c.overdueAmount, 0);
    const facturasVencidas = filteredData.reduce((sum, c) => sum + c.overdueInvoices, 0);
    const interesTotal = filteredData.reduce((sum, c) => sum + (c.interesCalculado ?? 0), 0);
    const clientesIrregulares = filteredData.filter(esIrregular).length;

    // Crear cajas de estadísticas
    const boxWidth = (pageWidth - 2 * margin - 20) / 3;
    const boxHeight = 25;
    
    // Caja 1: Total Clientes
    doc.setFillColor(239, 68, 68); // bg-red-500
    doc.rect(margin, y, boxWidth, boxHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTES EN MORA', margin + boxWidth/2, y + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.text(totalClientes.toString(), margin + boxWidth/2, y + 18, { align: 'center' });

    // Caja 2: Monto Total
    doc.setFillColor(245, 158, 11); // bg-amber-500
    doc.rect(margin + boxWidth + 10, y, boxWidth, boxHeight, 'F');
    doc.setFontSize(10);
    doc.text('MONTO TOTAL (USD)', margin + boxWidth + 10 + boxWidth/2, y + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`$${montoTotal.toFixed(2)}`, margin + boxWidth + 10 + boxWidth/2, y + 18, { align: 'center' });

    // Caja 3: Facturas Vencidas
    doc.setFillColor(34, 197, 94); // bg-green-500
    doc.rect(margin + 2 * boxWidth + 20, y, boxWidth, boxHeight, 'F');
    doc.setFontSize(10);
    doc.text('FACTURAS VENCIDAS', margin + 2 * boxWidth + 20 + boxWidth/2, y + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.text(facturasVencidas.toString(), margin + 2 * boxWidth + 20 + boxWidth/2, y + 18, { align: 'center' });

    y += 40;

    // Información adicional
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Interés total acumulado: $${interesTotal.toFixed(2)}`, margin, y);
    y += 8;
    doc.text(`• Clientes irregulares (>60 días): ${clientesIrregulares}`, margin, y);
    y += 8;
    doc.text(`• Promedio días en mora: ${Math.round(filteredData.reduce((sum, c) => sum + c.daysOverdue, 0) / totalClientes)} días`, margin, y);
    y += 20;

    checkPageBreak(40);

    // Título de la tabla
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE CLIENTES EN MOROSIDAD', margin, y);
    y += 15;

    // Tabla mejorada con autoTable
    const tableColumnHeaders = [
      'Cliente',
      'Cédula/RUC',
      'Monto\n(USD)',
      'Facturas',
      'Días\nMora',
      'Último\nPago',
      'Interés\n(USD)',
      'Riesgo'
    ];

    const tableRows = filteredData.map((client) => {
      const risk = getRiskLevel(client.daysOverdue);
      return [
        client.name,
        client.cedula,
        `$${client.overdueAmount.toFixed(2)}`,
        client.overdueInvoices.toString(),
        `${client.daysOverdue}`,
        client.lastPaymentDate,
        `$${(client.interesCalculado ?? 0).toFixed(2)}`,
        risk.level
      ];
    });

    autoTable(doc, {
      startY: y,
      head: [tableColumnHeaders],
      body: tableRows,
      theme: 'striped',
      headStyles: { 
        fillColor: [59, 130, 246], // blue-600
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4
      },
      bodyStyles: { 
        fontSize: 8,
        cellPadding: 3,
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] }, // gray-50
      columnStyles: {
        0: { halign: 'left', cellWidth: 35 }, // Cliente
        1: { halign: 'center', cellWidth: 25 }, // Cédula
        2: { halign: 'right', cellWidth: 20 }, // Monto
        3: { halign: 'center', cellWidth: 15 }, // Facturas
        4: { halign: 'center', cellWidth: 15 }, // Días
        5: { halign: 'center', cellWidth: 22 }, // Último pago
        6: { halign: 'right', cellWidth: 18 }, // Interés
        7: { halign: 'center', cellWidth: 18 } // Riesgo
      },
      margin: { left: margin, right: margin },
      didParseCell: function(data) {
        // Colorear filas de clientes irregulares
        if (data.section === 'body') {
          const client = filteredData[data.row.index];
          if (esIrregular(client)) {
            data.cell.styles.fillColor = [254, 226, 226]; // red-100
            data.cell.styles.textColor = [127, 29, 29]; // red-900
          }
        }
        
        // Colorear la columna de riesgo
        if (data.section === 'body' && data.column.index === 7) {
          const riskText = data.cell.text[0];
          switch (riskText) {
            case 'Crítico':
              data.cell.styles.fillColor = [239, 68, 68]; // red-500
              data.cell.styles.textColor = [255, 255, 255];
              break;
            case 'Alto':
              data.cell.styles.fillColor = [245, 158, 11]; // amber-500
              data.cell.styles.textColor = [255, 255, 255];
              break;
            case 'Medio':
              data.cell.styles.fillColor = [34, 197, 94]; // green-500
              data.cell.styles.textColor = [255, 255, 255];
              break;
          }
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 30;

    // Footer con firmas
    checkPageBreak(60);
    
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VALIDACIONES', margin, y);
    y += 15;

    const firmaWidth = (pageWidth - 2 * margin - 20) / 2;
    
    // Firma 1
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('_'.repeat(30), margin, y);
    doc.text('Gerente Financiero', margin, y + 8);
    doc.text('Aprobado por', margin, y + 16);

    // Firma 2
    doc.text('_'.repeat(30), margin + firmaWidth + 20, y);
    doc.text('Contador General', margin + firmaWidth + 20, y + 8);
    doc.text('Revisado por', margin + firmaWidth + 20, y + 16);

    // Pie de página
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      doc.text('Documento generado automáticamente', margin, pageHeight - 10);
    }

    // Descargar PDF
    doc.save(`reporte-morosidad-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totalMontoVencido = delinquencyData.reduce((sum, c) => sum + c.overdueAmount, 0);
  const totalFacturasVencidas = delinquencyData.reduce((sum, c) => sum + c.overdueInvoices, 0);
  const clientesIrregulares = delinquencyData.filter(esIrregular).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">📊 Reportes de Morosidad</h1>
        <p className="opacity-90">Análisis completo de clientes que requieren atención inmediata por pagos vencidos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes en Mora</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{delinquencyData.length}</div>
            <p className="text-xs text-muted-foreground">
              {clientesIrregulares} irregulares (60 días)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total Vencido</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${totalMontoVencido.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +${delinquencyData.reduce((sum, c) => sum + (c.interesCalculado ?? 0), 0).toFixed(2)} intereses
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <FileDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totalFacturasVencidas}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio: {Math.round(totalFacturasVencidas / Math.max(delinquencyData.length, 1))} por cliente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Días Promedio Mora</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(delinquencyData.reduce((sum, c) => sum + c.daysOverdue, 0) / Math.max(delinquencyData.length, 1))}
            </div>
            <p className="text-xs text-muted-foreground">días de atraso</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Clientes en Morosidad
              </CardTitle>
              <CardDescription>
                {filteredData.length === 0
                  ? 'No existen clientes que coincidan con los filtros aplicados'
                  : `${filteredData.length} cliente(s) con pagos vencidos encontrados`}
              </CardDescription>
            </div>
            {filteredData.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportToExcel(filteredData)}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Exportar Excel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={generarPDFProfesional}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Download className="h-4 w-4" />
                  Generar Reporte PDF
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Cliente</TableHead>
                    <TableHead className="font-semibold">Correo</TableHead>
                    <TableHead className="font-semibold">Cédula/RUC</TableHead>
                    <TableHead className="font-semibold text-right">Monto Adeudado</TableHead>
                    <TableHead className="font-semibold text-center">Facturas</TableHead>
                    <TableHead className="font-semibold text-center">Días en Mora</TableHead>
                    <TableHead className="font-semibold">Último Pago</TableHead>
                    <TableHead className="font-semibold text-right">Interés por Mora</TableHead>
                    <TableHead className="font-semibold text-center">Riesgo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((client) => {
                    const risk = getRiskLevel(client.daysOverdue);
                    const isIrregular = esIrregular(client);
                    return (
                      <TableRow 
                        key={client.id} 
                        className={`${isIrregular ? 'bg-red-50 border-l-4 border-l-red-500' : ''} hover:bg-gray-50`}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium text-gray-900">{client.name}</div>
                            {isIrregular && (
                              <Badge variant="destructive" className="w-fit text-xs mt-1">
                                IRREGULAR
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{client.email}</TableCell>
                        <TableCell className="font-mono text-sm">{client.cedula}</TableCell>
                        <TableCell className="text-right font-semibold text-red-600">
                          ${client.overdueAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-orange-700 border-orange-300">
                            {client.overdueInvoices}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${client.daysOverdue >= 30 ? 'text-red-600' : client.daysOverdue >= 15 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {client.daysOverdue} días
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{client.lastPaymentDate}</TableCell>
                        <TableCell className="text-right font-medium text-orange-600">
                          ${(client.interesCalculado ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={risk.variant} className="font-medium">
                            {risk.level}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-500">
                No existen clientes que coincidan con los filtros aplicados.
                <br />
                Intenta modificar los criterios de búsqueda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de análisis adicional */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📈 Análisis de Riesgo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Crítico', 'Alto', 'Medio'].map((nivel) => {
                  const count = filteredData.filter(c => getRiskLevel(c.daysOverdue).level === nivel).length;
                  const percentage = Math.round((count / filteredData.length) * 100);
                  return (
                    <div key={nivel} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={nivel === 'Crítico' ? 'destructive' : nivel === 'Alto' ? 'warning' : 'outline'}>
                          {nivel}
                        </Badge>
                        <span className="text-sm text-gray-600">{count} clientes</span>
                      </div>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💰 Resumen Financiero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monto principal:</span>
                  <span className="font-semibold">${totalMontoVencido.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Intereses acumulados:</span>
                  <span className="font-semibold text-orange-600">
                    ${delinquencyData.reduce((sum, c) => sum + (c.interesCalculado ?? 0), 0).toFixed(2)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total a recuperar:</span>
                  <span className="font-bold text-lg text-red-600">
                    ${(totalMontoVencido + delinquencyData.reduce((sum, c) => sum + (c.interesCalculado ?? 0), 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};