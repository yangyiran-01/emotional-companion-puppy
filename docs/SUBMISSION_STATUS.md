# Submission and review status

Last updated: 20 November 2026, Europe/London. This checklist distinguishes public implementation evidence, the locally prepared report and outstanding acceptance work.

| Requirement | Current evidence / status |
| --- | --- |
| Developed system or simulation | Working local Demo; real UI, state changes and suggestion decisions; reply text simulated |
| System diagram | `architecture-current.svg` and `ARCHITECTURE.md`; actual modules, flows and status labels |
| Two or three illustrated interactions | Three SVG storyboards, ten panels, HTML viewer and executable replay data in `storyboards/` |
| Public repository and README | [Emotional Companion Puppy](https://github.com/yangyiran-01/emotional-companion-puppy) and its [README](https://github.com/yangyiran-01/emotional-companion-puppy/blob/main/README.md); main is the development review branch |
| Submitted commit or release | Local review snapshot is not final acceptance; final submitted version has not been selected |
| Development record | `DEVELOPMENT_RECORD.md`, test results and real Git history; no backdated history |
| AI assistance and resource attribution | README examples, `ASSET_PROVENANCE.md`, `THIRD_PARTY_NOTICES.md` |
| References | Source inventory in `REFERENCES.md`; the local report also cites verified A1 literature and supplied lecture slides |
| Weeks 1–4 concepts and A1 evidence | Local A1 and course files were subsequently found and used in the report; private course files are not published; specific lecturer feedback was not found |
| Abstract and main report | English Word report prepared locally after the user's later explicit request; not uploaded with the source code |
| Report word count | First page states 181 abstract words and 1,078 main words, totalling 1,259, under its stated counting method; eight rendered pages inspected |
| User testing | Developer checks are not acceptance; awaiting the user's own test and explicit decision |

## Submission choices still open

The teacher permits prototypes and simulations, so a clearly labelled Demo is a legitimate scope to explain. This does not mark the user's originally planned real-AI integration as complete. The user must decide the final submission scope after testing; do not silently change the project objective.

The teacher does not require Figma, a video, a specific drawing tool or formal participant research in the supplied brief. Figma prototype connections remain an unfinished item in the user's own delivery plan, not an invented teaching requirement. Repository files do not need an extra ZIP; use one only if material genuinely cannot go in the repository.

The brief specifies up to 300 abstract words, around 1,000 / maximum 1,100 main words, and a combined maximum of 1,400. It also says reading may stop after 1,300 counted words if the report significantly exceeds its limit. The local report remains within these limits; explanatory prose was not moved into figures to evade counting. It identifies code snapshot `57c566d`, without establishing final user acceptance or a submitted release.

## Inspect the local version

```sh
git log --oneline --decorate -5
git rev-parse HEAD
git remote -v
```

The tag [`demo-evidence-2026-11-17`](https://github.com/yangyiran-01/emotional-companion-puppy/tree/demo-evidence-2026-11-17) identifies the original evidence-review snapshot. Verify its local version with `git show --no-patch demo-evidence-2026-11-17`. Later naming and repository-integration commits are visible in [the main branch history](https://github.com/yangyiran-01/emotional-companion-puppy/commits/main/). These are review versions, not final user acceptance. Choose and record the exact submitted commit only when the submission scope is confirmed.
