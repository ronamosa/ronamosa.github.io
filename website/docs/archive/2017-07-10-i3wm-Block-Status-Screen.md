---
title: i3wm (Window Manager) + Blocks + Screencasting
---

Setup screencasting on your i3wm window manager for Linux.

Running i3wm can be a bit arduous, but if you like Linux and avoiding bloaty McBloatware setups like Ubuntu then running i3wm and hacking away at things can be very rewarding. In this post I will go over the following tasks to set up:

1. the screencasting script.
2. the i3 keybinding for stop/start.
3. the i3 blocks setup for displaying the "record" status in the status bar.

## Setup Screencasting Function

### Requirements

* Just need `ffmpeg` installed (`$ sudo apt install -y ffmpeg`).

### The Screencast Script

Put this script somewhere in you `$PATH`

```bash
#!/usr/bin/env bash
# start|stop screencast

set -o errexit
set -o pipefail

PIDFILE="$\{HOME}/.screencast.pid"
OUTFILE="/tmp/out.avi"
FINALFILE="$\{HOME}/Videos/ScreenCasts/screencast--$(date +'%Y-%m-%d--%H-%M-%S').avi"

# check if this script is already running
if [ -s $PIDFILE ] && [ -d "/proc/$(cat $PIDFILE)" ]; then

    # send SIG_TERM to screen recorder
    kill $(cat $PIDFILE)

    # clear the pidfile
    rm $PIDFILE

    # move the screencast into the user's video directory
    mv $OUTFILE $FINALFILE
else
    # screen resolution
    SCREENRES=$(xrandr -q --current | grep '*' | awk '{print$1}')

    # write to the pidfile
    echo $$ > $PIDFILE &&

    # let the recording process take over this pid
    exec ffmpeg \
      -f pulse \
      -i default \
      -ac 2 \
      -acodec vorbis \
      -f x11grab \
      -r 25 \
      -s $\{SCREENRES} \
      -i :0.0 \
      -vcodec libx264 $\{OUTFILE}
fi
```

### script run-down

* When the script is called it checks if the PID file already exists ( `if` statement looking for file at location $PIDFILE or running process under `/proc/`) which means its "running" and the current call to it is to STOP.

* If its running, kill it and remove $PIDFILE and move the temporary recording file to its final resting place under (in this case) `$HOME/Videos/`

* If its NOT running, we calculate the SCREENRES (several options you can substitute here) and let loose with the recording process (ffmpeg here but you can run anything here) and send that process to $PIDFILE

## i3wm Keybinding Setup

In your `~/.i3/config` file make sure to have the following:

set your 'screencast' variable to point to the script you setup in step #1

`set $screencast bash ~/scripts/screencast`

then create your keybinding to execute (start/stop) your screencast script:

`bindsym $mod+Shift+s    exec $screencast`

note: this (for me) does `WindowsKey + Shift + s`

you'll need to restart i3wm for these changes to take effect (my reload keybinding is `WindowsKey + Shift + r`)

## i3blocks Status Bar Setup

You'll need to already have i3blocks setup, I might write something up on it another time, for now, if you have it working already, this section will just show you what I did to ensure when I hit my keybinding a 'record' notification would show up and disappear when recording was happening.

In your `~/.i3/i3blocks.conf` check the following sections are as follows:

globlal properties

```ini
command=~/.i3/blocks/$BLOCK_NAME
separator_block_width=15
markup=none
```

screencast entry:

```ini
[record]
label=
interval=2
color=#FF0000
```

note: set whatever label, interval, color you want **but** the word you use between the '[]' **must** match the next section.

following the global properties directive, your screencast 'command' must live in `~/.i3/blocks/`, and the $BLOCK_NAME will be, in line with my example, called 'record'

so, file `~/.i3/blocks/record` will have the following:

```bash
#!/usr/bin/env bash
set -o errexit
set -o pipefail

# check screencast PID

PIDFILE="$\{HOME}/.screencast.pid"

if [[ -e "$\{PIDFILE}" ]]; then
  echo "RECORD"
  echo "RECORD"
  echo ""
fi
```

sets the PIDFILE location to look for, then check it if exists (-e). i3blocks will capture this status and activate the icon set in the 'label' for this entry in i3blocks.conf, and then show it in the status bar like this (when you press your keybinding combo once):
![i3blocks-record-on](/img/archive/i3blocks-status-on.png)

pressing your keybinding combo again will turn record OFF:
![i3blocks-record-off](/img/archive/i3blocks-status-off.png)

and you should find a new screencast video in your ~/Videos/ScreenCast folder (or wherever you set it in the screencast script above):
![i3blocks-new-video](/img/archive/i3blocks-new-video.png)

That's it! Enjoy and contact me if you have any questions I'll do my best to answer or find an answer for you :).
