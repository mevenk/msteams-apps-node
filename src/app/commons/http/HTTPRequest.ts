import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Logger } from "./../../logging/Logger";
import { LoggingTracker } from "./../../logging/LoggingTracker";
import { CommonUtils } from "./../CommonUtils";

export class HTTPRequest<BODY, RESPONSE> {

    public static isStatusSuccess(status: number): boolean {
        return status === 200;
    }

    private static readonly LOGGER: Logger = Logger.getLogger("src/app/commons/http/HTTPRequest");

    private static generateLoggingTracker<BODY, RESPONSE>(httpRequest: HTTPRequest<BODY, RESPONSE>): LoggingTracker {
        const logTracker: Map<string, string> = new Map();
        logTracker.set("URL", httpRequest.url.slice(0, 25));
        logTracker.set("method", httpRequest.httpRequestMethod);
        const loggingTracker: LoggingTracker = new LoggingTracker(
            LoggingTracker.generateTrackingId("HTTPRequest"), logTracker);
        return loggingTracker;
    }

    constructor(public url: string, public httpRequestMethod: HTTPRequestMethod) {

    }

    public set body(body: BODY | undefined) { this.body = body; }

    public set headers(headers: Array<{ key: string, value: string | number }>) { this.headers = headers; }

    public getResponse(): Promise<IHTTPResponse<RESPONSE>> {
        return new Promise<IHTTPResponse<RESPONSE>>((resolve, reject) => {
            const loggingTracker: LoggingTracker = HTTPRequest.generateLoggingTracker(this);
            const axiosRequestConfig: AxiosRequestConfig = {};
            axiosRequestConfig.url = this.url;
            axiosRequestConfig.method = this.httpRequestMethod;
            let responseToSend: IHTTPResponse<RESPONSE>;
            const promiseResponse = axios.request<Request, AxiosResponse<RESPONSE | undefined>>(axiosRequestConfig);
            promiseResponse.then((response: AxiosResponse<RESPONSE | undefined>) => {
                HTTPRequest.LOGGER.log(loggingTracker,
                    "Server response:", CommonUtils.prettyPrintJSONReduceTo(response, 200));
                responseToSend = {
                    data: response.data,
                    headers: response.headers, status: response.status, statusText: response.statusText,
                };
                HTTPRequest.LOGGER.log(loggingTracker, "Response status:", responseToSend.status);
                HTTPRequest.LOGGER.log(
                    loggingTracker, "Response:", CommonUtils.prettyPrintJSONReduceTo(responseToSend, 200));
                resolve(responseToSend);
            }).catch((error: any) => {
                reject(error);
            });
        });

    }

    public getStatus(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.getResponse()
                .then((response: IHTTPResponse<RESPONSE>) => { resolve(response.status); })
                .catch((error: any) => { reject(error); });
        });
    }

    public isSuccess(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getStatus()
                .then((status: number) => {
                    resolve(HTTPRequest.isStatusSuccess(status));
                })
                .catch((error: any) => { reject(error); });
        });
    }

}
export interface IHTTPResponse<RESPONSE> {
    status: number;
    statusText: string | undefined;
    headers: any | undefined;
    data: RESPONSE | undefined;
}

export type HTTPRequestMethod = "GET" | "POST" | "PUT" | "DELETE";
