import { POST } from "./route";

const originalApiKey = process.env.OPENAI_API_KEY;

const createRequest = (question: string) =>
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

const createJsonResponse = (payload: unknown, ok = true) => ({
  ok,
  json: vi.fn().mockResolvedValue(payload),
});

const embeddingFor = (input: string) => {
  if (input.startsWith("What AI projects")) return [1, 0, 0];
  if (input.includes("Featured AI and automation projects")) return [1, 0, 0];
  if (input.includes("AI agents and OpenAI expertise")) return [0.9, 0.1, 0];
  if (input.includes("Portfolio RAG chatbot implementation")) {
    return [0.8, 0.2, 0];
  }

  return [0, 1, 0];
};

describe("chat API route retrieval", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-openai-key";
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
      if (url === "https://api.openai.com/v1/embeddings") {
        const body = JSON.parse(String(init?.body));

        return createJsonResponse({
          data: body.input.map((input: string, index: number) => ({
            index,
            embedding: embeddingFor(input),
          })),
        });
      }

      if (url === "https://api.openai.com/v1/chat/completions") {
        return createJsonResponse({
          choices: [
            {
              message: {
                content: "Dylan has built AI projects including Resume Analyzer.",
              },
            },
          ],
        });
      }

      throw new Error(`Unexpected request URL: ${url}`);
    });
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }

    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("embeds the question and portfolio chunks before sending retrieved context to chat completions", async () => {
    const response = await POST(createRequest("What AI projects has Dylan built?"));
    const data = await response.json();

    expect(data).toEqual({
      answer: "Dylan has built AI projects including Resume Analyzer.",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.openai.com/v1/embeddings"
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.openai.com/v1/chat/completions"
    );

    const embeddingBody = JSON.parse(
      String((fetchMock.mock.calls[0][1] as RequestInit).body)
    );
    expect(embeddingBody.model).toBe("text-embedding-3-small");
    expect(embeddingBody.input[0]).toBe("What AI projects has Dylan built?");
    expect(embeddingBody.input.length).toBeGreaterThan(1);

    const chatBody = JSON.parse(
      String((fetchMock.mock.calls[1][1] as RequestInit).body)
    );
    const systemPrompt = chatBody.messages[0].content;

    expect(systemPrompt).toContain("Retrieval mode: embedding");
    expect(systemPrompt).toContain(
      "Source 1: Featured AI and automation projects"
    );
    expect(systemPrompt).toContain("AI Resume Analyzer");
    expect(chatBody.messages[1]).toEqual({
      role: "user",
      content: "What AI projects has Dylan built?",
    });
  });

  it("falls back to keyword retrieval when embedding retrieval fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockImplementationOnce(async () =>
      createJsonResponse({ error: "embeddings unavailable" }, false)
    );
    fetchMock.mockImplementationOnce(async () =>
      createJsonResponse({
        choices: [
          {
            message: {
              content:
                "Dylan is targeting AI Automation Engineer and AI Agent Engineer roles.",
            },
          },
        ],
      })
    );

    const response = await POST(
      createRequest("What AI roles is Dylan targeting?")
    );
    const data = await response.json();
    const chatBody = JSON.parse(
      String((fetchMock.mock.calls[1][1] as RequestInit).body)
    );

    expect(data.answer).toBe(
      "Dylan is targeting AI Automation Engineer and AI Agent Engineer roles."
    );
    expect(chatBody.messages[0].content).toContain("Retrieval mode: keyword");
    expect(chatBody.messages[0].content).toContain("AI Automation Engineer");

    consoleErrorSpy.mockRestore();
  });
});
