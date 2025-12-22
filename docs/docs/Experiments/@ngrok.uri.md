:::tip This experiment was developed by the Sparkly team.
ID: `@ngrok.uri`
:::
:::warning
Experiments can always be able to break your code. Make sure to create a backup before using the experiment.
:::
---------

:::note Important
Ensure to add `experiments: ['@ngrok.uri']` in the `sparkly-config.json` file to enable this feature.
:::
Start your project as normal, and type :Net in your terminal, which creates an NGROK URL you can test with on multiple devices.
It should look like this:

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

## Information

:::danger This is an experimental feature, so do not rely on it. It can be removed in future updates.
:::

:::warning
This experiment will be ignored in Production builds, even with the `DISABLE_EXPERIMENTS_CHECK_PROD=1` flag.
Its only use is to aid in development. This does NOT help with any aspects in the Production environment. It may be a security vulnerability in Production, so it is ignored.
:::