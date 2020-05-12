import { RequestHandler } from "express";
import { Logger } from "../logging/Logger";

export class RequestMetadata {
    public path: string;
    public requestHandler: RequestHandler;

    public constructor(path: string, requestHandler: RequestHandler) {
        Logger.log("Path: " + path);
        this.path = path;
        this.requestHandler = requestHandler;
    }
}
