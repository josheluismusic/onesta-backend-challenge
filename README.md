# onesta-backend-challenge

## 1. Challeng description

### Construir una pequeña API en TypeScript, usando SQLite que permita agregar:

- Frutas y sus distintos tipos de Variedades.
- Cosechas.
- Agricultores y sus distintos Campos.
- Clientes.

También debe incluir una ruta que al enviarle un CSV lo lea y cargue su data dentro de la DDBB.

- El mail debe ser único dentro de los agricultores.
- El mail debe ser único dentro de los clientes.
- La combinación Nombre Ubicación de los campos debe ser única.
- El nombre de la fruta debe ser única.
- La combinación fruta variedad debe ser única.

### Se valorara:

- Orden de código.
- Orden de commits.
- Validaciones de schema.
- Separación de concerns.
- Manejo de errores.

### Nice to Do:

- Usar una arquitectura de DDD.

## 2. Tech stack

- Node.js
- NestJS (Framework para Node.js)
- TypeORM (ORM para TypeScript y JavaScript)
- SQLite (Base de datos)
- TypeScript
- Jest (Framework de pruebas)

## 3. Code Architecture

La arquitectura del proyecto sigue los principios de la arquitectura hexagonal y Domain-Driven Design (DDD), proporcionando una separación clara de las responsabilidades, facilitando la escalabilidad y el mantenimiento del código.

### Componentes de la Arquitectura
**Adapters**: Los adaptadores actúan como intermediarios entre el dominio y las capas externas (API, bases de datos, etc.). Los adaptadores se dividen en diferentes tipos:

- Clients (u otros): Adaptadores que manejan la comunicación con servicios externos.
- HTTP: Adaptadores que manejan las solicitudes HTTP entrantes.
- Persistence: Adaptadores que manejan la persistencia de datos en la base de datos.

**Application**: Esta capa contiene los casos de uso y la lógica de aplicación. Define los puertos de entrada y salida para interactuar con los adaptadores.

- Ports: Interfaces que definen los contratos para los adaptadores.
- In: Puertos de entrada utilizados por los controladores para ejecutar los casos de uso.
- Out: Puertos de salida utilizados por los servicios para interactuar con los adaptadores de persistencia.
- Services: Implementaciones de los casos de uso que contienen la lógica de negocio específica.

**Domain**: Esta capa contiene las entidades del dominio, modelos y tipos. Representa el núcleo del negocio y es independiente de las capas externas.

- Models: Clases que representan las entidades del dominio.
- Types: Definiciones de tipos y enumeraciones utilizadas en el dominio.


## 4. Run tests



## 5. How to run with docker



## 6. How to run with local Node.js environment


## 7. Next challenges

- Implementar autenticación y autorización.
- Implementar Swagger para documentar la API.
- Implementar pruebas de integración
- Implementar pruebas de aceptación (e2e)