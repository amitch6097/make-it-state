import MakeItState from "./MakeItState";

interface IStoreProps<Class, State, Actions> {
  state: State;
  actions: Actions;
  instance: Class;
}

class Store<Class = new (args: any[]) => any, State = {}, Actions = {}> {
  private _subscribers: Array<(nextState: State) => void> = [];
  private _state: State;
  private _actions: Actions;
  private _instance: Class;

  constructor({
    state,
    actions,
    instance
  }: IStoreProps<Class, State, Actions>) {
    this._state = state;
    this._actions = actions;
    this._instance = instance;
    MakeItState.register(instance, this);
  }

  destructor() {
    this._subscribers = [];
    this._state = {} as State;
    MakeItState.unregister(this._instance, this);
  }

  setState = (nextState: Partial<State>) => {
    this._state = { ...this._state, ...nextState };
    this._subscribers.forEach(subscriber => {
      subscriber(this._state);
    });
  };

  getState = (): State => {
    return this._state;
  };

  subscribe = (func: (nextState: State) => void) => {
    if (!this._subscribers.find(sub => sub === func)) {
      this._subscribers = [...this._subscribers, func];
    }
  };

  unsubscribe(func: (nextState: State) => void) {
    for (let i = 0; i < this._subscribers.length; i++) {
      if (func === this._subscribers[i]) {
        this._subscribers = [
          ...this._subscribers.slice(0, i),
          ...this._subscribers.slice(i + 1)
        ];
        return;
      }
    }
  }
}
export default Store;
