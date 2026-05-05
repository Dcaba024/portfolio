import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Connect4 from "./Connect4";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: React.ComponentProps<"div">) => (
      <div className={className}>{children}</div>
    ),
  },
}));

describe("Connect4", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ column: 3 }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders an empty game board with the starting status", () => {
    render(<Connect4 />);

    expect(screen.getByText("Your move.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /column \d/i })).toHaveLength(
      42
    );
  });

  it("sends the current board to the AI endpoint after a player move", async () => {
    render(<Connect4 />);

    fireEvent.click(screen.getAllByRole("button", { name: "Column 4" })[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/connect4",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const request = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(request.body as string) as {
      board: number[][];
    };

    expect(payload.board[5][3]).toBe(1);
    expect(screen.getByText("Your move.")).toBeInTheDocument();
  });

  it("resets the game after a move", async () => {
    render(<Connect4 />);

    fireEvent.click(screen.getAllByRole("button", { name: "Column 4" })[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.getByText("Your move.")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
