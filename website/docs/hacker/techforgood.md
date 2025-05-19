---
title: "Tech for Good: 🕵️‍♀️ Decrypt the Secret Message Challenge"
---

## Mission Brief

You're part of something big — a *Tech for Good* mission. Somewhere, hidden across the web, are clues to unlock a powerful message.

You’ll need to:

- Hunt for **3 secret flags** 🏁
- Combine them into a 🔑 **decryption key**
- Use [CyberChef](https://gchq.github.io/CyberChef/) to 🔓 unlock the message

---

## 🔍 Find the 3 Hidden Flags

Each flag looks like this:

```

FLAGX{someword}

```

Explore these sites carefully:

- 🛰️ `https://www.pasifikateched.net/` *hint:* `robots.txt`
- 🧠 `https://www.theuncommon.ai/` *hint: what's in the source?*
- ⚡ `https://technesianlivestream.github.io/` → (view source and hidden elements)

Write down each flag!

Then, strip the `FLAGX{}` part and combine the words in order:  

`FLAG1`, then `FLAG2`, then `FLAG3`.

```
e.g. if your 3 flags were: FLAG1{tech}, FLAG1{for}, FLAG1{good}

your decryption key would be 'techforgood'

```

---

## 🔐 Decrypt the Message in CyberChef

Go to [CyberChef](https://gchq.github.io/CyberChef/) and follow these steps:

1. **Recipe**: Add operation `AES Decrypt`
2. **Mode**: `CBC`
3. **Key**: the phrase from your flags (e.g., `techforgood`)
4. **IV**: `0000000000000000`
5. **Input Type**: `Base64`
6. **Paste this ciphertext**:


```

eW3N1O6U4N8XTeKvKzogcr5pCOopjhYjC+aWEm7b9aYwPOn+ww9qb8sZlfqtqFgr

```

If you’ve got the correct key — boom! 🎉 You’ll unlock the message.

---

## 🏆 Bonus Questions

- What does AES stand for?
- Why do we need an IV?
- What are ways real hackers hide clues in webpages?

---

:::tip

## ✅ You Win When

You’ve decrypted the message and can explain how you found the flags.

**Cyber skills + curiosity = unstoppable.**
:::


# 🌊 *Keep building. Keep believing.*
