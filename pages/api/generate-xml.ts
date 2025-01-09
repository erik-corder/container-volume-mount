import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Use the volume's mount path inside the container
const MOUNTED_VOLUME_PATH = "/app/wwwroot/sitemaps";

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

      // Define the file path in the mounted volume
      const filePath = path.join(MOUNTED_VOLUME_PATH, "output.xml");

      // Write the XML file to the mounted volume
      fs.writeFileSync(filePath, xml);

      res.status(200).json({
        message: "XML file generated and saved successfully.",
        filePath,
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
