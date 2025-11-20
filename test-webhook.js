// Test script to send a message to the secure chatbot API endpoint

async function testWebhook() {
  // Use the local API endpoint which adds API key authentication
  const apiUrl = "http://localhost:3000/api/chatbot";
  // Or use your production domain:
  // const apiUrl = "https://akheelkappoor.me/api/chatbot";

  const payload = {
    message: "Hello! This is a test message from the chatbot.",
    timestamp: new Date().toISOString(),
    sessionId: `test-session-${Date.now()}`
  };

  console.log("Sending message to secure API endpoint...");
  console.log("URL:", apiUrl);
  console.log("Payload:", JSON.stringify(payload, null, 2));
  console.log("\n---\n");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", response.status, response.statusText);

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n✅ SUCCESS! Webhook is working!");
      console.log("Bot response:", data.response || data.message || data);
    } else {
      console.log("\n❌ FAILED! Webhook returned an error.");
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("The webhook might not be activated or there's a connection issue.");
  }
}

testWebhook();
