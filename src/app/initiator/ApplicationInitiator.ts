import { CommonUtils } from "../commons/CommonUtils";
import { SystemUtils } from "../commons/SystemUtils";
import { ServerComponent } from "../component/server/ServerComponent";
import { Logger } from "../logging/Logger";
import { LoggingTracker } from "../logging/LoggingTracker";
import { ApplicationComponents } from "./ApplicationComponents";

export class ApplicationInitiator {

    public static initiate(): boolean {
        ApplicationInitiator.validate();
        const ENV: any = SystemUtils.applicationEnvironment();
        const PORT: number = SystemUtils.applicationPort();
        this.LOGGER.log(this.LOGGING_TRACKER, "Environment: ", ENV);
        this.LOGGER.log(this.LOGGING_TRACKER, "port: ", PORT);
        this.LOGGER.log(this.LOGGING_TRACKER, "Server status", ServerComponent.startServer(PORT));
        this.LOGGER.info(this.LOGGING_TRACKER, "No of components:", ApplicationInitiator.startComponents());
        return true;
    }

    private static readonly LOGGER: Logger = Logger.getLogger("src/app/initiator/ApplicationInitiator");
    private static readonly LOGGING_TRACKER: LoggingTracker = new LoggingTracker("ApplicationInitiator");

    private static validate(): void {
        if (CommonUtils.isUndefined(SystemUtils.applicationEnvironment())) {
            throw new Error("ENV system variable not available");
        }

        if (CommonUtils.isUndefined(SystemUtils.applicationPort())) {
            throw new Error("port system variable not available");
        }
    }

    private static startComponents(): number {
        let noOfComponents = 0;
        ApplicationComponents.getApplicationComponents().forEach((component) => {
            this.LOGGER.info(this.LOGGING_TRACKER, "Starting", component.name, "[" + component.constructor.name + "]");
            if (!component.isValid()) {
                throw new Error(component.name + " component not valid!!!");
            }
            component.start();
            noOfComponents++;
        });
        return noOfComponents;
    }

}
