import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "../button";

describe("Button", () => {
  test("renders with default variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole("button", { name: /test/i });
    expect(button.className).toContain("custom-class");
  });
});
