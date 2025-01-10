import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

type ApiResponse = {
    message: string;
    filePath?: string;
    error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>): void {
    // Example XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <note>
        <to>Tove</to>
        <from>Jani</from>
        <heading>Reminder</heading>
        <body>Don't forget me this weekend!</body>
    </note>`;

    // Define the directory and file paths
    const dirPath = path.join(process.cwd(), 'public', 'generated-xml');
    const filePath = path.join(dirPath, 'example.xml');

    try {
        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively
        }

        // Write the XML content to the file
        fs.writeFileSync(filePath, xmlContent);

        // Respond with success
        res.status(200).json({
            message: 'XML file generated successfully',
            filePath,
        });
    } catch (error) {
        console.error('Error generating XML file:', error);

        // Respond with error
        res.status(500).json({
            message: 'Failed to generate XML file',
            error: (error as Error).message,
        });
    }
}
