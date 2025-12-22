---
sidebar_position: 0
---

# Experiment Warning

These experiments are NOT production ready. They can easily break your codebase or render your project unusable.

:::danger
It is not recommended to use experiments in Production.

In Production builds, the flag is ignored and set to false unless you build like below. Only do this if you NEED to use the experiments and are aware of the consequences.

```bash title="root@my-pc.local my-game"
DISABLE_EXPERIMENTS_CHECK_PROD=1 npm export
```
:::