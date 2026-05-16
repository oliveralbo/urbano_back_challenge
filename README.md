# NestJS E-commerce - Challenge Sr Fullstack

Este proyecto es una evolución de un sistema base de e-commerce, transformado de un monolito tradicional hacia un modelo **Event-Driven**.

## 1. Diagnóstico del Diseño Original

Al analizar el repositorio base, se identificaron los siguientes problemas estructurales:

- **Acoplamiento Sincrónico:** El sistema realizaba operaciones lineales (ej. registro -> lógica de negocio). Una falla en un paso secundario podía comprometer la transacción principal.
- **Lógica de Dominio Dispersa:** Las validaciones de estado (como la activación de productos) requerían llamadas manuales y no estaban automatizadas tras cambios en el modelo.
- **Falta de Trazabilidad:** No existía un mecanismo para reaccionar a cambios de estado importantes sin modificar los servicios existentes.
- **Uso Directo de EntityManager:** Dificultaba la implementación de patrones como Repository y complicaba las pruebas unitarias.

## 2. Solución: Arquitectura Orientada a Eventos

Se implementó un modelo basado en eventos para desacoplar el núcleo del negocio de las tareas secundarias.

### Eventos Implementados

1.  **`user.registered`**: Emitido tras el registro exitoso de un usuario. Permite que otros módulos (como Mail o Roles) reaccionen de forma independiente.
2.  **`product.created`**: Al crear un producto, se dispara un flujo de auto-validación.
3.  **`product.activated`**: Notifica cuando un producto ha pasado las validaciones y está listo para la venta.
4.  **`role.assigned`**: Notifica la asignación de un nuevo rol a un usuario, disparando flujos de bienvenida específicos (ej. Welcome Merchant Email).
5.  **`role.unassigned`**: Gestiona la revocación de permisos. Si se quita el rol de **Merchant**, el sistema elimina automáticamente todos los productos asociados a ese vendedor para mantener la integridad del catálogo.

### Decisiones Técnicas Relevantes

- **Desacoplamiento con `EventEmitter2`**: Se utilizó para asegurar que la emisión de eventos sea asíncrona y no bloquee el flujo principal de la API.
- **Listeners Especializados**: Cada evento tiene consumidores dedicados (`ProductListener`, `RoleListener`, `UserListener`) que encapsulan la lógica de respuesta, manteniendo los servicios enfocados únicamente en su responsabilidad primaria.
- **Validación Automática**: El flujo de activación de productos ahora es reactivo; el sistema intenta activar el producto automáticamente al detectar su creación.
- **Integridad en Cascada vía Eventos**: En lugar de usar eliminaciones en cascada a nivel de base de datos (que pueden ser opacas), se utiliza el evento `role.unassigned` para que el módulo de productos limpie el catálogo de forma explícita y trazable cuando un usuario deja de ser vendedor.

## 3. Guía de Inicio rápido

### Requisitos

- Node.js v18+
- Docker y Docker Compose
- PostgreSQL

### Instalación

1.  **Clonar el repositorio**
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Levantar Infraestructura (BD):**
    ```bash
    docker-compose up -d
    ```
4.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` basado en `.env.example`.
5.  **Ejecutar Migraciones y Seeds:**
    ```bash
    npm run migration:run
    npm run seed:run
    ```
6.  **Iniciar la Aplicación:**
    ```bash
    npm run start:dev
    ```

## 4. Estructura del Proyecto

- `src/api`: Módulos de la API (Auth, User, Product, Category).
- `src/database`: Entidades de TypeORM, migraciones y seeders.
- `src/common`: Helpers y servicios compartidos (Mail, Interceptors).
- `src/api/[modulo]/events`: Definición de eventos de dominio.
- `src/api/[modulo]/listeners`: Consumidores de eventos.

## 5. Deployment y Entorno Productivo

Para el despliegue se separó la aplicación en distintas capas, manteniendo desacoplados frontend, backend e infraestructura de base de datos.

### Backend

El backend de NestJS se deployó utilizando **Render** a través de un Dockerfile multi-stage basado en `node:18-alpine`.
Esto permitió:

- Estandarizar el entorno de ejecución.
- Reducir el tamaño final de la imagen.
- Mantener consistencia entre desarrollo local y producción.

El proyecto mantiene soporte local mediante `docker-compose` para levantar PostgreSQL durante el desarrollo.

### Base de Datos

La base de datos PostgreSQL se deployó utilizando **Neon** como proveedor _managed database_.

La estructura de tablas se generó utilizando las migraciones de TypeORM ya incluidas en el proyecto, reutilizando el mismo flujo utilizado en desarrollo local.

### Frontend

El frontend realizado con **React + Vite** fue deployado en **Vercel**, utilizando variables de entorno para desacoplar la URL del backend según el entorno.

### Variables de Entorno y CORS

La aplicación fue adaptada para soportar:

- Configuración dinámica mediante variables de entorno.
- Conexión segura a PostgreSQL mediante SSL.
- Configuración de CORS separada entre entorno local y producción.

### Flujo General de Arquitectura

```text
Frontend (Vercel)
        ↓
Backend NestJS Dockerizado (Render)
        ↓
PostgreSQL Managed (Neon)
```

## 6. Repositorio FrontEnd

https://github.com/oliveralbo/urbano-ecommerce
