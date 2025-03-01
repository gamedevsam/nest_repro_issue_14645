# Setup

## Pre-requisites

### Node

The recommended way to install node is with [fnm](https://github.com/Schniz/fnm):

```bash
# Install fnm
curl -fsSL https://fnm.vercel.app/install | bash && source ~/.bashrc

# Install Node
fnm use --install-if-missing
```

## Pnpm package manager

We use pnpm to manage our package dependencies, install it like so:

```bash
# Install & activate pnpm
corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
pnpm install

# Launch: http://localhost:3000
pnpm run dev
```

## Troubleshooting

Make sure you don't have any other node versions installed, then try re-installing [Schniz/fnm](https://github.com/Schniz/fnm?tab=readme-ov-file#installation).

- Linux: https://stackoverflow.com/a/33947181
- Mac: https://stackoverflow.com/questions/11177954/how-do-i-completely-uninstall-node-js-and-reinstall-from-beginning-mac-os-x

