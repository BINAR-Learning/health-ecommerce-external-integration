const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Health E-Commerce API",
      version: "1.0.0",
      description: "Complete API documentation for Health E-Commerce with AI Integration, Kemenkes API, and Midtrans Payment Gateway",
      contact: {
        name: "API Support",
        email: "support@healthecommerce.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.healthecommerce.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login/register endpoint",
        },
      },
      schemas: {
        // Product Schemas
        Product: {
          type: "object",
          required: ["name", "category", "price", "stock"],
          properties: {
            _id: {
              type: "string",
              description: "Product unique identifier",
              example: "69058b83cc8332efdabe01e2",
            },
            name: {
              type: "string",
              description: "Product name",
              example: "Vitamin C 1000mg",
            },
            category: {
              type: "string",
              enum: ["Vitamin", "Supplement", "Medical Equipment", "Medicine", "Other"],
              description: "Product category",
              example: "Vitamin",
            },
            price: {
              type: "number",
              minimum: 0,
              description: "Product price in IDR",
              example: 85000,
            },
            stock: {
              type: "number",
              minimum: 0,
              description: "Available stock quantity",
              example: 50,
            },
            description: {
              type: "string",
              description: "Product description",
              example: "Suplemen vitamin C untuk meningkatkan daya tahan tubuh",
            },
            manufacturer: {
              type: "string",
              description: "Product manufacturer",
              example: "PT Sehat Sejahtera",
            },
            kemenkesId: {
              type: "string",
              description: "Kemenkes API integration ID",
              example: "KEM-123456",
            },
            isActive: {
              type: "boolean",
              description: "Product availability status",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Product creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Product last update timestamp",
            },
          },
        },
        ProductCreate: {
          type: "object",
          required: ["name", "category", "price", "stock"],
          properties: {
            name: {
              type: "string",
              description: "Product name",
              example: "Vitamin C 1000mg",
            },
            category: {
              type: "string",
              enum: ["Vitamin", "Supplement", "Medical Equipment", "Medicine", "Other"],
              example: "Vitamin",
            },
            price: {
              type: "number",
              minimum: 0,
              example: 85000,
            },
            stock: {
              type: "number",
              minimum: 0,
              example: 50,
            },
            description: {
              type: "string",
              example: "Suplemen vitamin C untuk meningkatkan daya tahan tubuh",
            },
            manufacturer: {
              type: "string",
              example: "PT Sehat Sejahtera",
            },
            kemenkesId: {
              type: "string",
              example: "KEM-123456",
            },
            isActive: {
              type: "boolean",
              default: true,
            },
          },
        },
        ProductUpdate: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            category: {
              type: "string",
              enum: ["Vitamin", "Supplement", "Medical Equipment", "Medicine", "Other"],
            },
            price: {
              type: "number",
              minimum: 0,
            },
            stock: {
              type: "number",
              minimum: 0,
            },
            description: {
              type: "string",
            },
            manufacturer: {
              type: "string",
            },
            isActive: {
              type: "boolean",
            },
          },
        },
        // User Schemas
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "69058b83cc8332efdabe01e2",
            },
            name: {
              type: "string",
              maxLength: 50,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
            phone: {
              type: "string",
              example: "081234567890",
            },
            address: {
              type: "string",
              example: "Jl. Merdeka No. 123, Jakarta",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        UserRegister: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              maxLength: 50,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              format: "password",
              example: "Password123!",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
              example: "user",
            },
            phone: {
              type: "string",
              example: "081234567890",
            },
            address: {
              type: "string",
              example: "Jl. Merdeka No. 123, Jakarta",
            },
          },
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password123!",
            },
          },
        },
        // Auth Response
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login berhasil",
            },
            token: {
              type: "string",
              description: "JWT token for authentication",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        // AI Schemas
        AIRequest: {
          type: "object",
          required: ["question"],
          properties: {
            question: {
              type: "string",
              maxLength: 500,
              description: "Health-related question",
              example: "Vitamin apa yang bagus untuk imun tubuh?",
            },
          },
        },
        AIResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            answer: {
              type: "string",
              description: "AI-generated health recommendation",
              example: "Untuk meningkatkan daya tahan tubuh, saya rekomendasikan...",
            },
            recommendedProducts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: {
                    type: "string",
                    example: "69058b83cc8332efdabe01e2",
                  },
                  name: {
                    type: "string",
                    example: "Vitamin C 1000mg",
                  },
                  category: {
                    type: "string",
                    example: "Vitamin",
                  },
                  price: {
                    type: "number",
                    example: 85000,
                  },
                },
              },
            },
          },
        },
        // Payment Schemas
        PaymentRequest: {
          type: "object",
          required: ["items"],
          properties: {
            orderId: {
              type: "string",
              description: "Unique order identifier",
              example: "ORDER-1234567890",
            },
            customerEmail: {
              type: "string",
              format: "email",
              example: "customer@example.com",
            },
            customerName: {
              type: "string",
              example: "John Doe",
            },
            items: {
              type: "array",
              description: "List of items to purchase",
              items: {
                type: "object",
                required: ["id", "name", "price", "quantity"],
                properties: {
                  id: {
                    type: "string",
                    example: "69058b83cc8332efdabe01e2",
                  },
                  name: {
                    type: "string",
                    example: "Vitamin C 1000mg",
                  },
                  price: {
                    type: "number",
                    example: 85000,
                  },
                  quantity: {
                    type: "number",
                    example: 2,
                  },
                },
              },
            },
          },
        },
        PaymentResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            orderId: {
              type: "string",
              example: "ORDER-1234567890-abc",
            },
            paymentToken: {
              type: "string",
              description: "Midtrans payment token",
              example: "66e4fa55-fdac-4ef9-91b5-733b97d1b862",
            },
            redirectUrl: {
              type: "string",
              format: "uri",
              description: "Payment page URL",
              example: "https://app.sandbox.midtrans.com/snap/v2/vtweb/...",
            },
          },
        },
        // Kemenkes Schemas
        KemenkesMedication: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "KEM-123456",
            },
            name: {
              type: "string",
              example: "Paracetamol 500mg",
            },
            manufacturer: {
              type: "string",
              example: "PT Kimia Farma",
            },
            description: {
              type: "string",
              example: "Obat pereda nyeri dan penurun demam",
            },
          },
        },
        // Error Schemas
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message description",
            },
            error: {
              type: "string",
              description: "Detailed error (development only)",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoint",
      },
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Products",
        description: "Product management endpoints",
      },
      {
        name: "AI",
        description: "AI chatbot for health recommendations",
      },
      {
        name: "Kemenkes",
        description: "Kemenkes API integration",
      },
      {
        name: "Payment",
        description: "Midtrans payment gateway integration",
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

