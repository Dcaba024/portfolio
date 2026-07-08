import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock("./components/About", () => ({
  default: () => <section data-testid="about" />,
}));

vi.mock("./components/Connect4", () => ({
  default: () => <section data-testid="connect4" />,
}));

vi.mock("./components/Projects", () => ({
  default: ({
    sectionRef,
    isSpotlighted,
  }: {
    sectionRef?: React.Ref<HTMLElement>;
    isSpotlighted?: boolean;
  }) => (
    <section
      ref={sectionRef}
      tabIndex={-1}
      data-testid="projects"
      className={isSpotlighted ? "ring-4" : ""}
    />
  ),
}));

vi.mock("./components/Contact", () => ({
  default: ({
    formRef,
    isSpotlighted,
  }: {
    formRef?: React.Ref<HTMLFormElement>;
    isSpotlighted?: boolean;
  }) => (
    <form
      ref={formRef}
      tabIndex={-1}
      data-testid="contact-form"
      className={isSpotlighted ? "ring-4" : ""}
    />
  ),
}));

vi.mock("./components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock("./components/FloatingChatbot", () => ({
  default: ({
    onResumeRequest,
    onContactRequest,
    onProjectsRequest,
  }: {
    onResumeRequest?: () => void;
    onContactRequest?: () => void;
    onProjectsRequest?: () => void;
  }) => (
    <div data-testid="floating-chatbot">
      <button type="button" onClick={onResumeRequest}>
        Mock resume request
      </button>
      <button type="button" onClick={onContactRequest}>
        Mock contact request
      </button>
      <button type="button" onClick={onProjectsRequest}>
        Mock projects request
      </button>
    </div>
  ),
}));

describe("Home resume download", () => {
  it("links the download button to the updated resume PDF", () => {
    render(<Home />);

    const resumeLink = screen.getByRole("link", { name: /download resume/i });

    expect(resumeLink).toHaveAttribute(
      "href",
      "/Dylan-Caballero-Resume.pdf"
    );
    expect(resumeLink).toHaveAttribute(
      "download",
      "Dylan-Caballero-Resume.pdf"
    );
  });

  it("keeps the linked resume PDF available in the public folder", () => {
    expect(
      existsSync(
        join(
          process.cwd(),
          "public",
          "Dylan-Caballero-Resume.pdf"
        )
      )
    ).toBe(true);
  });
});

describe("Home floating chatbot", () => {
  it("renders the site-level chatbot", () => {
    render(<Home />);

    expect(screen.getByTestId("floating-chatbot")).toBeInTheDocument();
  });

  it("spotlights the resume button when the chatbot handles a resume request", () => {
    render(<Home />);

    const resumeLink = screen.getByRole("link", { name: /download resume/i });
    fireEvent.click(screen.getByRole("button", { name: /mock resume request/i }));

    expect(resumeLink).toHaveClass("ring-4");
    expect(resumeLink).toHaveFocus();
    expect(
      screen.getByTestId("resume-spotlight-overlay").getAttribute("style")
    ).toContain("radial-gradient");
  });

  it("spotlights the contact form when the chatbot handles a contact request", () => {
    render(<Home />);

    const contactForm = screen.getByTestId("contact-form");
    fireEvent.click(screen.getByRole("button", { name: /mock contact request/i }));

    expect(contactForm).toHaveClass("ring-4");
    expect(contactForm).toHaveFocus();
    expect(
      screen.getByTestId("contact-spotlight-overlay").getAttribute("style")
    ).toContain("radial-gradient");
  });

  it("spotlights the projects section when the chatbot handles a projects request", () => {
    render(<Home />);

    const projectsSection = screen.getByTestId("projects");
    fireEvent.click(screen.getByRole("button", { name: /mock projects request/i }));

    expect(projectsSection).toHaveClass("ring-4");
    expect(projectsSection).toHaveFocus();
    expect(
      screen.getByTestId("projects-spotlight-overlay").getAttribute("style")
    ).toContain("radial-gradient");
  });
});

describe("Home project navigation", () => {
  it("links the View projects button to the projects section", () => {
    render(<Home />);

    const projectsLink = screen.getByRole("link", { name: /view projects/i });

    expect(projectsLink).toHaveAttribute("href", "#projects");
  });
});

describe("Home IAM and AI positioning", () => {
  it("highlights IAM, OAuth, AI agents, and automation", () => {
    render(<Home />);

    expect(
      screen.getByText(
        /full stack software engineer \| identity & access management \(iam\) \+ oauth 2\.0 \| ai agent & automation development/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/5\+ years building secure, enterprise-scale identity/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/forgerock, oauth 2\.0, mfa, and sso/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/langchain, crewai, n8n, openai\/claude apis/i)
        .length
    ).toBeGreaterThan(0);
  });
});

describe("Home profile image", () => {
  it("renders Dylan's profile image on the home screen", () => {
    render(<Home />);

    const profileImage = screen.getByRole("img", { name: /dylan caballero/i });

    expect(profileImage).toHaveAttribute(
      "src",
      expect.stringContaining("url=%2FDylan.PNG")
    );
  });
});
