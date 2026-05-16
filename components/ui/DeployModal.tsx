'use client'
import { useState } from 'react'

export default function DeployModal({ subdomain: projectSubdomain, onClose }: { subdomain?: string; onClose: () => void }) {
  const [subdomain, setSubdomain] = useState(projectSubdomain || '')
  const [deploying, setDeploying] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')
  const [error, setError] = useState('')

  const handleDeploy = async () => {
    if (!subdomain.trim()) return
    setDeploying(true)
    setError('')
    try {
      // Save to MongoDB first
      const saveRes = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: subdomain.toLowerCase().trim(),
          title: subdomain,
          description: 'Deployed via WebCraft AI',
          content: {
            hero: { heading: `Welcome to ${subdomain}`, subheading: 'Built with WebCraft AI' },
          },
        }),
      })
      // 409 = already exists, that's fine
      const saveData = await saveRes.json()
      if (!saveRes.ok && saveRes.status !== 409) {
        setError(saveData.error || 'Failed to save site')
        setDeploying(false)
        return
      }

      setDeployedUrl(`https://${subdomain.toLowerCase()}.rakshithganjimut.xyz`)
      // In production, trigger Vercel domain API here
      // await fetch('/api/deploy', { method: 'POST', body: JSON.stringify({ subdomain }) })
    } catch (e: any) {
      setError('Network error. Please try again.')
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl w-[440px] shadow-2xl relative animate-in fade-in slide-in-from-bottom-4">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl">✕</button>
        <div className="text-4xl mb-4">🚀</div>
        <h2 className="text-2xl font-black mb-1">Deploy Your Site</h2>
        <p className="text-sm text-gray-500 mb-6">Choose a unique subdomain for your site.</p>

        {!deployedUrl ? (
          <>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden mb-4 focus-within:border-violet-400 transition-colors">
              <input
                type="text"
                value={subdomain}
                onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="my-awesome-site"
                className="flex-1 p-3 pl-4 outline-none text-sm font-mono"
              />
              <span className="bg-gray-50 px-3 py-3 text-sm text-gray-400 border-l border-gray-200 whitespace-nowrap">.rakshithganjimut.xyz</span>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handleDeploy}
              disabled={deploying || !subdomain}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-violet-200"
            >
              {deploying ? 'Saving & Deploying...' : 'Deploy Now 🚀'}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
            <h3 className="text-xl font-bold mb-2">Deployed!</h3>
            <p className="text-sm text-gray-500 mb-4">Your site is live at:</p>
            <a href={deployedUrl} target="_blank" className="text-violet-600 hover:underline font-mono text-sm block mb-6 bg-violet-50 rounded-xl p-3">
              {deployedUrl}
            </a>
            <p className="text-xs text-gray-400 mb-4">Visit <code>/sites/{subdomain}</code> locally to preview</p>
            <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-8 rounded-xl transition-colors">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
