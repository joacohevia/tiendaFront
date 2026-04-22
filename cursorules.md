# .cursorules

## Proyecto: Tienda Deportiva Angular

### 📌 Descripción

Aplicación frontend desarrollada en Angular que consume una API REST para gestionar una tienda deportiva (productos, usuarios, autenticación, etc.).

---

## 🧱 Stack Tecnológico

* Frontend: Angular 19 + TypeScript
* Backend API: http://localhost:3000
* Comunicación: API REST (HTTP)
* Estilos: SCSS (preferentemente modular por componente)

---


---

## 🔌 Comunicación con la API

* Utilizar `HttpClient` para todas las peticiones HTTP
* Centralizar las URLs en un archivo de entorno (`environment.ts`)
* Seguir convenciones REST:

  * GET → obtener datos
  * POST → crear
  * PUT/PATCH → actualizar
  * DELETE → eliminar

Ejemplo de endpoint:

```
GET http://localhost:3000/api/productos
```

---

## 🧠 Buenas Prácticas en Angular

### 🔹 Separación de responsabilidades

* Componentes → solo lógica de UI
* Servicios → lógica de negocio y llamadas a la API

---

### 🔹 Uso de servicios

* Crear un servicio por recurso (ej: `ProductoService`, `AuthService`)
* No hacer llamadas HTTP directamente en componentes

---

### 🔹 Tipado fuerte

* Definir interfaces en `models/`

```ts
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}
```

---

### 🔹 Componentes reutilizables

* Ubicar en `shared/`
* Evitar duplicar código (ej: botones, cards, navbar)

---

### 🔹 Feature-based architecture

* Agrupar por funcionalidad:

  * `productos/`
  * `auth/`
  * `usuarios/`

Cada feature puede tener:

```
- components/
- services/
- pages/
```

---

### 🔹 Manejo de estado simple

* Usar servicios con `BehaviorSubject` o `signals` (Angular moderno)
* Evitar lógica compleja en múltiples componentes

---

### 🔹 Interceptores HTTP

* Usar interceptores para:

  * agregar token JWT
  * manejar errores globales

---

### 🔹 Routing

* Definir rutas claras:

```
/productos
/productos/:id
/login
```

* Usar lazy loading para módulos grandes

---

### 🔹 Manejo de errores

* Capturar errores en servicios (`catchError`)
* Mostrar feedback al usuario (alerts, mensajes)

---

### 🔹 Seguridad

* No hardcodear URLs ni tokens
* Usar `environment.ts`
* Implementar guards para rutas protegidas

---

## 🎯 Objetivo del Proyecto

* Consumir correctamente la API REST
* Mostrar productos
* Permitir autenticación de usuarios
* Gestionar operaciones CRUD desde el frontend

---

## 🚀 Reglas Generales

* Mantener código limpio y modular
* Evitar lógica duplicada
* Priorizar reutilización de componentes
* Seguir convenciones de Angular
* Pensar siempre en escalabilidad

---

## ⚠️ Notas

* Este proyecto es SOLO frontend
* Toda la lógica de datos depende de la API
* No manejar lógica de base de datos en el frontend
