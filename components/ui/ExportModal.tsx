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
        case 'navbar': {
          code += `      {/* Navbar Section */}\n`
          code += `      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>\n`
          code += `        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>${c.props.logo || 'Brand'}</div>\n`
          code += `        <div style={{ display: 'flex', gap: '20px' }}>\n`
          const navLinks = c.props.links || [{ label: 'Home', href: '#home' }, { label: 'About', href: '#about' }]
          navLinks.forEach((l: string | { label: string; href: string }) => {
            const label = typeof l === 'string' ? l : l.label
            const href = typeof l === 'string' ? `#${l.toLowerCase()}` : l.href
            code += `          <a href="${href}" style={{ textDecoration: 'none', color: '#666' }}>${label}</a>\n`
          })
          code += `        </div>\n`
          code += `        <a href="${c.props.ctaHref || '#contact'}" style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>${c.props.cta || 'Get Started'}</a>\n`
          code += `      </nav>\n`
          break
        }
        case 'hero': {
          code += `      {/* Hero Section */}\n`
          code += `      <section id="home" style={{ padding: '100px 20px', textAlign: 'center', background: '${c.props.bg || 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)'}', color: 'white' }}>\n`
          code += `        <h1 style={{ fontSize: '64px', margin: '0 0 20px 0' }}>${c.props.title || 'Welcome'}</h1>\n`
          code += `        <p style={{ fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.8 }}>${c.props.subtitle || ''}</p>\n`
          code += `        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>\n`
          code += `          <a href="${c.props.ctaHref || '#contact'}" style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: 'white', color: '#4f46e5', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>${c.props.cta || 'Get Started'}</a>\n`
          if (c.props.cta2) {
            code += `          <a href="${c.props.cta2Href || '#features'}" style={{ padding: '15px 30px', fontSize: '18px', border: '2px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>${c.props.cta2}</a>\n`
          }
          code += `        </div>\n`
          code += `      </section>\n`
          break
        }
        case 'features': {
          code += `      {/* Features Section */}\n`
          code += `      <section id="features" style={{ padding: '80px 20px', backgroundColor: '#f8fafc', textAlign: 'center' }}>\n`
          code += `        <h2 style={{ fontSize: '40px', marginBottom: '10px' }}>${c.props.heading || 'Features'}</h2>\n`
          code += `        <p style={{ color: '#666', marginBottom: '50px' }}>${c.props.subheading || ''}</p>\n`
          code += `        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>\n`
          const feats = c.props.featureList || []
          feats.forEach((f: any) => {
            code += `          <div style={{ padding: '30px', background: 'white', borderRadius: '16px', width: '300px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>\n`
            code += `            <div style={{ fontSize: '40px', marginBottom: '15px' }}>${f.icon}</div>\n`
            code += `            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>${f.title}</h3>\n`
            code += `            <p style={{ color: '#666', lineHeight: 1.6 }}>${f.desc}</p>\n`
            code += `            <a href="${c.props.learnMoreHref || '#contact'}" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Learn More →</a>\n`
            code += `          </div>\n`
          })
          code += `        </div>\n`
          code += `      </section>\n`
          break
        }
        case 'pricing': {
          code += `      {/* Pricing Section */}\n`
          code += `      <section id="pricing" style={{ padding: '80px 20px', textAlign: 'center' }}>\n`
          code += `        <h2 style={{ fontSize: '40px', marginBottom: '50px' }}>${c.props.heading || 'Pricing'}</h2>\n`
          code += `        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>\n`
          const pricingPlans = c.props.plans || []
          pricingPlans.forEach((p: any) => {
            code += `          <div style={{ padding: '40px', background: 'white', borderRadius: '16px', width: '280px', border: p.popular ? '2px solid #4f46e5' : '1px solid #eee', boxShadow: p.popular ? '0 20px 40px rgba(79,70,229,0.15)' : '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' }}>\n`
            if (p.popular) code += `            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#4f46e5', color: 'white', padding: '4px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>POPULAR</div>\n`
            code += `            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>${p.name}</h3>\n`
            code += `            <div style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '24px' }}>${p.price}<span style={{ fontSize: '14px', opacity: 0.5 }}>/mo</span></div>\n`
            code += `            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', textAlign: 'left' }}>\n`
            ;(p.features || []).forEach((f: string) => code += `              <li style={{ padding: '6px 0', color: '#666' }}>✓ ${f}</li>\n`)
            code += `            </ul>\n`
            code += `            <a href="${p.href || '#contact'}" style={{ display: 'block', padding: '12px', background: ${p.popular ? "'#4f46e5'" : "'#f0f0f0'"}, color: ${p.popular ? "'white'" : "'#111'"}, borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>${p.cta || `Get ${p.name}`}</a>\n`
            code += `          </div>\n`
          })
          code += `        </div>\n`
          code += `      </section>\n`
          break
        }
        case 'contact': {
          code += `      {/* Contact Section */}\n`
          code += `      <section id="contact" style={{ padding: '80px 20px', backgroundColor: '#f8fafc', textAlign: 'center' }}>\n`
          code += `        <h2 style={{ fontSize: '40px', marginBottom: '10px' }}>${c.props.heading || 'Get In Touch'}</h2>\n`
          code += `        <p style={{ color: '#666', marginBottom: '40px' }}>${c.props.subtitle || ''}</p>\n`
          code += `        <form style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>\n`
          code += `          <input type="text" placeholder="Your Name" style={{ padding: '16px', border: '1px solid #eee', borderRadius: '12px', fontSize: '16px' }} />\n`
          code += `          <input type="email" placeholder="Your Email" style={{ padding: '16px', border: '1px solid #eee', borderRadius: '12px', fontSize: '16px' }} />\n`
          code += `          <textarea rows={4} placeholder="Your message..." style={{ padding: '16px', border: '1px solid #eee', borderRadius: '12px', fontSize: '16px', resize: 'none' }}></textarea>\n`
          code += `          <button type="submit" style={{ padding: '16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>${c.props.submitTxt || 'Send Message'}</button>\n`
          code += `        </form>\n`
          code += `      </section>\n`
          break
        }
        case 'about': {
          code += `      {/* About Section */}\n`
          code += `      <section id="about" style={{ padding: '80px 20px', textAlign: 'center' }}>\n`
          code += `        <h2 style={{ fontSize: '40px', marginBottom: '24px' }}>${c.props.heading || 'About Us'}</h2>\n`
          code += `        <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>${c.props.body || ''}</p>\n`
          code += `      </section>\n`
          break
        }
        case 'testimonials': {
          code += `      {/* Testimonials Section */}\n`
          code += `      <section style={{ padding: '80px 20px', backgroundColor: '#f8fafc', textAlign: 'center' }}>\n`
          code += `        <h2 style={{ fontSize: '40px', marginBottom: '50px' }}>${c.props.heading || 'Testimonials'}</h2>\n`
          code += `        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>\n`
          const revs = c.props.reviews || []
          revs.forEach((r: any) => {
            code += `          <div style={{ padding: '32px', background: 'white', borderRadius: '16px', width: '300px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>\n`
            code += `            <div style={{ color: '#f59e0b', marginBottom: '16px' }}>★★★★★</div>\n`
            code += `            <p style={{ color: '#555', fontStyle: 'italic', marginBottom: '20px' }}>${r.quote}</p>\n`
            code += `            <strong>${r.name}</strong><br/><span style={{ color: '#999', fontSize: '14px' }}>${r.role}</span>\n`
            code += `          </div>\n`
          })
          code += `        </div>\n`
          code += `      </section>\n`
          break
        }
        case 'footer': {
          const footerLinks = c.props.footerLinks || [{ label: 'Privacy', href: '#privacy' }, { label: 'Terms', href: '#terms' }, { label: 'Contact', href: '#contact' }]
          code += `      {/* Footer Section */}\n`
          code += `      <footer style={{ padding: '40px', backgroundColor: '#111', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>\n`
          code += `        <span style={{ fontWeight: 'bold', fontSize: '20px' }}>${c.props.brand || 'Brand'}</span>\n`
          code += `        <div style={{ display: 'flex', gap: '24px' }}>\n`
          footerLinks.forEach((l: { label: string; href: string }) => {
            code += `          <a href="${l.href}" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>${l.label}</a>\n`
          })
          code += `        </div>\n`
          code += `        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>${c.props.copy || `© ${new Date().getFullYear()} All rights reserved.`}</p>\n`
          code += `      </footer>\n`
          break
        }
        case 'image': {
          code += `      {/* Image Section */}\n`
          code += `      <section style={{ padding: '40px 20px', textAlign: 'center' }}>\n`
          code += `        <img src="${c.props.src || 'https://via.placeholder.com/800x400'}" alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />\n`
          code += `      </section>\n`
          break
        }
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
