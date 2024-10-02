import * as pd_api from "pandadoc-node-client";

const API_KEY = process.env.PANDADOC_API_KEY;

const cfg = pd_api.createConfiguration({
    authMethods: { apiKey: `API-Key ${API_KEY}` },
    baseServer: new pd_api.ServerConfiguration(
        // Defining the host is optional and defaults to https://api.pandadoc.com
        "https://api.pandadoc.com", {}
    ),
});

const apiInstance = new pd_api.DocumentsApi(cfg);
export { apiInstance };