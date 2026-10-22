
import "dotenv/config";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { GoogleGenAI, Type } from "@google/genai";

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
const PORT = 3001;

app.use(express.json());

// Allow the local React website to call this server.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin === "http://localhost:5173" ||
    origin === "http://127.0.0.1:5173"
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Shared sample charger data.
const chargers = [
  {
    id: "CH001",
    name: "Green Charge Hub",
    location: "Kothrud, Pune",
    type: "car-and-two-wheeler",
    pricePerKwh: 18,
    available: true,
    hostContact: "host1@example.com",
  },
  {
    id: "CH002",
    name: "The Daily Grind",
    location: "Baner, Pune",
    type: "car",
    pricePerKwh: 22,
    available: true,
    hostContact: "host2@example.com",
  },
  {
    id: "CH003",
    name: "City Power Point",
    location: "Aundh, Pune",
    type: "two-wheeler",
    pricePerKwh: 15,
    available: false,
    hostContact: "host3@example.com",
  },
];

// Temporary in-memory bookings.
const bookings = [];

function createBooking({
  chargerId,
  customerName,
  customerEmail,
  customerPhone,
}) {
  const charger = chargers.find((item) => item.id === chargerId);

  if (!charger) {
    return { error: "Charger not found.", status: 404 };
  }

  if (!charger.available) {
    return { error: "This charger is unavailable.", status: 400 };
  }

  if (
    typeof customerName !== "string" ||
    customerName.trim().length < 2 ||
    typeof customerEmail !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) ||
    typeof customerPhone !== "string" ||
    !/^\d{10}$/.test(customerPhone.trim())
  ) {
    return {
      error: "Enter a valid name, email, and 10-digit phone number.",
      status: 400,
    };
  }

  const booking = {
    bookingId: `BK${String(bookings.length + 1).padStart(4, "0")}`,
    chargerId,
    chargerName: charger.name,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim(),
    customerPhone: customerPhone.trim(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);

  return { booking };
}

// Website booking API.
app.post("/api/bookings", (req, res) => {
  const result = createBooking(req.body);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(201).json({
    message: "Booking confirmed!",
    booking: result.booking,
  });
});

// Optional endpoint to inspect test bookings.
app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});

// MCP tools for assistant integrations.
function createMcpServer() {
  const server = new McpServer({
    name: "whatacharger",
    version: "1.0.0",
  });

  server.tool(
    "findChargers",
    "Find EV charging locations by area, price, and vehicle type.",
    {
      location: z.string().optional(),
      maxPricePerKwh: z.number().positive().optional(),
      vehicleType: z.enum(["car", "two-wheeler", "both"]).optional(),
    },
    async ({ location, maxPricePerKwh, vehicleType }) => {
      const results = chargers.filter((charger) => {
        const matchesLocation =
          !location ||
          charger.location.toLowerCase().includes(location.toLowerCase());

        const matchesPrice =
          maxPricePerKwh === undefined ||
          charger.pricePerKwh <= maxPricePerKwh;

        const matchesVehicle =
          !vehicleType ||
          vehicleType === "both" ||
          charger.type === "car-and-two-wheeler" ||
          charger.type === vehicleType;

        return matchesLocation && matchesPrice && matchesVehicle;
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              results.map(({ hostContact: _hostContact, ...charger }) => charger),
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "checkAvailability",
    "Check whether a charger is available.",
    { chargerId: z.string() },
    async ({ chargerId }) => {
      const charger = chargers.find((item) => item.id === chargerId);

      return {
        content: [
          {
            type: "text",
            text: charger
              ? JSON.stringify({
                  chargerId: charger.id,
                  name: charger.name,
                  available: charger.available,
                })
              : `Charger ${chargerId} was not found.`,
          },
        ],
      };
    }
  );

  server.tool(
    "getHostContact",
    "Retrieve the contact details supplied for a charger host.",
    { chargerId: z.string() },
    async ({ chargerId }) => {
      const charger = chargers.find((item) => item.id === chargerId);

      return {
        content: [
          {
            type: "text",
            text: charger
              ? JSON.stringify({
                  chargerId: charger.id,
                  hostContact: charger.hostContact,
                })
              : `Charger ${chargerId} was not found.`,
          },
        ],
      };
    }
  );

  server.tool(
    "createBooking",
    "Create a test booking for an available charger.",
    {
      chargerId: z.string(),
      customerName: z.string().min(2),
      customerEmail: z.string().email(),
      customerPhone: z.string().regex(/^\d{10}$/),
    },
    async (input) => {
      const result = createBooking(input);

      if (result.error) {
        return {
          isError: true,
          content: [{ type: "text", text: result.error }],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.booking, null, 2),
          },
        ],
      };
    }
  );

  return server;
}

// Stateless Streamable HTTP MCP endpoint.
app.post("/mcp", async (req, res) => {
  const server = createMcpServer();

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request failed:", error);

    if (!res.headersSent) {
      res.status(500).json({ error: "Internal MCP server error" });
    }
  }
});

