# AbortController Multiplexer
> Combine multiple AbortControllers or AbortSignals into a single instance

[![abort-controller-multiplexer](https://img.shields.io/npm/v/abort-controller-multiplexer?color=blue&label=abort-controller-multiplexer&logo=npm&style=flat-square)](https://www.npmjs.com/package/abort-controller-multiplexer) ![Tests status](https://github.com/perry-mitchell/abort-controller-multiplexer/actions/workflows/test.yml/badge.svg) ![GitHub](https://img.shields.io/github/license/perry-mitchell/abort-controller-multiplexer)

`AbortController`s are very useful mechanisms in JavaScript that allow one to _insert_ abort signals into application components with ease. You can pass an `AbortController`'s `signal` (`AbortSignal`) into methods you call, abort it later, and use it to:

 * Cancel asynchronous operations
   * Cancel requests
 * Throw if the signal was previously aborted
 * _Etc._

Sometimes, in sufficiently complicated applications, you may run across situations where you need multiple abort signals. This library can be used to **group them together** into one large signal/controller, that you can abort from a single method or watch using a single signal.

## Installation

Install using npm:

```shell
npm install abort-controller-multiplexer --save
```

_Note that this library uses ESM. You must consume it in an ESM-friendly environment._

## Usage

Combine several abort controllers:

```typescript
import { combineControllers } from "abort-controller-multiplexer";

const ac1 = new AbortController();
const ac2 = new AbortController();
const controller = combineControllers(ac1, ac2);

controller.abort();
```

_Note that `combineControllers` calls `combineSignals` under the hood._

Combine several signals:

```typescript
import { combineSignals } from "abort-controller-multiplexer";

const ac1 = new AbortController();
const ac2 = new AbortController();
const signal = combineSignals(ac1.signal, ac2.signal);

ac1.abort();

signal.throwIfAborted(); // Throws
```

Note that these combination methods _do not_ modify the underlying `AbortController` and `AbortSignal` instances.
