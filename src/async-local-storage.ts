import http from "http";
import { AsyncLocalStorage } from "async_hooks";

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg: string) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : "-"}:`, msg);
}

let idSeq = 0;
http
  .createServer((req, res) => {
    asyncLocalStorage.run(idSeq++, () => {
      logWithId("start");
      // Imagine any chain of async operations here
      setImmediate(() => {
        logWithId("finish");
        res.end();
      });
    });
  })
  .listen(8080);

http.get("http://localhost:8080");
http.get("http://localhost:8080");
