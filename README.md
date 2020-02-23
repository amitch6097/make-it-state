# make-it-state
And experiemental typescript state managment library that makes state stores out of plain classes.

## Problem 
I want to be able to write code in an object orienteted fashion, but this becomes problematic when you start converting that to state for React.js.  Further, I belive a simpler soultion for state managment can be proposed, than what Redux and MobX give us.

## Solution
### This Library!
The idea of this library is to "extend" pure javascript classses into individual state stores.  This is not only makes it easier to create a state store, but also forces the user to write in a manor that keeps their logic independent of this library, if they ever want to move away from it!

## The Gist

make-it-state only export one function, create. Create takes a Class, state, and actions as an argument.  The Class should be that Class that you would like to create a State Store from.  The state is the initial state the store will have and should provide all of the member variables from the Class you provided, that you want to be considered state.  Finally, Actions is an array of strings, which should be all of the public functions on the Class, that you want to give access to and will update state.  The return from create, is a function.  This final function is where you will provide any arguments that you would typically to instantiate the Class.

```ts
import { create } from "make-it-state";

class Counter {
  count: number = 0;

  increment = () => {
    this.count = this.count + 1;
  };

  decrement = () => {
    this.count = this.count - 1;
  };

  setCount = (count: number) => {
    this.count = count;
  };
}
const counterStore = create(Counter, { count: 100 }, [
  "increment",
  "decrement"
])();

function printState(state) {
  console.log("state:", state);
}
counterStore.subscribe(printState);
counterStore.increment(); //state: Object {count: 101}
counterStore.decrement(); //state: Object {count: 100}
counterStore.unsubscribe(printState);
```
Check out this Simple Exmple Above [here](https://codesandbox.io/s/make-it-state-simple-example-ms2fi)

Check out this React Example [here](https://codesandbox.io/s/make--it-state-count-example-4tfed)

