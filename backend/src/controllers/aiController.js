const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const recommendTicket = async (req, res) => {
  try {
    const {
      source,
      destination,
      travelDate,
      tickets,
    } = req.body;

    if (!source || !destination || !tickets) {
      return res.status(400).json({
        message: "Source, destination and tickets are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const prompt = `
You are an AI ticket recommendation assistant.

User wants to travel:
Source: ${source}
Destination: ${destination}
Travel Date: ${travelDate || "Not specified"}

Available tickets:
${JSON.stringify(tickets, null, 2)}

Choose the best ticket for the user.

Consider:
- Price
- Duration
- Departure time
- Available seats
- Ticket type

Return a short recommendation in simple English.

Mention:
1. Recommended operator
2. Price
3. Duration
4. A short reason why it is recommended

Do not invent any ticket information.
Only use the data provided above.
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const recommendation = response.text();

    res.status(200).json({
      recommendation,
    });

  } catch (error) {
    console.error(
      "AI recommendation error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to generate AI recommendation",
    });
  }
};

module.exports = {
  recommendTicket,
};