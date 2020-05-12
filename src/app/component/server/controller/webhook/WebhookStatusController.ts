import { Logger } from "../../../../logging/Logger";
import { RequestMetadata } from "../../../../pojo/RequestMetadata";
import { WebhookBaseResponse } from "./../../../../pojo/webhook/WebhookBaseResponse";
import { IWebhookController } from "./IWebhookController";

export class WebhookStatusController implements IWebhookController {
    public name: string = "WebhookStatusController";
    public description: string = "WebhookStatusController";
    public requestMetadata: RequestMetadata = new RequestMetadata("/status", (req, res, next) => {
        Logger.log("request received");
        res.send(new WebhookBaseResponse("Hello. The date is " + new Date()));
    });

}
