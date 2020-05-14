import { CommonUtils } from "../commons/CommonUtils";
import { SystemUtils } from "../commons/SystemUtils";
import { ServerComponent } from "../component/server/ServerComponent";
import { Logger } from "../logging/Logger";
import { ApplicationComponents } from "./ApplicationComponents";

export class ApplicationInitiator {

    public static initiate(): boolean {
        ApplicationInitiator.validate();
        const ENV: any = SystemUtils.applicationEnvironment();
        const PORT: number = SystemUtils.applicationPort();
        Logger.log("Environment: ", ENV);
        Logger.log("port: ", PORT);
        Logger.log("Server status", ServerComponent.startServer(PORT));
        Logger.info("No of components:", ApplicationInitiator.startComponents());
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

    private static startComponents(): number {
        let noOfComponents = 0;
        ApplicationComponents.getApplicationComponents().forEach((component) => {
            Logger.info("Starting", component.name, "[" + component.constructor.name + "]");
            if (!component.isValid()) {
                throw new Error(component.name + " component not valid!!!");
            }
            component.start();
            noOfComponents++;
        });
        return noOfComponents;
    }

}
