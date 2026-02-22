import { Router, Request, Response } from 'express'
import puppeteer from 'puppeteer'

const router = Router()

router.post('/pdf', async (req: Request, res: Response) => {
    const { html } = req.body as { html?: string }
    if (!html || typeof html !== 'string') {
        res.status(400).json({ error: 'Missing html body' })
        return
    }

    let browser
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })

        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        await page.evaluateHandle('document.fonts.ready')

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        })

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="portfolio.pdf"')
        res.send(pdf)
    } catch (err) {
        console.error('PDF generation failed:', err)
        res.status(500).json({ error: 'PDF generation failed' })
    } finally {
        await browser?.close()
    }
})

export default router