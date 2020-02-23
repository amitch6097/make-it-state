import Store from './Store';

export default class MakeItState {
  static stores: Record<string, Array<Store<any, any, any>>> = {};
  
  static register(instance: {constructor: {name: string}}, store: Store<any, any, any>) {
    const name = instance?.constructor?.name;
    if(!name) return;

    MakeItState.stores[name] = MakeItState.stores[name] || [];
    MakeItState.stores[name] = [...MakeItState.stores[name], store];
  }


  static unregister(instance: {constructor: {name: string}}, store: Store<any, any, any>) {
    const name = instance?.constructor?.name;
    if(!name) return;

    let storeOfName = MakeItState.stores[name] || [];
    for (let i = 0; i < storeOfName.length; i++) {
      if (store === storeOfName[i]) {
        storeOfName = [
          ...storeOfName.slice(0, i),
          ...storeOfName.slice(i + 1)
        ];
        return;
      }
    }
    MakeItState.stores[name] = storeOfName;
  }

  static create = <Class, State, Actions>(
    Class: new (args: any[]) => Class,
    state: State,
    actions: Array<keyof Actions>
  ) => (...args: any[]): Store<Class, State, Actions> & Actions => {
    //@ts-ignore
    const _instance = new Class(...args);
    const _actions = [...actions];
    const _state = { ...state };

    
    // Attach actions to the store
    const store = _actions.reduce((storeActions, action) => {
      Object.defineProperty(storeActions, action, {
        get() {
          return _instance[action];
        }
      });
      return storeActions;
    }, new Store({state: _state, actions: _actions, instance: _instance}));

    // define getters / setters of state
    Object.keys(_state).forEach(key => {
      Object.defineProperty(_instance, key, {
        get() {
          //@ts-ignore
          return store.getState()[key];
        },
        set(value) {
          //@ts-ignore
          store.setState({
            [key]: value
          });
        }
      });
    });

    //@ts-ignore
    return store;
  };
}

if (window) {
  //@ts-ignore
  window.MakeItState = MakeItState;
}





