# API Routes Documentation

## Authentication

### Login
**POST /auth/login**
- Description: Authenticate user and get tokens
- Request Body:
  ```json
  {
    "email": "teste@teste.com",
    "password": "123456",
    "tenantDomain": "admin"
  }
  ```
- Response:
  ```json
  {
    "accessToken": "jwt.token.here",
    "refreshToken": "refresh-token-here",
    "userId": "uuid",
    "email": "teste@teste.com",
    "name": "User Name",
    "tenantId": "tenant-uuid",
    "roleId": "role-uuid",
    "permissions": ["create:user", "read:user", "update:user", "delete:user"]
  }
  ```

### Refresh Token
**POST /auth/refresh**
- Description: Refresh access token using refresh token
- Request Body:
  ```json
  {
    "refreshToken": "refresh-token-here"
  }
  ```
- Response: Same as login

## Tenants

### Create Tenant
**POST /tenants**
- Description: Create a new tenant
- Request Body:
  ```json
  {
    "name": "Tenant Name",
    "domain": "tenant-domain",
    "active": true
  }
  ```
- Response: Tenant object

### Get All Tenants
**GET /tenants**
- Description: Get all tenants
- Response: Array of tenant objects

### Get Tenant by ID
**GET /tenants/:id**
- Description: Get a tenant by ID
- Parameters: `id` - Tenant ID
- Response: Tenant object

### Update Tenant
**PUT /tenants/:id**
- Description: Update a tenant
- Parameters: `id` - Tenant ID
- Request Body:
  ```json
  {
    "name": "Updated Tenant Name",
    "active": true
  }
  ```
- Response: Updated tenant object

### Delete Tenant
**DELETE /tenants/:id**
- Description: Delete a tenant
- Parameters: `id` - Tenant ID
- Response: No content (204)

## Users

