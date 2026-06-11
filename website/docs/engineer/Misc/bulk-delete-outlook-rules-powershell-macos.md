---
title: "Bulk-Deleting Outlook Rules from a Mac with PowerShell"
description: "Mass-delete Outlook inbox rules on macOS with PowerShell 7 and Exchange Online using Get-InboxRule and Remove-InboxRule, plus fixes for the MSAL clash and Graph admin-consent wall."
keywords: ["bulk delete outlook rules", "powershell macos", "exchange online powershell", "get-inboxrule", "remove-inboxrule", "connect-exchangeonline", "inbox rules cleanup", "outlook mac"]
tags: ["powershell", "outlook", "exchange-online", "macos", "email", "automation"]
sidebar_position: 7
---

Years of "create a rule for this sender" left me with **229 Outlook inbox rules** — broken ones pointing at deleted folders, duplicates, conflicts. Outlook on macOS won't let you bulk-delete rules in the GUI, and `outlook.exe /cleanrules` is Windows-only. This is the PowerShell + Exchange Online path that actually works, plus the gotchas that nearly derailed it.

## TL;DR

Use **PowerShell 7 + the ExchangeOnlineManagement module** to drive `Get-InboxRule` / `Remove-InboxRule`. The cmdlets are trivial — the friction is all environment: an MSAL assembly clash, a tenant admin-consent wall, and interactive paste corruption.

---

## Why the GUI is a dead end on macOS

On Windows you'd open **Manage Rules & Alerts**, shift-select the lot, and delete. Or nuke everything with `outlook.exe /cleanrules`. Neither exists on macOS:

- **New Outlook for Mac and Outlook on the Web delete rules one at a time** — no multi-select.
- `/cleanrules` is a Windows-only switch.

So for bulk work, PowerShell is the way.

## 1) Get PowerShell on macOS

PowerShell isn't Windows-only anymore. Install via Homebrew:

```bash
brew install --cask powershell
```

If the stable cask fails to install (it did for me on this machine), grab the preview build — it ships as `pwsh-preview`:

```bash
brew install --cask powershell@preview
```

Confirm it runs:

```bash
pwsh-preview -v
# PowerShell 7.7.0-preview.2
```

## 2) Install the Exchange Online module

Inside PowerShell:

```powershell
Install-Module ExchangeOnlineManagement -Scope CurrentUser -Force
```

## 3) Connect

```powershell
Connect-ExchangeOnline -UserPrincipalName you@yourcompany.com
```

This opens a browser for SSO. When it lands on "Authentication complete," you're connected.

## 4) Audit before you delete

Never delete blind. Dump the rules so you can read them:

```powershell
Get-InboxRule | Select Name, Enabled, Description, Priority | Format-Table -Wrap

# or export to review properly
Get-InboxRule | Select Name, Enabled, Description, Priority | Export-Csv ~/inbox-rules.csv
```

The `Description` field is gold — it spells out each rule's condition and action in plain English, including the tell-tale `[folder not found]` for rules whose destination folder is gone.

## 5) Back up (so "undo" exists)

The CSV is human-readable but not a faithful restore artifact. Take a real one:

```powershell
Get-InboxRule | Export-Clixml ~/inbox-rules-backup.clixml
```

## 6) Bulk delete

The whole point. Target the cruft, or take it all:

```powershell
# Delete only the broken rules (destination folder deleted)
Get-InboxRule | Where-Object { $_.Description -match 'folder not found' } | Remove-InboxRule -Confirm:$false

# Or the full reset
Get-InboxRule | Remove-InboxRule -Confirm:$false
```

Two lines do what the Mac GUI can't.

---

The rest is the stuff that actually costs you time.

## Gotcha 1: Inbox rules don't run retroactively

If your plan is "delete everything, build clean rules, let them re-sort my inbox" — stop. **Server-side inbox rules only fire on incoming mail.** They will not retroactively sort the thousands of messages already in your inbox. Re-filing existing mail is a separate job: OWA's **Sweep** (move all from a sender, current and future) or a manual sort. Don't architect a migration around rules reaching backwards.

## Gotcha 2: The Exchange + Graph MSAL clash

Folder management (create/delete/rename) isn't in the Exchange module — those cmdlets were deprecated. The modern route is Microsoft Graph. If you install it and connect **in the same session**, you get:

```powershell
Connect-MgGraph -Scopes "Mail.ReadWrite"
# Connect-MgGraph: InteractiveBrowserCredential authentication failed:
# Method not found: '...Microsoft.Identity.Client...WithLogging...'
```

That `Method not found` is an **MSAL assembly version conflict**. The ExchangeOnlineManagement module loads an *older* `Microsoft.Identity.Client` into the session; Graph's auth needs a newer method the loaded assembly doesn't have.

**Fix:** run Graph in a **fresh PowerShell session** that hasn't touched Exchange. Keep two windows — one for EXO (rules), one for Graph (folders). Don't mix them.

## Gotcha 3: Graph may be walled off entirely

The fresh session got me past the clash, straight into a different wall:

> Microsoft Graph Command Line Tools needs permission to access resources in your organisation that only an admin can grant.

In a locked-down corporate tenant, the **Graph CLI app requires admin consent** you can't self-approve. Exchange Online worked because that app is pre-consented org-wide; the Graph CLI app isn't. If chasing an IT ticket isn't worth it, manage folders manually in the Outlook client instead — rules via EXO, folders by hand.

## Gotcha 4: Don't paste big blocks into interactive PowerShell

Pasting ~30 `New-InboxRule` commands into the interactive prompt at once, one line corrupted mid-paste — a dropped character left an unterminated quote, PowerShell dropped into continuation mode (`>>`), and silently swallowed the next several commands. Half the rules never ran.

**Fix:** put the commands in a `.ps1` file and run it. No clipboard, no corruption. Make it **idempotent** so a re-run is safe — remove any same-named rule before creating it:

```powershell
$rules = @(
  @{ Name="Acme";   Words=@("acme.com","acme.co.nz"); Folder=":\Inbox\Partners\Acme" }
  @{ Name="GitHub"; Words=@("github.com");            Folder=":\Inbox\GitHub" }
  # ...
)

foreach ($r in $rules) {
  Get-InboxRule -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq $r.Name } | Remove-InboxRule -Confirm:$false
  New-InboxRule -Name $r.Name -FromAddressContainsWords $r.Words `
    -MoveToFolder $r.Folder -StopProcessingRules $true | Out-Null
  Write-Host "Created: $($r.Name)"
}
```

Run it with a dot-source in your connected session:

```powershell
. ~/inbox-rules-batch.ps1
```

Test a single rule first and confirm the folder path resolved before running the batch:

```powershell
New-InboxRule -Name "ZZTEST" -FromAddressContainsWords "acme.co.nz" -MoveToFolder ":\Inbox\Partners\Acme" -StopProcessingRules $true
Get-InboxRule "ZZTEST" | Format-List Name, MoveToFolder   # should resolve, not error
```

## The bigger lesson: kill the per-person pattern

While rebuilding, I stopped recreating one rule per person. Most could be replaced by **domain rules** — `FromAddressContainsWords "acme.com"` catches every current and future person at that company, no maintenance. About 80 per-person rules collapsed into a dozen domain rules. The cleanup wasn't just deletion; it was killing the pattern that caused the bloat.

The commands are trivial. Budget your time for the environment, not the cmdlets.

:::info 🤖 AI Collaboration
Every command, error message, and gotcha here is from a live cleanup session — the MSAL clash, the admin-consent wall, and the paste corruption all actually happened. Written up from that session, then edited.
:::
