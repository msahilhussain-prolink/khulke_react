const noopLogger = {
  debug: () => {},
  info: () => {},
  start: () => {},
  success: () => {},
  warn: () => {},
  error: () => {},
};

// ------------------------ Consola Logger --------------------------//
// debug: Used for debug messages or very detailed information that is not important in most cases.
// info: Used for general information messages that do not indicate any problems or errors.
// start: Used to indicate the start of an operation or task.
// success: Used to indicate the successful completion of an operation or task.
// warn: Used to indicate a warning or potential problem that should be addressed, but is not severe enough to halt the application.
// error: Used to indicate an error or problem that requires attention, but is not severe enough to cause the application to crash.
import { createConsola } from "consola";
let logger = noopLogger;

const designConsolaLogger = () => {
  try {
    const logger = createConsola({
      level: process.env.NODE_ENV === "development" ? "debug" : "silent",
    });

    return logger;
  } catch (error) {
    console.log("error while generating loggers", error);
    return noopLogger;
  }
};

logger = designConsolaLogger();

export default logger;