### Create User
**POST /users**
- Description: Create a new user
- Request Body:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password",
    "roleId": "role-id",
    "tenantId": "tenant-id",
    "active": true
  }
  ```
- Response: User object

### Get All Users
**GET /users**
- Description: Get all users
- Query Parameters:
  - `tenantId` (optional): Filter users by tenant ID
- Response: Array of user objects

### Get User by ID
**GET /users/:id**
- Description: Get a user by ID
- Parameters: `id` - User ID
- Response: User object

### Update User
**PUT /users/:id**
- Description: Update a user
- Parameters: `id` - User ID
- Request Body:
  ```json
  {
    "name": "Updated User Name",
    "email": "user@example.com",
    "roleId": "role-id",
    "active": true
  }
  ```
- Response: Updated user object

### Delete User
**DELETE /users/:id**
- Description: Delete a user
- Parameters: `id` - User ID
- Response: No content (204)

## Vehicles

### Create Vehicle
**POST /vehicles**
- Description: Create a new vehicle
- Request Body:
  ```json
  {
    "plate": "ABC1234",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2021,
    "color": "Black",
    "chassisNumber": "123456789",
    "renavamCode": "12345678901",
    "fuelType": "FLEX",
    "mileage": 10000,
    "status": "AVAILABLE",
    "purchaseDate": "2021-01-01",
    "purchaseValue": 50000,
    "categoryId": "category-id"
  }
  ```
- Response: Vehicle object

### Get Vehicle by ID
**GET /vehicles/:id**
- Description: Get a vehicle by ID
- Parameters: `id` - Vehicle ID
- Response: Vehicle object

### Get All Vehicles
**GET /vehicles**
- Description: List all vehicles with optional filters
- Query Parameters:
  - `categoryId` (optional): Filter by category ID
  - `status` (optional): Filter by status (AVAILABLE, MAINTENANCE, RENTED, INACTIVE)
- Response: Array of vehicle objects

### Update Vehicle
**PUT /vehicles/:id**
- Description: Update a vehicle
- Parameters: `id` - Vehicle ID
- Request Body: Vehicle data to update
- Response: Updated vehicle object

### Delete Vehicle
**DELETE /vehicles/:id**
- Description: Delete a vehicle
- Parameters: `id` - Vehicle ID
- Response: No content (204)

### Upload Vehicle Photos
**POST /vehicles/:id/photos**
- Description: Upload photos for a vehicle
- Parameters: `id` - Vehicle ID
- Request: Multipart form data with photos
- Response: Array of vehicle photo objects

## Customers

### Create Customer
**POST /customers**
- Description: Create a new customer
- Request Body:
  ```json
  {
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "1234567890",
    "document": "12345678901",
    "documentType": "CPF",
    "birthDate": "1990-01-01",
    "type": "INDIVIDUAL",
    "address": {
      "street": "Street",
      "number": "123",
      "complement": "Apt 101",
      "neighborhood": "Neighborhood",
      "city": "City",
      "state": "State",
      "zipCode": "12345-678"
    }
  }
  ```
- Response: Customer object

### Get All Customers
**GET /customers**
- Description: List all customers
- Query Parameters:
  - `type` (optional): Filter by customer type
  - `rating` (optional): Filter by customer rating
  - `active` (optional): Filter by active status
  - `search` (optional): Search term for name, email or document
- Response: Array of customer objects

### Get Customer by ID
**GET /customers/:id**
- Description: Find a customer by ID
- Parameters: `id` - Customer ID
- Response: Customer object

### Update Customer
**PUT /customers/:id**
- Description: Update a customer
- Parameters: `id` - Customer ID
- Request Body: Customer data to update
- Response: Updated customer object

### Delete Customer
**DELETE /customers/:id**
- Description: Delete a customer
- Parameters: `id` - Customer ID
- Response: No content (204)

## Customer Documents

### Create Customer Document
**POST /customers/:customerId/documents**
- Description: Create a new document for a customer
- Parameters: `customerId` - Customer ID
- Request: Multipart form data with document file
- Response: Customer document object

### Get All Customer Documents
**GET /customers/:customerId/documents**
- Description: List all documents for a customer
- Parameters: `customerId` - Customer ID
- Response: Array of customer document objects

### Get Customer Document by ID
**GET /customers/:customerId/documents/:id**
- Description: Find a customer document by ID
- Parameters: 
  - `customerId` - Customer ID
  - `id` - Document ID
- Response: Customer document object

### Verify Customer Document
**PUT /customers/:customerId/documents/:id/verify**
- Description: Verify a customer document
- Parameters:
  - `customerId` - Customer ID
  - `id` - Document ID
- Request Body:
  ```json
  {
    "verified": true,
    "verificationNote": "Document verified successfully"
  }
  ```
- Response: Updated customer document object

### Delete Customer Document
**DELETE /customers/:customerId/documents/:id**
- Description: Delete a customer document
- Parameters:
  - `customerId` - Customer ID
  - `id` - Document ID
- Response: No content (204)

## Rentals

### Calculate Rental
**POST /rentals/calculate**
- Description: Calculate rental price
- Request Body:
  ```json
  {
    "vehicleId": "vehicle-id",
    "startDate": "2023-01-01T10:00:00Z",
    "endDate": "2023-01-03T10:00:00Z"
  }
  ```
- Response: Rental calculation object

### Create Rental
**POST /rentals**
- Description: Create a new rental
- Request Body:
  ```json
  {
    "vehicleId": "vehicle-id",
    "customerId": "customer-id",
    "startDate": "2023-01-01T10:00:00Z",
    "endDate": "2023-01-03T10:00:00Z"
  }
  ```
- Response: Rental object

### Get All Rentals
**GET /rentals**
- Description: List all rentals
- Query Parameters:
  - `status` (optional): Filter by rental status
  - `customerId` (optional): Filter by customer ID
  - `vehicleId` (optional): Filter by vehicle ID
  - `startDate` (optional): Filter by start date
  - `endDate` (optional): Filter by end date
- Response: Array of rental objects

### Get Rental by ID
**GET /rentals/:id**
- Description: Get rental by ID
- Parameters: `id` - Rental ID
- Response: Rental object

### Update Rental Status
**PUT /rentals/:id/status**
- Description: Update rental status
- Parameters: `id` - Rental ID
- Request Body:
  ```json
  {
    "status": "CONFIRMED",
    "observations": "Status updated successfully"
  }
  ```
- Response: Updated rental object

### Complete Rental
**PUT /rentals/:id/complete**
- Description: Complete a rental
- Parameters: `id` - Rental ID
- Request Body:
  ```json
  {
    "actualEndDate": "2023-01-03T12:00:00Z",
    "finalMileage": 10250,
    "observations": "Vehicle returned in good condition"
  }
  ```
- Response: Completed rental object

## Payments

### Create Payment
**POST /payments**
- Description: Create a payment
- Request Body:
  ```json
  {
    "rentalId": "rental-id",
    "amount": 500.00,
    "method": "CREDIT_CARD",
    "status": "PENDING"
  }
  ```
- Response: Payment object

### Get Payment by ID
**GET /payments/:id**
- Description: Get a payment by ID
- Parameters: `id` - Payment ID
- Response: Payment object

### Get All Payments for Rental
**GET /payments**
- Description: List payments for a rental
- Query Parameters:
  - `rentalId` (required): Filter by rental ID
- Response: Array of payment objects

### Refund Payment
**POST /payments/:id/refund**
- Description: Refund a payment
- Parameters: `id` - Payment ID
- Request Body:
  ```json
  {
    "amount": 500.00,
    "reason": "Customer requested refund"
  }
  ```
- Response: Refunded payment object

### Generate Payment Link
**POST /payments/generate-link**
- Description: Generate a payment link
- Request Body:
  ```json
  {
    "rentalId": "rental-id",
    "amount": 500.00
  }
  ```
- Response: Payment link object 