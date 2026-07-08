import {
  formatRetrievedContext,
  retrieveKnowledgeChunks,
} from "./portfolioKnowledge";
import { resumeSourceFile } from "./resumeKnowledge";

describe("portfolio knowledge retrieval", () => {
  it("retrieves project context for AI project questions", () => {
    const chunks = retrieveKnowledgeChunks("What AI projects has Dylan built?", {
      maxChunks: 3,
    });

    expect(chunks.map((chunk) => chunk.id)).toContain("featured-ai-projects");
    expect(chunks[0].score).toBeGreaterThanOrEqual(chunks[1].score);
  });

  it("retrieves target role context from the current resume", () => {
    const chunks = retrieveKnowledgeChunks(
      "What AI roles is Dylan targeting?",
      { maxChunks: 2 }
    );

    expect(chunks[0].id).toBe("resume-education-target-roles");
    expect(chunks[0].content).toContain("AI Automation Engineer");
  });

  it("retrieves current resume AI automation tools", () => {
    const chunks = retrieveKnowledgeChunks(
      "Does Dylan use n8n LangChain CrewAI and Claude API?",
      { maxChunks: 2 }
    );

    expect(resumeSourceFile).toBe("public/Dylan-Caballero-Resume.pdf");
    expect(chunks[0].id).toBe("resume-ai-automation-skills");
    expect(chunks[0].content).toContain("n8n");
    expect(chunks[0].content).toContain("Claude API");
    expect(chunks[0].content).toContain("CrewAI");
  });

  it("formats retrieved chunks as source-labeled prompt context", () => {
    const chunks = retrieveKnowledgeChunks("How does the chatbot use RAG?", {
      maxChunks: 1,
    });

    expect(formatRetrievedContext(chunks)).toContain(
      "Source 1: Portfolio RAG chatbot implementation"
    );
  });
});
