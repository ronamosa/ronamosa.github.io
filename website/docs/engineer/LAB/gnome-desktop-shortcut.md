---
title: How to Set Up CursorAI AppImage on GNOME Desktop (Linux)
description: Integrate the CursorAI AppImage into your GNOME desktop environment like a native app.
slug: setup-cursorai-appimage-gnome
tags:
  - linux
  - appimage
  - gnome
  - setup
  - cursorai
---

I needed to setup [CursorAI](https://www.cursor.com/) on my Linux desktop as a native application. Here are the instructions for setting it up on Ubuntu/GNOME.

## 📁 1. Move AppImage to a Permanent Location

Choose a permanent directory and move the AppImage there, I have a `~/bin/` folder that's in my `$PATH` so anything I drop there is available on CLI, or create one like `~/Applications` below:

```bash
mkdir -p ~/Applications
mv ~/Downloads/CursorAI*.AppImage ~/Applications/CursorAI.AppImage
chmod +x ~/Applications/CursorAI.AppImage
```

---

## 📝 2. Create a Desktop Entry

Create a `.desktop` file so GNOME can recognize it as a launchable app:

```bash
nano ~/.local/share/applications/cursorai.desktop
```

Paste the following into the file:

```ini
[Desktop Entry]
Name=CursorAI
Exec=/home/YOUR_USERNAME/Applications/CursorAI.AppImage
Icon=/home/YOUR_USERNAME/Applications/cursorai.png
Type=Application
StartupNotify=true
Categories=Development;AI;
Comment=Cursor – the AI coding assistant
Terminal=false
```

> 🔁 Replace `/home/YOUR_USERNAME/Applications/` with the actual path to your AppImage and icon.

---

## ✅ 3. Make the Desktop Entry Executable

```bash
chmod +x ~/.local/share/applications/cursorai.desktop
```

---

## 🔄 4. Refresh the App Database

```bash
update-desktop-database ~/.local/share/applications
```

---

## 📌 5. Pin to Dock (Optional)

After it appears in your App Grid (Activities), right-click the icon and choose **“Add to Favorites”** to pin it to your dock.

---

## 🖥️ 6. Add CLI Shortcut (Optional)

To run CursorAI from the terminal:

```bash
sudo ln -s ~/Applications/CursorAI.AppImage /usr/local/bin/cursorai
```

---

## 🎨 Icon Tip

To extract the official icon from the AppImage:

```bash
./CursorAI.AppImage --appimage-extract
```

Then find the icon inside the `squashfs-root` directory and move it to your preferred location.

---

## 🚀 Alternative: AppImageLauncher

If you want a more automated experience, consider using [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher) which handles integration, updates, and menu entries automatically.

---
