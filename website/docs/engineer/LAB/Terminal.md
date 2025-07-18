---
title: "Terminal and OMZ Prompt Setup"
---

![terminal](/img/terminal-omz-p10k.png)

Documenting how I set my terminal up with `oh-my-zsh`, `powerlevel10k` theme and plugins. I use Gnomes [terminator](https://gnome-terminator.org/) terminal with tmux.

## Pre-requisites

### Remove existing install

from terminal: `uninstall_oh_my_zsh`

### Install ZSH

from terminal: `sudo apt install zsh`

## Install oh-my-zsh

visit [oh-my-zsh](https://ohmyz.sh/#install):

`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`

### default ~/.zshrc

I've stripped most of the comments out to leave the active lines

```sh
# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# theme
ZSH_THEME="robbyrussell"

# Uncomment the following line to use case-sensitive completion.
CASE_SENSITIVE="true"

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
plugins=(git)

# reload zsh config
source $ZSH/oh-my-zsh.sh
```

### Make oh-my-zsh default shell

Run: `$ sudo chsh -s $(which zsh) $(whoami)`.

Close and re-open your terminal.

## Powerlevel10k Theme

Follow instructions [here](https://bytexd.com/install-powerlevel10k-zsh-theme-with-oh-my-zsh/).

`git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $\{ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k`

edit `~/.zshrc`, find & change `ZSH_THEME` to below:

```sh
ZSH_THEME="powerlevel10k/powerlevel10k"
```

reload config with `$ source ~/.zshrc`

:::note

After you source your zsrhc file and run through powerlevel10k config, you get a new `~/.p10k.zsh` and updated `~/.zshrc`.

:::

this gets added to the bottom of your `~/.zshrc` file:

```sh
# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

## Plugins

Reference: [docs](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins).

Follow these [instructions](https://gist.github.com/n1snt/454b879b8f0b7995740ae04c5fb5b7df) for my plugins setup.

### zsh-autocomplete && zsh-autosuggestions

Install both plugins to help with commands autosuggestions suggests possible commands, autocomplete completes the command without needing to press `tab` to see the full command.

![autosuggestions](/img/terminal-autosuggestions.png)

zsh-autosuggestions: `git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions`

![autocompletes](/img/terminal-autocompletes.png)

zsh-autocomplete: `git clone --depth 1 -- https://github.com/marlonrichert/zsh-autocomplete.git $ZSH_CUSTOM/plugins/zsh-autocomplete`

Run each command to install plugins.

## zsh-syntax-highlighting && fast-syntax-highlighting

1. zsh-syntax-highlighting: `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting`
2. fast-syntax-highlighting: `git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git $\{ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting`

Run each command to install plugins.

Update your `~/.zshrc` with the following line:

```sh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete)
```

reload config with `source ~/.zshrc`
