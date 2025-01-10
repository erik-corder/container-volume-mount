import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

// Azure App Service mounted path for the volume
const MOUNTED_VOLUME_PATH = "https://xml-volume-andshkdwahemagg7.australiaeast-01.azurewebsites.net/sitemaps";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const filePath = path.join(MOUNTED_VOLUME_PATH, "output.xml");

      // Check if the file exists in the mounted path
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "File not found in mounted volume." });
        return;
      }

      // Serve the XML file
      res.setHeader("Content-Type", "application/xml");
      res.status(200).send(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      console.error("Error accessing file in mounted volume:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
