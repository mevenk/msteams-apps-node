import { CommonUtils } from "./commons/CommonUtils";
import { SystemUtils } from "./commons/SystemUtils";
import { ServerComponent } from "./component/server/ServerComponent";
import { Logger } from "./logging/Logger";

export class ApplicationInitiator {

    public static initiate(): boolean {
        ApplicationInitiator.validate();
        const ENV: any = SystemUtils.applicationEnvironment();
        const PORT: number = SystemUtils.applicationPort();
        Logger.log("Environment: ", ENV);
        Logger.log("port: ", PORT);
        Logger.log("Server status", ServerComponent.startServer(PORT));
        return true;
    }

    private static validate(): void {
        if (CommonUtils.isUndefined(SystemUtils.applicationEnvironment())) {
            throw new Error("ENV system variable not available");
        }

        if (CommonUtils.isUndefined(SystemUtils.applicationPort())) {
            throw new Error("port system variable not available");
        }
    }

}
