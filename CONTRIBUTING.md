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
