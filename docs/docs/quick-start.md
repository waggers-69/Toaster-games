---
sidebar_position: 1
---

# Quick Start

## Prerequisites

- A [SparklyDev](/sparkly-dev/) account
- [Node.js](https://nodejs.org) and [npm](https://npmjs.org)
- ~15 GB of free disk space
- A game idea
- A [GitHub](https://github.com) account

---

## Getting Started

1. Install Visual Studio Code (or another code editor).
2. Open a terminal and run:

```bash title="root@my-pc.local ~"
npm create sparkly-pkg -- "my-game"
```

3. You may be prompted to sign in via your browser.  
   Make sure you **authorise `@sparkly.dev/cli`**, otherwise the CLI will not function.

---

:::warning Security notice

If an **official Sparkly package** is ever found to be compromised, we may temporarily disable authentication for that package and revoke associated tokens as a precaution. When access is restored, you’ll simply need to log in again to re-issue tokens.

This is done to protect both developers and players.
:::

:::danger Third-party packages

Only authorise packages marked with the **“Official Sparkly Product”** tag.

Authorising unverified packages may expose your account. If you believe your account has been compromised:
- Revoke any unfamiliar authorisations
- Contact SparklyDev support immediately

As a safety measure, affected accounts may temporarily enter **Safe Mode**, disabling new uploads until the issue is resolved.
:::

:::info Need help?

Email: **hijack@sparkly.creepers.sbs**
:::

---

4. After setup, you’ll receive a project preset with mock API endpoints such as:
   - `/api/isMonetised`
   - `/api/isAdSupported`

5. Place your game files in the `public` folder and add new API endpoints in `api.js`.

---

## Testing Your Game

1. Navigate to your project directory:

```bash title="root@my-pc.local ~"
cd my-game
```

2. Install dependencies (if needed):

```bash title="root@my-pc.local my-game"
npm install
```

3. Verify the project structure:

```bash title="root@my-pc.local my-game"
npm run struct-chck
```

4. Start the development server:

```bash title="root@my-pc.local my-game"
npm start
```

---

🎉 **That’s it!**  
You’ve successfully created your first game using the Sparkly Games API.