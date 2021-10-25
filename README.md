[![npm](https://img.shields.io/npm/v/@wishy-gift/noscript)](https://www.npmjs.com/package/@wishy-gift/noscript)
[![npm](https://img.shields.io/npm/dw/@wishy-gift/noscript)](https://www.npmjs.com/package/@wishy-gift/noscript)

# @wishy-gift/noscript

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Important note](#important-note)
- [Examples](#examples)
- [Components](#components)
  - [Form](#form)
    - [Including](#including)
    - [Props](#props)
    - [Example](#example)
  - [Button](#button)
    - [Including](#including-1)
    - [Props](#props-1)
    - [Example](#example-1)
- [Utils](#utils)
  - [handleServerActions](#handleserveractions)
    - [Including](#including-2)
    - [Parameters](#parameters)
    - [Example](#example-2)
  - [actionCreators](#actioncreators)
    - [Including](#including-3)
    - [Parameters](#parameters-1)
    - [Example](#example-3)
  - [usePayloadProxy](#usepayloadproxy)
    - [Including](#including-4)
    - [Parameters](#parameters-2)
    - [Example](#example-4)
- [License](#license)

## About

A small collection of utils and React components to assist in developing web applications that seamlessly work without JavaScript enabled on the client.

In short, by leveraging the similarities of form events and an event based state container like Redux, we can dispatch and update client/app state on the server side for users without JS enabled, by making all essential actions go through forms.

Instead of directly dispatching actions, we serialize the action type/creator and payload in the form body itself. The helpers in this package is meant to make this task easier.

More details on this can be found in ["Using React, Redux and SSR to acommodate users without JavaScript"](https://blog.klungo.no/2020/05/28/using-react-and-redux-to-acommodate-users-without-javascript/), or this talk from React Advanced 2021 (soon™)

## Installation

```cli
npm i @wishy-gift/noscript
```

## Important note

For these components to be of any use, you should be listening for `POST` requests towards your view routes. One of the basic assumptions we make, is that the only reason why someone would do a POST-request to a view route is because they've disabled JS, and an action has been dispatched. This way we know when to update the client state for our users server-side, and re-render the page.

## Examples

- [\_app.js](examples/_app.js) for use with Next.js
- [TodoMVC](examples/todos) à la @wishy-gift/noscript
- [Counter](examples/counter)
  - [Normal](examples/counter/counter-initial.js)
  - [Noscript](examples/counter/counter-result.js) + `createAsyncThunk`
- [Epic Gutenberg](examples/gutenberg)
  - Uses `createAsyncThunk` with a 3rd-party API ([Gutendex](https://github.com/garethbjohnson/gutendex))

## Components

### Form

Will serialize the app state to the DOM, and handle client side state updates by calling `preventDefault` when the form is submitted, parse the form data, and dispatch the correct action/actionCreator.

#### Including

```js
import Form from '@wishy-gift/noscript/dist/components/Form';
```

#### Props

```ts
interface FormProps {
  actionType?: string; // `type` to dispatch
  actionCreator?: string | Function; // function or name of function. see section about actionCreators below
  children: ReactNode;
  className?: string;
  onSubmit?: Function; // optional function to call on submit. NOTE: Actions are dispatched for you
  payloadType?: 'string' | 'object' | 'json'; // default is 'object' which means you can use array notation like payload[foo][bar]
}
```

Note: You cannot specify both `actionType` AND `actionCreator`, but you can also omit passing any of them as props, instead opting to render it to the DOM like this:

```jsx
<input name="actionType" value={someAction().type} type="hidden" readOnly />
```

#### Example

```jsx
<Form
  className="new-todo-wrapper"
  actionType={addTodo().type}
  onSubmit={resetOnSubmit}
>
  <input
    className="new-todo"
    name="payload[text]"
    placeholder="What needs to be done?"
    autoFocus
  />
  <input type="hidden" name="payload[id]" value={nanoid()} />
</Form>
```

### Button

A simple wrapper for `Form` with a `<button>` as child and `payloadType="json"`.

#### Including

```js
import Button from '@wishy-gift/noscript/dist/components/Button';
```

#### Props

```ts
interface ButtonProps {
  wrapperClassName?: string; // className to <Form>
  wrapperParams?: object; // spread to <Form>
  className?: string; // className for <button>
  action?: {
    type: string;
    payload?: any; // will be stringifed and rendered to DOM if `payload` isn't provided
  };
  actionCreator?: string | Function; // function or name of function. see section about actionCreators below
  payload?: any; // will be stringifed and rendered to DOM if provided
  children: ReactNode;
  onSubmit?: Function; // optional function to call on submit. NOTE: Actions are dispatched for you
}
```

Note: As with `Form`, you cannot specify both `action` AND `actionCreator`.

#### Example

```jsx
<Button
  className="btn"
  actionCreator={fetchBooks}
  disabled={!nextUrl}
  payload={{
    url: nextUrl,
  }}
>
  Next page
</Button>
```

## Utils

### handleServerActions

Given a body and a callback for getting a Redux store given an initial state, will get the store, dispatch any action/actionCreator in body, and return the store and its updated state.

Returns a `Promise` that resolves with `{reduxStore, state}`

#### Including

```js
import handleServerActions from '@wishy-gift/noscript/dist/utils/handleServerActions';
```

#### Parameters

```ts
type HandleServerActionsParams = {
  data: Data; // one of these must be provided
  rawBody: string; // one of these must be provided
  getReduxStore: (state: any) => ReturnType<typeof configureStore>;
};

type Data = {
  actionType?: string;
  actionCreatorName?: string;
  payloadType: 'string' | 'object' | 'json';
  state?: string;
  payload?: any;
};
```

#### Example

```js
const rawBody = req.read().toString();
// const data = qs.parse(rawBody);

const result = await handleServerActions({
  rawBody,
  // data, // if pre-parsed
  getReduxStore: (state) => {
    return getStore(state, isServer);
  },
});

const { reduxStore, state } = result;
```

### actionCreators

Helpers for mapping `actionCreators` to their `typePrefix` and vice-versa. Specifically made to be compatible with `thunks` created with `createAsyncThunk`. Should be run once, eg. in `_app.js` for Next.js projects.

#### Including

```js
import { addActionCreators } from '@wishy-gift/noscript/dist/utils/actionCreators';
```

#### Parameters

```ts
// Basically the signature of an `AsyncThunk` created with `createAsyncThunk`
type SimpleActionCreator = Function & {
  typePrefix?: string;
};
```

#### Example

```js
// _app.js

import { fetchBooks } from './gutenberg/gutenbergSlice';
import { incrementBySurprise } from './counter/counterSlice';

addActionCreators({ fetchBooks, incrementBySurprise });
```

### usePayloadProxy

A hook that returns a `Proxy` to easier provide the corect array notation to the `name` attribute of form elements by simply accessing the proxy.

#### Including

```js
import usePayloadProxy from '@wishy-gift/noscript/dist/hooks/usePayloadProxy';
```

#### Parameters

```ts
varName?: string; // defaults to 'payload'
```

#### Example

```js
const MyInput = () => {
  const payloadProxy = usePayloadProxy('payload'); // 'payload' is default

  return <input name={payloadProxy.foo.bar} value="baz" type="text" />;
};
```

will render

```html
<input name="payload[foo][bar]" value="baz" type="text" />
```

## License

See [LICENSE](LICENSE)
