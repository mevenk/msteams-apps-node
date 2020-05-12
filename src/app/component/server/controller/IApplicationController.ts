import { RequestMetadata } from "../../../pojo/RequestMetadata";

export interface IApplicationController {
    requestMetadata: RequestMetadata;
}

export interface IGetRequestController extends IApplicationController {
    description: string;
}

export interface IPostRequestController extends IApplicationController {
    description: string;
}

export interface IPutRequestController extends IApplicationController {
    description: string;
}
