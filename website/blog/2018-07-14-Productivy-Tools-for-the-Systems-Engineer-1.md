---
title: "Productivity Tools & Tips for the Professional DevOps Engineer - Part 2."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [career, devops, tools]
---

In your professional life, you're going to come across and use a wide range of applications and tools to get the job done. I'm always amazed when looking over someone's shoulder (with their permission of course haha) and seeing how they do their "thing", even if we both do the same job, people will have their favourite apps and ways of doing things (some of it is insightful, others - annoying haha).

I wanted to list and give a brief overview and explanation of why I use the things I do, for the things I do ;)

In this post I'm going to look at the Operating System, text editors, Terminals and finally Desktop Management tools.

<!--truncate-->

## Operating Systems (OS)

### Linux (of course)

The OS of choice is Linux (always will be). Usually running on a Lenovo ultrabook of some kind (currently using a [T450 Ultrabook](https://www.lenovo.com/us/en/laptops/thinkpad/t-series/t450/)).

I run [Xubuntu 18.04](https://xubuntu.org/download).

Mainly just to avoid the bloat that comes with the standard [Ubuntu 18.04 LTS](https://www.ubuntu.com/download/desktop/thank-you?version=18.04&architecture=amd64) Desktop install. I know you can remove it, but why put yourself through that ordeal in the first place!?

### Windows

It's usually a good idea to have a windows OS handy either for applications a company uses that doesn't have a linux equivalent. [Windows 10 Professional](https://www.microsoft.com/en-us/p/windows-10-pro/df77x4d43rkt/48DN). If its for work, always Pro.

:::note

_I'm speaking from a contractors p.o.v. in that I'm purchasing these things. You won't have a say if the company's providing the hardware, but you'll usually get the latest Microsoft Windows OS anyway._

:::

## Editors

### [Atom](https://atom.io/)

#### What Do I Use It For?

Editing files obviously. I'm talking code or programming files that need editing. Usually if it involves editing multiple files from the same repo and I need to see files side-by-side, or editing a lot of lines simultaneously I'll use Atom.

#### What's So Great About It?

* Lots of plugins. You can add any syntax highlighters so you can see you code clearly. You have integrations with git so you can do all your [SCM](https://en.wikipedia.org/wiki/Software_configuration_management) all from the comfort of your Atom editor - add, commit, push files to your repos etc.
* folder structure down the left with files changing color if edited so you can see what files in your repo have changed.

### [Haroopad](http://pad.haroopress.com/)

#### What Do I Use It For

For anything distinctly MARKDOWN I'll use haroopad. So mostly my blog posts because they're all markdown (see: [Jekyll](https://jekyllrb.com/)), and README.md files for [git repos](https://github.com/ronamosa).

#### What's So Great About It

It has a display panel to preview your markdown files as you edit. I quite like the UI and the different themes of the preview window so you can see your markdown in different "looks".

### [Notepad++](https://notepad-plus-plus.org/)

#### What Do I Use It For

Usually when I'm on windows this is a good go-to text editor. The fonts are pretty plain i.e. monospaced, but this is the editor goes where notepad and wordpad can't as far as editing source code, config or random snippets of things like json/xml payloads.

#### What's So Great About It

It's quick. It's only available on windows.

## Terminals

If you're working with enterprise, backend systems, 99% of the time you'll need to SSH in. So, terminals. Linux comes baked in and these are my go-to's:

### Terminator (Linux)

#### What Do I Use It For?

Terminal stuff. Duh. Jokes, I use it as my "daily driver" (thanks, mobile phone reviewers who always use this term) for running everything I need to do from my terminal. SSH sessions, running git commands, editing files in vim, running docker etc.

#### What's So Great About It?

terminator lets you split as single window up into multiple sessions. What's so great about that? sometimes you need to see multiple things alongside each other in real time e.g. watching a process start in one pane while monitoring 'ps aux' or a 'tail -f /var/log/logfile.log' in another.

### Sakura (Linux)

#### What Do I Use It For?

Same as above. I just found this one recently and tend to use 'tmux' in it. Still need to play with it more. But a terminal's a terminal's a terminal usually.

#### What's So Great About It?

Nice looking terminal. Does transparency, tabbed windows, set titles to tabs.

### [MobaXterm (Windows)](https://mobaxterm.mobatek.net/)

#### What Do I Use It For?

My go-to for windows terminals. Its based on cygwin (I think) if you remember back to those days of running "bash" on Windows via cygwin (just use Linux!).

#### What's So Great About It?

It's pretty much the most full-featured terminal emulator I've used on windows. It does everything as far as connecting to remote servers, comes with a boatload of protocol connectivity capabilities (RDP, X11, SSH), does SSH Tunnels (cos those are a pain in the..), tabbed windows, SCP/SFTP browser capable - the list goes on.
_note: you will need to purchase a license for some of the more complex features, but the free version will do 98% of what you need it for anyway._

### [cmder (Windows)](http://cmder.net/)

#### What Do I Use It For?

Now, on windows my main go-to is MobaXterm, but I was recently put onto this cool terminal tool (they call it a 'console emulator') by my mate DZ and its a pretty great looking terminal with powershell built-ins.

#### What's So Great About It?

Looks good. Does CMD (dos) and Powershell.

## Desktop Tools & Managment

Here are some desktop related tools and applications that I'd recommend to make navigating your desktop space a little easier, possibly more efficient.

### [i3wm (Linux)](https://i3wm.org/)

#### What Do I Use It For?

i3wm is a tiled window manager for linux. So it's my desktop UI for all things Linux.

#### What's So Great About It?

It's light and efficient. Highly customizable so whatever key presses you want to do whatever is available to you. You can tile every application window out exactly how you want it to appear every time, and other than the fact you can do whatever you like with it, it just looks leet ;)

I mean, just look at it <3

### [Remote Desktop Connection Manager (RDCM)](https://www.microsoft.com/en-us/download/confirmation.aspx?id=44989)

#### What Do I Use It For?

Keeping all your remote desktop connection sessions in one place.

#### What's So Great About It?

If you need to jump between a lot of remote desktop connections without disconnecting or having to alt-tab and switch windows, then you add all your connection session details here. If you set the hierarchy up correctly you can have all child sessions inherit the same logins and display settings which saves you doing it manually for each session.

### [picPick (Windows)](https://picpick.app/en/download)

#### What Do I Use It For?

Screenshots of your desktop. Editing image files.

#### What's So Great About It?

Lots of features. Keyboard shortcuts and lots of intuitive options like autosave settings, auto file-name settings. I use this app to capture and quickly edit screenshots for technical documentation, or to quickly illustrate things like this:

### [LastPass (Chrome Extension / Mobile App)](https://www.lastpass.com/business-password-manager)

#### What Do I Use It For?

Manage all your passwords and secure notes and details.

#### What's So Great About It?

Easily manage, update, generate secure passwords, access from any browser or mobile app so you're never without access to your passwords. You can set the password generating policies so it will "randomly" generate any password to match whatever the system password policy is e.g. capital letters, no more than 16 characters etc.
e.g.

## Coming up Next Time

Didn't realise how long that was going to take so splitting the action into two posts for your consuming pleasure (and also cos I need a break haha).

Keep your eyes out for part deuce where I get into the tools and applications most used across projects I work on!
