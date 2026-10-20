import { invoke } from "@tauri-apps/api/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { App } from "./App";
import type { AppData } from "./types";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

beforeEach(() => {
  vi.mocked(invoke).mockReset();
});

afterEach(cleanup);

const loaded: AppData = {
  version: 1,
  projects: [
    { id: "p1", name: "Projekt A", archived: false, createdAt: "2026-10-20T12:00:00Z" },
    { id: "p2", name: "Projekt B", archived: false, createdAt: "2026-10-20T12:00:00Z" },
  ],
  tasks: [],
  lastProjectId: "p1",
};

test("blockiert die Bedienung nach einem Ladefehler", async () => {
  vi.mocked(invoke).mockRejectedValue("Die Datei daten.json ist beschädigt.");

  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent("daten.json");
  expect(screen.getByRole("heading", { name: "Daten konnten nicht geladen werden" })).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("deaktiviert den Projektwechsel während eines Speichervorgangs", async () => {
  let finishSave: (() => void) | undefined;
  vi.mocked(invoke).mockImplementation((command) => command === "load_data"
    ? Promise.resolve(loaded)
    : new Promise<void>((resolve) => { finishSave = resolve; }));
  render(<App />);
  await screen.findByRole("heading", { name: "Projekt A" });

  fireEvent.click(screen.getByRole("button", { name: /Neue Aufgabe/ }));
  fireEvent.change(screen.getByLabelText(/Titel/), { target: { value: "Neue Aufgabe" } });
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

  expect(screen.getByRole("button", { name: /Projekt B/ })).toBeDisabled();
  finishSave?.();
});

test("speichert nicht erneut beim Klick auf das bereits gewählte Projekt", async () => {
  vi.mocked(invoke).mockResolvedValue(loaded);
  render(<App />);
  await screen.findByRole("heading", { name: "Projekt A" });

  fireEvent.click(screen.getByRole("button", { name: /Projekt A/ }));

  expect(invoke).toHaveBeenCalledTimes(1);
});