app.get("/mcp", (_req, res) => {
  res.status(405).set("Allow", "POST").send("Use POST for stateless MCP requests.");
});

app.delete("/mcp", (_req, res) => {
  res.status(405).set("Allow", "POST").send("This stateless endpoint has no session to delete.");
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "WhatACharger MCP Server",
  });
});

app.listen(PORT, () => {
  console.log(`WhatACharger server running at http://localhost:${PORT}`);
  console.log(`Website booking API: http://localhost:${PORT}/api/bookings`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Health check: http://localhost:${PORT}/health`);

  
const assistantAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/assistant", async (req, res) => {
  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  const confirmBooking = req.body?.confirmBooking === true;

  if (!message) {
    return res.status(400).json({
      error: "Please enter a message.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Gemini API key is not configured.",
    });
  }

  const mcpClient = new Client({
    name: "whatacharger-assistant",
    version: "1.0.0",
  });

  let connected = false;

  try {
    const transport = new StreamableHTTPClientTransport(
      new URL("http://localhost:3001/mcp")
    );

    await mcpClient.connect(transport);
    connected = true;

    const functionDeclarations = [
      {
        name: "findChargers",
        description:
          "Find chargers using location, maximum price per kWh, and vehicle type.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
            maxPricePerKwh: { type: Type.NUMBER },
            vehicleType: {
              type: Type.STRING,
              enum: ["car", "two-wheeler", "both"],
            },
          },
        },
      },
      {
        name: "checkAvailability",
        description: "Check the current availability of a charger by ID.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            chargerId: { type: Type.STRING },
          },
          required: ["chargerId"],
        },
      },
      {
        name: "getHostContact",
        description: "Get the contact details for a charger host.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            chargerId: { type: Type.STRING },
          },
          required: ["chargerId"],
        },
      },
      ...(confirmBooking
        ? [
            {
              name: "createBooking",
              description:
                "Create a booking only after the user explicitly confirms and supplies all required customer details.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  chargerId: { type: Type.STRING },
                  customerName: { type: Type.STRING },
                  customerEmail: { type: Type.STRING },
                  customerPhone: { type: Type.STRING },
                },
                required: [
                  "chargerId",
                  "customerName",
                  "customerEmail",
                  "customerPhone",
                ],
              },
            },
          ]
        : []),
    ];

    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const systemInstruction = `
You are WhatACharger, a helpful EV charging assistant.
Understand natural-language requests and use the supplied tools
to find chargers, check availability, or retrieve host contact details.
Use tool results as the source of truth. Never invent charger locations,
prices, availability, contact details, or booking IDs.
If no results are returned, say so honestly.
For booking requests, ask for the charger, customer name, email and
10-digit phone number when missing. Summarize the booking and ask the
user to confirm before proceeding. Never claim a booking succeeded
unless createBooking returns a successful result.
Be concise, friendly, and useful to a stranded EV driver.
`;

    for (let attempt = 0; attempt < 6; attempt++) {
      const response = await assistantAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations }],
        },
      });

      const modelContent = response.candidates?.[0]?.content;

      if (!modelContent) {
        return res.status(502).json({
          error: "The assistant did not return a response. Please try again.",
        });
      }

      contents.push(modelContent);

      const functionCalls = (modelContent.parts || [])
        .filter((part) => part.functionCall)
        .map((part) => part.functionCall);

      if (functionCalls.length === 0) {
        return res.json({
          reply:
            response.text ||
            "I couldn't prepare a response. Please try again.",
        });
      }

      const functionResponseParts = [];

      for (const call of functionCalls) {
        if (
          call.name === "createBooking" &&
          !confirmBooking
        ) {
          functionResponseParts.push({
            functionResponse: {
              name: call.name,
              response: {
                error:
                  "Booking requires explicit confirmation from the user.",
              },
            },
          });
          continue;
        }

        const toolResult = await mcpClient.callTool({
          name: call.name,
          arguments: call.args || {},
        });

        functionResponseParts.push({
          functionResponse: {
            name: call.name,
            response: { result: toolResult },
          },
        });
      }

      contents.push({
        role: "user",
        parts: functionResponseParts,
      });
    }

    return res.json({
      reply: "I reached the limit for this request. Please try a simpler question.",
    });
  } catch (error) {
    console.error("WhatACharger assistant error:", error.message);

    return res.status(500).json({
      error:
        "The assistant could not complete your request. Check that the MCP server and Gemini API are working.",
    });
  } finally {
    if (connected) {
      try {
        await mcpClient.close();
      } catch (error) {
        console.error("MCP client close error:", error.message);
      }
    }
  }
});

});
