export interface Credit {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  startDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  totalPaid: number;
  remainingBalance: number;
  paymentHistory: Payment[];
  createdDate: string;
}

export interface Payment {
  id: string;
  creditId: string;
  clientId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  method: 'card' | 'transfer' | 'cash' | 'pending';
  transactionId?: string;
  date: string;
  installmentNumber?: number;
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  address: string;
}

const CREDITS_KEY = 'el_granito_credits';
const PAYMENTS_KEY = 'el_granito_payments';

export const creditService = {
  // Otorgar crédito (solo gerente)
  grantCredit: async (data: {
    clientId: string;
    clientName: string;
    amount: number;
    interestRate: number;
    term: number;
  }): Promise<{ success: boolean; message: string; credit?: Credit }> => {
    const credits = JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
    
    // Verificar si el cliente ya tiene un crédito activo
    const activeCredit = credits.find((c: Credit) => 
      c.clientId === data.clientId && c.status === 'active'
    );
    
    if (activeCredit) {
      return { success: false, message: 'El cliente ya tiene un crédito activo.' };
    }

    const monthlyPayment = calculateMonthlyPayment(data.amount, data.interestRate, data.term);
    
    const newCredit: Credit = {
      id: Date.now().toString(),
      clientId: data.clientId,
      clientName: data.clientName,
      amount: data.amount,
      interestRate: data.interestRate,
      term: data.term,
      monthlyPayment,
      startDate: new Date(),
      status: 'active',
      totalPaid: 0,
      remainingBalance: data.amount,
      paymentHistory: [],
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Generar cuotas
    const payments = generatePaymentSchedule(newCredit);
    
    credits.push(newCredit);
    const allPayments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
    allPayments.push(...payments);
    
    localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(allPayments));

    return { success: true, message: 'Crédito otorgado exitosamente', credit: newCredit };
  },

  // Obtener créditos de un cliente
  getClientCredits: (clientId: string): Credit[] => {
    const credits = JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
    return credits.filter((c: Credit) => c.clientId === clientId);
  },

  // Obtener pagos pendientes de un cliente
  getClientPendingPayments: (clientId: string): Payment[] => {
    const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
    const credits = JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
    const clientCredits = credits.filter((c: Credit) => c.clientId === clientId);
    const creditIds = clientCredits.map((c: Credit) => c.id);
    
    return payments.filter((p: Payment) => 
      creditIds.includes(p.creditId) && p.status !== 'paid'
    );
  },

  // Procesar pago
  processPayment: async (paymentId: string, paymentData: PaymentFormData): Promise<{ success: boolean; message: string }> => {
    const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
    const credits = JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
    
    const paymentIndex = payments.findIndex((p: Payment) => p.id === paymentId);
    if (paymentIndex === -1) {
      return { success: false, message: 'Pago no encontrado.' };
    }

    // Validar datos de tarjeta
    if (!validateCardData(paymentData)) {
      return { success: false, message: 'Complete todos los datos de la tarjeta correctamente.' };
    }

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));

    const payment = payments[paymentIndex];
    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.method = 'card';
    payment.transactionId = `TRX-${Date.now()}`;

    // Actualizar crédito
    const creditIndex = credits.findIndex((c: Credit) => c.id === payment.creditId);
    if (creditIndex !== -1) {
      credits[creditIndex].totalPaid += payment.amount;
      credits[creditIndex].remainingBalance -= payment.amount;
      
      if (credits[creditIndex].remainingBalance <= 0) {
        credits[creditIndex].status = 'completed';
      }
    }

    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));

    return { success: true, message: 'Pago procesado exitosamente.' };
  },

  // Generar certificado de pago
  generatePaymentCertificate: (paymentIds: string[]): { success: boolean; certificate?: any } => {
    const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
    const paidPayments = payments.filter((p: Payment) => 
      paymentIds.includes(p.id) && p.status === 'paid'
    );

    if (paidPayments.length === 0) {
      return { success: false };
    }

    const certificate = {
      id: `CERT-${Date.now()}`,
      payments: paidPayments,
      generatedAt: new Date(),
      totalAmount: paidPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0)
    };

    return { success: true, certificate };
  },

  // Obtener todos los créditos (para reportes)
  getAllCredits: (): Credit[] => {
    return JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
  },

  // Obtener todos los pagos (para reportes)
  getAllPayments: (): Payment[] => {
    return JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
  },

  // Obtener todos los clientes (necesario para componentes)
  getAllClients: () => {
    const users = JSON.parse(localStorage.getItem('el_granito_users') || '[]');
    return users.filter((user: any) => user.role === 'cliente');
  },

  // Agregar crédito
  addCredit: (credit: any) => {
    const credits = JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
    credits.push(credit);
    localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));
  },

  // Agregar pago
  addPayment: (payment: any) => {
    const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
    payments.push(payment);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  }
};

