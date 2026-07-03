import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FloatingChatbot from "./FloatingChatbot";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("FloatingChatbot", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        answer: "I can help you find Dylan's projects.",
      }),
    });

    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("opens on page load with Dylan's greeting", () => {
    render(<FloatingChatbot />);

    expect(
      screen.getByRole("region", { name: /^dylan chatbot$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/anything i can help you find/i)
    ).toBeInTheDocument();
  });

  it("sends questions to the chat API and displays the answer", async () => {
    render(<FloatingChatbot />);

    fireEvent.change(screen.getByLabelText(/ask dylan a question/i), {
      target: { value: "Tell me about your background" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: "Tell me about your background" }),
      });
    });

    expect(await screen.findByText("Tell me about your background")).toBeInTheDocument();
    expect(
      await screen.findByText("I can help you find Dylan's projects.")
    ).toBeInTheDocument();
  });

  it("guides resume requests without calling the chat API", async () => {
    const onResumeRequest = vi.fn();

    render(<FloatingChatbot onResumeRequest={onResumeRequest} />);

    fireEvent.change(screen.getByLabelText(/ask dylan a question/i), {
      target: { value: "Can I download your resume?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(onResumeRequest).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "Absolutely. I highlighted the Download resume button for you. You can also open it here."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open resume/i })).toHaveAttribute(
      "target",
      "_blank"
    );
  });

  it("returns a clickable LinkedIn link without calling the chat API", async () => {
    render(<FloatingChatbot />);

    fireEvent.change(screen.getByLabelText(/ask dylan a question/i), {
      target: { value: "Can I get your LinkedIn?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(fetchMock).not.toHaveBeenCalled();

    const linkedinLink = await screen.findByRole("link", {
      name: /open linkedin/i,
    });

    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/dylan-caballero-54963b185/"
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("guides contact requests without calling the chat API", async () => {
    const onContactRequest = vi.fn();

    render(<FloatingChatbot onContactRequest={onContactRequest} />);

    fireEvent.change(screen.getByLabelText(/ask dylan a question/i), {
      target: { value: "Where can I contact you?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(onContactRequest).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "You can contact me through the form. I highlighted it for you."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email dylan/i })).toHaveAttribute(
      "href",
      "mailto:CaballeroDylan96@gmail.com"
    );
  });

  it("guides project requests without calling the chat API", async () => {
    const onProjectsRequest = vi.fn();

    render(<FloatingChatbot onProjectsRequest={onProjectsRequest} />);

    fireEvent.change(screen.getByLabelText(/ask dylan a question/i), {
      target: { value: "Can you show me your projects?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(onProjectsRequest).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "Here are the projects in my portfolio. I highlighted that section for you."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open resume analyzer/i })
    ).toHaveAttribute("href", "https://resume-analyzer-woad.vercel.app/");
  });

  it("renders URLs from API answers as new-tab links", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        answer: "You can visit https://example.com/profile.",
      }),
    });

    render(<FloatingChatbot />);

    fireEvent.change(screen.getByLabelText(/ask dylan a question/i), {
      target: { value: "Send me a useful website" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    const responseLink = await screen.findByRole("link", {
      name: "https://example.com/profile",
    });

    expect(responseLink).toHaveAttribute("href", "https://example.com/profile");
    expect(responseLink).toHaveAttribute("target", "_blank");
  });

  it("can be minimized into a floating launcher", () => {
    render(<FloatingChatbot />);

    fireEvent.click(
      screen.getByRole("button", { name: /minimize dylan chatbot/i })
    );

    expect(
      screen.getByRole("button", { name: /open dylan chatbot/i })
    ).toBeInTheDocument();
  });
});
