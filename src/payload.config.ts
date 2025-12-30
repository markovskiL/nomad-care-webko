// Webko site configuration
import { createPayloadConfig } from "@webko-labs/payload-config/factory"
import { allCollections, allGlobals } from "@webko-labs/payload-config/presets"
import { ALL_BLOCKS } from "@webko-labs/payload-config/blocks"

export default createPayloadConfig({
  siteName: "Nomad Care",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET || "",
  databaseURL: process.env.POSTGRES_URL || "",
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  collections: allCollections,
  globals: allGlobals,
  blocks: ALL_BLOCKS,
  overrides: 
  {
    typescript: 
    {
      autoGenerate: false,
    },
  },
  locales: [
    { label: "English", code: "en" },
    { label: "Български", code: "bg" },
  ],
  defaultLocale: "en",
  seo: {
    collections: ["pages"],
    globals: ["site-settings"],
  },
})
