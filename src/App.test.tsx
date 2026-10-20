import { invoke } from "@tauri-apps/api/core";
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { App } from "./App";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

beforeEach(() => {
  vi.mocked(invoke).mockReset();
});

test("blockiert die Bedienung nach einem Ladefehler", async () => {
  vi.mocked(invoke).mockRejectedValue("Die Datei daten.json ist beschädigt.");

  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent("daten.json");
  expect(screen.getByRole("heading", { name: "Daten konnten nicht geladen werden" })).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
