# Gates: REF-APP-1 S1 Durchstich

Scope: Eine installierbare Windows-App speichert ein Projekt und eine Aufgabe atomar und stellt beide nach einem Neustart wieder her.

- [x] G1: Die Frontend-Validierung zeigt den vereinbarten Hinweis für einen leeren Aufgabentitel
  CHECK: npm test && echo FRONTEND_TESTS_OK
  EXPECT: FRONTEND_TESTS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Cuarr\orca\.projecta-worktrees\wk-1a15aca65e8-22; path=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=22d3bcdece663dbd00ba206014fe45565f7aec2cce14747e0f5eb7c6c4fd326a; output-bytes=288

- [x] G2: Die Rust-Speicherlogik erfüllt Roundtrip, Ausfallsicherheit, Backup, Validierung und Korruptionsschutz
  CHECK: cargo test --manifest-path src-tauri/Cargo.toml && echo RUST_TESTS_OK
  EXPECT: RUST_TESTS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Cuarr\orca\.projecta-worktrees\wk-1a15aca65e8-22; path=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=1ebfb31689e153ff044931c3d21928f9470832ac97fe61b34267173526455a2b; output-bytes=1284

- [x] G3: Der Windows-Produktionsbuild erzeugt einen NSIS-Installer
  CHECK: npm run tauri build && echo TAURI_BUILD_OK
  EXPECT: TAURI_BUILD_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Cuarr\orca\.projecta-worktrees\wk-1a15aca65e8-22; path=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=98f5574f0867e74d1544da2d607ffe97ac9eaca6fd6701ac3aabbc5f009ee156; output-bytes=1737

- [x] G4: Der freigegebene Abnahmevertrag ist unverändert
  CHECK: git diff --exit-code -- docs/ABNAHMEVERTRAG.md && echo CONTRACT_UNCHANGED
  EXPECT: CONTRACT_UNCHANGED
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Cuarr\orca\.projecta-worktrees\wk-1a15aca65e8-22; path=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=8afe2530b33f1784210b38bfdaf044f3ca4ba01649544159cde2618bd60e5598; output-bytes=20

- [x] G5: Der gebaute Prozess speichert Testprojekt A mit Erste Aufgabe und zeigt beide nach vollständigem Beenden und erneutem Start
  EVIDENCE: EXE gestartet, Testdaten angelegt, PID 102036 nach Fensterschluss nicht mehr vorhanden; Neustart als PID 44772 zeigte Projekt und Aufgabe im Accessibility-Baum und Screenshot.

- [ ] G6: Die beauftragten Änderungen sind lokal auf Branch s1-durchstich committtet, ohne Push oder gh-Aufruf
  EVIDENCE: pending
