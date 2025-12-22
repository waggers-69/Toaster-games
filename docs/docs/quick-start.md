---
sidebar_position: 1
---

# Quick Start

Prerequisites:
  - A SparklyDev account
  - [Node.js](https://nodejs.org) and [npm](https://npmjs.org).
  - Approximately 15 gigabytes of free space
  - A game idea.
  - A [GitHub](https://github.com) account.

## Getting Started

1. Ensure you have Visual Studio Code (or a similar code editor) installed.
2. Open a terminal and run the following command:
  ```bash title="root@my-pc.local ~"
  npm create sparkly-pkg -- "my-game"
  ```
3. You might be asked to login to your account in your browser. Authorise `@sparkly.dev/cli` or it won't work.

:::::warning Make sure to read this!

If the official package is infected, we will stop the package from being able to authenticate to your account. We will remove ALL tokens, which means when it comes back, you will need to log back in (to reset account tokens). 

:::danger Be careful!

If you authorise a package without the `Official Sparkly Product` tag, someone may be able to steal your account. If you suspect your account has been stolen, contact SparklyDev support immediately. Make sure to unauthorise any packages you don't recognise. When we recieve your email, your account will be put into `Safe Mode` and you will be unable to upload new games until we get to fixing your case. Any games modified in the last 28 days will be temporarily unavailable to stop any of your audience getting their devices infected.

::::
:::info Reach out for support

Email: hijack@sparkly.creepers.sbs

:::
:::::

4. You will be presented with a project preset for a game application. It will have mock API endpoints, such as `/api/isMonetised` and `/api/isAdSupported`.
5. Drop your game in the `public` folder and create new API endpoints in `api.js`.

## Testing your Game.

1. Navigate to your project directory (in our case, `my-game`):
```bash title="root@my-pc.local ~"
cd my-game
```

2. If the packages are not already installed, run:
```bash title="root@my-pc.local my-game"
npm install
```

3. Ensure the app is correctly setup with:
```bash title="root@my-pc.local my-game"
npm run struct-chck -- "error"
```

4. And finally, run:
```bash title="root@my-pc.local my-game"
npm start
```

You have successfully created your first game with the Sparkly Games API!