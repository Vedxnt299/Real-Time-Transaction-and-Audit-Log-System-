# Assignment 2 - Real Time Transaction and Audit Log System

## Project Overview

This project implements a Real-Time Transaction and Audit Log System for a peer-to-peer (P2P) lending use case. It simulates secure fund transfers between users while maintaining a persistent audit trail of all transactions.

The primary objective of this assignment is to demonstrate:
- Real-time transaction processing with strong database consistency
- Accurate audit logging of all financial transactions
- Secure API design for sensitive operations
- Clear separation of concerns across controller, service, and persistence layers
- End-to-end integration between backend services and a frontend application

The system allows users to:
- View all registered users along with their current balances
- Perform authenticated fund transfers between users
- View a complete transaction history that serves as an audit log

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Data JPA (Hibernate)
- Spring Security (Basic Authentication)
- PostgreSQL

### Frontend
- React (JavaScript)
- Fetch API for HTTP communication

### Tools & Utilities
- Git & GitHub for version control
- Postman for API testing
- IntelliJ IDEA for backend development
- pgAdmin for database inspection

## System Architecture

![System Architecture Diagram](images/architecture.png)

The above diagram represents the high-level architecture of the Real-Time Transaction and Audit Log System.

- The React frontend communicates with the Spring Boot backend via REST APIs.
- The backend follows a layered architecture (Controller, Service, Repository).
- Transaction creation APIs are secured using Basic Authentication.
- All transactions are persistently stored in PostgreSQL and act as an immutable audit log.

### NOTE - Screenshots of the application can be found in the [Screenshots](#screenshots) section below.

## Features Implemented

- User creation and retrieval via REST APIs
- Balance management per user
- Secure fund transfer between users
- Atomic transaction handling using @Transactional
- Persistent audit logging with sender, receiver, amount, status, and timestamp
- User-specific transaction history (sender or receiver)
- Global transaction history across all users
- Pagination support for transaction logs
- DTO-based response mapping for API safety
- Real-time UI refresh after successful operations
- Centralized exception handling and validation


## Security Design

Basic authentication has been implemented using Spring Security.

- The fund transfer endpoint (`POST /api/transfer`) is protected and requires authentication
- Read-only endpoints (user listing and transaction history) are publicly accessible for demo purposes
- In-memory users are configured for simplicity in this assignment

This approach demonstrates secure API access while keeping the setup lightweight and easy to test.


## API Documentation

### User APIs
- `GET /api/users`  
  Retrieves the list of all users and their balances

### Transaction APIs
- `POST /api/transfer`  
  Transfers funds from one user to another  
  **Query Params**: senderId, receiverId, amount  
  **Authentication**: Required (Basic Auth)

- `GET /api/users/{userId}/transactions`  
  Retrieves transactions where the user is either sender or receiver

- `GET /api/transactions/all`  
  Retrieves all transactions across all users (paginated)



## Database Schema

### Users Table
- id (Primary Key)
- name
- balance

### Transactions Table
- id (Primary Key)
- sender_id (Foreign Key → Users)
- receiver_id (Foreign Key → Users)
- amount
- status
- timestamp

## Setup and Run Instructions

This section provides step-by-step instructions to set up and run both the backend and frontend components of the application on a local machine.

---

## Prerequisites

Ensure the following software is installed on your system:

- Java JDK 17
- PostgreSQL (with pgAdmin)
- Node.js (v18 or above) and npm
- Git

---

## Backend Setup (Spring Boot)

### 1. Clone the Repository

```
git clone https://github.com/Vedxnt299/Real-Time-Transaction-and-Audit-Log-System-.git
cd transactionservice
```

### 2. Create PostgreSQL Database
Open pgAdmin and create a new database with the name:
p2p_db

### 3. Configure Database Connection

Update the `application.properties` file with the following values:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/p2p_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```
### 4. Start the Backend Server

Run the Spring Boot application using:

```
./mvnw spring-boot:run
```


---

## **Backend Security (Basic Authentication)**

```
The money transfer API is secured using HTTP Basic Authentication.
- Secured Endpoint:
- Demo Credentials:
    Username: user
    Password: user123

> Note: Security is intentionally kept simple for demonstration purposes and can be extended to JWT or OAuth-based authentication.
```
## Frontend Setup (React)

### 1. Navigate to the Frontend Directory

`cd p2p-frontend`

### 2. Install Dependencies 
`npm install`

### 3. Start React Application 
`npm start`

---

## **Application Access Summary**

```
| Component              | URL / Name            |
|------------------------|-----------------------|
| React Frontend         | http://localhost:3000 |
| Spring Boot Backend    | http://localhost:8080 |
| PostgreSQL Database    | p2p_db                |
```

## AI Tool Usage Log 

### AI-Assisted Development Overview

AI tools were used during the development of this project to improve productivity, reduce boilerplate effort, and assist with debugging and documentation. All core business logic, design decisions, and final implementations were reviewed and validated manually.

### AI-Assisted Tasks

- Assistance in structuring the Spring Boot project using a layered architecture
- Generation of boilerplate code for controllers, services, and repositories
- Debugging support for Spring Security configuration and CORS-related issues
- Suggestions for improving error handling and validation logic
- Assistance in drafting and structuring the project README documentation
- Support in designing the system architecture diagram

### AI Tools Used

- **ChatGPT** – for backend development guidance, debugging assistance, and documentation support
- **Gemini** – for generating the system architecture diagram

### Effectiveness Score

**Score: 4 / 5**

AI tools significantly accelerated development by reducing setup time and assisting with configuration and documentation. However, core logic, testing, and final integration were performed manually to ensure correctness and reliability.

## Future Improvements

- Role-based access control (Admin vs User)
- JWT-based authentication instead of Basic Auth
- Advanced filtering and sorting for audit logs
- Export audit logs as CSV or PDF
- Dockerized deployment for production readiness


## Screenshots

The following screenshots demonstrate the core functionality and user experience of the Real-Time Transaction and Audit Log System.

### User List and Balances
Displays all registered users along with their current account balances.

![Users List](images/users-list.png)

---

### Add New User
UI form to create a new user with name, email, and initial balance.

![Add User](images/add-user.png)

---

### Fund Transfer
Secure money transfer between users with real-time balance updates.

![Transfer Money](images/transfer-success.png)

---

### Audit Logs – All Users
Complete transaction audit log showing transfers across all users.

![Audit Logs - All Users](images/audit-all.png)

---

### Audit Logs – User Specific
Filtered transaction history for a selected user.

![Audit Logs - User Specific](images/audit-filtered.png)

---
## Upcoming Enhancements

###  JWT Authentication Enhancement 

A new feature branch **`jwt-auth-enhancement`** has been created to enhance the security of the application without affecting the stable release.

### What’s added in this branch:
- JWT-based authentication using Spring Security
- User **Signup** and **Login** APIs
- Secure token-based access to protected endpoints
- Stateless authentication (no sessions)
- React frontend updated to:
  - Handle login & signup
  - Store JWT securely
  - Attach token to API requests
  - Restrict access to authenticated users only

### Why this approach?
- Keeps `main` branch stable (v1.0.0)
- Demonstrates real-world feature development using Git branches
- Allows incremental enhancements without breaking production code

>  This enhancement is currently available on the `jwt-auth-enhancement` branch and is not yet merged into `main`.

---




