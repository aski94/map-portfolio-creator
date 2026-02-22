import { Router, Request, Response } from 'express'
import puppeteer, { type Browser, type Page } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

const router = Router()

let browserPromise: Promise<Browser> | null = null

async function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        }) as Promise<Browser>

        browserPromise.then((b) => {
            b.on('disconnected', () => {
                browserPromise = null
            })
        }).catch(() => {
            browserPromise = null
        })
    }
    return browserPromise
}

router.post('/pdf', async (req: Request, res: Response) => {
    const { html } = req.body as { html?: string }
    if (!html || typeof html !== 'string') {
        res.status(400).json({ error: 'Missing html body' })
        return
    }

    let page: Page | null = null

    try {
        const browser = await getBrowser()
        page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'domcontentloaded' })

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
    }
})

export default router