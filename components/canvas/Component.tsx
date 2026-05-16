'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useStorage } from '@/lib/liveblocks'
import { Page } from '@/lib/liveblocks'
import { useState, useRef } from 'react'
import { palettes } from '@/lib/palettes'
import { DEFAULT_NAV_LINKS, DEFAULT_FOOTER_LINKS } from '@/lib/templates'
import { usePreviewContext } from '@/lib/preview-context'

// Inline editable text component
function Editable({ value, onChange, className, tag: Tag = 'p', multiline = false, style = {} }: any) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        className={`${className} bg-white/90 text-gray-900 border-2 border-blue-400 rounded p-1 w-full resize-none outline-none z-10 relative shadow-sm`}
        style={{ ...style, minHeight: '80px' }}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); onChange(draft) }}
      />
    ) : (
      <input
        autoFocus
        className={`${className} bg-white/90 text-gray-900 border-2 border-blue-400 rounded p-1 outline-none w-full z-10 relative shadow-sm`}
        style={style}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { setEditing(false); onChange(draft) }}
        onKeyDown={e => { if (e.key === 'Enter') { setEditing(false); onChange(draft) } }}
      />
    )
  }

  return (
    <Tag
      className={`${className} cursor-text hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded transition-all`}
      style={style}
      onClick={(e: any) => { e.stopPropagation(); setEditing(true); setDraft(value) }}
      title="Click to edit"
    >
      {value || <span className="opacity-50 italic">Click to edit...</span>}
    </Tag>
  )
}

/**
 * LinkableButton — renders as a real <a> tag in preview mode,
 * or as an inline-editable button in the editor.
 */
function LinkableButton({ value, href, isPreview, onChange, className, style }: {
  value: string
  href?: string
  isPreview?: boolean
  onChange: (v: string) => void
  className?: string
  style?: React.CSSProperties
}) {
  if (isPreview) {
    return (
      <a
        href={href || '#'}
        className={className}
        style={style}
        onClick={e => { if (!href || href === '#') e.preventDefault() }}
      >
        {value}
      </a>
    )
  }
  return (
    <Editable tag="button" value={value} onChange={onChange} className={className} style={style} />
  )
}

/**
 * NavLink — in preview renders as real anchor; in editor renders editable text.
 * Supports both legacy string links and new {label, href} object links.
 */
function NavLink({ link, isPreview, onChange, className, style }: {
  link: string | { label: string; href: string }
  isPreview?: boolean
  onChange: (v: string) => void
  className?: string
  style?: React.CSSProperties
}) {
  const label = typeof link === 'string' ? link : link.label
  const href = typeof link === 'string' ? `#${link.toLowerCase()}` : link.href

  if (isPreview) {
    return (
      <a href={href} className={className} style={style}>
        {label}
      </a>
    )
  }
  return (
    <Editable tag="span" className={className} style={style} value={label} onChange={onChange} />
  )
}

