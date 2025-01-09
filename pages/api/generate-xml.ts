import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Mounted volume path inside Azure App Service
const MOUNTED_VOLUME_PATH = "https://digital400.file.core.windows.net/sitemap-volume/sitemaps";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Dummy data
      const data: { [key: string]: string | number } = {
        name: "John Doe",
        age: 30,
        city: "New York",
      };

      // Convert dummy data to XML
      const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <root>
          ${Object.keys(data)
            .map(
              (key) => `
            <${key}>${data[key]}</${key}>`
            )
            .join("")}
        </root>
      `;

      // Ensure the directory exists
      if (!fs.existsSync(MOUNTED_VOLUME_PATH)) {
        fs.mkdirSync(MOUNTED_VOLUME_PATH, { recursive: true });
      }

      // Define the file path in the mounted volume
      const fileName = "output.xml";
      const filePath = path.join(MOUNTED_VOLUME_PATH, fileName);

      // Write the XML file to the directory
      fs.writeFileSync(filePath, xml);

      // Return the URL where the file can be accessed
      const fileUrl = `https://${req.headers.host}/sitemaps/sitemaps/${fileName}`;
      res.status(200).json({
        message: "XML file generated and saved successfully.",
        fileUrl,
      });
    } catch (error) {
      console.error("Error generating XML:", error);
      res.status(500).json({ error: "Failed to generate XML file." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
