# Changesets

This folder contains [changesets](https://github.com/changesets/changesets) used
to drive Gracile's releases.

## Workflow

1. After making changes to one or more packages, run `pnpm change` (alias for
   `changeset add`).
2. Select the packages you changed, the semver bump type, and write a
   release-note-style summary.
3. Commit the generated `.md` file alongside your changes.

## Release model

- **`main`** → publishes to the npm `latest` dist-tag.
- **`next`** → publishes to the npm `next` dist-tag (Changesets pre mode).

In both cases, CI on branch push runs the full build/test suite. Publishing only
happens when **pending changesets exist** on the branch. Pushes without
changesets are valid integration states and produce no release.

## Snapshots

For disposable previews:

```sh
pnpm changeset version --snapshot canary
pnpm changeset publish --tag canary --no-git-tag
```

Snapshots do not commit or tag; do not merge their version bumps back into
`main`/`next`.

## Empty changesets

For chore-only PRs that touch package paths but do not need a release, use
`pnpm changeset --empty`.
