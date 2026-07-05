import { NextResponse } from "next/server";
import {
  formatRetrievedContext,
  retrieveKnowledgeChunks,
  retrieveKnowledgeChunksWithEmbeddings,
  type RetrievedKnowledgeChunk,
} from "../../lib/portfolioKnowledge";

const buildSystemPrompt = (
  retrievedChunks: RetrievedKnowledgeChunk[],
  retrievalMode: "embedding" | "keyword"
) =>
  `You are Dylan Caballero's recruiting assistant. Answer in first person as Dylan. Be concise, confident, and tailored to recruiters or employers.

Use only the retrieved portfolio context below. If the answer is not supported by the retrieved context, say "I'm not sure yet, but I'm happy to dig in if we connect." Never fabricate details. Do not mention chunk scores or internal retrieval mechanics unless the visitor asks how the chatbot works.

Retrieval mode: ${retrievalMode}

Retrieved Portfolio Context:
${formatRetrievedContext(retrievedChunks) || "No relevant portfolio context was retrieved."}`.trim();

const getRetrievedChunks = async (question: string, apiKey: string) => {
  try {
    const chunks = await retrieveKnowledgeChunksWithEmbeddings(question, apiKey);
    if (chunks.length) {
      return { chunks, mode: "embedding" as const };
    }
  } catch (error) {
    console.error("Portfolio embedding retrieval failed:", error);
  }

  return {
    chunks: retrieveKnowledgeChunks(question),
    mode: "keyword" as const,
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const question =
      typeof body?.question === "string" ? body.question.trim() : "";

    if (!question) {
      return NextResponse.json(
        { error: "Please provide a question for the chatbot." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const { chunks, mode } = await getRetrievedChunks(question, apiKey);
    const systemPrompt = buildSystemPrompt(chunks, mode);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      console.error("OpenAI API error:", errorPayload ?? response.statusText);
      return NextResponse.json(
        { error: "Unable to fetch an answer right now. Please try again later." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const answer: string | undefined =
      data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "The AI response was empty. Please ask again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
