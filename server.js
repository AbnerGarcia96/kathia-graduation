import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const tableName = process.env.DYNAMODB_TABLE_NAME || 'RSVPs';

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn('Warning: AWS credentials are missing. DynamoDB persistence will fail without proper environment variables.');
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const ddbDoc = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(express.json());

app.post('/api/rsvp', async (req, res) => {
  const { name, message, attending } = req.body;

  if (!name || !message || typeof attending !== 'string') {
    return res.status(400).json({ message: 'Name, message, and attending flag are required.' });
  }

  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    message,
    attending,
    createdAt: new Date().toISOString()
  };

  try {
    await ddbDoc.send(new PutCommand({
      TableName: tableName,
      Item: item
    }));

    return res.status(201).json({ message: 'RSVP saved successfully.', item });
  } catch (error) {
    console.error('DynamoDB save error:', error);
    return res.status(500).json({ message: 'Failed to save RSVP.', error: error?.message || 'Unknown error' });
  }
});

app.listen(port, () => {
  console.log(`RSVP backend running on http://localhost:${port}`);
  console.log(`DynamoDB table: ${tableName}`);
});
