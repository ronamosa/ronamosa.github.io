# How to Set Up MCP Server Trello with Claude

A quick guide to connecting your Trello boards to Claude using the MCP Server Trello integration.

## Prerequisites

- **Claude Code** (recommended) or Claude Desktop installed
- A Trello account
- Node.js or Bun installed (for npx/bunx)

---

## Step 1: Get Your Trello API Credentials

### Get Your API Key

1. **Visit the Trello Developer Portal**
   Go to: **<https://trello.com/app-key>**
   (Make sure you're logged into Trello first!)

2. **Copy Your API Key**
   You'll see your API Key displayed at the top of the page in a box.
   Copy this entire string - you'll need it in a moment.

### Generate Your Token

3. **Click the Token Link**
   On the same page, look for a hyperlink that says **"Token"** or text like:
   *"You can manually generate a Token"*

4. **Authorize Access**
   Click that Token link and you'll be taken to an authorization page.
   Click the green **"Allow"** button to grant access.

5. **Copy Your Token**
   You'll be redirected to a page showing your token (a long string of characters).
   Copy this entire token.

> ⚠️ **Security Note**: Keep your token private! It grants full access to your Trello account.

---

## Step 2: Choose Your Setup Method

### Option A: Claude Code (Recommended) 🚀

**Quick One-Command Setup:**

```bash
claude mcp add trello \
  -e TRELLO_API_KEY=your-api-key-here \
  -e TRELLO_TOKEN=your-token-here \
  --scope user \
  -- npx -y @delorenj/mcp-server-trello
```

**That's it!** The server is now available across all your projects.

**Verify it worked:**

```bash
claude mcp list
```

You should see `trello` in the list.

**Using Bun for 2.8-4.4x speed boost?**

```bash
claude mcp add trello \
  -e TRELLO_API_KEY=your-api-key-here \
  -e TRELLO_TOKEN=your-token-here \
  --scope user \
  -- bunx @delorenj/mcp-server-trello
```

**Manual Config File Edit (Alternative):**

If you prefer editing the config file directly:

```bash
# Edit your Claude Code config
nano ~/.claude.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "trello": {
      "command": "npx",
      "args": ["-y", "@delorenj/mcp-server-trello"],
      "env": {
        "TRELLO_API_KEY": "your-api-key-here",
        "TRELLO_TOKEN": "your-token-here"
      },
      "scope": "user"
    }
  }
}
```

---

### Option B: Claude Desktop

### Locate Your Config File

Find your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Add the MCP Server Configuration

Open the config file in a text editor and add the Trello server configuration:

```json
{
  "mcpServers": {
    "trello": {
      "command": "npx",
      "args": ["-y", "@delorenj/mcp-server-trello"],
      "env": {
        "TRELLO_API_KEY": "your-api-key-here",
        "TRELLO_TOKEN": "your-token-here"
      }
    }
  }
}
```

**Replace:**

- `your-api-key-here` with the API key you copied in Step 1
- `your-token-here` with the token you generated in Step 1

:::note

:::

> 💡 **Using Bun?** Replace `"npx"` with `"bunx"` for faster performance (2.8-4.4x speed improvement)

### If You Have Other MCP Servers

If you already have other MCP servers configured, add the Trello server to your existing configuration:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "trello": {
      "command": "npx",
      "args": ["-y", "@delorenj/mcp-server-trello"],
      "env": {
        "TRELLO_API_KEY": "your-api-key-here",
        "TRELLO_TOKEN": "your-token-here"
      }
    }
  }
}
```

---

## Step 3: Test the Connection

### For Claude Code

Just start a conversation and ask:

```
Can you list my Trello boards?
```

### For Claude Desktop

Close Claude Desktop completely, reopen it, then start a new conversation and ask:

```
Can you list my Trello boards?
```

If everything is configured correctly, Claude will fetch and display your Trello boards!

---

## What You Can Do Now

With the MCP Server Trello integration, you can:

- ✅ List and switch between boards and workspaces
- ✅ Create, update, and archive cards
- ✅ Manage lists and checklists
- ✅ Add comments and attachments
- ✅ Assign members and labels
- ✅ Track card history and activity
- ✅ Get comprehensive card details in markdown format

### Example Commands

Try asking Claude:

- *"Create a new card called 'Review Q1 Planning' in my TODO list"*
- *"Show me all cards assigned to me"*
- *"Add a checklist item to card [card-id]"*
- *"What's the recent activity on my board?"*
- *"Get detailed information about card [card-id]"*

---

## Troubleshooting

### "App Not Found" Error (When Getting Token)

Make sure you're logged into Trello when visiting the app-key page.

### Server Not Showing Up (Claude Code)

```bash
# Check if it's installed
claude mcp list

