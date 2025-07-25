export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cliente' | 'asistente' | 'gerente';
  cedula?: string;
  telefono?: string;
  direccion?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simulación de base de datos en localStorage
const USERS_KEY = 'el_granito_users';
const CURRENT_USER_KEY = 'el_granito_current_user';

export const authService = {
  // Registrar cliente
  registerClient: async (userData: {
    name: string;
    email: string;
    password: string;
    cedula?: string;
    telefono?: string;
    direccion?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Verificar si el email ya existe
    if (users.find((user: User) => user.email === userData.email)) {
      return { success: false, message: 'Este correo ya está registrado. Intente iniciar sesión o recuperar su contraseña.' };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { success: false, message: 'El formato del correo electrónico no es válido.' };
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
if (!passwordRegex.test(userData.password)) {
  return { 
    success: false, 
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial. Ejemplo: Cliente123!, MiClave2024@, ContraseñaSegura1$' 
  };
}

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'cliente',
      cedula: userData.cedula,
      telefono: userData.telefono,
      direccion: userData.direccion,
      createdAt: new Date()
    };

    users.push({ ...newUser, password: userData.password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: 'Registro exitoso', user: newUser };
  },

  // Registrar asistente (solo gerente)
  registerAssistant: async (userData: {
    name: string;
    email: string;
    password: string;
  }, currentUser: User): Promise<{ success: boolean; message: string; user?: User }> => {
    if (currentUser.role !== 'gerente') {
      return { success: false, message: 'No tiene permisos para realizar esta acción.' };
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((user: User) => user.email === userData.email)) {
      return { success: false, message: 'El correo ingresado ya está registrado. Intente con otro.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'asistente',
      createdAt: new Date()
    };

    users.push({ ...newUser, password: userData.password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: 'Asistente registrado exitosamente', user: newUser };
  },

  // Iniciar sesión
  login: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Credenciales incorrectas. Intente nuevamente.' };
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Inicio de sesión exitoso', user: userWithoutPassword };
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },

  // Obtener todos los usuarios (para gestión)
  getAllUsers: (): User[] => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },

  // Actualizar usuario
  updateUser: async (userId: string, userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex((user: any) => user.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    users[userIndex] = { ...users[userIndex], ...userData };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true, message: 'Usuario actualizado exitosamente' };
  },

  // Eliminar usuario
  deleteUser: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const filteredUsers = users.filter((user: any) => user.id !== userId);
    
    if (filteredUsers.length === users.length) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
    return { success: true, message: 'Usuario eliminado exitosamente' };
  }
};

// Crear usuarios por defecto
export const initializeDefaultUsers = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 'manager-001',
        name: 'Gerente Principal',
        email: 'gerente@elgranito.com',
        password: 'Gerente123!',
        role: 'gerente',
        createdAt: new Date()
      },
      {
        id: 'assistant-001',
        name: 'Ana Martínez',
        email: 'asistente@elgranito.com',
        password: 'Asistente123!',
        role: 'asistente',
        createdAt: new Date()
      },
      {
        id: 'cliente-001',
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        password: 'Cliente123!',
        role: 'cliente',
        cedula: '1234567890',
        telefono: '0987654321',
        direccion: 'Av. Principal 123',
        createdAt: new Date()
      },
      {
        id: 'cliente-002',
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        password: 'Cliente123!',
        role: 'cliente',
        cedula: '0987654321',
        telefono: '0912345678',
        direccion: 'Calle Secundaria 456',
        createdAt: new Date()
      },
      {
        id: 'cliente-003',
        name: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        password: 'Cliente123!',
        role: 'cliente',
        cedula: '1122334455',
        telefono: '0976543210',
        direccion: 'Barrio Los Pinos 789',
        createdAt: new Date()
      }
    ];

    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};