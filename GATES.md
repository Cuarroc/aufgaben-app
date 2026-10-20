# Gates: REF-APP-1 S1 Nachbesserung Runde 1

Scope: Die geprüften Datenverlust- und Nebenläufigkeitsfehler sind regressionsgetestet behoben, die billigen Sicherheitskorrekturen sind enthalten und der Windows-Build bleibt startbar.

- [ ] R1: Frontend-Regressionstests bestehen
  CHECK: npm test && echo FRONTEND_TESTS_OK
  EXPECT: FRONTEND_TESTS_OK
  EVIDENCE: pending

- [ ] R2: Rust-Regressionstests bestehen
  CHECK: cargo test --manifest-path src-tauri/Cargo.toml && echo RUST_TESTS_OK
  EXPECT: RUST_TESTS_OK
  EVIDENCE: pending

- [ ] R3: Rust-Code ist formatiert und ohne Clippy-Warnungen
  CHECK: cargo fmt --manifest-path src-tauri/Cargo.toml --check && cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings && echo RUST_QUALITY_OK
  EXPECT: RUST_QUALITY_OK
  EVIDENCE: pending

- [ ] R4: Frontend-Produktionsbuild besteht
  CHECK: npm run build && echo FRONTEND_BUILD_OK
  EXPECT: FRONTEND_BUILD_OK
  EVIDENCE: pending

- [ ] R5: Windows-Produktionsbuild erzeugt erneut den NSIS-Installer
  CHECK: npm run tauri build && echo TAURI_BUILD_OK
  EXPECT: TAURI_BUILD_OK
  EVIDENCE: pending

- [ ] R6: Der freigegebene Abnahmevertrag ist unverändert
  CHECK: git diff --exit-code 3bdbb2f..HEAD -- docs/ABNAHMEVERTRAG.md && git diff --exit-code -- docs/ABNAHMEVERTRAG.md && echo CONTRACT_UNCHANGED
  EXPECT: CONTRACT_UNCHANGED
  EVIDENCE: pending

- [ ] R7: Der gebaute Prozess zeigt Testprojekt A und Erste Aufgabe nach vollständigem Beenden und Neustart erneut
  EVIDENCE: pending

- [ ] R8: Alle Änderungen sind auf dem aktuellen Branch lokal committtet; Push und gh wurden nicht ausgeführt
  EVIDENCE: pending
