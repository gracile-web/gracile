# Contributing to the Gracile code base

> [!WARNING]  
> Work-in-progress

Thanks for being willing to make Gracile better!

Hopefully, the barrier to contributing is kept manageable, due to a constrained code-base and toolchain.

## Steps

You need [PNPM](https://pnpm.io/installation), via, for example, Node Corepack.

```sh
git clone git@github.com:gracile-web/gracile.git

cd gracile

git checkout next

git checkout -b feat/my-feat # or fix|chore|…

pnpm install

pnpm dev

# Do modifications in the sources
# ...

# Release
pnpm format:fix

pnpm build

pnpm lint:es:fix

pnpm test

git add .
git commit -m "feat: my-feat"

git push --set-upstream origin feat/my-feat
```

Then open a Pull Request named "feat/my-feat", from the `feat/my-feat` branch to the `next` branch.

---

See also the [Starter projects repository](https://github.com/gracile-web/starter-projects) and use the `link:` protocol inside their package.json files, while testing.  
That way, you'll be able to use them with your locally developed Gracile version.

---

<!--

nodemon -w 'node_modules/@gracile' -x 'vite dev'

-->

## Testing

The `./local-ci.sh` can be used locally to simulate the GitHub CI pipeline.  
No git hooks with Lint-Staged on this repo! It slows down things too much,
so instead you'll have to remember to launch this local pipeline before
the ultimate merge.  
Intermediate commits on a PR that fails a CI is OK. CI passing is only required
before merging the `fix|feat` branch to the `next` integration branch.

Gracile is still in a sub `<1.x` version, with many breaking changes all over.
As creating tests for fast moving targets is a waste of time,
coverage is kept empiric; and added to stabilize APIs that are mostly settled and
are **user-facing** (e.g. `defineRoute`).

### Integration

Most of the testing is achieved here for now, because it offers the most bang for the buck
for the end user,
but it is slower than unit tests, and not optimized well enough yet.  
The main reason is due to spinning up real Vite dev/build instances that provoke file system/network conflicts (HMR, server…).  
Workaround: **tests are sequential**, but they could be re-instated to parallel or semi-parallel runs.

The main technique used for Gracile integration tests is snapshots comparison of server-produced responses.  
Correctness of user-facing package exports is also covered.

### Unit

Most critical aspects of the framework are meant to be unit-tested, with
priority to the core, for now.

### End-to-end

Head over to the [starter projects](https://github.com/gracile-web/starter-projects)
where you can find Playwright test suites for each template in build and dev modes.

They simulate route navigation, compare screenshots to be sure that nothing broke,
and more advanced interactions, notably with client/server communication.

## More

- [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
