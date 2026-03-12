const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export async function handler(event) {

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    const API_KEY = process.env.GROQ_API_KEY;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are DialBot, a friendly and helpful AI assistant." },
          ...history,
          { role: "user", content: message }
        ],
        max_tokens: 512,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: data.error?.message || "Groq error" })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
}