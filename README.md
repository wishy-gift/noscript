# @wishy-gift/noscript

## About

A small collection of utils and React components to assist in developing web applications that seamlessly work without JavaScript enabled on the client.

In short, by leveraging the similarities of form events and an event based state container like Redux, we can dispatch and update client/app state on the server side for users without JS enabled, by making all essential actions go through forms.

Instead of directly dispatching actions, we serialize the action type/creator and payload in the form body itself. The helpers in this package is meant to make this task easier.

More details on this can be found in ["Using React, Redux and SSR to acommodate users without JavaScript"](https://blog.klungo.no/2020/05/28/using-react-and-redux-to-acommodate-users-without-javascript/), or this talk from React Advanced 2021 (soon™️)

## Installation

    npm i @wishy-gift/noscript

## Examples

- [\_app.js](examples/_app.js) for use with Next.js
- [TodoMVC](examples/todos) à la @wishy-gift/noscript
- [Counter](examples/counter)
  - [Normal](examples/counter/counter-initial.js)
  - [Noscript](examples/counter/counter-result.js) + `createAsyncThunk`
- [Epic Gutenberg](examples/gutenberg)
  - Uses `createAsyncThunk` with the brilliant 3rd-party API ([Gutendex](https://github.com/garethbjohnson/gutendex))

## Components

###
