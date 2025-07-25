# Guía de Colores El Granito Finance Hub

## Paleta de Colores Corporativos

### Colores Principales
- **Verde El Granito**: Una gama completa de verdes desde muy claro hasta muy oscuro
- **Amarillo El Granito**: Tonos amarillos que complementan el verde
- **Blanco**: Para contrastes y espacios limpios

### Clases Tailwind Disponibles

#### Colores Verde El Granito
```css
granito-green-50   /* Verde muy claro para fondos */
granito-green-100  /* Verde claro para hover states */
granito-green-200  /* Verde suave para bordes */
granito-green-300  /* Verde medio claro */
granito-green-400  /* Verde medio */
granito-green-500  /* Verde estándar */
granito-green-600  /* Verde principal (recomendado para botones) */
granito-green-700  /* Verde oscuro para texto */
granito-green-800  /* Verde muy oscuro */
granito-green-900  /* Verde extremadamente oscuro */
granito-green-950  /* Verde casi negro */
```

#### Colores Amarillo El Granito
```css
granito-yellow-50   /* Amarillo muy claro para fondos */
granito-yellow-100  /* Amarillo claro */
granito-yellow-200  /* Amarillo suave */
granito-yellow-300  /* Amarillo medio claro */
granito-yellow-400  /* Amarillo medio */
granito-yellow-500  /* Amarillo estándar (recomendado para acentos) */
granito-yellow-600  /* Amarillo intenso */
granito-yellow-700  /* Amarillo oscuro */
granito-yellow-800  /* Amarillo muy oscuro */
granito-yellow-900  /* Amarillo extremadamente oscuro */
granito-yellow-950  /* Amarillo casi negro */
```

#### Blanco
```css
granito-white      /* Blanco puro */
```

## Gradientes Predefinidos

### Clases CSS de Gradientes (Más Verdes)
```css
/* Gradiente principal con dominancia verde */
.bg-granito-gradient

/* Gradiente suave con más tonos verdes */
.bg-granito-soft

/* Gradiente verde intenso */
.bg-granito-green

/* Gradiente que inicia en verde */
.bg-granito-yellow

/* Gradiente para hero sections con más verde */
.bg-granito-hero

/* Gradiente para tarjetas con más verde */
.bg-granito-card
```

### Gradientes Tailwind (Actualizados - Más Verdes)
```css
bg-gradient-granito         /* Linear gradient con dominancia verde */
bg-gradient-granito-soft    /* Gradiente suave con más verde */
bg-gradient-granito-green   /* Gradiente verde intenso */
bg-gradient-granito-yellow  /* Gradiente que inicia en verde */
bg-gradient-granito-hero    /* Gradiente para hero sections con más verde */
bg-gradient-granito-card    /* Gradiente para tarjetas con más verde */
```

## Componentes con Estilos Predefinidos

### Botones
```tsx
/* Botón principal verde */
<Button className="btn-granito-primary">Botón Principal</Button>

/* Botón secundario amarillo */
<Button className="btn-granito-secondary">Botón Secundario</Button>

/* Botón outline */
<Button className="btn-granito-outline">Botón Outline</Button>
```

### Tarjetas
```tsx
/* Tarjeta blanca con bordes verdes */
<Card className="card-granito">Contenido</Card>

/* Tarjeta con gradiente suave */
<Card className="card-granito-gradient">Contenido</Card>
```

### Efectos de Hover
```tsx
/* Efecto glow verde al hacer hover */
<div className="hover-granito-glow">Elemento con glow verde</div>

/* Efecto glow amarillo al hacer hover */
<div className="hover-granito-yellow-glow">Elemento con glow amarillo</div>
```

### Texto con Gradiente
```tsx
/* Texto con gradiente verde-amarillo */
<h1 className="text-granito-gradient">El Granito</h1>

/* Texto verde principal */
<p className="text-granito-primary">Texto en verde</p>

/* Texto amarillo secundario */
<p className="text-granito-secondary">Texto en amarillo</p>
```

### Bordes con Gradiente
```tsx
/* Borde con gradiente */
<div className="border-granito-gradient">Contenido con borde gradiente</div>
```

## Componentes de Layout

### Navbar
```tsx
/* Navbar con estilo El Granito */
<nav className="navbar-granito">...</nav>
```

### Sidebar
```tsx
/* Sidebar con estilo El Granito */
<aside className="sidebar-granito">...</aside>
```

## Formularios

### Inputs
```tsx
/* Input normal */
<input className="input-granito" />

/* Input con error */
<input className="input-granito-error" />

/* Input con éxito */
<input className="input-granito-success" />
```

## Alertas

### Tipos de Alerta
```tsx
/* Alerta de éxito */
<div className="alert-granito-success">Operación exitosa</div>

/* Alerta de advertencia */
<div className="alert-granito-warning">Advertencia importante</div>

/* Alerta informativa */
<div className="alert-granito-info">Información relevante</div>
```

## Animaciones

### Pulse Effect
```tsx
/* Animación pulse con colores El Granito */
<div className="animate-granito-pulse">Elemento con pulse</div>
```

## Ejemplos de Uso

### Hero Section
```tsx
<section className="bg-granito-hero text-white p-12 rounded-lg">
  <h1 className="text-4xl font-bold mb-4">El Granito Finance Hub</h1>
  <p>Tu socio financiero de confianza</p>
</section>
```

### Card de Dashboard
```tsx
<Card className="card-granito-gradient hover-granito-glow">
  <CardHeader>
    <CardTitle className="text-granito-green-700">Saldo Total</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold text-granito-green-800">$1,234,567</p>
  </CardContent>
</Card>
```

### Botón de Acción Principal
```tsx
<Button className="btn-granito-primary hover-granito-glow">
  Realizar Pago
</Button>
```

### Navbar con Logo
```tsx
<nav className="navbar-granito">
  <div className="flex items-center">
    <img src={logo} alt="El Granito" className="h-8 w-8 mr-3" />
    <span className="text-xl font-bold text-granito-gradient">El Granito</span>
  </div>
</nav>
```

## Variables CSS Actualizadas

Las siguientes variables CSS han sido actualizadas para reflejar los colores de El Granito:

```css
:root {
  --background: 0 0% 100%;          /* Fondo blanco */
  --primary: 142 71% 45%;           /* Verde El Granito */
  --secondary: 48 89% 50%;          /* Amarillo El Granito */
  --foreground: 120 100% 10%;       /* Texto verde oscuro */
  /* ... más variables */
}
```

## Consejos de Uso

1. **Verde principal**: Usa `granito-green-600` para botones principales y elementos importantes
2. **Amarillo de acento**: Usa `granito-yellow-500` para resaltar información o botones secundarios
3. **Fondos**: El fondo principal es blanco, usa `granito-green-50` o `bg-granito-soft` para fondos de tarjetas o secciones específicas
4. **Texto**: Usa `granito-green-700` para texto principal y `granito-green-600` para texto secundario
5. **Gradientes**: Usa `bg-granito-hero` para secciones destacadas y `bg-granito-card` para tarjetas

## Modo Oscuro

El tema oscuro ha sido actualizado para mantener la coherencia con los colores de El Granito, usando versiones más brillantes de los colores sobre fondos oscuros.
