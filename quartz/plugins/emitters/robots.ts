import { FilePath, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"

export const RobotsTxt: QuartzEmitterPlugin = () => ({
  name: "RobotsTxt",
  async emit({ argv, cfg }) {
    const path = joinSegments(argv.output, "robots.txt")
    const baseUrl = cfg.configuration.baseUrl ?? ""
    const sitemapUrl = `https://${baseUrl}/sitemap.xml`.replace(/([^:]\/)\/+/g, "$1") // Remove double slashes

    const content = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`
    await fs.promises.mkdir(argv.output, { recursive: true })
    await fs.promises.writeFile(path, content)
    return [path] as FilePath[]
  },
  async *partialEmit() {},
})
