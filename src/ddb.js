const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

class DDB {
    constructor() {
        this.client = new DynamoDBClient({ region: "ap-south-1" });
        this.docClient = DynamoDBDocumentClient.from(this.client);
    }

    async putItem() {
        const params = {
            TableName: "user",
            Item: {
                email: "john@example.com",
                passcode: "123456",
            },
        };
        try {
            await this.docClient.send(new PutCommand(params));
            console.log("Item added successfully");
        } catch (err) {
            console.error(err);
        }
    };

    async queryItems() {
        const params = {
            TableName: "user",
            KeyConditionExpression: "email = :id",
            ExpressionAttributeValues: {
                ":id": "john@example.com",
            },
        };
        try {
            const data = await this.docClient.send(new QueryCommand(params));
            console.log("Query Results:", data.Items);
        } catch (err) {
            console.error(err);
        }
    };
}

module.exports = { DDB }