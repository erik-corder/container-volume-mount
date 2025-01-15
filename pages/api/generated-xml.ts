import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const AZURE_MOUNT_PATH = "/home/site/sitemap-volume"; // Mounted file share path in App Service

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Ensure the directory exists
      // if (!fs.existsSync(AZURE_MOUNT_PATH)) {
      //   fs.mkdirSync(AZURE_MOUNT_PATH, { recursive: true });
      // }

      // Dummy data
      const data: { [key: string]: string | number } = {
        name: "John Doe",
        age: 30,
        city: "New York",
      };

      // Convert data to XML
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

      // Define the file path in the mounted volume
      const filePath = path.join(AZURE_MOUNT_PATH, "sitemaps/output.xml");

      // Write the XML file
      fs.writeFileSync(filePath, xml);

      res.status(200).json({
        message: "XML file generated and saved successfully in the Azure mounted volume.",
        filePath: `/sitemaps/output.xml`, // Publicly accessible if served correctly
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
