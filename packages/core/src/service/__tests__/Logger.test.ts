import * as fs from "fs";
import Logger from "../Logger";

afterEach(done => {
  // winston does FS async so we wait until the EL is flushed to effectively remove the files
  setTimeout(() => {
    if (fs.existsSync(__dirname + "/test.log")) {
      fs.unlinkSync(__dirname + "/test.log");
    }

    if (fs.existsSync(__dirname + "/test.error.log")) {
      fs.unlinkSync(__dirname + "/test.error.log");
    }

    done();
  }, 0);
});

const afterEventLoop = () => new Promise(accept => setTimeout(accept, 0));

it("should create a logger", async () => {
  const logger = new Logger({
    env: "test",
    path: __dirname,
    level: "info"
  });

  // Guess we need 2, anyway this should be refactored because it's not deterministic
  await afterEventLoop();
  await afterEventLoop();

  const logFile = __dirname + "/test.log";
  const errorLogFile = __dirname + "/test.error.log";

  expect(fs.existsSync(logFile)).toBe(true);
  expect(fs.existsSync(errorLogFile)).toBe(true);
  expect(fs.readFileSync(logFile).toString()).toEqual("");
  expect(fs.readFileSync(errorLogFile).toString()).toEqual("");

  logger.info("Hello this is a test");

  await afterEventLoop();
  const text: any = JSON.parse(fs.readFileSync(logFile).toString());
  expect(text.message).toEqual("Hello this is a test");
});
