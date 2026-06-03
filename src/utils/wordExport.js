function markdownToHtml(text) {
  return text
    .split('\n')
    .map(line => {
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.match(/^[-*] /)) return `<li>${line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`
      if (line.trim() === '') return '<br/>'
      return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`
    })
    .join('\n')
}

export function downloadAsWord(content, filename = 'analise-juridica') {
  const html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${filename}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 2.5cm; line-height: 1.6; color: #222; }
    h2 { font-size: 13pt; color: #1e3a8a; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; }
    h3 { font-size: 12pt; color: #1e3a8a; margin-top: 14px; margin-bottom: 6px; }
    p { margin: 6px 0; text-align: justify; }
    li { margin: 4px 0 4px 20px; }
    strong { font-weight: bold; }
    .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; }
    .header h1 { font-size: 14pt; color: #1e3a8a; margin: 0; }
    .header p { font-size: 10pt; color: #666; margin: 4px 0 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatorio de Analise Juridica</h1>
    <p>Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
  </div>
  ${markdownToHtml(content)}
</body>
</html>`

  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadAllAsWord(allResults, agentTitles, filename = 'analise-completa') {
  const sections = Object.entries(allResults)
    .filter(([, v]) => v.result)
    .map(([mode, v]) => `<h1 style="page-break-before:always;font-size:14pt;color:#1e3a8a;border-bottom:2px solid #1e3a8a;padding-bottom:8px;">${agentTitles[mode] || mode}</h1>\n${markdownToHtml(v.result)}`)
    .join('\n\n')

  const html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${filename}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 2.5cm; line-height: 1.6; color: #222; }
    h1 { font-size: 14pt; color: #1e3a8a; }
    h2 { font-size: 13pt; color: #1e3a8a; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 18px; }
    h3 { font-size: 12pt; color: #1e3a8a; margin-top: 14px; }
    p { margin: 6px 0; text-align: justify; }
    li { margin: 4px 0 4px 20px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <div style="text-align:center;margin-bottom:32px;border-bottom:2px solid #1e3a8a;padding-bottom:16px;">
    <h1 style="font-size:16pt;color:#1e3a8a;margin:0;">Relatorio Completo de Analise Juridica</h1>
    <p style="color:#666;margin:8px 0 0;">Todos os Agentes &mdash; ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
  </div>
  ${sections}
</body>
</html>`

  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
