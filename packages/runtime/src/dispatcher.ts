export class Dispatcher {
  private subs = new Map<string, Function[]>();
  private afterHandlers: Function[] = [];

  public subscribe = (commandName: string, handler: Function) => {
    if (!this.subs.has(commandName)) {
      this.subs.set(commandName, []);
    }

    const handlers = this.subs.get(commandName);

    if (!handlers) {
      throw new Error("handlers cannot be undefined");
    }

    if (handlers.includes(handler)) {
      return () => {};
    }

    handlers.push(handler);

    return () => {
      const idx = handlers.indexOf(handler);
      handlers.splice(idx, 1);
    };
  };

  public afterEveryCommand = (handler: Function) => {
    this.afterHandlers.push(handler);

    return () => {
      const idx = this.afterHandlers.indexOf(handler);
      this.afterHandlers.splice(idx, 1);
    };
  };

  public dispatch = (commandName: string, payload: any) => {
    const handlers = this.subs.get(commandName);

    if (handlers) {
      for (const handler of handlers) {
        handler(payload);
      }
    } else {
      console.warn(`No handlers for command: ${commandName}`);
    }

    for (const afterHandler of this.afterHandlers) {
      afterHandler();
    }
  };
}
