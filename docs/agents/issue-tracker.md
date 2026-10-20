# Issue tracker: Local Markdown

Issues and PRDs for this repo live as Markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The PRD is `.scratch/<feature-slug>/PRD.md`
- Implementation issues are `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`
- Triage state is recorded as a `Status:` line near the top of each issue file; see `triage-labels.md` for the approved status strings.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading.

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/`, creating the directory if needed.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or issue number directly.

## Completion

When work for an issue is completed, set its `Status:` line to `done`.

## Wayfinding operations

Used by `/wayfinder`. The map is `.scratch/<effort>/map.md`; child tickets are `.scratch/<effort>/issues/<NN>-<slug>.md`.

- Record `Type:` as `research`, `prototype`, `grilling`, or `task`.
- Record `Blocked by:` with ticket numbers when applicable.
- A ticket is unblocked when every ticket it lists is complete.
- Claim work by setting `Status: claimed` before beginning.
- Resolve work by appending the answer under `## Answer`, setting `Status: resolved`, and updating the map's decisions.
