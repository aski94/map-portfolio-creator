import html2pdf from 'html2pdf.js'

export function exportShowcaseAsHtml(showcaseEl: HTMLElement, filename = 'portfolio.html') {
    const html = buildExportHtml(showcaseEl)
    downloadText(html, filename, 'text/html')
}

export async function exportShowcaseAsPdf(showcaseEl: HTMLElement, filename = 'portfolio.pdf') {
    const title = filename.replace(/\.pdf$/i, '') || 'Portfolio'

    const rootVars = extractCssVariables()
    const inlineStyles = collectInlineStyles()

    const host = document.createElement('div')
    host.style.cssText = 'position:fixed;left:0;top:0;width:1080px;background:#ffffff;z-index:99999;pointer-events:none;'

    const styleEl = document.createElement('style')
    styleEl.textContent = `:root { ${rootVars} }\n${inlineStyles}`
    host.appendChild(styleEl)

    const clone = showcaseEl.cloneNode(true) as HTMLElement
    sanitizeClone(clone)
    applyPageBreaks(clone)
    host.appendChild(clone)
    document.body.appendChild(host)

    const fonts: any = (document as any).fonts
    if (fonts?.ready) await fonts.ready
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))

    resolveBordersFromComputed(clone)

    await new Promise<void>((r) => requestAnimationFrame(() => r()))

    try {
        await (html2pdf() as any)
            .set({
                margin: [10, 10, 10, 10],
                filename,
                pagebreak: { mode: ['css', 'legacy'] },
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    windowWidth: 1080,
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            })
            .from(clone)
            .toPdf()
            .get('pdf')
            .then((pdf: any) => { pdf.setProperties({ title }) })
            .save()
    } finally {
        host.remove()
    }
}

function applyPageBreaks(root: HTMLElement) {
    root.querySelectorAll<HTMLElement>('.template, .wrap, .card, article').forEach((el) => {
        el.style.setProperty('break-inside', 'avoid', 'important')
        el.style.setProperty('page-break-inside', 'avoid', 'important')
    })
}

function buildExportHtml(showcaseEl: HTMLElement) {
    const clone = showcaseEl.cloneNode(true) as HTMLElement
    sanitizeClone(clone)

    const rootVars = extractCssVariables()
    const inlineStyles = collectInlineStyles()

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Portfolio</title>
<style>
:root { ${rootVars} }
${inlineStyles}
body { margin: 0; display: flex; justify-content: center; }
.showcase { width: 100%; max-width: 980px; box-shadow: 0 4px 32px rgba(0,0,0,0.10); border-radius: 12px; background: #fff; }
.action, .reorder { display: none !important; }
img { max-width: 100%; }
</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`
}

function sanitizeClone(root: HTMLElement) {
    root.querySelectorAll('.action,.reorder').forEach((n) => n.remove())
    root.querySelectorAll('.template.selected').forEach((n) => n.classList.remove('selected'))
    root.style.cssText += ';overflow:visible;box-shadow:none;border:none;margin:0;border-radius:0;'
}

function resolveBordersFromComputed(root: HTMLElement) {
    root.querySelectorAll<HTMLElement>('span.tag').forEach((el) => {
        const cs = getComputedStyle(el)
        const bw = cs.getPropertyValue('border-top-width').trim()
        const bs = cs.getPropertyValue('border-top-style').trim()
        const bc = cs.getPropertyValue('border-top-color').trim()
        if (bw && bw !== '0px' && bs !== 'none') {
            el.style.setProperty('border', `${bw} ${bs} ${bc}`)
        }
        const raw = parseFloat(cs.getPropertyValue('border-radius'))
        el.style.setProperty('border-radius', '20px')
        el.style.setProperty('padding-bottom', '1.5em')
        el.style.setProperty('display', 'inline-flex')
        el.style.setProperty('align-items', 'center')
        el.style.setProperty('line-height', '1')
    })

    root.querySelectorAll<HTMLElement>('*').forEach((el) => {
        if (el.classList.contains('tag')) return

        const cs = getComputedStyle(el)
        const sides = ['top', 'right', 'bottom', 'left'] as const
        const widths = sides.map((s) => cs.getPropertyValue(`border-${s}-width`).trim())
        const styleVals = sides.map((s) => cs.getPropertyValue(`border-${s}-style`).trim())
        const colors = sides.map((s) => cs.getPropertyValue(`border-${s}-color`).trim())

        const allSame =
            widths.every((v) => v === widths[0]) &&
            styleVals.every((v) => v === styleVals[0]) &&
            colors.every((v) => v === colors[0])

        if (allSame) {
            if (widths[0] && widths[0] !== '0px' && styleVals[0] !== 'none') {
                el.style.setProperty('border', `${widths[0]} ${styleVals[0]} ${colors[0]}`)
            }
        } else {
            sides.forEach((s, i) => {
                if (widths[i] && widths[i] !== '0px' && styleVals[i] !== 'none') {
                    el.style.setProperty(`border-${s}`, `${widths[i]} ${styleVals[i]} ${colors[i]}`)
                }
            })
        }

        const radii = [
            'border-top-left-radius',
            'border-top-right-radius',
            'border-bottom-right-radius',
            'border-bottom-left-radius',
        ]
        const radiusVals = radii.map((r) => cs.getPropertyValue(r).trim())
        const allRadiusSame = radiusVals.every((v) => v === radiusVals[0])

        if (allRadiusSame && radiusVals[0] && radiusVals[0] !== '0px') {
            const raw = parseFloat(radiusVals[0])
            el.style.setProperty('border-radius', raw > 100 ? '9999px' : radiusVals[0])
        } else if (!allRadiusSame) {
            radii.forEach((r, i) => {
                if (radiusVals[i] && radiusVals[i] !== '0px') {
                    el.style.setProperty(r, radiusVals[i]!)
                }
            })
        }
    })
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

function collectInlineStyles(): string {
    const parts: string[] = []
    document.querySelectorAll('style').forEach((s) => {
        const txt = s.textContent ?? ''
        if (txt.trim()) parts.push(txt)
    })
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