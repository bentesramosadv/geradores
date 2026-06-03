import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

async function extractPdfText(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(item => item.str).join(' ') + '\n'
  }
  return text.trim()
}

async function extractDocxText(file) {
  const mammoth = await import('mammoth/mammoth.browser')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawValue({ arrayBuffer })
  return result.value.trim()
}

export default function FileUpload({ text, setText, fileName, setFileName }) {
  const [dragging, setDragging] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [fileError, setFileError] = useState('')
  const inputRef = useRef()

  const processFile = async (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setFileError('Formato nao suportado. Use PDF, DOCX ou TXT.')
      return
    }
    setFileLoading(true)
    setFileError('')
    try {
      let extracted = ''
      if (ext === 'pdf') extracted = await extractPdfText(file)
      else if (ext === 'docx' || ext === 'doc') extracted = await extractDocxText(file)
      else extracted = await file.text()

      if (!extracted.trim()) {
        setFileError('Nao foi possivel extrair texto deste arquivo.')
        return
      }
      setText(extracted)
      setFileName(file.name)
    } catch (err) {
      setFileError(`Erro ao ler arquivo: ${err.message}`)
    } finally {
      setFileLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const clearFile = () => {
    setText('')
    setFileName('')
    setFileError('')
  }

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Documento / Peticao</span>
        <div className="flex items-center gap-3">
          {text && (
            <span className="text-xs text-slate-400">
              {wordCount.toLocaleString('pt-BR')} palavras
            </span>
          )}
          {fileName && (
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
              <FileText size={11} />
              <span className="truncate max-w-[140px]">{fileName}</span>
              <button onClick={clearFile} className="hover:text-red-500 transition-colors ml-0.5">
                <X size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drop zone hint (only when empty) */}
      {!text && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`mx-4 mt-4 mb-2 border-2 border-dashed rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 ${
            dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          }`}
        >
          {fileLoading ? (
            <Loader2 size={24} className="text-blue-500 animate-spin flex-shrink-0" />
          ) : (
            <Upload size={24} className={dragging ? 'text-blue-500' : 'text-slate-400'} />
          )}
          <div>
            <p className="text-sm font-medium text-slate-600">
              {fileLoading ? 'Extraindo texto...' : 'Arraste PDF, DOCX ou TXT aqui'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">ou clique para selecionar</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      )}

      {fileError && (
        <p className="text-xs text-red-500 px-4 py-1">{fileError}</p>
      )}

      {/* Textarea */}
      <div className="px-4 pb-4" onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setFileName('') }}
          placeholder={text ? '' : 'Ou cole o texto da peticao diretamente aqui...'}
          className="w-full h-56 p-3 text-sm text-slate-700 leading-relaxed border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 placeholder:text-slate-400 transition-all font-mono whitespace-pre-wrap"
          spellCheck={false}
        />
        {text && !fileName && (
          <button
            onClick={clearFile}
            className="mt-1 text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <X size={11} /> Limpar
          </button>
        )}
      </div>
    </div>
  )
}
