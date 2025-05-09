// server/api/ai-chat.post.js
import { OpenAI } from "openai";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
    });

    const body = await readBody(event);
    const { messages, property, threadId } = body;

    // Get the last user message
    const lastUserMessage = messages.findLast(m => m.role === 'user');
    
    if (!lastUserMessage) {
      return {
        status: "error",
        message: "No user message found."
      };
    }

    // Create or retrieve thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      // Create a new thread with property information as the first message
      const propertyContext = createPropertyContext(property);
      thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: `Here is the property information I'm looking at: ${propertyContext}`,
          },
        ],
      });
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: lastUserMessage.content,
    });

    // Run the assistant on the thread
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_CaIzxIdsJrvtLjicLpKhZny0",
    });

    // Poll for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    // Wait for the run to complete (with a timeout)
    const startTime = Date.now();
    const timeoutMs = 30000; // 30 seconds timeout
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed" && 
           runStatus.status !== "cancelled" && runStatus.status !== "expired") {
      
      // Check for timeout
      if (Date.now() - startTime > timeoutMs) {
        return {
          status: "error",
          message: "Request timed out. Please try again.",
          threadId: thread.id
        };
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    if (runStatus.status !== "completed") {
      return {
        status: "error",
        message: `Assistant run failed with status: ${runStatus.status}`,
        threadId: thread.id
      };
    }

    // Get the latest messages from the thread
    const messagesResponse = await openai.beta.threads.messages.list(thread.id, {
      limit: 1,
      order: "desc",
    });

    const latestMessage = messagesResponse.data[0];

    return {
      message: {
        role: "assistant",
        content: latestMessage.content[0].text.value,
      },
      status: "success",
      threadId: thread.id
    };
  } catch (error) {
    console.error("AI Chat API Error:", error);
    return {
      status: "error",
      message: "Failed to get a response from the AI.",
      error: error.message
    };
  }
});

// Helper function to format property information
function createPropertyContext(property) {
  if (!property) return "No property information available.";
  
  const zillow = property.zillow || {};
  const propertyInfo = property.propertyInfo || {};
  const address = propertyInfo.address?.label || "Unknown address";
  
  return `
    Property Address: ${address}
    Price: ${zillow.price || propertyInfo.price || "Unknown"}
    Bedrooms: ${zillow.bedrooms || propertyInfo.bedrooms || "Unknown"}
    Bathrooms: ${zillow.bathrooms || propertyInfo.bathrooms || "Unknown"}
    Square Feet: ${zillow.livingArea || propertyInfo.squareFootage || "Unknown"}
    Year Built: ${zillow.yearBuilt || propertyInfo.yearBuilt || "Unknown"}
    Property Type: ${zillow.homeType || propertyInfo.propertyType || "Unknown"}
    Description: ${zillow.description || propertyInfo.description || "No description available."}
    Neighborhood: ${zillow.neightborhood || propertyInfo.neighborhood || "Unknown"}
    Lot Size: ${zillow.lotAreaValue || propertyInfo.lotSize || "Unknown"}
    Zoning: ${propertyInfo.zoning || "Unknown"}
  `;
}