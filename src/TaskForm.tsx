import { FormEvent, useState } from "react";

export interface TaskDraft {
  title: string;
  description: string;
}

interface Props {
  error?: string;
  saving: boolean;
  onCancel: () => void;
  onSave: (draft: TaskDraft) => Promise<void>;
}

export function TaskForm({ error, saving, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<TaskDraft>({ title: "", description: "" });
  const [titleError, setTitleError] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) {
      setTitleError(true);
      return;
    }
    await onSave(draft);
  }

  return (
    <aside className="panel" aria-labelledby="task-form-title">
      <div className="panel-header">
        <h2 id="task-form-title">Neue Aufgabe</h2>
        <button className="icon-button" type="button" onClick={onCancel} aria-label="Bearbeitung schließen">×</button>
      </div>
      <form id="task-form" className="panel-body" onSubmit={submit} noValidate>
        {error && <div className="banner" role="alert"><strong>Konnte nicht speichern.</strong><span>{error}</span><span>Deine Eingaben sind noch da.</span></div>}
        <label htmlFor="task-title">Titel <span>(Pflichtfeld)</span></label>
        <input
          id="task-title"
          autoFocus
          value={draft.title}
          aria-invalid={titleError}
          aria-describedby={titleError ? "title-error" : undefined}
          onChange={(event) => {
            setDraft({ ...draft, title: event.target.value });
            if (event.target.value.trim()) setTitleError(false);
          }}
        />
        {titleError && <p id="title-error" className="error" role="alert">Bitte einen Titel eingeben.</p>}
        <label htmlFor="task-description">Beschreibung <span>(optional)</span></label>
        <textarea id="task-description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
      </form>
      <div className="panel-footer">
        <button className="button primary" form="task-form" disabled={saving}>{error ? "Erneut versuchen" : saving ? "Speichert…" : "Speichern"}</button>
        <button className="button" type="button" onClick={onCancel}>Abbrechen</button>
      </div>
    </aside>
  );
}
