:::tip
This experiment was developed by the **Sparkly team**.  
ID: `@ngrok.uri`
:::

:::warning
Experiments can break your code at any time.  
Always create a backup before enabling experimental features.
:::

---

:::note
Add the following to your `sparkly-config.json` file:

```json
{
  "experiments": ["@ngrok.uri"]
}
```
:::

Start your project as normal, then type `:Net` in your terminal to expose your local server via NGROK.

Example output:

```log title="root@my-pc.local my-game"
npm start

> sparkly start

[INFO] Starting server...

Server exposed on:
http://localhost
http://127.0.0.1

:Net - Expose to NGROK
:R - Restart server
:C - Clear Cache

:

[INFO] Enter command:
Net

[INFO] Exposing to NGROK...

URL: https://my-game.ngrok.app
```

---

## Information

:::danger
This is an **experimental feature** and may be removed or changed without notice.  
Do **not** rely on it for long-term workflows.

This experiment is **always ignored in Production builds**, even if
`DISABLE_EXPERIMENTS_CHECK_PROD=1` is set.

It exists solely to aid local development and may introduce security risks in Production environments.
:::