import { Router, Request, Response } from 'express'
import puppeteer, { type Browser, type Page } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

const router = Router()

let browserPromise: Promise<Browser> | undefined
let lastUsedAt = Date.now()

async function getBrowser() {
    lastUsedAt = Date.now()
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        })
    }
    return browserPromise
}

async function closeBrowserIfIdle() {
    if (!browserPromise) return
    if (Date.now() - lastUsedAt < 60_000) return
    try {
        const b = await browserPromise
        await b.close()
    } catch { }
    browserPromise = undefined
}

setInterval(() => {
    closeBrowserIfIdle().catch(() => { })
}, 30_000).unref()

router.post('/pdf', async (req: Request, res: Response) => {
    const { html } = req.body as { html?: string }
    if (!html || typeof html !== 'string') {
        res.status(400).json({ error: 'Missing html body' })
        return
    }

    let browser: Browser | undefined
    let page: Page | undefined

    try {
        browser = await getBrowser()
        page = await browser.newPage()

        await page.setContent(html, { waitUntil: 'domcontentloaded' })

        await Promise.race([
            page.evaluate(() => (document as any).fonts?.ready).catch(() => null),
            new Promise((r) => setTimeout(r, 250)),
        ])

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        })

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="portfolio.pdf"')
        res.send(pdf)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[PdfService]', message)
        res.status(500).json({ error: 'PDF generation failed', detail: message })
    } finally {
        await page?.close().catch(() => { })
        lastUsedAt = Date.now()
    }
})

export default router