# <i-c o='ph:terminal-duotone'></i-c>Command-line interface

This are all the commands you need to interact with the Gracile engine locally.

## Commands

Gracile just re-use the Vite typical commands as such:

```sh
node --run dev
vite

node --run build
vite build

node --run preview
vite preview
```

You can alias these in `package.json` scripts, see the [manual installation guide](/docs/learn/getting-started/installation/#doc_install-manually).

---

See also the ["Create" command](/docs/learn/getting-started/installation/#doc_the-create-command) (`npm create gracile`) for bootstrapping a project in under a minute.

## Options

See the Vite [CLI](https://vitejs.dev/guide/cli) options.

### `create-gracile` options

```text
  -d, --location <string>        Project directory location.

  -t, --template <string>        Choose a starter template. Available:
                                 minimal-static, minimal-server-express,
                                 minimal-server-hono, basics-blog-static,
                                 basics-server

  -n, --next                     Use the `next` version of the selected template.

  -i, --install-dependencies     Automatically install dependencies with your detected
                                 package manager.

  -g, --initialize-git           Initialize a git repository after setting up your project.

  -s, --use-previous-settings    Whether or not we should load previous settings.

  -r, --clear-previous-settings  Clear previously saved settings.

  -h, --help                     display help for command
```

---

`npm create gracile@next` can be used to try the pre-release version of the `create-gracile`, CLI, too.

<!-- ```text
  -p, --port <number>  Assign a local port (overrides config. file)
  -h, --host           Expose the server to you local network (0.0.0.0)
  --help               display help for command
``` -->
