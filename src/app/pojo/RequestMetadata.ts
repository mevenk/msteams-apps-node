import { Request, RequestHandler } from "express";
import { CommonUtils } from "./../commons/CommonUtils";

export class RequestMetadata {

    public static getRequestBody(request: Request): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                let body: string;
                request.on("data", (data: any) => {
                    body += data;
                });
                request.on("end", () => { resolve(CommonUtils.prettyPrintJSON(body)); });
            } catch (error) {
                reject(error);
            }
        });
    }

    public path: string;
    public requestHandler: RequestHandler;

    public constructor(path: string, requestHandler: RequestHandler) {
        this.path = path;
        this.requestHandler = requestHandler;
    }
}