export default function Component(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })
  const isPreview: boolean = props.isPreview ?? false

  const paletteName = useStorage((root: any) => root.colorPalette) || 'midnight'
  const theme = (palettes as any)[paletteName] || palettes.midnight

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const updateProp = useMutation(({ storage }, key: string, value: any) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const activeId = storage.get('activePage') as string
    const updated = currentPages.map((pg: Page) => {
      if (pg.id !== activeId) return pg
      return {
        ...pg,
        components: pg.components.map((c: any) =>
          c.id === props.id ? { ...c, props: { ...c.props, [key]: value } } : c
        ),
      }
    })
    storage.set('pages', updated)
  }, [props.id])

  const removeComponent = useMutation(({ storage }) => {
    const currentPages: Page[] = (storage.get('pages') as any) || []
    const activeId = storage.get('activePage') as string
    const updated = currentPages.map((pg: Page) => {
      if (pg.id !== activeId) return pg
      return { ...pg, components: pg.components.filter((c: any) => c.id !== props.id) }
    })
    storage.set('pages', updated)
  }, [props.id])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewCtx = usePreviewContext()
  const allPages = useStorage((root: any) => root.pages) as Page[] | null
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) updateProp('src', ev.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  let content = null

  // Normalize links: support both legacy string[] and new {label, href}[]
  const rawLinks = props.props?.links
  const links: (string | { label: string; href: string })[] =
    Array.isArray(rawLinks) && rawLinks.length > 0
      ? rawLinks
      : DEFAULT_NAV_LINKS

  const featureList = props.props?.featureList || [
    { icon: '⚡', title: 'Blazing Fast', desc: 'Built for performance from the ground up.' },
    { icon: '🎨', title: 'Beautiful Design', desc: 'Stunning UI components.' },
    { icon: '🔒', title: 'Enterprise Ready', desc: 'Secure and scalable.' },
  ]

  const plans = props.props?.plans || [
    { name: 'Starter', price: '$9', features: ['5 projects', '10GB storage'], cta: 'Get Starter', href: '#contact' },
    { name: 'Pro', price: '$29', features: ['Unlimited projects', '100GB storage'], popular: true, cta: 'Get Pro', href: '#contact' },
    { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'SLA guarantee'], cta: 'Contact Sales', href: '#contact' },
  ]

  const reviews = props.props?.reviews || [
    { quote: 'This product completely transformed how our team works.', name: 'Sarah J.', role: 'CEO' },
    { quote: 'The best investment we\'ve made. Setup took minutes.', name: 'Marcus T.', role: 'CTO' },
    { quote: 'Unbelievable quality. Our customers love it.', name: 'Priya K.', role: 'Product Lead' },
  ]

  // Normalize footer links
  const rawFooterLinks = props.props?.footerLinks
  const footerLinks: { label: string; href: string }[] =
    Array.isArray(rawFooterLinks) && rawFooterLinks.length > 0
      ? rawFooterLinks
      : DEFAULT_FOOTER_LINKS

  switch (props.type) {
    // ─── NAVBAR ──────────────────────────────────────────────────────────────
    case 'navbar':
      content = (
        <div className="px-8 py-4 bg-white shadow-sm flex justify-between items-center border-b border-gray-100">
          <Editable tag="span" className="font-black text-2xl" style={{ color: theme[0] }} value={props.props?.logo || 'Brand'} onChange={(v: string) => updateProp('logo', v)} />
          <div className="flex gap-8">
            {links.map((link, i) => (
              <NavLink
                key={i}
                link={link}
                isPreview={isPreview}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: theme[2] }}
                onChange={(v: string) => {
                  const newLinks = [...links]
                  if (typeof newLinks[i] === 'string') {
                    (newLinks as string[])[i] = v
                  } else {
                    (newLinks as { label: string; href: string }[])[i] = {
                      ...(newLinks[i] as { label: string; href: string }),
                      label: v,
                    }
                  }
                  updateProp('links', newLinks)
                }}
              />
            ))}
          </div>
          <LinkableButton
            value={props.props?.cta || 'Get Started'}
            href={props.props?.ctaHref || '#contact'}
            isPreview={isPreview}
            onChange={(v: string) => updateProp('cta', v)}
            className="text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: theme[3] }}
          />
        </div>
      )
      break

    // ─── HERO ─────────────────────────────────────────────────────────────────
    case 'hero':
      content = (
        <div style={{ background: `linear-gradient(135deg, ${theme[1]} 0%, ${theme[2]} 100%)` }} className="py-28 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
          <div className="relative max-w-4xl mx-auto">
            <Editable tag="h1" className="text-6xl font-black mb-6 leading-tight text-white" value={props.props?.title || 'Your Amazing Headline'} onChange={(v: string) => updateProp('title', v)} />
            <Editable tag="p" multiline className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: theme[4] }} value={props.props?.subtitle || 'A compelling subtitle that explains your value proposition clearly.'} onChange={(v: string) => updateProp('subtitle', v)} />
            <div className="flex gap-4 justify-center flex-wrap">
              <LinkableButton
                value={props.props?.cta || 'Get Started Free'}
                href={props.props?.ctaHref || '#contact'}
                isPreview={isPreview}
                onChange={(v: string) => updateProp('cta', v)}
                className="font-bold px-8 py-4 rounded-xl transition-colors text-lg hover:opacity-90"
                style={{ backgroundColor: theme[3], color: 'white' }}
              />
              <LinkableButton
                value={props.props?.cta2 || 'Learn More →'}
                href={props.props?.cta2Href || '#features'}
                isPreview={isPreview}
                onChange={(v: string) => updateProp('cta2', v)}
                className="border border-white/50 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
              />
            </div>
          </div>
        </div>
      )
      break

    // ─── FEATURES ─────────────────────────────────────────────────────────────
    case 'features':
      content = (
        <div className="py-20 px-8" style={{ backgroundColor: theme[4] }}>
          <div className="max-w-5xl mx-auto">
            <Editable tag="h2" className="text-4xl font-black text-center mb-4" style={{ color: theme[0] }} value={props.props?.heading || 'Why Choose Us'} onChange={(v: string) => updateProp('heading', v)} />
            <Editable tag="p" className="text-center mb-14 text-lg max-w-2xl mx-auto opacity-70" style={{ color: theme[1] }} value={props.props?.subheading || 'Everything you need to build something amazing.'} onChange={(v: string) => updateProp('subheading', v)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureList.map((f: any, i: number) => (
                <div key={i} className="p-8 rounded-2xl border border-black/5 bg-white/50 hover:shadow-lg transition-shadow group flex flex-col">
                  <Editable tag="div" className="text-4xl mb-4" value={f.icon} onChange={(v: string) => { const n = [...featureList]; n[i].icon = v; updateProp('featureList', n) }} />
                  <Editable tag="h3" className="text-xl font-bold mb-3" style={{ color: theme[0] }} value={f.title} onChange={(v: string) => { const n = [...featureList]; n[i].title = v; updateProp('featureList', n) }} />
                  <Editable tag="p" multiline className="leading-relaxed opacity-70 flex-1" style={{ color: theme[1] }} value={f.desc} onChange={(v: string) => { const n = [...featureList]; n[i].desc = v; updateProp('featureList', n) }} />
                  <div className="mt-5">
                    <LinkableButton
                      value="Learn More →"
                      href={props.props?.learnMoreHref || '#contact'}
                      isPreview={isPreview}
                      onChange={() => {}}
                      className="text-sm font-bold transition-colors hover:opacity-70"
                      style={{ color: theme[3] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
      break

    // ─── ABOUT ────────────────────────────────────────────────────────────────
    case 'about':
      content = (
        <div className="py-20 px-8" style={{ backgroundColor: theme[4] }}>
          <div className="max-w-4xl mx-auto text-center border-y border-black/5 py-16">
            <Editable tag="h2" className="text-4xl font-black mb-6" style={{ color: theme[0] }} value={props.props?.heading || 'About Us'} onChange={(v: string) => updateProp('heading', v)} />
            <Editable tag="p" multiline className="text-lg leading-relaxed max-w-2xl mx-auto opacity-80" style={{ color: theme[1] }} value={props.props?.body || 'We are a passionate team dedicated to building world-class products.'} onChange={(v: string) => updateProp('body', v)} />
          </div>
        </div>
      )
      break

    // ─── PRICING ──────────────────────────────────────────────────────────────
    case 'pricing':
      content = (
        <div className="py-20 px-8" style={{ backgroundColor: theme[4] }}>
          <div className="max-w-5xl mx-auto">
            <Editable tag="h2" className="text-4xl font-black text-center mb-14" style={{ color: theme[0] }} value={props.props?.heading || 'Simple Pricing'} onChange={(v: string) => updateProp('heading', v)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan: any, i: number) => (
                <div key={i} className={`p-8 rounded-2xl border bg-white flex flex-col ${plan.popular ? 'border-2 shadow-xl relative' : 'border-gray-200'}`} style={plan.popular ? { borderColor: theme[3] } : {}}>
                  {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full" style={{ backgroundColor: theme[3] }}>POPULAR</div>}
                  <Editable tag="h3" className="text-xl font-bold mb-2" style={{ color: theme[1] }} value={plan.name} onChange={(v: string) => { const n = [...plans]; n[i].name = v; updateProp('plans', n) }} />
                  <div className="flex items-baseline mb-6">
                    <Editable tag="span" className="text-4xl font-black" style={{ color: theme[0] }} value={plan.price} onChange={(v: string) => { const n = [...plans]; n[i].price = v; updateProp('plans', n) }} />
                    <span className="text-sm opacity-50 ml-1">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f: string, j: number) => (
                      <li key={j} className="text-sm flex items-start gap-2 opacity-80" style={{ color: theme[1] }}>
                        <span style={{ color: theme[3] }}>✓</span>
                        <Editable tag="span" className="flex-1" value={f} onChange={(v: string) => { const n = [...plans]; n[i].features[j] = v; updateProp('plans', n) }} />
                      </li>
                    ))}
                  </ul>
                  <LinkableButton
                    value={plan.cta || `Get ${plan.name}`}
                    href={plan.href || '#contact'}
                    isPreview={isPreview}
                    onChange={(v: string) => { const n = [...plans]; n[i].cta = v; updateProp('plans', n) }}
                    className="w-full py-3 rounded-xl font-bold transition-colors text-center block hover:opacity-90"
                    style={plan.popular ? { backgroundColor: theme[3], color: 'white' } : { backgroundColor: theme[4], color: theme[0] }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
      break

    // ─── TESTIMONIALS ────────────────────────────────────────────────────────
    case 'testimonials':
      content = (
        <div className="py-20 px-8" style={{ backgroundColor: theme[4] }}>
          <div className="max-w-5xl mx-auto">
            <Editable tag="h2" className="text-4xl font-black text-center mb-14" style={{ color: theme[0] }} value={props.props?.heading || 'What They Say'} onChange={(v: string) => updateProp('heading', v)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((t: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5">
                  <div className="text-yellow-400 text-xl mb-4 text-left">★★★★★</div>
                  <Editable tag="p" multiline className="leading-relaxed mb-6 italic opacity-80" style={{ color: theme[1] }} value={t.quote} onChange={(v: string) => { const n = [...reviews]; n[i].quote = v; updateProp('reviews', n) }} />
                  <div>
                    <Editable tag="p" className="font-bold" style={{ color: theme[0] }} value={t.name} onChange={(v: string) => { const n = [...reviews]; n[i].name = v; updateProp('reviews', n) }} />
                    <Editable tag="p" className="text-sm opacity-60" style={{ color: theme[1] }} value={t.role} onChange={(v: string) => { const n = [...reviews]; n[i].role = v; updateProp('reviews', n) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
      break

    // ─── CONTACT ─────────────────────────────────────────────────────────────
    case 'contact':
      content = (
        <div className="py-20 px-8" style={{ backgroundColor: theme[4] }}>
          <div className="max-w-2xl mx-auto text-center border p-12 rounded-3xl bg-white shadow-xl shadow-black/5">
            <Editable tag="h2" className="text-4xl font-black mb-4" style={{ color: theme[0] }} value={props.props?.heading || 'Get In Touch'} onChange={(v: string) => updateProp('heading', v)} />
            <Editable tag="p" className="mb-10 text-lg opacity-70" style={{ color: theme[1] }} value={props.props?.subtitle || 'Have questions? We\'d love to hear from you.'} onChange={(v: string) => updateProp('subtitle', v)} />
            <div className="space-y-4 text-left">
              <input type="text" placeholder="Your Name" className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-violet-400 bg-gray-50" />
              <input type="email" placeholder="Your Email" className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-violet-400 bg-gray-50" />
              <textarea rows={4} placeholder="Your message..." className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-violet-400 resize-none bg-gray-50" />
              <Editable tag="button" className="w-full text-white font-bold py-4 rounded-xl transition-colors" style={{ backgroundColor: theme[3] }} value={props.props?.submitTxt || 'Send Message'} onChange={(v: string) => updateProp('submitTxt', v)} />
            </div>
          </div>
        </div>
      )
      break

    // ─── IMAGE ────────────────────────────────────────────────────────────────
    case 'image':
      content = (
        <div className="py-10 px-8 bg-transparent">
          <div className="max-w-4xl mx-auto relative group/img">
            {props.props?.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={props.props.src} alt="Uploaded content" className="w-full rounded-2xl shadow-lg object-cover" />
            ) : (
              <div
                className="w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors"
                style={{ borderColor: theme[3], backgroundColor: theme[4] }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-4xl mb-2">📸</div>
                <div className="font-bold opacity-70" style={{ color: theme[1] }}>Click to upload image</div>
                <div className="text-sm opacity-50" style={{ color: theme[1] }}>JPEG, PNG up to 5MB</div>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            {props.props?.src && (
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg font-bold text-sm opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
              >
                Change Image
              </button>
            )}
          </div>
        </div>
      )
      break

    // ─── FOOTER ───────────────────────────────────────────────────────────────
    case 'footer':
      content = (
        <div className="py-12 px-8" style={{ backgroundColor: theme[0], color: 'white' }}>
          <div className="max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-6">
            <Editable tag="span" className="text-xl font-black" value={props.props?.brand || 'Brand'} onChange={(v: string) => updateProp('brand', v)} />
            <div className="flex gap-8 text-sm opacity-70">
              {footerLinks.map((link, i) =>
                isPreview ? (
                  <a key={i} href={link.href} className="hover:opacity-100 transition-opacity hover:underline">
                    {link.label}
                  </a>
                ) : (
                  <span key={i} className="hover:opacity-100 transition-opacity">{link.label}</span>
                )
              )}
            </div>
            <Editable tag="p" className="text-sm opacity-50" value={props.props?.copy || `© ${new Date().getFullYear()} All rights reserved.`} onChange={(v: string) => updateProp('copy', v)} />
          </div>
        </div>
      )
      break


    // ─── BUTTON ───────────────────────────────────────────────────────────────
    case 'button': {
      const btnLabel: string   = props.props?.label   || 'Click Me'
      const btnPageId: string  = props.props?.pageId  || ''   // id of target page
      const btnStyle: string   = props.props?.style   || 'solid'

      const btnStyleMap: Record<string, React.CSSProperties> = {
        solid:   { backgroundColor: theme[3], color: 'white' },
        outline: { border: `2px solid ${theme[3]}`, color: theme[3], backgroundColor: 'transparent' },
        ghost:   { color: theme[3], backgroundColor: 'transparent', textDecoration: 'underline' },
      }

      if (isPreview) {
        // Navigate within the preview via context — no URL change needed
        const handleClick = () => {
          if (!btnPageId) return
          previewCtx.setActivePageId(btnPageId)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        content = (
          <div className="px-6 py-4 flex justify-start" style={{ backgroundColor: 'transparent' }}>
            <button
              onClick={handleClick}
              disabled={!btnPageId}
              className="font-semibold px-5 py-2.5 rounded-lg text-sm transition-all hover:opacity-80 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={btnStyleMap[btnStyle] || btnStyleMap.solid}
            >
              {btnLabel}
            </button>
          </div>
        )
      } else {
        // Editor: compact strip with label editor + page picker
        const targetPage = (allPages || []).find((pg: Page) => pg.id === btnPageId)
        content = (
          <div
            className="px-4 py-3 flex flex-wrap items-center gap-3 border border-dashed border-violet-200 bg-violet-50/40 rounded-lg mx-4 my-2"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Live preview of button */}
            <div
              className="font-semibold px-5 py-2.5 rounded-lg text-sm shadow-sm shrink-0"
              style={btnStyleMap[btnStyle] || btnStyleMap.solid}
            >
              <Editable
                tag="span"
                value={btnLabel}
                onChange={(v: string) => updateProp('label', v)}
                className=""
              />
            </div>

            {/* Arrow separator */}
            <span className="text-gray-300 text-lg">→</span>

            {/* Page picker */}
            <select
              value={btnPageId}
              onMouseDown={e => e.stopPropagation()}
              onChange={e => updateProp('pageId', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-violet-400 shadow-sm"
            >
              <option value="">— Pick destination page —</option>
              {(allPages || []).map((pg: Page) => (
                <option key={pg.id} value={pg.id}>{pg.name}</option>
              ))}
            </select>

            {targetPage && (
              <span className="text-xs text-violet-500 font-medium bg-violet-100 px-2 py-1 rounded-md">
                /{targetPage.slug}
              </span>
            )}

            {/* Style pills */}
            <div className="flex gap-1 ml-auto">
              {(['solid', 'outline', 'ghost'] as const).map(s => (
                <button
                  key={s}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); updateProp('style', s) }}
                  className={`text-xs px-2 py-1 rounded border font-medium transition-all ${
                    btnStyle === s
                      ? 'border-violet-500 bg-violet-100 text-violet-700'
                      : 'border-gray-200 text-gray-400 hover:border-violet-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )
      }
      break
    }



    default:
      content = (
        <div className="p-10 bg-white border-2 border-dashed border-gray-200 text-center text-gray-400 rounded-xl">
          Unknown component: <code>{props.type}</code>
        </div>
      )
  }

  // ── In preview mode render clean, no editor chrome ─────────────────────────
  if (isPreview) {
    return <div className="w-full">{content}</div>
  }

  // ── In editor mode render full draggable/deletable wrapper ─────────────────
  return (
    <div ref={setNodeRef} style={style} className="relative group w-full">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing bg-black/5 transition-opacity"
        title="Drag to reorder"
      >
        <span className="text-gray-400 text-xl">⠿</span>
      </div>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); removeComponent() }}
        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-7 h-7 text-xs font-bold flex items-center justify-center hover:bg-red-600 transition-all shadow-md"
        title="Delete component"
      >✕</button>
      <span className="absolute top-2 left-10 z-20 opacity-0 group-hover:opacity-100 bg-gray-900/80 backdrop-blur text-white text-xs font-mono px-2 py-1 rounded-md transition-opacity">{props.type}</span>
      {content}
    </div>
  )
}