# Remove and re-add if needed
claude mcp remove trello
claude mcp add trello -e TRELLO_API_KEY=... -e TRELLO_TOKEN=... --scope user -- npx -y @delorenj/mcp-server-trello
```

### Claude Can't Connect to Trello

1. Check that your API key and token are correct in the config file
2. Verify there are no extra spaces or quotes around the credentials
3. **For Claude Code**: Run `claude mcp list` to verify the server is registered
4. **For Claude Desktop**: Check logs at:
   - **macOS**: `~/Library/Logs/Claude/`
   - **Windows**: `%APPDATA%\Claude\logs\`

### Token Expired

If you used a temporary token (30 days), regenerate it by visiting the Token link on <https://trello.com/app-key> again.

### JSON Syntax Errors (Manual Config Edit)

Make sure your config file has valid JSON:

- No trailing commas
- All strings in double quotes
- Proper bracket matching

---

## Advanced Configuration

### Scope Options (Claude Code)

Control where the server is available:

| Scope | Command Flag | Availability |
|-------|-------------|--------------|
| **user** | `--scope user` | All your projects (recommended) |
| **local** | `--scope local` | Current project only (default) |
| **project** | `--scope project` | Specific project workspace |

**Recommendation**: Use `--scope user` so Trello is accessible from any project.

### Managing Servers (Claude Code)

```bash
# List all MCP servers
claude mcp list

# Remove a server
claude mcp remove trello

# Update a server (remove and re-add)
claude mcp remove trello
claude mcp add trello -e TRELLO_API_KEY=... --scope user -- npx -y @delorenj/mcp-server-trello
```

### Global Installation (Alternative)

If you prefer a permanent installation:

```bash
npm install -g @delorenj/mcp-server-trello
```

**For Claude Code:**

```bash
claude mcp add trello \
  -e TRELLO_API_KEY=your-key \
  -e TRELLO_TOKEN=your-token \
  --scope user \
  -- mcp-server-trello
```

**For Claude Desktop:**

```json
{
  "mcpServers": {
    "trello": {
      "command": "mcp-server-trello",
      "env": {
        "TRELLO_API_KEY": "your-api-key-here",
        "TRELLO_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Docker Installation

For containerized environments, see the [full installation guide](https://github.com/delorenj/mcp-server-trello#docker-installation).

---

## Security Best Practices

- ✅ Never commit your `.env` file or config with credentials to git
- ✅ Use `expiration=30days` for tokens in production environments and rotate regularly
- ✅ Store credentials in a password manager
- ✅ Review authorized apps periodically at <https://trello.com/my/account>

---

## Additional Resources

- **GitHub Repository**: <https://github.com/delorenj/mcp-server-trello>
- **npm Package**: <https://www.npmjs.com/package/@delorenj/mcp-server-trello>
- **Trello API Documentation**: <https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/>
- **MCP Documentation**: <https://modelcontextprotocol.io>

---

## Credits

MCP Server Trello is developed by [Jarad DeLorenzo](https://github.com/delorenj) and is available under the MIT License.

---

