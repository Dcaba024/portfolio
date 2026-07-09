import { resumeKnowledgeChunks } from "./resumeKnowledge";

export type KnowledgeChunk = {
  id: string;
  title: string;
  source: "resume" | "portfolio" | "project";
  content: string;
  keywords: string[];
};

export type RetrievedKnowledgeChunk = KnowledgeChunk & {
  score: number;
};

type RetrieveOptions = {
  maxChunks?: number;
};

type EmbeddingRetrieveOptions = RetrieveOptions & {
  fetcher?: typeof fetch;
};

type EmbeddingApiResponse = {
  data?: Array<{
    index?: number;
    embedding?: number[];
  }>;
};

export const EMBEDDING_MODEL = "text-embedding-3-small";

const defaultMaxChunks = 4;

const portfolioSpecificKnowledgeChunks: KnowledgeChunk[] = [
  {
    id: "rag-chatbot-implementation",
    title: "Portfolio RAG chatbot implementation",
    source: "portfolio",
    content:
      "The portfolio chatbot uses retrieval-augmented generation. For general questions, the API embeds the visitor question and curated portfolio knowledge chunks, ranks chunks by vector similarity, falls back to keyword retrieval if embeddings fail, and sends only the retrieved context to the OpenAI chat model. The UI still handles direct link requests for resume, projects, contact, LinkedIn, GitHub, and email without calling the chat API.",
    keywords: [
      "rag",
      "retrieval",
      "retrieval augmented generation",
      "embeddings",
      "vector search",
      "semantic search",
      "chatbot",
      "portfolio assistant",
      "fallback",
    ],
  },
  {
    id: "featured-ai-projects",
    title: "Featured AI and automation projects",
    source: "project",
    content:
      "Dylan's featured projects include AI Resume Analyzer, a full-stack resume scoring platform that uses React, Node.js, backend REST APIs, and OpenAI APIs to compare resume context with job requirements and return match scores with actionable feedback; BabbyDaddy.com, an AI legal-guidance agent for fathers fighting for custody rights who cannot afford a lawyer; DillyDidIt, a sports prediction social app concept; and this portfolio website, a WCAG-compliant Next.js portfolio with a RAG chatbot. He also built Cardboard Kings, a sports card storefront for cleaning services and collectible sales.",
    keywords: [
      "projects",
      "ai projects",
      "resume analyzer",
      "openai api",
      "job matching",
      "match scores",
      "babydaddy",
      "babbydaddy",
      "legal guidance",
      "custody",
      "dillydidit",
      "sports prediction",
      "portfolio",
      "cardboard kings",
    ],
  },
];

export const portfolioKnowledgeChunks: KnowledgeChunk[] = [
  ...resumeKnowledgeChunks,
  ...portfolioSpecificKnowledgeChunks,
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "has",
  "have",
  "he",
  "his",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "you",
  "your",
]);

const queryExpansions: Record<string, string[]> = {
  ai: ["openai", "agent", "automation", "intelligence"],
  bot: ["chatbot", "assistant", "chat"],
  chatbot: ["bot", "assistant", "chat", "rag"],
  cv: ["resume"],
  job: ["role", "work", "employment"],
  llm: ["openai", "chat", "prompt"],
  rag: ["retrieval", "embedding", "vector", "semantic"],
  resume: ["cv", "experience", "skills"],
};

const stemTerm = (term: string) =>
  term
    .replace(/ies$/, "y")
    .replace(/ing$/, "")
    .replace(/ed$/, "")
    .replace(/s$/, "");

