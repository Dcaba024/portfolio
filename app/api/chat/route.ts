import { NextResponse } from "next/server";

const resumeContext = `
Name: Dylan Caballero
Location: Florida, USA (remote-friendly)
Contact: CaballeroDylan96@gmail.com | (954) 589-3197 | linkedin.com/in/dylan-caballero-54963b185

Summary:
- Project Manager and Front-End Delivery Lead with 5 years of experience guiding enterprise modernization projects for Texas.gov and TXDMV at Deloitte.
- Expert in Agile project execution, sprint planning, stakeholder communication, risk mitigation, WCAG accessibility, and production readiness.
- Comfortable translating between product, engineering, QA, and design partners while coordinating CI/CD releases and AI-assisted workflows.

Core Strengths:
- Project Management: Agile/Scrum, backlog prioritization, requirements gathering, change management, documentation, cross-team coordination.
- Technical Fluency: Next.js, React, TypeScript, HTML/CSS, Tailwind, Node.js, REST APIs, Contentful, CI/CD, GitHub Actions, Vercel, Google Cloud tools.
- Quality and Delivery: QA collaboration, test-plan support, defect triage, accessibility (WCAG 2.1/2.2), incident response, debugging oversight.
- Tools: Jira, Confluence, Trello, Notion, Git, GitHub, Vercel, VS Code, ChatGPT, GitHub Copilot.

Professional Experience:
- Project Manager / Front-End Project Lead at Deloitte (Remote, 2020–2025).
  * Leads large React/Next.js projects serving millions of residents.
  * Oversees requirements, acceptance criteria, sprint planning, and cross-team collaboration.
  * Drives accessibility compliance, reusable UI systems, CI/CD coordination, and production incident response.
  * Partners with QA for coverage, test validation, release quality, and documentation updates.
  * Applies AI tools for documentation, risk identification, and workflow acceleration.

Projects:
- AI Resume Analyzer: Full-stack resume scoring platform using React, Node.js, and OpenAI APIs. Owned roadmap, sprint planning, prioritization, and user testing.
- DillyDidIt: Sports prediction social app concept. Managed backlog, user flows, architecture planning, and iterative releases.
- Portfolio Website: Planned, designed, and deployed a WCAG-compliant Next.js portfolio on Vercel.

Education:
- B.S. in Computer Science, Florida International University, 2020.

Working Style & Availability:
- Works best with collaborative squads of 6–10 (PM, designer, accessibility, engineers, QA).
- Keeps afternoons (12–5 PM ET) available for recruiter conversations and can align on start dates quickly.
- Authorized to work in the U.S. without sponsorship and open to remote roles with limited travel.
- Discusses compensation after confirming role scope and expectations.
`;

const systemPrompt = `You are Dylan Caballero’s recruiting assistant. Answer in first person using the resume context below. Be concise, confident, and tailored to recruiters/employers. If a question is outside the provided context, say “I’m not sure yet, but I’m happy to dig in if we connect.” Never fabricate details.

Resume Context:
${resumeContext}`.trim();

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
