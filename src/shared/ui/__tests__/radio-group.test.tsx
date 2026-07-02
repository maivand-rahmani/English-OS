import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { RadioGroup } from "../radio-group";

const options = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

describe("RadioGroup", () => {
  test("renders all options as radios", () => {
    render(<RadioGroup options={options} value={null} onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(options.length);
  });

  test("selected option has aria-checked='true'", () => {
    render(
      <RadioGroup
        options={options}
        value="intermediate"
        onChange={() => {}}
      />
    );
    const selected = screen.getByRole("radio", { name: /intermediate/i });
    const others = screen.getAllByRole("radio");
    expect(selected).toHaveAttribute("aria-checked", "true");
    others
      .filter((radio) => radio !== selected)
      .forEach((radio) => {
        expect(radio).toHaveAttribute("aria-checked", "false");
      });
  });

  test("clicking an option calls onChange with its value", () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup options={options} value={null} onChange={handleChange} />
    );
    fireEvent.click(screen.getByRole("radio", { name: /advanced/i }));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("advanced");
  });

  test("forwards className to the root element", () => {
    render(
      <RadioGroup
        options={options}
        value={null}
        onChange={() => {}}
        className="custom-radio-group"
      />
    );
    expect(screen.getByRole("radiogroup").className).toContain(
      "custom-radio-group"
    );
  });
});
