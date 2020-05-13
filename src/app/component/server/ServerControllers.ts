import { IGetRequestController, IPostRequestController } from "./controller/IApplicationController";
import { WebhookStatusController } from "./controller/webhook/WebhookStatusController";

export const GET_CONTROLLERS: IGetRequestController[] = [new WebhookStatusController()];
export const POST_CONTROLLERS: IPostRequestController[] = [new WebhookStatusController()];

export const ALL_CONTROLLERS: IPostRequestController[] = [new WebhookStatusController()];
