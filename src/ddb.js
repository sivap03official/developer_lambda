const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

class DDB {
    constructor() {
        this.client = new DynamoDBClient({ region: "ap-south-1" });
        if (!this.client) {
            throw new Error("Failed to create DynamoDB client");
        }
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    async putItem(table, object) {
        const params = {
            TableName: table,
            Item: object,
        };
        try {
            await this.docClient.send(new PutCommand(params));
            return "Item added successfully";
        } catch (err) {
            throw err;
        }
    };

    async getItem(table, keyObj) {
        const params = {
            TableName: table,
            Key: keyObj
        };
        try {
            const data = await this.docClient.send(new GetCommand(params));
            return data?.Item || null;
        } catch (err) {
            throw err;
        }
    };

    async deleteItem(table, key) {
        const params = {
            TableName: table,
            Key: key
        };
        try {
            await this.docClient.send(new DeleteCommand(params));
            console.log("Item deleted successfully");
        } catch (err) {
            throw err;
        }
    }
}

module.exports = { DDB }