// Funciones auxiliares
function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1);
}

function generatePaymentSchedule(credit: Credit): Payment[] {
  const payments: Payment[] = [];
  const startDate = new Date(credit.startDate);
  
  for (let i = 0; i < credit.term; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    payments.push({
      id: `PAY-${credit.id}-${i + 1}`,
      creditId: credit.id,
      clientId: credit.clientId,
      amount: credit.monthlyPayment,
      dueDate,
      status: 'pending',
      method: 'pending',
      date: dueDate.toISOString().split('T')[0],
      installmentNumber: i + 1
    });
  }
  
  return payments;
}

function validateCardData(data: PaymentFormData): boolean {
  const cardNumberRegex = /^\d{16}$/;
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvvRegex = /^\d{3,4}$/;
  
  return cardNumberRegex.test(data.cardNumber.replace(/\s/g, '')) &&
         expiryRegex.test(data.expiryDate) &&
         cvvRegex.test(data.cvv) &&
         data.cardHolderName.trim().length > 0 &&
         data.address.trim().length > 0;
}

// Inicializar datos de prueba
export const initializeMockData = () => {
  const credits = JSON.parse(localStorage.getItem(CREDITS_KEY) || '[]');
  const payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY) || '[]');
  
  if (credits.length === 0) {
    // Crear créditos de prueba
    const mockCredits: Credit[] = [
      {
        id: 'credit-001',
        clientId: 'cliente-001',
        clientName: 'Juan Pérez',
        amount: 50000,
        interestRate: 12,
        term: 24,
        monthlyPayment: 2347.22,
        startDate: new Date('2024-01-15'),
        status: 'active',
        totalPaid: 18777.76,
        remainingBalance: 31222.24,
        paymentHistory: [],
        createdDate: '2024-01-15'
      },
      {
        id: 'credit-002',
        clientId: 'cliente-002',
        clientName: 'María González',
        amount: 75000,
        interestRate: 10,
        term: 36,
        monthlyPayment: 2416.67,
        startDate: new Date('2023-06-01'),
        status: 'active',
        totalPaid: 43500.05,
        remainingBalance: 31499.95,
        paymentHistory: [],
        createdDate: '2023-06-01'
      },
      {
        id: 'credit-003',
        clientId: 'cliente-003',
        clientName: 'Carlos Silva',
        amount: 30000,
        interestRate: 15,
        term: 18,
        monthlyPayment: 1944.44,
        startDate: new Date('2023-10-01'),
        status: 'completed',
        totalPaid: 30000,
        remainingBalance: 0,
        paymentHistory: [],
        createdDate: '2023-10-01'
      }
    ];

    // Crear pagos de prueba
    const mockPayments: Payment[] = [
      {
        id: 'pay-001',
        creditId: 'credit-001',
        clientId: 'cliente-001',
        amount: 2347.22,
        dueDate: new Date('2024-07-15'),
        status: 'pending',
        method: 'pending',
        date: '2024-07-15',
        installmentNumber: 1
      },
      {
        id: 'pay-002',
        creditId: 'credit-001',
        clientId: 'cliente-001',
        amount: 2347.22,
        dueDate: new Date('2024-08-15'),
        status: 'pending',
        method: 'pending',
        date: '2024-08-15',
        installmentNumber: 2
      },
      {
        id: 'pay-003',
        creditId: 'credit-002',
        clientId: 'cliente-002',
        amount: 2416.67,
        dueDate: new Date('2024-07-01'),
        status: 'overdue',
        method: 'pending',
        date: '2024-07-01',
        installmentNumber: 1
      },
      {
        id: 'pay-004',
        creditId: 'credit-002',
        clientId: 'cliente-002',
        amount: 2416.67,
        dueDate: new Date('2024-08-01'),
        status: 'pending',
        method: 'pending',
        date: '2024-08-01',
        installmentNumber: 2
      },
      {
        id: 'pay-005',
        creditId: 'credit-001',
        clientId: 'cliente-001',
        amount: 2347.22,
        dueDate: new Date('2024-06-15'),
        paidDate: new Date('2024-06-14'),
        status: 'paid',
        method: 'card',
        transactionId: 'TRX-1718396400000',
        date: '2024-06-15',
        installmentNumber: 0
      }
    ];

    localStorage.setItem(CREDITS_KEY, JSON.stringify(mockCredits));
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(mockPayments));
  }
};