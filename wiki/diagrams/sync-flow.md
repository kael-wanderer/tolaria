# Diagram: upstream sync flow

Visual-only. Steps in [reference/how-to-sync.md](../reference/how-to-sync.md).

Legend: **lookup** = fetch upstream · **action** = re-apply customizations / verify · **guard** = decision · **reject** = conflict path · **audit** = log write · **session** = confirm/publish.

```mermaid
flowchart TD
  classDef guard   fill:#FFF4CC,stroke:#E6C200,color:#333;
  classDef action  fill:#CDEFD9,stroke:#4CAF7D,color:#333;
  classDef lookup  fill:#CFE8FB,stroke:#4A90D9,color:#333;
  classDef session fill:#E6DAF7,stroke:#9B72CF,color:#333;
  classDef audit   fill:#FBD5DD,stroke:#E0708A,color:#333;
  classDef reject  fill:#FCE0C8,stroke:#E8954A,color:#333;

  S([author ships update]):::session --> F[git fetch upstream]:::lookup
  F --> CMP[/review upstream/main log/]:::lookup
  CMP --> RB[rebase/merge main onto upstream/main]:::action
  RB --> Q{conflicts?}:::guard
  Q -->|yes| R[resolve at integration points<br/>keep src/customization/ intact]:::reject
  Q -->|no| V[verify: tsc · lint · tests · tauri build]:::action
  R --> V
  V --> OK{all green?}:::guard
  OK -->|no| R
  OK -->|yes| LOG[append CHANGELOG.customization.md<br/>+ wiki/02-timeline.md sync log]:::audit
  LOG --> P([git push origin main]):::session
```

> Hero PNG: export an Excalidraw version to `png/sync-flow.png` if a polished image is needed for a presentation. The Mermaid above stays the source of truth.
