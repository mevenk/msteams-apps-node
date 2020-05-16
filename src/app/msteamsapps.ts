import { SystemUtils } from "./commons/SystemUtils";
import { ApplicationInitiator } from "./initiator/ApplicationInitiator";
import { Logger } from "./logging/Logger";
import { LoggingTracker } from "./logging/LoggingTracker";

const LOGGER: Logger = Logger.getLogger("msteamsapps");
const LOGGING_TRACKER: LoggingTracker = new LoggingTracker("msteamsapps");

LOGGER.log(LOGGING_TRACKER, "Hello " + SystemUtils.username());
LOGGER.log(LOGGING_TRACKER, "Initializing....");
LOGGER.log(LOGGING_TRACKER, "Initiated?" + ApplicationInitiator.initiate());
LOGGER.log(LOGGING_TRACKER, "Initiation called");
