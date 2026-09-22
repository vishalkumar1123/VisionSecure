// Explicit, opt-in provider checks; no customer data or outbound messages.
require('@next/env').loadEnvConfig(process.cwd())
const OpenAI = require('openai').default
async function main() {
  const results = {}
  try {
    const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 20000, maxRetries: 0 })
    const response = await ai.responses.create({ model: process.env.OPENAI_MODEL, input: 'Reply with OK.', store: false, max_output_tokens: 32 })
    results.openai = { passed: response.status === 'completed' && Boolean(response.output_text?.trim()), status: response.status }
  } catch (error) { results.openai = { passed: false, status: error.status || null, code: error.code || 'CONNECTION_FAILED' } }
  try {
    // App-default version is used only for token diagnostics, never messaging.
    const endpoint = new URL('https://graph.facebook.com/debug_token')
    endpoint.searchParams.set('input_token', process.env.META_ACCESS_TOKEN || '')
    const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${process.env.META_APP_ID}|${process.env.META_APP_SECRET}` }, signal: AbortSignal.timeout(20000) })
    const body = await response.json()
    results.meta = { status: response.status, validToken: body.data?.is_valid === true, appMatches: body.data?.app_id === process.env.META_APP_ID, code: body.error?.code || body.data?.error?.code || null, subcode: body.error?.error_subcode || body.data?.error?.error_subcode || null, graphVersionConfigured: Boolean(process.env.META_GRAPH_VERSION) }
  } catch { results.meta = { passed: false, code: 'CONNECTION_FAILED' } }
  results.google = { oauthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), measurementMatches: process.env.NEXT_PUBLIC_GA_ID === 'G-XRYGR89Q5K', streamMatches: process.env.GA4_STREAM_ID === '15223351834', propertyExplicitlyConfigured: Boolean(process.env.GA4_PROPERTY_ID) }
  console.log(JSON.stringify(results, null, 2))
}
main().catch(() => { console.error('Provider check failed; details withheld.'); process.exitCode = 1 })
