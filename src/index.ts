import async_hooks from "async_hooks";
import fs from "fs";

// Ref: https://blog.appsignal.com/2020/09/30/exploring-nodejs-async-hooks.html
// Well, you can’t use any of the console’s functions to test async hooks simply because they’re also asynchronous,
// per se. So, this would generate an infinite loop since we’re providing an init event function below.
// This function would call a console’s log, which would trigger the init again and so on… infinitely.

// Sync write to the console
const writeSomething = (phase: any, more?: any) => {
  fs.writeSync(
    1,
    `Phase: "${phase}", Exec. Id: ${async_hooks.executionAsyncId()} ${
      more ? ", " + more : ""
    }\n`
  );
};

// Create and enable the hook
const timeoutHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    writeSomething(
      "Init",
      `asyncId: ${asyncId}, type: "${type}", triggerAsyncId: ${triggerAsyncId}`
    );
  },
  before(asyncId) {
    writeSomething("Before", `asyncId: ${asyncId}`);
  },
  after(asyncId) {
    writeSomething("After", `asyncId: ${asyncId}`);
  },
  destroy(asyncId) {
    writeSomething("Destroy", `asyncId: ${asyncId}`);
  },
  promiseResolve(asyncId) {
    writeSomething("promiseResolve", `asyncId: ${asyncId}`);
  },
});

timeoutHook.enable();

writeSomething("Before call");

// Example 1: Set the timeout
// setTimeout(() => {
//   writeSomething("Exec. Timeout");
// }, 1000);

// Example 2: Promise
const calcPow = async (n: any, exp: any) => {
  writeSomething("Exec. Promise");

  return Math.pow(n, exp);
};

(async () => {
  await calcPow(3, 4);
})();
