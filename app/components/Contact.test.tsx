import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import emailjs from "emailjs-com";
import { forwardRef, useImperativeHandle } from "react";
import Contact from "./Contact";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: React.ComponentProps<"div">) => (
      <div className={className}>{children}</div>
    ),
  },
}));

vi.mock("emailjs-com", () => ({
  default: {
    send: vi.fn(),
  },
}));

vi.mock("react-google-recaptcha", () => ({
  default: forwardRef(function MockReCAPTCHA(_, ref) {
    useImperativeHandle(ref, () => ({
      executeAsync: vi.fn().mockResolvedValue("captcha-token"),
      reset: vi.fn(),
    }));

    return <div data-testid="recaptcha" />;
  }),
}));

describe("Contact", () => {
  beforeEach(() => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: "OK" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends the contact form through EmailJS after captcha validation", async () => {
    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "Dylan Caballero" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), {
      target: { value: "dylan@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Tell me about the role, team, or project."),
      {
        target: { value: "Let's talk about a full-stack role." },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalledWith(
        "service_6mcnsyo",
        "template_w119ov8",
        {
          name: "Dylan Caballero",
          email: "dylan@example.com",
          message: "Let's talk about a full-stack role.",
          "g-recaptcha-response": "captcha-token",
        },
        "fXwflN6T_8dBc33BB"
      );
    });

    expect(
      await screen.findByRole("button", { name: /message sent/i })
    ).toBeInTheDocument();
  });
});