const tokenize = (value: string) =>
  (value.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .map(stemTerm)
    .filter((term) => term.length > 1 && !stopWords.has(term));

const getExpandedTerms = (question: string) => {
  const terms = new Set(tokenize(question));

  for (const term of Array.from(terms)) {
    queryExpansions[term]?.forEach((expandedTerm) =>
      tokenize(expandedTerm).forEach((token) => terms.add(token))
    );
  }

  return Array.from(terms);
};

const countTerms = (terms: string[]) =>
  terms.reduce<Map<string, number>>((counts, term) => {
    counts.set(term, (counts.get(term) ?? 0) + 1);
    return counts;
  }, new Map());

const getSearchText = (chunk: KnowledgeChunk) =>
  `${chunk.title}\n${chunk.content}\n${chunk.keywords.join(" ")}`;

const scoreChunkByKeywords = (chunk: KnowledgeChunk, question: string) => {
  const queryTerms = getExpandedTerms(question);
  if (!queryTerms.length) return 0;

  const searchCounts = countTerms(tokenize(getSearchText(chunk)));
  const titleTerms = new Set(tokenize(chunk.title));
  const keywordTerms = new Set(tokenize(chunk.keywords.join(" ")));

  return queryTerms.reduce((score, term) => {
    const matches = searchCounts.get(term) ?? 0;
    if (!matches) return score;

    const titleBoost = titleTerms.has(term) ? 1.5 : 0;
    const keywordBoost = keywordTerms.has(term) ? 1.25 : 0;
    return score + 1 + Math.min(matches, 3) * 0.35 + titleBoost + keywordBoost;
  }, 0);
};

const cosineSimilarity = (first: number[], second: number[]) => {
  const length = Math.min(first.length, second.length);
  if (!length) return 0;

  let dotProduct = 0;
  let firstMagnitude = 0;
  let secondMagnitude = 0;

  for (let index = 0; index < length; index += 1) {
    dotProduct += first[index] * second[index];
    firstMagnitude += first[index] ** 2;
    secondMagnitude += second[index] ** 2;
  }

  if (!firstMagnitude || !secondMagnitude) return 0;
  return dotProduct / (Math.sqrt(firstMagnitude) * Math.sqrt(secondMagnitude));
};

export const retrieveKnowledgeChunks = (
  question: string,
  options: RetrieveOptions = {}
): RetrievedKnowledgeChunk[] => {
  const maxChunks = options.maxChunks ?? defaultMaxChunks;

  return portfolioKnowledgeChunks
    .map((chunk) => ({
      ...chunk,
      score: scoreChunkByKeywords(chunk, question),
    }))
    .filter((chunk) => chunk.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, maxChunks);
};

export const retrieveKnowledgeChunksWithEmbeddings = async (
  question: string,
  apiKey: string,
  options: EmbeddingRetrieveOptions = {}
): Promise<RetrievedKnowledgeChunk[]> => {
  const fetcher = options.fetcher ?? fetch;
  const maxChunks = options.maxChunks ?? defaultMaxChunks;
  const inputs = [question, ...portfolioKnowledgeChunks.map(getSearchText)];

  const response = await fetcher("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: inputs,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve portfolio knowledge embeddings.");
  }

  const data = (await response.json()) as EmbeddingApiResponse;
  const embeddings = data.data
    ?.slice()
    .sort((first, second) => (first.index ?? 0) - (second.index ?? 0))
    .map((item) => item.embedding);

  if (!embeddings || embeddings.length !== inputs.length) {
    throw new Error("Embedding response did not include every portfolio chunk.");
  }

  const [questionEmbedding, ...chunkEmbeddings] = embeddings;
  if (!questionEmbedding) {
    throw new Error("Embedding response did not include the visitor question.");
  }

  return portfolioKnowledgeChunks
    .map((chunk, index) => {
      const embeddingScore = cosineSimilarity(
        questionEmbedding,
        chunkEmbeddings[index] ?? []
      );
      const keywordBoost = scoreChunkByKeywords(chunk, question) * 0.01;

      return {
        ...chunk,
        score: embeddingScore + keywordBoost,
      };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, maxChunks);
};

export const formatRetrievedContext = (chunks: RetrievedKnowledgeChunk[]) =>
  chunks
    .map(
      (chunk, index) =>
        `Source ${index + 1}: ${chunk.title}\nType: ${chunk.source}\n${chunk.content}`
    )
    .join("\n\n");
