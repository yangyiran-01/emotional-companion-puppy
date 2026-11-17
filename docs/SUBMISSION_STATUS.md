# Submission and review status

Last updated: 17 November 2026, Europe/London. This is a checklist, not the Assignment 2 report. Report prose remains outside this development task under the user's earlier instruction.

| Requirement | Current evidence / status |
| --- | --- |
| Developed system or simulation | Working local Demo; real UI, state changes and suggestion decisions; reply text simulated |
| System diagram | `architecture-current.svg` and `ARCHITECTURE.md`; actual modules, flows and status labels |
| Two or three illustrated interactions | Three SVG storyboards, ten panels, HTML viewer and executable replay data in `storyboards/` |
| Public repository and README | README prepared; requested remote repository name `Yoyo-project`; publication requires GitHub connection |
| Submitted commit or release | Local review snapshot is not final acceptance; final submitted version has not been selected |
| Development record | `DEVELOPMENT_RECORD.md`, test results and real Git history; no backdated history |
| AI assistance and resource attribution | README examples, `ASSET_PROVENANCE.md`, `THIRD_PARTY_NOTICES.md` |
| References | Verified source inventory; actual A1 references and lecture sources still needed |
| Weeks 1–4 concepts and A1 evidence | Evidence map prepared; local course materials and exact passage mapping not yet supplied or confirmed |
| Abstract and main report | Deliberately not written; up to 300 words abstract, around 1,000 / maximum 1,100 main words; combined maximum 1,400 |
| Report word count | Later: put total count on first page; rationale-table prose counts; short figure labels and references excluded |
| User testing | Developer checks are not acceptance; awaiting the user's own test and explicit decision |

## Submission choices still open

The teacher permits prototypes and simulations, so a clearly labelled Demo is a legitimate scope to explain. This does not mark the user's originally planned real-AI integration as complete. The user must decide the final submission scope after testing; do not silently change the project objective.

The teacher does not require Figma, a video, a specific drawing tool or formal participant research in the supplied brief. Figma prototype connections remain an unfinished item in the user's own delivery plan, not an invented teaching requirement. Repository files do not need an extra ZIP; use one only if material genuinely cannot go in the repository.

The brief also says reading may stop after 1,300 counted words if the report significantly exceeds its limit. A later report should aim near the requested lengths rather than filling every maximum, and must not move explanatory paragraphs into figures to evade counting.

## Inspect the local version

```sh
git log --oneline --decorate -5
git rev-parse HEAD
git remote -v
```

The local tag `demo-evidence-2026-11-17` identifies the evidence-review snapshot once created; verify it with `git show --no-patch demo-evidence-2026-11-17`. It does not mean final project acceptance. After publication, record the actual public repository URL and the commit selected for submission; do not insert a guessed link.
