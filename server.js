import express, { json } from "express";
import dotenv from "dotenv";
import { apiInstance } from "./api.js";
import {
    createDocumentFromPandadocTemplate,
    ensureDocumentCreated,
    documentSend,
} from "./utils.js";

dotenv.config({ path: ".env" });

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(json());

// Endpoint to create a document from a template ID
app.post("/create-document/:templateId", async(req, res) => {
    const { templateId } = req.params;
    const customFields = req.body.fields || {};

    if (!templateId) {
        return res.status(400).json({ error: "Template ID is required" });
    }

    try {
        let createdDocument = await createDocumentFromPandadocTemplate(
            apiInstance,
            templateId,
            customFields
        );
        console.log("Created document:", createdDocument);

        await ensureDocumentCreated(apiInstance, createdDocument);
        await documentSend(apiInstance, createdDocument);

        res.status(201).json({
            success: true,
            message: "Document created successfully!",
            data: {
                documentId: createdDocument.uuid,
                documentName: createdDocument.name,
                documentStatus: createdDocument.status,
                documentUrl: `https://app.pandadoc.com/a/#/documents/${createdDocument.uuid}`,
            },
        });
    } catch (error) {
        console.error("Error creating document:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to create document!" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});