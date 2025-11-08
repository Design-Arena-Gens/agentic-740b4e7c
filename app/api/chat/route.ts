import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const responses = [
  "I understand your question. Let me help you with that.",
  "That's an interesting point. Here's what I think:",
  "Based on what you're asking, I can provide the following information:",
  "Great question! Let me break this down for you.",
  "I'd be happy to help you understand this better.",
];

const elaborations = [
  "This is a complex topic that involves multiple factors. Consider the historical context, current trends, and future implications when analyzing this subject.",
  "From a practical standpoint, there are several approaches you could take. Each has its own advantages and trade-offs that you should carefully weigh.",
  "The key principles to remember here are consistency, clarity, and consideration of edge cases. These will guide you toward the right solution.",
  "When dealing with this kind of situation, it's important to think both strategically and tactically. Look at both the big picture and the fine details.",
  "Research has shown that the most effective approach combines theory with practice. Try to apply these concepts to real-world scenarios.",
];

const conclusions = [
  "I hope this helps clarify things. Let me know if you have any other questions!",
  "Feel free to ask if you need more details on any specific aspect.",
  "Is there anything else you'd like me to explain or expand on?",
  "Let me know if this answers your question or if you need further clarification.",
  "I'm here to help if you need any additional information!",
];

function generateResponse(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1];

  // Simple response generation based on keywords
  const content = lastMessage.content.toLowerCase();

  let response = responses[Math.floor(Math.random() * responses.length)];
  response += "\n\n";

  if (content.includes("code") || content.includes("program")) {
    response += `Here's a simple example:\n\n\`\`\`javascript\nfunction example() {\n  console.log("Hello, World!");\n  return true;\n}\n\`\`\`\n\n`;
    response += elaborations[2];
  } else if (content.includes("how") || content.includes("what") || content.includes("why")) {
    response += elaborations[Math.floor(Math.random() * elaborations.length)];
    response += "\n\n";
    response += "Here are some key points to consider:\n\n";
    response += "1. **First consideration**: Understanding the fundamentals is crucial\n";
    response += "2. **Second consideration**: Practical application brings theory to life\n";
    response += "3. **Third consideration**: Continuous learning leads to mastery\n";
  } else if (content.includes("explain")) {
    response += "Let me break this down step by step:\n\n";
    response += "**Step 1**: First, we need to understand the basic concept. This forms the foundation for everything else.\n\n";
    response += "**Step 2**: Next, we build upon that foundation with more advanced ideas.\n\n";
    response += "**Step 3**: Finally, we apply these concepts to practical situations.\n\n";
    response += elaborations[0];
  } else if (content.includes("help") || content.includes("can you")) {
    response += "Absolutely! I'm here to assist you. " + elaborations[1];
  } else {
    response += elaborations[Math.floor(Math.random() * elaborations.length)];
    response += "\n\n";
    response += "This involves understanding multiple perspectives and considering various factors that might influence the outcome.";
  }

  response += "\n\n";
  response += conclusions[Math.floor(Math.random() * conclusions.length)];

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const responseMessage = generateResponse(messages);

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
