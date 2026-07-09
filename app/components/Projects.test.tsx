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
    expect(screen.getByText("BabbyDaddy.com")).toBeInTheDocument();
    expect(screen.queryByText("Spring Boot Task Manager")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /start a conversation/i })
    ).toHaveAttribute("href", "#contact");
  });

  it("renders GitHub and live demo links for selected projects", () => {
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
      screen.getByRole("link", { name: /babbydaddy\.com live demo/i })
    ).toHaveAttribute("href", "https://babbydaddy.com");
    expect(
      screen.getByRole("link", {
        name: /babbydaddy\.com github repository/i,
      })
    ).toHaveAttribute("href", "https://github.com/Dcaba024/babydaddy");
  });

  it("can receive a spotlight state from the page", () => {
    render(<Projects isSpotlighted />);

    expect(screen.getByRole("region", { name: /selected work/i })).toHaveClass(
      "ring-4"
    );
  });
});
