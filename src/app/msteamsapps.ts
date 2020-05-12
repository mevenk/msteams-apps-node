import { ApplicationInitiator } from "./ApplicationInitiator";
import { SystemUtils } from "./commons/SystemUtils";
import { Logger } from "./logging/Logger";

Logger.log("Hello " + SystemUtils.username());
Logger.log("Initializing....");
Logger.log("Initiated?" + ApplicationInitiator.initiate());
Logger.log("Initiation called");
