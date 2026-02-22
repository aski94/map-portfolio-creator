export function exportShowcaseAsHtml(showcaseEl: HTMLElement, filename = 'portfolio.html') {
    buildExportHtml(showcaseEl).then((html) => downloadText(html, filename, 'text/html'))
}

export async function exportShowcaseAsPdf(showcaseEl: HTMLElement, filename = 'portfolio.pdf') {
    const html = await buildExportHtml(showcaseEl)

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
    })

    if (!res.ok) throw new Error('PDF generation failed')

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

async function buildExportHtml(showcaseEl: HTMLElement) {
    const clone = showcaseEl.cloneNode(true) as HTMLElement
    sanitizeClone(clone)

    const rootVars = extractCssVariables()
    const allStyles = await collectAllStyles()

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Portfolio</title>
<style>
:root { ${rootVars} }
${allStyles}
body { margin: 0; padding: 18px; display: flex; justify-content: center; }
.showcase { width: 100%; max-width: 980px; background: #fff; }
.action, .reorder { display: none !important; }
img { max-width: 100%; }
.template { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body style="margin:0;padding:18px;display:flex;justify-content:center;">
${clone.outerHTML}
</body>
</html>`
}

function sanitizeClone(root: HTMLElement) {
    root.classList.add('showcase')
    root.querySelectorAll('.action,.reorder').forEach((n) => n.remove())
    root.querySelectorAll('.template.selected').forEach((n) => n.classList.remove('selected'))
    root.style.cssText += ';overflow:visible;box-shadow:none;border:none;margin:0;border-radius:0;padding-top:0;padding-bottom:0;'
}

function extractCssVariables(): string {
    const vars: string[] = []
    const rootStyle = getComputedStyle(document.documentElement)
    const bodyStyle = getComputedStyle(document.body)

    for (const sheet of Array.from(document.styleSheets)) {
        try {
            for (const rule of Array.from(sheet.cssRules ?? [])) {
                if (!(rule instanceof CSSStyleRule)) continue
                const isRoot = rule.selectorText === ':root' || rule.selectorText === 'html'
                const isBody = rule.selectorText === 'body'
                if (!isRoot && !isBody) continue
                const style = rule.style
                const computed = isRoot ? rootStyle : bodyStyle
                for (let i = 0; i < style.length; i++) {
                    const prop = style[i] as string | undefined
                    if (prop?.startsWith('--')) {
                        const val = computed.getPropertyValue(prop).trim()
                        if (val) vars.push(`${prop}: ${val};`)
                    }
                }
            }
        } catch { }
    }

    return vars.join('\n  ')
}

async function collectAllStyles(): Promise<string> {
    const parts: string[] = []

    document.querySelectorAll('style').forEach((s) => {
        const txt = s.textContent ?? ''
        if (txt.trim()) parts.push(txt)
    })

    const fetches = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
        .map(async (link) => {
            try {
                const res = await fetch(link.href)
                if (res.ok) return await res.text()
            } catch { }
            return ''
        })

    const fetched = await Promise.all(fetches)
    fetched.forEach((txt) => { if (txt.trim()) parts.push(txt) })

    return parts.join('\n')
}

function downloadText(text: string, filename: string, mime: string) {
    const blob = new Blob([text], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, (c) => {
        if (c === '&') return '&amp;'
        if (c === '<') return '&lt;'
        if (c === '>') return '&gt;'
        if (c === '"') return '&quot;'
        return '&#39;'
    })
}