use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    path::{Path, PathBuf},
};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppData {
    pub version: u8,
    pub projects: Vec<Project>,
    pub tasks: Vec<Task>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_project_id: Option<String>,
}

impl Default for AppData {
    fn default() -> Self {
        Self {
            version: 1,
            projects: Vec::new(),
            tasks: Vec::new(),
            last_project_id: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: String,
    pub name: String,
    pub archived: bool,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub project_id: String,
    pub title: String,
    pub description: String,
    pub status: Status,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub due: Option<String>,
    pub archived: bool,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum Status {
    Offen,
    InArbeit,
    Erledigt,
}

fn data_path() -> Result<PathBuf, String> {
    std::env::var_os("APPDATA")
        .map(PathBuf::from)
        .map(|path| path.join("Aufgaben").join("daten.json"))
        .ok_or_else(|| "Der lokale AppData-Ordner wurde nicht gefunden.".into())
}

fn validate(data: &AppData) -> Result<(), String> {
    if data.version != 1 {
        return Err("Diese Datenversion wird nicht unterstützt.".into());
    }
    if data
        .projects
        .iter()
        .any(|project| project.name.trim().is_empty())
    {
        return Err("Bitte einen Projektnamen eingeben.".into());
    }
    if data.tasks.iter().any(|task| task.title.trim().is_empty()) {
        return Err("Bitte einen Titel eingeben.".into());
    }
    if data.tasks.iter().any(|task| {
        !data
            .projects
            .iter()
            .any(|project| project.id == task.project_id)
    }) {
        return Err("Eine Aufgabe verweist auf ein unbekanntes Projekt.".into());
    }
    Ok(())
}

fn load_from_path(path: &Path) -> Result<AppData, String> {
    if !path.exists() {
        return Ok(AppData::default());
    }
    let mut bytes = Vec::new();
    File::open(path)
        .and_then(|mut file| file.read_to_end(&mut bytes))
        .map_err(|error| format!("Die Datendatei konnte nicht gelesen werden: {error}"))?;
    let data: AppData = serde_json::from_slice(&bytes)
        .map_err(|error| format!("Die Datendatei ist beschädigt: {error}"))?;
    validate(&data)?;
    Ok(data)
}

fn save_to_path(path: &Path, data: &AppData) -> Result<(), String> {
    validate(data)?;
    let parent = path
        .parent()
        .ok_or_else(|| "Der Datenordner ist ungültig.".to_string())?;
    fs::create_dir_all(parent)
        .map_err(|error| format!("Der Datenordner konnte nicht angelegt werden: {error}"))?;
    let temp = parent.join("daten.json.tmp");
    let backup = parent.join("daten.bak.json");
    let bytes = serde_json::to_vec_pretty(data)
        .map_err(|error| format!("Die Daten konnten nicht vorbereitet werden: {error}"))?;

    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&temp)
        .map_err(|error| {
            format!("Die temporäre Datendatei konnte nicht geschrieben werden: {error}")
        })?;
    file.write_all(&bytes)
        .and_then(|_| file.sync_all())
        .map_err(|error| {
            format!("Die temporäre Datendatei konnte nicht gespeichert werden: {error}")
        })?;
    drop(file);

    replace(&temp, path, &backup).map_err(|error| {
        let _ = fs::remove_file(&temp);
        format!("Die Datendatei konnte nicht sicher ersetzt werden: {error}")
    })
}

#[cfg(windows)]
fn replace(temp: &Path, target: &Path, backup: &Path) -> std::io::Result<()> {
    use std::{io, os::windows::ffi::OsStrExt};
    use windows_sys::Win32::Storage::FileSystem::{ReplaceFileW, REPLACEFILE_WRITE_THROUGH};

    if !target.exists() {
        return fs::rename(temp, target);
    }
    let wide = |path: &Path| {
        path.as_os_str()
            .encode_wide()
            .chain(Some(0))
            .collect::<Vec<_>>()
    };
    let target = wide(target);
    let temp = wide(temp);
    let backup = wide(backup);
    let result = unsafe {
        ReplaceFileW(
            target.as_ptr(),
            temp.as_ptr(),
            backup.as_ptr(),
            REPLACEFILE_WRITE_THROUGH,
            std::ptr::null_mut(),
            std::ptr::null_mut(),
        )
    };
    if result == 0 {
        Err(io::Error::last_os_error())
    } else {
        Ok(())
    }
}

#[cfg(not(windows))]
fn replace(temp: &Path, target: &Path, backup: &Path) -> std::io::Result<()> {
    if target.exists() {
        fs::copy(target, backup)?;
        fs::remove_file(target)?;
    }
    fs::rename(temp, target)
}

#[tauri::command]
fn load_data() -> Result<AppData, String> {
    load_from_path(&data_path()?)
}

#[tauri::command]
fn save_data(data: AppData) -> Result<(), String> {
    save_to_path(&data_path()?, &data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_data, save_data])
        .run(tauri::generate_context!())
        .expect("Fehler beim Starten von Aufgaben");
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn sample(title: &str) -> AppData {
        AppData {
            version: 1,
            projects: vec![Project {
                id: "p1".into(),
                name: "Testprojekt A".into(),
                archived: false,
                created_at: "2026-10-20T12:00:00Z".into(),
            }],
            tasks: vec![Task {
                id: "t1".into(),
                project_id: "p1".into(),
                title: title.into(),
                description: String::new(),
                status: Status::Offen,
                due: None,
                archived: false,
                created_at: "2026-10-20T12:01:00Z".into(),
            }],
            last_project_id: Some("p1".into()),
        }
    }

    #[test]
    fn save_load_roundtrip() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("daten.json");
        let data = sample("Erste Aufgabe");
        save_to_path(&path, &data).unwrap();
        assert_eq!(load_from_path(&path).unwrap(), data);
    }

    #[test]
    fn failed_temp_write_leaves_old_file_intact() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("daten.json");
        save_to_path(&path, &sample("Alt")).unwrap();
        fs::create_dir(dir.path().join("daten.json.tmp")).unwrap();
        assert!(save_to_path(&path, &sample("Neu")).is_err());
        assert_eq!(load_from_path(&path).unwrap(), sample("Alt"));
    }

    #[test]
    fn previous_version_is_backed_up() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("daten.json");
        save_to_path(&path, &sample("Alt")).unwrap();
        save_to_path(&path, &sample("Neu")).unwrap();
        save_to_path(&path, &sample("Noch neuer")).unwrap();
        assert_eq!(load_from_path(&path).unwrap(), sample("Noch neuer"));
        assert_eq!(
            load_from_path(&dir.path().join("daten.bak.json")).unwrap(),
            sample("Neu")
        );
    }

    #[test]
    fn empty_task_title_is_rejected() {
        let dir = tempdir().unwrap();
        let error = save_to_path(&dir.path().join("daten.json"), &sample("  ")).unwrap_err();
        assert!(error.contains("Bitte einen Titel eingeben."));
    }

    #[test]
    fn corrupt_json_is_reported_and_untouched() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("daten.json");
        let corrupt = b"{not json";
        fs::write(&path, corrupt).unwrap();
        assert!(load_from_path(&path).unwrap_err().contains("beschädigt"));
        assert_eq!(fs::read(&path).unwrap(), corrupt);
    }

    #[test]
    fn corrupt_file_blocks_save_and_preserves_original() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("daten.json");
        let corrupt = b"{not json";
        fs::write(&path, corrupt).unwrap();

        assert!(save_to_path(&path, &sample("Neu")).is_err());
        assert_eq!(fs::read(&path).unwrap(), corrupt);
    }
}
