# Installation

## Using CLI

If you want to get started with Vue Storefront, the easiest way to do this is to set up your project through our CLI tool. It can be installed globally through NPM:

<code-group>
<code-block title="YARN">
```bash
yarn global add @vue-storefront/cli
```
</code-block>

<code-block title="NPM">
```bash
npm i -g @vue-storefront/cli
```
</code-block>
</code-group>

Once installed, you can use Vue Storefront CLI to set up the project with:

```bash
vsf init <project_name>
```

Then you will be asked about the backend platform you wish to use. Once you choose it, the CLI will create the project files in the `<project_name>` directory.

<center>
  <img src="../images/cli.png" alt="vue storefront cli" />
</center>

The only thing that's left before you can start developing is to install the dependencies:

```bash
cd <project_name> && yarn

// after dependencies are installed

yarn dev
```

## Non-standard installation

Vue Storefront can also be installed within already existing Vue and Nuxt codebases or without a boilerplate theme. Check out the platform-specific docs to learn how!

## What's next?

- Learn about [key concepts in Vue Storefront](./key-concepts.html) to confidently work with your newly created Vue Storefront project.
- Check out the platform-specific docs in the `eCommerce platforms` category to learn more about your integration.
