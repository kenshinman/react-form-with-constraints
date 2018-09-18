type Listener<Args extends any[], ReturnType> = (...args: Args) => ReturnType | Promise<ReturnType>;

export default class EventEmitter<ListenerArgs extends any[] = [], ListenerReturnType = void> {
  listeners = new Map<string, Listener<ListenerArgs, ListenerReturnType>[]>();

  async emit(eventName: string, ...args: ListenerArgs) {
    const listeners = this.listeners.get(eventName)!;

    // Assert disabled: an even can be emitted even without listeners
    //console.assert(listeners !== undefined, `Unknown event '${eventName}'`);

    const ret = new Array<ListenerReturnType>();

    if (listeners !== undefined) {
      console.assert(listeners.length > 0, `No listener for event '${eventName}'`);
      for (const listener of listeners) {
        // Why await? Two cases:
        // - listener does not return a Promise:
        //   => await changes nothing: the next listener call happens when the current one is done
        // - listener returns a Promise:
        //   => wait for the listener call to finish (e.g listeners are executed in sequence),
        //      without we would call each listener without waiting for their results
        ret.push(await listener(...args));
      }
    }

    return ret;
  }

  addListener(eventName: string, listener: Listener<ListenerArgs, ListenerReturnType>) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, []);
    const listeners = this.listeners.get(eventName)!;
    console.assert(listeners.indexOf(listener) === -1, `Listener already added for event '${eventName}'`);
    listeners.push(listener);
  }

  // See https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener
  // "removeListener will remove, at most, one instance of a listener from the listener array.
  // If any single listener has been added multiple times to the listener array for the specified eventName,
  // then removeListener must be called multiple times to remove each instance."
  removeListener(eventName: string, listener: Listener<ListenerArgs, ListenerReturnType>) {
    const listeners = this.listeners.get(eventName)!;
    console.assert(listeners !== undefined, `Unknown event '${eventName}'`);

    const index = listeners.lastIndexOf(listener);
    console.assert(index > -1, `Listener not found for event '${eventName}'`);
    listeners.splice(index, 1);

    if (listeners.length === 0) this.listeners.delete(eventName);
  }
}
