import { invoke } from "@tauri-apps/api/core";
import { useEffect, useMemo, useState } from "react";
import { TaskDraft, TaskForm } from "./TaskForm";
import type { AppData, Project } from "./types";

const emptyData: AppData = { version: 1, projects: [], tasks: [] };

function message(error: unknown) {
  return typeof error === "string" ? error : "Unbekannter Fehler";
}

export function App() {
  const [data, setData] = useState<AppData>(emptyData);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [projectForm, setProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [taskForm, setTaskForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    invoke<AppData>("load_data")
      .then((loaded) => {
        setData(loaded);
        const restored = loaded.projects.some((project) => project.id === loaded.lastProjectId && !project.archived)
          ? loaded.lastProjectId
          : loaded.projects.find((project) => !project.archived)?.id;
        setSelectedId(restored);
      })
      .catch((reason) => setLoadError(message(reason)))
      .finally(() => setLoading(false));
  }, []);

  const selected = data.projects.find((project) => project.id === selectedId && !project.archived);
  const tasks = useMemo(() => data.tasks.filter((task) => task.projectId === selectedId && !task.archived), [data.tasks, selectedId]);

  async function persist(next: AppData) {
    setSaving(true);
    setError(undefined);
    try {
      await invoke("save_data", { data: next });
      setData(next);
      return true;
    } catch (reason) {
      setError(message(reason));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function selectProject(project: Project) {
    setSelectedId(project.id);
    setTaskForm(false);
    await persist({ ...data, lastProjectId: project.id });
  }

  async function createProject(event: React.FormEvent) {
    event.preventDefault();
    const name = projectName.trim();
    if (!name) return;
    const id = crypto.randomUUID();
    const next: AppData = {
      ...data,
      projects: [...data.projects, { id, name, archived: false, createdAt: new Date().toISOString() }],
      lastProjectId: id,
    };
    if (await persist(next)) {
      setSelectedId(id);
      setProjectName("");
      setProjectForm(false);
    }
  }

  async function createTask(draft: TaskDraft) {
    if (!selected) return;
    const next: AppData = {
      ...data,
      tasks: [...data.tasks, {
        id: crypto.randomUUID(),
        projectId: selected.id,
        title: draft.title.trim(),
        description: draft.description,
        status: "offen",
        archived: false,
        createdAt: new Date().toISOString(),
      }],
    };
    if (await persist(next)) setTaskForm(false);
  }

  if (loading) return <main className="loading">Aufgaben werden geladen…</main>;

  if (loadError) return (
    <div className="app-shell">
      <header className="titlebar"><span className="brand-icon" aria-hidden="true">✓</span><strong>Aufgaben</strong></header>
      <main className="welcome blocked-state">
        <span className="empty-icon" aria-hidden="true">!</span>
        <h1>Daten konnten nicht geladen werden</h1>
        <div className="global-error" role="alert"><strong>%APPDATA%\Aufgaben\daten.json</strong><span>{loadError}</span><span>Die Datei wurde nicht verändert. Bitte sichere oder repariere sie, bevor du Aufgaben weiter verwendest.</span></div>
      </main>
    </div>
  );

  return (
    <div className="app-shell">
      <header className="titlebar"><span className="brand-icon" aria-hidden="true">✓</span><strong>Aufgaben</strong></header>
      <div className="content">
        <aside className="sidebar">
          <nav aria-label="Projekte">
            <h2>Projekte</h2>
            <ul>
              {data.projects.filter((project) => !project.archived).map((project) => (
                <li key={project.id}>
                  <button className={`project ${project.id === selectedId ? "active" : ""}`} onClick={() => selectProject(project)} aria-current={project.id === selectedId ? "page" : undefined}>
                    <span aria-hidden="true">□</span><span>{project.name}</span><span className="count">{data.tasks.filter((task) => task.projectId === project.id && !task.archived).length}</span>
                  </button>
                </li>
              ))}
            </ul>
            {projectForm ? (
              <form className="project-form" onSubmit={createProject}>
                <label htmlFor="project-name">Projektname</label>
                <input id="project-name" autoFocus value={projectName} onChange={(event) => setProjectName(event.target.value)} />
                <div><button className="small primary" disabled={!projectName.trim() || saving}>Anlegen</button><button className="small" type="button" onClick={() => setProjectForm(false)}>Abbrechen</button></div>
              </form>
            ) : <button className="new-project" onClick={() => { setProjectForm(true); setError(undefined); }}>＋ Neues Projekt</button>}
          </nav>
          <p className="local">▣ Lokal auf diesem Gerät</p>
        </aside>
        <main className={`main ${taskForm ? "with-panel" : ""}`}>
          {error && !taskForm && <div className="global-error" role="alert"><strong>Fehler:</strong> {error}</div>}
          {selected ? (
            <section className="workspace" aria-labelledby="project-title">
              <p className="eyebrow">□ Projekt</p>
              <div className="heading"><div><h1 id="project-title">{selected.name}</h1><p>{tasks.length} {tasks.length === 1 ? "Aufgabe" : "Aufgaben"}</p></div><button className="button primary" onClick={() => { setTaskForm(true); setError(undefined); }}>＋ Neue Aufgabe</button></div>
              {tasks.length ? (
                <><div className="list-label"><span>Alle Aufgaben</span><span>{tasks.length} {tasks.length === 1 ? "Aufgabe" : "Aufgaben"}</span></div><ul className="task-list">{tasks.map((task) => <li key={task.id}><span className="checkbox" aria-hidden="true" /><div><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}</div><span className="status"><i />Offen</span></li>)}</ul></>
              ) : (
                <div className="empty-state"><span className="empty-icon" aria-hidden="true">☑</span><h2>Hier beginnt dein Projekt.</h2><p>Eine kleine Aufgabe ist ein guter Anfang.<br />Was möchtest du als Erstes erledigen?</p><button className="button primary" onClick={() => setTaskForm(true)}>＋ Erste Aufgabe anlegen</button></div>
              )}
            </section>
          ) : (
            <section className="welcome"><span className="empty-icon" aria-hidden="true">□</span><h1>Deine Projekte</h1><p>Lege dein erstes Projekt an, um zu beginnen.</p><button className="button primary" onClick={() => setProjectForm(true)}>＋ Neues Projekt</button></section>
          )}
          {taskForm && <TaskForm saving={saving} error={error} onCancel={() => { setTaskForm(false); setError(undefined); }} onSave={createTask} />}
        </main>
      </div>
    </div>
  );
}
