import dbConnect from '@/lib/mongodb'
import Site from '@/models/Site'
import { notFound } from 'next/navigation'

interface ContentRendererProps {
  content: Record<string, any>
}

function ContentRenderer({ content }: ContentRendererProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {content?.hero && (
        <section className="text-center py-20">
          <h1 className="text-5xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            {content.hero.heading || 'Welcome'}
          </h1>
          <p className="text-xl text-gray-500">{content.hero.subheading || ''}</p>
        </section>
      )}

      {content?.features && (
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(content.features) ? content.features.map((f: any, i: number) => (
              <div key={i} className="p-6 border border-gray-200 rounded-2xl">
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.description}</p>
              </div>
            )) : null}
          </div>
        </section>
      )}

      {content?.about && (
        <section className="py-12 bg-gray-50 rounded-2xl px-8">
          <h2 className="text-3xl font-bold mb-4">{content.about.heading || 'About'}</h2>
          <p className="text-gray-600 leading-relaxed">{content.about.body || ''}</p>
        </section>
      )}

      {content?.contact && (
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <a href={`mailto:${content.contact.email}`} className="text-violet-600 hover:underline text-lg">
            {content.contact.email}
          </a>
        </section>
      )}
    </div>
  )
}

export default async function SitePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params

  let site = null
  try {
    await dbConnect()
    site = await Site.findOne({ subdomain } as any).lean()
  } catch (e) {
    console.error('DB Error:', e)
  }

  if (!site) {
    notFound()
  }

  const siteData = site as any

  return (
    <main className="min-h-screen bg-white">
      {/* Site Header */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{siteData.title}</h1>
        <span className="text-xs text-gray-400 font-mono">{subdomain}.rakshithganjimut.xyz</span>
      </header>

      {/* Description Banner */}
      {siteData.description && (
        <div className="bg-violet-50 border-b border-violet-100 px-6 py-3 text-center">
          <p className="text-sm text-violet-700">{siteData.description}</p>
        </div>
      )}

      {/* Dynamic Content */}
      <ContentRenderer content={siteData.content} />
    </main>
  )
}

export async function generateMetadata({ params }: { params: { subdomain: string } }) {
  try {
    await dbConnect()
    const site = await Site.findOne({ subdomain: params.subdomain } as any).lean() as any
    if (!site) return { title: 'Not Found' }
    return {
      title: site.title,
      description: site.description,
    }
  } catch {
    return { title: 'WebCraft Site' }
  }
}
