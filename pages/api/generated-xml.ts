import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getSlugPath } from '@/lib/utilities/getSlugPath'

interface ICollectionTypes {
  name: string
  data: {
    slug: string
    isPublished: boolean
  }[]
}

interface ISigleTypes {
  name: string
  isPublished: boolean
}

interface ISitemapResponse {
  message?: {
    collectionTypes?: ICollectionTypes[]
    singleTypes?: ISigleTypes[]
  }
  status?: number
}

interface ISitemap {
  loc: string
  lastmod: string
  changefreq: string
  priority: number
}

const AZURE_MOUNT_PATH = '/home/site/sitemap-volume/sitemaps' // Azure File Share path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    // Fetch sitemap data from CMS
    const cmsSitemapRes = await fetch(`${process.env.CMS_URI}/api/sitemap`)
    if (!cmsSitemapRes.ok) {
      console.error('Failed to fetch CMS sitemap:', cmsSitemapRes.statusText)
      return res.status(500).json({ error: 'Failed to fetch CMS sitemap' })
    }

    const cmsSitemapData: ISitemapResponse = await cmsSitemapRes.json()

    console.log('Generating sitemap XML...')
    const singleTypes = cmsSitemapData?.message?.singleTypes
    const cmsStaticPaths: ISitemap[] =
      singleTypes
        ?.filter(item => item?.isPublished && getSlugPath(item?.name))
        ?.map(item => ({
          loc: `${process.env.NEXT_PUBLIC_INTERNAL_API_URI}${getSlugPath(item?.name)}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        })) ?? []

    // Generate sitemap XML content
    const cmsStaticXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap-style.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cmsStaticPaths
  .map(
    urlPath => `
  <url>
    <loc>${urlPath.loc}</loc>
    <lastmod>${urlPath.lastmod}</lastmod>
    <changefreq>${urlPath.changefreq}</changefreq>
    <priority>${urlPath.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    // Azure File Share path for the sitemap
    const filePath = path.join(AZURE_MOUNT_PATH, 'sitemap-cms.xml')

    try {
      // Ensure the Azure File Share directory exists
      if (!fs.existsSync(AZURE_MOUNT_PATH)) {
        console.log('Creating directory at:', AZURE_MOUNT_PATH)
        fs.mkdirSync(AZURE_MOUNT_PATH, { recursive: true })
      }

      // Write the sitemap XML to the mounted path
      fs.writeFileSync(filePath, cmsStaticXmlContent, 'utf-8')
      console.log('Sitemap file written to:', filePath)
    } catch (fileError) {
      console.error('Error writing sitemap file:', fileError)
      return res.status(500).json({ error: 'Failed to write sitemap file' })
    }

    return res.status(200).json({
      success: true,
      message: `Sitemap file written to ${filePath}`
    })
  } catch (err) {
    console.error('Error during API call:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
