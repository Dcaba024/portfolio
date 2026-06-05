import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
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
  default: () => <section data-testid="projects" />,
}));

vi.mock("./components/Contact", () => ({
  default: () => <section data-testid="contact" />,
}));

vi.mock("./components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

describe("Home resume download", () => {
  it("links the download button to the updated resume PDF", () => {
    render(<Home />);

    const resumeLink = screen.getByRole("link", { name: /download resume/i });

    expect(resumeLink).toHaveAttribute(
      "href",
      "/Dylan-Caballero-AI-Resume.pdf"
    );
    expect(resumeLink).toHaveAttribute(
      "download",
      "Dylan-Caballero-AI-Resume.pdf"
    );
  });

  it("keeps the linked resume PDF available in the public folder", () => {
    expect(
      existsSync(
        join(process.cwd(), "public", "Dylan-Caballero-AI-Resume.pdf")
      )
    ).toBe(true);
  });
});

describe("Home project navigation", () => {
  it("links the View projects button to the projects section", () => {
    render(<Home />);

    const projectsLink = screen.getByRole("link", { name: /view projects/i });

    expect(projectsLink).toHaveAttribute("href", "#projects");
  });
});

describe("Home AI automation positioning", () => {
  it("highlights AI agents and workflow automation", () => {
    render(<Home />);

    expect(screen.getByText(/ai automation engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/agents, prompts, scoring, and evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/workflows, extraction, and decision support/i)).toBeInTheDocument();
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
