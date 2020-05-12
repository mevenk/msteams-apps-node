import { DatePipe } from "@angular/common";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import { CommonUtils } from "../../commons/CommonUtils";
import { RequestMetadata } from "../../pojo/RequestMetadata";
import { SystemUtils } from "./../../commons/SystemUtils";
import { Logger } from "./../../logging/Logger";
import { GET_CONTROLLERS, POST_CONTROLLERS } from "./ServerControllers";

export class ServerComponent {

    public static startServer(port: number): any {
        const application = express();

        application.use(ServerComponent.APP_INTERCEPTOR_FUNCTION);

        let requestMetadata: RequestMetadata;
        GET_CONTROLLERS.forEach((controller) => {
            requestMetadata = controller.requestMetadata;
            application.get(requestMetadata.path, requestMetadata.requestHandler);
        });

        POST_CONTROLLERS.forEach((controller) => {
            requestMetadata = controller.requestMetadata;
            application.post(requestMetadata.path, requestMetadata.requestHandler);
        });

        application.use(ServerComponent.APP_ERROR_FUNCTION);

        let server: any;

        if (SystemUtils.isHTTPSServerRequired()) {
            Logger.log("Creating HTTPS server");
            Logger.log("Current DIR: ", process.cwd(), __dirname, path.delimiter);
            Logger.log("Key path: ", SystemUtils.appHTTPSKeyPath());
            Logger.log("Cert path: ", SystemUtils.appHTTPSCertPath());
            const privateKey = fs.readFileSync(SystemUtils.appHTTPSKeyPath(), "utf8");
            const certificate = fs.readFileSync(SystemUtils.appHTTPSCertPath(), "utf8");
            const credentials = { key: privateKey, cert: certificate };
            const serverHTTPS = https.createServer(credentials, application);
            server = serverHTTPS.listen(port);
        } else {
            Logger.log("Creating HTTP server");
            const serverHTTP = http.createServer(application);
            server = serverHTTP.listen(port);
        }

        ServerComponent.printServerDetail(server);
        Logger.log("Server:", CommonUtils.prettyPrintJSON(server));
        return true;
    }

    private static APP_CORRELATION_ID = "app-correlation-id";
    private static APP_AUTH_HEADER = "authorization";
    private static APP_AUTH_TOKEN_BUF_SECRET = new Buffer(SystemUtils.appHeaderAuthorizationTokenSecret(), "base64");
    private static DATE_PIPE: DatePipe = new DatePipe("en-US");

    private static isAuthorized(req: any): boolean {
        const auth: string = req.headers[ServerComponent.APP_AUTH_HEADER];
        Logger.info("Auth: " + auth);
        //
        return true;
    }

    private static APP_INTERCEPTOR_FUNCTION = (req: any, res: any, next: any) => {
        const date: Date = new Date();
        const transformedDate: string | null = ServerComponent.DATE_PIPE.transform(date, "ddMMyyyy_HHmmss_S");
        let transformedDateString;
        if (transformedDate != null) {
            transformedDateString = transformedDate.toString();
        } else {
            transformedDateString = date.getTime().toString();
        }
        const correlationId: string = transformedDateString.toString();
        Logger.log("Before");
        ServerComponent.checkRequest(req, correlationId);
        if (!ServerComponent.isAuthorized(req)) {
            Logger.error("Invalid token");
            //res.send("Not authorized");
            //return;
        }
        Logger.log(CommonUtils.prettyPrintJSON(req.params));
        res.set(ServerComponent.APP_CORRELATION_ID, req.headers[ServerComponent.APP_CORRELATION_ID]);
        next();
    }

    private static APP_ERROR_FUNCTION = (err: any, req: any, res: any, next: any) => {
        Logger.error("Error occured[" + req.headers[ServerComponent.APP_CORRELATION_ID] + "]", "sending appropriate response");
        res.set(ServerComponent.APP_CORRELATION_ID, req.headers[ServerComponent.APP_CORRELATION_ID]);
        ServerComponent.checkResponse(req, res, req.headers[ServerComponent.APP_CORRELATION_ID]);
        res.send("Error occurred");
    }

    private static checkRequest(req: any, correlationId: string | null): void {
        req.headers[ServerComponent.APP_CORRELATION_ID] = correlationId;
        Logger.log("Request: ", correlationId, req.baseUrl, req.hostname);
        Logger.log("Request headers: ", CommonUtils.prettyPrintJSON(req.headers));
        Logger.log("Body");
        Logger.log(req.body);
    }

    private static checkResponse(req: any, res: any, correlationId: string | null): void {
        Logger.log("Response: ", correlationId, res.headersSent);
    }

    private static printServerDetail(server: any): void {
        Logger.log("Server started", server.family);
        const address = server.address();
        Logger.log("Listening at https://" + address.address + ":" + address.port);
    }
}
