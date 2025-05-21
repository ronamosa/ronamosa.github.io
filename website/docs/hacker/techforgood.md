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

Explore these sites carefully, find the flags:

- 🛰️ `https://www.pasifikateched.net/` *hint: have a look at the Tech Workshop page source...*
- ⚡ `https://technesianlivestream.github.io/docs/` *hint: so many cool episodes! Ep4 looks interesting...*
- - 🧠 `https://www.theuncommon.ai/` *hint: robots.txt*

Write down each flag but rememeber the order!!

Then, strip the `FLAGX{}` part and combine the words in order:  

`FLAG1`, then `FLAG2`, then `FLAG3`.

```
e.g. if your 3 flags were: FLAG1{tech}, FLAG1{for}, FLAG1{good}

your decryption key would be 'techforgood'

```

---

## 🔐 Decrypt the Message in CyberChef

Go to [CyberChef](https://gchq.github.io/CyberChef/) and follow these steps:

1. Look at the left-hand-side Menu, click "Encryption/Encoding".
2. Drag & Drop "AES Decrypt" to the "Recipe" section

![CyberChef-AESDecrypt-1](/img/CyberChef-AESDecrypt-1.png)

3. Set the recipe settings to the following (drop-down menus):
4. **Key**: your secret decription key goes here, set to `UTF-8`
5. **IV**: paste this in the input box `1234567890abcdef`, set to `UTF-8`
6. **Mode**: `CBC`
7. **Input**: `Hex`
8. **Output**: `Raw`

your setup should look like this:

![CyberChef-AESDecrypt-2](/img/CyberChef-AESDecrypt-2.png)

### 🔓 Decryption Time!

Copy & Paste the key you got from putting the 3 Flags together e.g. `techforgood` into the **Key** input box.

Now, copy & paste this cipher text into the **Input** box to the right of the Recipe box...

```text title="Encrypted Text"

f8b61164367c7abcf793d89b001dbbc12ebce00d59b851f2b44ae0502b251e7544b6eefb2ccd1df53dd956c648fd942b4bbe1aeb015f455c8016caa06231c2130af08c41b3755d88f57157a121d4d146988bab1b1f9577b17e91903f5848ea2391a65642e91cc466d56c7ed3a8e6cafc280ba12779ba589873f2fad8dbbc67e7be12a46de0e024b0beeaa6b765a1bb9bc7382b5255e943648dbbd43170d90183

```

If you’ve got the correct key — boom! 🎉 You’ll see the decrypted message in the `Output` box.

![CyberChef-AESDecrypt-2](/img/CyberChef-AESDecrypt-3.png)

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
