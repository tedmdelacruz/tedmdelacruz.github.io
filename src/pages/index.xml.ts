// Redirect /index.xml → /rss.xml for legacy Hugo feed subscribers.
// Re-exports the live RSS handler so the content is identical.
export { GET } from "./rss.xml.ts";
