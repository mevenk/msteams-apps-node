import { IGetRequestController, IPostRequestController, IPutRequestController } from "../IApplicationController";

export interface IWebhookController extends IGetRequestController, IPostRequestController, IPutRequestController {
    name: string;
}
