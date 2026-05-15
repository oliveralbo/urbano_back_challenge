# NestJS E-commerce - Challenge Sr Fullstack

Este proyecto es una evolución de un sistema base de e-commerce, transformado de un monolito tradicional hacia un modelo **Event-Driven**.

## 1. Diagnóstico del Diseño Original
Al analizar el repositorio base, se identificaron los siguientes problemas estructurales:
*   **Acoplamiento Sincrónico:** El sistema realizaba operaciones lineales (ej. registro -> lógica de negocio). Una falla en un paso secundario podía comprometer la transacción principal.
*   **Lógica de Dominio Dispersa:** Las validaciones de estado (como la activación de productos) requerían llamadas manuales y no estaban automatizadas tras cambios en el modelo.
*   **Falta de Trazabilidad:** No existía un mecanismo para reaccionar a cambios de estado importantes sin modificar los servicios existentes.
*   **Uso Directo de EntityManager:** Dificultaba la implementación de patrones como Repository y complicaba las pruebas unitarias.

## 2. Solución: Arquitectura Orientada a Eventos
Se implementó un modelo basado en eventos para desacoplar el núcleo del negocio de las tareas secundarias.

### Eventos Implementados
1.  **`user.registered`**: Emitido tras el registro exitoso de un usuario. Permite que otros módulos (como Mail o Roles) reaccionen de forma independiente.
2.  **`product.created`**: Al crear un producto, se dispara un flujo de auto-validación.
3.  **`product.activated`**: Notifica cuando un producto ha pasado las validaciones y está listo para la venta.

### Decisiones Técnicas Relevantes
*   **Desacoplamiento con `EventEmitter2`**: Se utilizó para asegurar que la emisión de eventos sea asíncrona y no bloquee el flujo principal de la API.
*   **Listeners Especializados**: Cada evento tiene consumidores dedicados (`ProductListener`, `UserListener`) que encapsulan la lógica de respuesta, manteniendo los servicios (`ProductService`, `AuthService`) enfocados únicamente en su responsabilidad primaria.
*   **Validación Automática**: El flujo de activación de productos ahora es reactivo; el sistema intenta activar el producto automáticamente al detectar su creación.

## 3. Guía de Inicio rápido

### Requisitos
*   Node.js v18+
*   Docker y Docker Compose
*   PostgreSQL

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
*   `src/api`: Módulos de la API (Auth, User, Product, Category).
*   `src/database`: Entidades de TypeORM, migraciones y seeders.
*   `src/common`: Helpers y servicios compartidos (Mail, Interceptors).
*   `src/api/[modulo]/events`: Definición de eventos de dominio.
*   `src/api/[modulo]/listeners`: Consumidores de eventos.
