---
title: "How to Decode Stuff."
---

Just some quick notes that someone might find useful, if they were, I dunno, doing a hacking challenge and needed a clue:

I would probably look up where I could install and run some Python code...?

Once I had that setup, I'd have a good look at this code below...

```python
from Crypto.Cipher import AES
import base64

def decrypt(enc, key):
    enc = base64.b64decode(enc)
    iv = enc[:16]
    cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
    return cipher.decrypt(enc[16:]).decode('utf-8').strip()

encrypted_message = "<paste encrypted message here>"
key = "mysecretdecryptionkey1234"  # Replace this with the key you found
print(decrypt(encrypted_message, key))
```

This could be very handy, I just need the encrypted message string, a key I'm supposed to find on this site somewhere- and it shoud be "open sesame" time!