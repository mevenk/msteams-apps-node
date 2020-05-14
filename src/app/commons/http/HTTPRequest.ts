import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Logger } from "./../../logging/Logger";
import { CommonUtils } from "./../CommonUtils";

export class HTTPRequest<BODY, RESPONSE> {

    public static isStatusSuccess(status: number): boolean {
        return status === 200;
    }

    private response: IHTTPResponse<RESPONSE> =
        { data: undefined, status: -1, statusText: undefined, headers: undefined };

    constructor(public url: string, public httpRequestMethod: HTTPRequestMethod) {

    }

    public set body(body: BODY | undefined) { this.body = body; }

    public set headers(headers: Array<{ key: string, value: string | number }>) { this.headers = headers; }

    //Need to return Promise to make it async
    public getResponse(): IHTTPResponse<RESPONSE | undefined> {
        const axiosRequestConfig: AxiosRequestConfig = {};
        axiosRequestConfig.url = this.url;
        axiosRequestConfig.method = this.httpRequestMethod;
        const promiseResponse = axios.request<Request, AxiosResponse<RESPONSE | undefined>>(axiosRequestConfig);
        promiseResponse.then((response: AxiosResponse<RESPONSE | undefined>) => {
            Logger.log("Server response:", CommonUtils.prettyPrintJSONReduceTo(response, 200));
            this.response.data = response.data;
            this.response.status = response.status;
            this.response.statusText = response.statusText;
            this.response.headers = response.headers;
            Logger.log("Response status:", this.response.status);
            Logger.log("Response:", CommonUtils.prettyPrintJSONReduceTo(this.response, 200));
        });
        return this.response;
    }

    public getStatus(): number {
        if (this.response.status === -1) {
            this.getResponse();
        }
        return this.response.status;
    }

    public isSuccess(): boolean {
        return HTTPRequest.isStatusSuccess(this.response.status);
    }

}
export interface IHTTPResponse<RESPONSE> {
    status: number;
    statusText: string | undefined;
    headers: any | undefined;
    data: RESPONSE | undefined;
}

export type HTTPRequestMethod = "GET" | "POST" | "PUT" | "DELETE";
