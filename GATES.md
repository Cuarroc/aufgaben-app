# Gates: REF-APP-1 S1 Nachbesserung Runde 1

Scope: Die geprüften Datenverlust- und Nebenläufigkeitsfehler sind regressionsgetestet behoben, die billigen Sicherheitskorrekturen sind enthalten und der Windows-Build bleibt startbar.

- [x] R1: Frontend-Regressionstests bestehen
  CHECK: npm test && echo FRONTEND_TESTS_OK
  EXPECT: FRONTEND_TESTS_OK
  EVIDENCE: exit=0; shell=cmd.exe; cwd=.; path-hash=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=51235732b85fa1db710bd821708ef23fd42b522052a0efc29ec957d65c997208; output-bytes=290

- [x] R2: Rust-Regressionstests bestehen
  CHECK: cargo test --manifest-path src-tauri/Cargo.toml && echo RUST_TESTS_OK
  EXPECT: RUST_TESTS_OK
  EVIDENCE: exit=0; shell=cmd.exe; cwd=.; path-hash=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=118ed44c2864710c2591e9c839ad00ef45f1a6052cdf2835f0e9c83cb20bd04d; output-bytes=1646

- [x] R3: Rust-Code ist formatiert und ohne Clippy-Warnungen
  CHECK: cargo fmt --manifest-path src-tauri/Cargo.toml --check && cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings && echo RUST_QUALITY_OK
  EXPECT: RUST_QUALITY_OK
  EVIDENCE: exit=0; shell=cmd.exe; cwd=.; path-hash=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=c91efb95ede9e879fc76d5aca4393fa74cdd6bca6629b913db6cbf86357deccd; output-bytes=190

- [x] R4: Frontend-Produktionsbuild besteht
  CHECK: npm run build && echo FRONTEND_BUILD_OK
  EXPECT: FRONTEND_BUILD_OK
  EVIDENCE: exit=0; shell=cmd.exe; cwd=.; path-hash=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=5734f340ae9fb641112a3456e6b5cda72621176a10585bc8e44a62a5d4c61d79; output-bytes=392

- [x] R5: Windows-Produktionsbuild erzeugt erneut den NSIS-Installer
  CHECK: npm run tauri build && echo TAURI_BUILD_OK
  EXPECT: TAURI_BUILD_OK
  EVIDENCE: exit=0; shell=cmd.exe; cwd=.; path-hash=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=baf6afbab9189e4cf38e7c0ee81518aaa729e7fe9a72f42d78f7f1ab70dca92b; output-bytes=1737

- [x] R6: Der freigegebene Abnahmevertrag ist unverändert
  CHECK: git diff --exit-code 3bdbb2f..HEAD -- docs/ABNAHMEVERTRAG.md && git diff --exit-code -- docs/ABNAHMEVERTRAG.md && echo CONTRACT_UNCHANGED
  EXPECT: CONTRACT_UNCHANGED
  EVIDENCE: exit=0; shell=cmd.exe; cwd=.; path-hash=ec92d6d9d53c/70 entries; EXPECT=matched; output-sha256=8afe2530b33f1784210b38bfdaf044f3ca4ba01649544159cde2618bd60e5598; output-bytes=20

- [x] R7: Der gebaute Prozess zeigt Testprojekt A und Erste Aufgabe nach vollständigem Beenden und Neustart erneut
  EVIDENCE: Release-EXE zeigte beide Testdaten; PID 98020 war nach Fensterschluss beendet; Neustart als PID 53424 zeigte beide Einträge erneut im Accessibility-Baum und Screenshot.

- [x] R8: Alle Änderungen sind auf dem aktuellen Branch lokal committtet; Push und gh wurden nicht ausgeführt
  EVIDENCE: Getrennte Rot-/Fix-Commits 13d5807/60f9898, 14d2ba7/eb7e9e9 und bfa76ae/25e57af sowie e3320b0 vorhanden; Abschlussnachweis wird lokal committed, ohne Push oder gh.
