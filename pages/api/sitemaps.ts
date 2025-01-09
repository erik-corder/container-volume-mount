import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filename } = req.query; // Extract the filename from the request query
    if (!filename || Array.isArray(filename)) {
        res.status(400).json({ error: 'Invalid filename' });
        return;
    }

    const filePath = path.join('/sitemaps', filename); // Path to the file in the mounted volume

    try {
        const xmlData = await fs.readFile(filePath, 'utf-8'); // Read the XML file
        res.setHeader('Content-Type', 'application/xml');  // Set the Content-Type header
        res.status(200).send(xmlData);                    // Send the XML content
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(404).json({ error: 'File not found' });
    }
}
