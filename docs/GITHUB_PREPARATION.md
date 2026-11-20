# GitHub repository and submission

Public repository: [Emotional Companion Puppy](https://github.com/yangyiran-01/emotional-companion-puppy). The user created the repository, supplied its URL and authorised the code upload. Its visibility was verified as public, with `main` as the default branch.

Local `main` is associated with `origin`. The original remote README commit is preserved in the merge history, and its short introduction was incorporated into the complete README. No force push was used to overwrite remote history. Source code, storyboards and development evidence are recorded in actual commits.

```sh
git clone https://github.com/yangyiran-01/emotional-companion-puppy.git
cd emotional-companion-puppy
npm ci
npm run dev
```

Use `git log --oneline --decorate`, `git status` and `git rev-parse HEAD` to inspect the version before and after changes. The first review snapshot uses the tag `demo-evidence-2026-11-17`. Final submission selection and user acceptance require explicit confirmation.

Pre-submission checks include `npm run check`, README word-count verification and inspection of the staged files. Do not commit `.env`, keys, private conversations, dependencies, build output or temporary tool files.

The README's Prose Word Count is generated with `npm run readme:count` and checked with `npm run readme:check`. Preserve outstanding items in the development and test records until they are actually completed. Add a project licence only after one is selected; dependencies retain their own licences.

Public source code does not mean the application is hosted online. Use the localhost instructions in the README. After pushing, verify that the GitHub remote `main` hash matches the local commit.
