import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { TaskForm } from "./TaskForm";

test("zeigt den Hinweis für einen leeren Titel", () => {
  const onSave = vi.fn();
  render(<TaskForm saving={false} onCancel={() => undefined} onSave={onSave} />);

  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Bitte einen Titel eingeben.");
  expect(onSave).not.toHaveBeenCalled();
});
