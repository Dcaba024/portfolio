import { render, screen } from "@testing-library/react";
import Projects from "./Projects";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: React.ComponentProps<"div">) => (
      <div className={className}>{children}</div>
    ),
    article: ({ children, className }: React.ComponentProps<"article">) => (
      <article className={className}>{children}</article>
    ),
  },
}));

describe("Projects", () => {
  it("renders the selected project cards and contact CTA", () => {
    render(<Projects />);

    expect(screen.getByText("Resume Analyzer")).toBeInTheDocument();
    expect(screen.getByText("AI Automation")).toBeInTheDocument();
    expect(screen.getByText("Cardboard Kings")).toBeInTheDocument();
    expect(screen.getByText("Spring Boot Task Manager")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /start a conversation/i })
    ).toHaveAttribute("href", "#contact");
  });

  it("renders GitHub and live demo links for each project", () => {
    render(<Projects />);

    expect(
      screen.getByRole("link", { name: /resume analyzer github repository/i })
    ).toHaveAttribute("href", "https://github.com/Dcaba024/Resume-Analyzer");
    expect(
      screen.getByRole("link", { name: /resume analyzer live demo/i })
    ).toHaveAttribute("href", "https://resume-analyzer-woad.vercel.app/");

    expect(
      screen.getByRole("link", { name: /cardboard kings github repository/i })
    ).toHaveAttribute("href", "https://github.com/Dcaba024/cardboardkings");
    expect(
      screen.getByRole("link", { name: /cardboard kings live demo/i })
    ).toHaveAttribute("href", "https://cardboardkings.org");

    expect(
      screen.getByRole("link", { name: /spring boot task manager live demo/i })
    ).toHaveAttribute("href", "https://spring-task-manager.vercel.app/");
    expect(
      screen.getByRole("link", {
        name: /spring boot task manager github repository/i,
      })
    ).toHaveAttribute(
      "href",
      "https://github.com/Dcaba024/spring-task-manager"
    );
  });
});
