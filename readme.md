# Payment Middleware

A Node.js middleware service that integrates external systems (such as EMR systems) with the Financial Institutions' APIs like telebirr payment API.
The service builds SOAP XML requests, sends them to telebirr for push ussd payment request, receives responses, and manages payment transactions.

---

## Overview

This project acts as a **payment gateway middleware** between client applications and the telebirr API. It handles:

* SOAP XML request generation
* Secure payment request submission
* XML response parsing
* Transaction logging
* Integration with a relational database

Typical use case:

Client System → Payment Middleware → Telebirr API

---

## Features

* telebirr SOAP API integration
* XML request generation
* XML response parsing
* REST API endpoints for initiating payments
* Transaction storage in PostgreSQL
* Modular architecture for adding additional payment providers

---

## Technology Stack

* Node.js
* Express.js
* PostgreSQL
* xmlbuilder2 (XML generation)
* xml2js (XML parsing)
* Axios (HTTP client)
* dotenv (environment configuration)
* crypto

---

## Project Structure

```
payment-middleware
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   └── paymentController.js
│   │
│   ├── routes
│   │   └── paymentRoutes.js
│   │
│   ├── services
│   │   └── telebirrService.js
│   │
│   ├── utils
│   │   └── xmlParser.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

Clone the repository:

```
git clone https://github.com/palladium-group/ethiopiaemr-payment-middleware.git
```

Navigate to the project directory:

```
cd ethiopiaemr-payment-middleware
```

Install dependencies:

```
npm install
```

---

## Configuration

Create a `.env` file in the root directory.

Example:

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=paymentmiddleware

TELEBIRR_API_URL="https://telebirr-api-endpoint"
THIRD_PARTY_ID=XXXX
PASSWORD=encodedPassword
RESULT_URL="https://yourdomain.com/telebirr/callback"
INITIATOR_ID=20089001
SECURITY_CREDENTIAL=encryptedCredential
SHORT_CODE=200878001
RECEIVER=20088001
```

---

## Running the Application

Start the development server:

```
npm run dev
```

Start the production server:

```
npm start
```

Server will run on:

```
http://localhost:3000
```

---

## API Endpoints

### Initiate Payment

POST /api/payments

Request Example:

```
{
  "phone": "251911541613",
  "amount": 10
}
```

The middleware will:

1. Build the SOAP XML request
2. Send the request to the Telebirr API
3. Receive and parse the XML response
4. Store the transaction

---

## XML Integration

The middleware generates SOAP XML requests compatible with the Telebirr API.

Example structure:

```
<soapenv:Envelope>
  <soapenv:Body>
    <api:Request>
      ...
    </api:Request>
  </soapenv:Body>
</soapenv:Envelope>
```

---

## Database

The system stores payment records using PostgreSQL.

Example tables:

* payment_provider
* payment_transaction
* payment_request
* payment_callback

---

## Security Considerations

Telebirr integrations typically require:

* Password hashing
* RSA encryption for security credentials
* Timestamp validation
* HTTPS communication

These features should be implemented in production deployments.

---

## Future Improvements

* Transaction status query API
* Webhook callback handler
* Retry and idempotency logic
* Support for multiple payment providers
* Request signing and certificate-based authentication
* Monitoring and logging

---

## Contributing

Contributions are welcome. Please create a pull request or open an issue to propose changes.

---

## License

This project is released under the MIT License.
