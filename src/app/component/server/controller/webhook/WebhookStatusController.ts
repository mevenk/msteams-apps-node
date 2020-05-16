import { Logger } from "../../../../logging/Logger";
import { LoggingTracker } from "../../../../logging/LoggingTracker";
import { RequestMetadata } from "../../../../pojo/RequestMetadata";
import { WebhookBaseResponse } from "./../../../../pojo/webhook/WebhookBaseResponse";
import { IWebhookController } from "./IWebhookController";

export class WebhookStatusController implements IWebhookController {

    private static readonly LOGGER: Logger = Logger.getLogger("src/app/component/server/controller/webhook/WebhookStatusController");

    public name: string = "WebhookStatusController";
    public description: string = "WebhookStatusController";

    public requestMetadata: RequestMetadata = new RequestMetadata("/status", (req, res, next) => {
        const loggingTracker: LoggingTracker =
            LoggingTracker.generateLoggingTracker("WebhookStatusController_" + req.url);
        WebhookStatusController.LOGGER.log(loggingTracker, "request received");
        RequestMetadata.getRequestBody(req).then((requestBody: string) => {
            WebhookStatusController.LOGGER.log(loggingTracker, "Parameter", requestBody);
        }).catch((onrejected: any) => {
            WebhookStatusController.LOGGER.log(loggingTracker, "ERROR", onrejected);
        }).finally(() => {
            res.send(new WebhookBaseResponse("Hello. The date is " + new Date()));
        });
    });

}
