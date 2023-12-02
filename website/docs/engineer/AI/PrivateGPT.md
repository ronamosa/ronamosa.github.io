---
title: "PrivateGPT: Local, Secure, Private, Chat with My Docs."
---

:::info

Following [PrivateGPT 2.0 - FULLY LOCAL Chat With Docs (PDF, TXT, HTML, PPTX, DOCX, and more)](https://www.youtube.com/watch?v=XFiof0V3nhA&ab_channel=MatthewBerman) by Matthew Berman.

:::

## Specs

Created an VM on proxmox, running:

```text
bot@ai:~/projects/privateGPT$ cat /etc/*release*
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.3 LTS"
PRETTY_NAME="Ubuntu 22.04.3 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.3 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```

## Requirements

- PrivateGPT [repo](https://github.com/imartinez/privateGPT.git)
- PrivateGPT Installation [docs](https://docs.privategpt.dev/installation)
- [Poetry](https://python-poetry.org/docs/#installation)

## Linux

```bash
git clone https://github.com/imartinez/privateGPT
cd privateGPT

# install script pyenv
curl https://pyenv.run | bash

# add to ~/.bashrc
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# install libs
pyenv install 3.11

Downloading Python-3.11.6.tar.xz...
-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz
Installing Python-3.11.6...

Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/bz2.py", line 17, in <module>
    from _bz2 import BZ2Compressor, BZ2Decompressor
ModuleNotFoundError: No module named '_bz2'
WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/curses/__init__.py", line 13, in <module>
    from _curses import *
ModuleNotFoundError: No module named '_curses'
WARNING: The Python curses extension was not compiled. Missing the ncurses lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/ctypes/__init__.py", line 8, in <module>
    from _ctypes import Union, Structure, Array
ModuleNotFoundError: No module named '_ctypes'
WARNING: The Python ctypes extension was not compiled. Missing the libffi lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
ModuleNotFoundError: No module named 'readline'
WARNING: The Python readline extension was not compiled. Missing the GNU readline lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/sqlite3/__init__.py", line 57, in <module>
    from sqlite3.dbapi2 import *
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/sqlite3/dbapi2.py", line 27, in <module>
    from _sqlite3 import *
ModuleNotFoundError: No module named '_sqlite3'
WARNING: The Python sqlite3 extension was not compiled. Missing the SQLite3 lib?
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/lzma.py", line 27, in <module>
    from _lzma import *
ModuleNotFoundError: No module named '_lzma'
WARNING: The Python lzma extension was not compiled. Missing the lzma lib?
Installed Python-3.11.6 to /home/bot/.pyenv/versions/3.11.6

# intall missing libs
sudo apt update
sudo apt install libbz2-dev libncurses5-dev libncursesw5-dev libreadline-dev libsqlite3-dev libssl-dev libffi-dev zlib1g-dev liblzma-dev

# success
bot@ai:~/projects/privateGPT$ pyenv install 3.11
pyenv: /home/bot/.pyenv/versions/3.11.6 already exists
continue with installation? (y/N) y
Downloading Python-3.11.6.tar.xz...
-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz
Installing Python-3.11.6...
Installed Python-3.11.6 to /home/bot/.pyenv/versions/3.11.6

# install
pyenv local 3.11

# install Poetry
curl -sSL https://install.python-poetry.org | python3 -

Retrieving Poetry metadata

# Welcome to Poetry!

This will download and install the latest version of Poetry,
a dependency and package manager for Python.

It will add the `poetry` command to Poetry's bin directory, located at:

/home/bot/.local/bin

You can uninstall at any time by executing this script with the --uninstall option,
and these changes will be reverted.

Installing Poetry (1.7.1): Done

Poetry (1.7.1) is installed now. Great!

To get started you need Poetry's bin directory (/home/bot/.local/bin) in your `PATH`
environment variable.

Add `export PATH="/home/bot/.local/bin:$PATH"` to your shell configuration file.

Alternatively, you can call Poetry explicitly with `/home/bot/.local/bin/poetry`.

You can test that everything is set up by executing:

`poetry --version`

# add to ~/.bashrc for poetry
export PATH="/home/bot/.local/bin:$PATH"


```
