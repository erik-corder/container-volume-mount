import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const AZURE_VOLUME_PATH = "/mnt/azure/sitemaps"; // Mounted Azure volume path

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Ensure the Azure volume path exists
      if (!fs.existsSync(AZURE_VOLUME_PATH)) {
        fs.mkdirSync(AZURE_VOLUME_PATH, { recursive: true });
      }

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

      // Define the file path in the mounted Azure volume
      const filePath = path.join(AZURE_VOLUME_PATH, "output.xml");

      // Write the XML file
      fs.writeFileSync(filePath, xml);

      res.status(200).json({
        message: "XML file generated and saved successfully in the Azure mounted volume.",
        filePath: `/sitemaps/output.xml`, // This might need a public URL, depending on Azure setup
      });
    } catch (error) {
      console.error("Error generating XML:", error);
      res.status(500).json({ error: "Failed to generate XML file." });
    }
  } else {
    console.log("Method Not Allowed");

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
