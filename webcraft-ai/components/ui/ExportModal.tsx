'use client'
import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function ExportModal({ components, theme, onClose }: { components: any[]; theme: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [zipping, setZipping] = useState(false)

  const generateCode = () => {
    let code = `// Exported from WebCraft AI
import React from 'react';

export default function MyAwesomeSite() {
  return (
    <div className="min-h-screen font-sans">\n`

    components.forEach(c => {
      switch (c.type) {
        case 'navbar':
          code += `      {/* Navbar Section */}\n`
          code += `      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>\n`
          code += `        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>${c.props.logo || 'Brand'}</div>\n`
          code += `        <div style={{ display: 'flex', gap: '20px' }}>\n`
          const links = c.props.links || ['Home', 'About']
          links.forEach((l: string) => code += `          <a href="#" style={{ textDecoration: 'none', color: '#666' }}>${l}</a>\n`)
          code += `        </div>\n`
          code += `        <button style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px' }}>${c.props.cta || 'Get Started'}</button>\n`
          code += `      </nav>\n`
          break
        case 'hero':
          code += `      {/* Hero Section */}\n`
          code += `      <section style={{ padding: '100px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', color: 'white' }}>\n`
          code += `        <h1 style={{ fontSize: '64px', margin: '0 0 20px 0' }}>${c.props.title || 'Welcome'}</h1>\n`
          code += `        <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.8 }}>${c.props.subtitle || ''}</p>\n`
          code += `        <button style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: 'white', color: '#4f46e5', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>${c.props.cta || 'Get Started'}</button>\n`
          code += `      </section>\n`
          break
        case 'features':
          code += `      {/* Features Section */}\n`
          code += `      <section style={{ padding: '80px 20px', backgroundColor: '#f8fafc', textAlign: 'center' }}>\n`
          code += `        <h2 style={{ fontSize: '40px', marginBottom: '10px' }}>${c.props.heading || 'Features'}</h2>\n`
          code += `        <p style={{ color: '#666', marginBottom: '50px' }}>${c.props.subheading || ''}</p>\n`
          code += `        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>\n`
          const feats = c.props.featureList || []
          feats.forEach((f: any) => {
            code += `          <div style={{ padding: '30px', background: 'white', borderRadius: '16px', width: '300px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>\n`
            code += `            <div style={{ fontSize: '40px', marginBottom: '15px' }}>${f.icon}</div>\n`
            code += `            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>${f.title}</h3>\n`
            code += `            <p style={{ color: '#666', lineHeight: 1.6 }}>${f.desc}</p>\n`
            code += `          </div>\n`
          })
          code += `        </div>\n`
          code += `      </section>\n`
          break
        case 'image':
          code += `      {/* Image Section */}\n`
          code += `      <section style={{ padding: '40px 20px', textAlign: 'center' }}>\n`
          code += `        <img src="${c.props.src || 'https://via.placeholder.com/800x400'}" alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />\n`
          code += `      </section>\n`
          break
        default:
          code += `      {/* Generic Section: ${c.type} */}\n`
          code += `      <section style={{ padding: '60px 20px', textAlign: 'center' }}>\n`
          code += `        <h2>${c.props.heading || c.type}</h2>\n`
          code += `      </section>\n`
      }
    })

    code += `    </div>
  );
}
`
    return code
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadZip = async () => {
    setZipping(true)
    try {
      const zip = new JSZip()

      // Add the React component
      zip.file("MyAwesomeSite.tsx", generateCode())

      // Add a simple package.json for Next.js/React
      const packageJson = {
        name: "webcraft-exported-site",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start"
        },
        dependencies: {
          next: "14.2.3",
          react: "^18",
          "react-dom": "^18"
        }
      }
      zip.file("package.json", JSON.stringify(packageJson, null, 2))

      // Add a README
      zip.file("README.md", `# Exported WebCraft AI Project

This is your exported React project. 

## How to run it
1. \`npm install\`
2. \`npm run dev\`
`)

      // Generate the ZIP and trigger download
      const content = await zip.generateAsync({ type: "blob" })
      saveAs(content, "webcraft-site.zip")
    } catch (e) {
      console.error("Failed to generate zip", e)
      alert('Failed to generate ZIP file')
    } finally {
      setZipping(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-black">Export Code</h2>
            <p className="text-sm text-gray-500">Download as a React project or copy the code directly.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900 border-b-4 border-violet-600">
          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
            <code>{generateCode()}</code>
          </pre>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 items-center">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors mr-auto">
            Close
          </button>
          <button onClick={handleCopy} className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            {copied ? '✅ Copied' : '📋 Copy Code'}
          </button>
          <button 
            onClick={handleDownloadZip} 
            disabled={zipping}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-200 flex items-center gap-2 disabled:opacity-50"
          >
            {zipping ? '⏳ Zipping...' : '📦 Download ZIP'}
          </button>
        </div>
      </div>
    </div>
  )
}
