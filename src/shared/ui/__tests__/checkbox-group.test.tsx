import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { CheckboxGroup } from "../checkbox-group";

const options = [
  { value: "movies", label: "Movies" },
  { value: "music", label: "Music" },
  { value: "books", label: "Books" },
];

describe("CheckboxGroup", () => {
  test("reflects initial selected values via aria-checked", () => {
    render(
      <CheckboxGroup
        options={options}
        value={["movies", "books"]}
        onChange={() => {}}
      />
    );
    expect(screen.getByRole("checkbox", { name: /movies/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("checkbox", { name: /books/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("checkbox", { name: /music/i })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  test("clicking an unchecked option adds it to the array", () => {
    const handleChange = vi.fn();
    render(
      <CheckboxGroup
        options={options}
        value={["movies"]}
        onChange={handleChange}
      />
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /music/i }));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(["movies", "music"]);
  });

  test("clicking a checked option removes it from the array", () => {
    const handleChange = vi.fn();
    render(
      <CheckboxGroup
        options={options}
        value={["movies", "music"]}
        onChange={handleChange}
      />
    );
    fireEvent.click(screen.getByRole("checkbox", { name: /music/i }));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(["movies"]);
  });

  test("forwards className to the root element", () => {
    render(
      <CheckboxGroup
        options={options}
        value={[]}
        onChange={() => {}}
        className="custom-checkbox-group"
      />
    );
    expect(screen.getByRole("group").className).toContain(
      "custom-checkbox-group"
    );
  });
});
