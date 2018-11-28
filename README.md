# Functional Web Components

> A library to write Web Components as a single function

## Table of Contents

-   [Background](#background)
-   [Install](#install)
-   [Usage](#usage)
-   [API](#api)
-   [Contributing](#contributing)
-   [License](#license)

## Background

[React](https://reactjs.org) allows to write function components for a long time now. But for components using state you had to use classes. At React Conf 2018 a proposal for [Hooks](https://reactjs.org/docs/hooks-intro.html) was announced. With this React allows to write stateful components using functions. One motivation for the move from classes to functions was that complex components become hard to understand. In class components related code often has to be split across different lifecycle methods.

I feel we have the same problem in [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) (although there are less lifecycle methods than in React). And I also like the API of React hooks. I asked myself: what is needed to write a custom element as a single function, using a similar hooks API for state management and lifecycle events? This library is the result.

While writing this I came across the other libraries, which provide different approaches to writing custom elements without classes (e.g. [functional-element](https://github.com/lastmjs/functional-element), [hybrids](https://github.com/hybridsjs/hybrids) and [Sigil](https://github.com/sigiljs/sigil)). However I was not satisfied with their API.

## Install

The library is not published on npm, yet. However you can install it from GitHub:

```
# npm
npm install frigus02/functional-web-components#master

# yarn
yarn add frigus02/functional-web-components#master
```

## Usage

```

```

## API

## Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs accepted.

## License

[MIT](LICENSE) © Jan Kuehle
