// Pre-built template presets that populate the canvas with rich content

// Default navbar links used as fallback for legacy data
export const DEFAULT_NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

// Default footer links
export const DEFAULT_FOOTER_LINKS = [
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
  { label: 'Contact', href: '#contact' },
]

export const TEMPLATE_PRESETS: Record<string, { label: string; description: string; color: string; emoji: string; components: any[] }> = {
  portfolio: {
    label: 'Portfolio',
    description: 'A sleek personal portfolio to showcase your work.',
    color: 'from-indigo-500 to-purple-600',
    emoji: '🧑‍🎨',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'John Doe',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#features' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Hire Me',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'I Build Beautiful Things',
          subtitle: 'Full-stack developer & designer crafting digital experiences that matter.',
          bg: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
          cta: 'See My Work',
          ctaHref: '#features',
          cta2: 'Get In Touch →',
          cta2Href: '#contact',
        }
      },
      { id: 'a1', type: 'about', props: { heading: 'About Me', body: 'Hi! I\'m John, a passionate developer with 5+ years of experience building web and mobile applications. I specialize in React, Next.js, and cloud architecture.' } },
      { id: 'f1', type: 'features', props: { heading: 'My Skills', subheading: 'A diverse set of skills built over years of professional experience.', learnMoreHref: '#contact' } },
      { id: 't1', type: 'testimonials', props: { heading: 'Kind Words' } },
      { id: 'c1', type: 'contact', props: { heading: 'Work With Me', subtitle: 'Available for freelance projects and full-time roles.' } },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'John Doe',
          copy: '© 2024 John Doe. All rights reserved.',
          footerLinks: [
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#features' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },

  saas: {
    label: 'SaaS',
    description: 'A high-converting SaaS landing page with pricing.',
    color: 'from-blue-500 to-cyan-500',
    emoji: '🚀',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'CloudFlow',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Start Free',
          ctaHref: '#pricing',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'Automate Your Entire Workflow',
          subtitle: 'CloudFlow connects your apps, automates your tasks, and gives your team superpowers.',
          bg: 'linear-gradient(135deg, #0c4a6e 0%, #0077B6 100%)',
          cta: 'Start For Free',
          ctaHref: '#pricing',
          cta2: 'See Features →',
          cta2Href: '#features',
        }
      },
      { id: 'f1', type: 'features', props: { heading: 'Everything You Need', subheading: 'Powerful features to scale your business.', learnMoreHref: '#pricing' } },
      {
        id: 'p1', type: 'pricing', props: {
          heading: 'Simple Pricing, No Surprises',
          plans: [
            { name: 'Starter', price: '$9', features: ['5 projects', '10GB storage', 'Basic support'], cta: 'Get Starter', href: '#contact' },
            { name: 'Pro', price: '$29', features: ['Unlimited projects', '100GB storage', 'Priority support'], popular: true, cta: 'Get Pro', href: '#contact' },
            { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'SLA guarantee', 'Dedicated manager'], cta: 'Contact Sales', href: '#contact' },
          ]
        }
      },
      { id: 't1', type: 'testimonials', props: { heading: 'Loved By Thousands' } },
      { id: 'c1', type: 'contact', props: { heading: 'Talk To Sales', subtitle: 'Learn how CloudFlow can work for your team.' } },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'CloudFlow',
          copy: '© 2024 CloudFlow Inc. All rights reserved.',
          footerLinks: [
            { label: 'Privacy', href: '#privacy' },
            { label: 'Terms', href: '#terms' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },

  agency: {
    label: 'Agency',
    description: 'A bold, dark agency site that commands attention.',
    color: 'from-gray-900 to-gray-700',
    emoji: '🏢',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'STUDIO X',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'Services', href: '#features' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Start A Project',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'We Build The Future',
          subtitle: 'Award-winning digital studio crafting brands, products, and experiences for ambitious companies.',
          bg: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)',
          cta: 'Start A Project',
          ctaHref: '#contact',
          cta2: 'Our Services →',
          cta2Href: '#features',
        }
      },
      { id: 'f1', type: 'features', props: { heading: 'What We Do', subheading: 'End-to-end creative and technical services.', learnMoreHref: '#contact' } },
      { id: 'a1', type: 'about', props: { heading: 'Our Story', body: 'Founded in 2018, Studio X has helped over 200 brands define their digital presence. We are a collective of designers, engineers, and strategists.' } },
      { id: 't1', type: 'testimonials', props: { heading: 'Client Stories' } },
      { id: 'c1', type: 'contact', props: { heading: 'Start A Project', subtitle: 'Tell us about what you want to build.' } },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'STUDIO X',
          copy: '© 2024 Studio X. All rights reserved.',
          footerLinks: [
            { label: 'Privacy', href: '#privacy' },
            { label: 'Terms', href: '#terms' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },

  restaurant: {
    label: 'Restaurant',
    description: 'A warm, inviting site for food & dining businesses.',
    color: 'from-orange-500 to-red-500',
    emoji: '🍽️',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'La Maison',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'Experience', href: '#features' },
            { label: 'About', href: '#about' },
            { label: 'Reserve', href: '#contact' },
          ],
          cta: 'Reserve A Table',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'Fine Dining, Reimagined',
          subtitle: 'An extraordinary culinary journey in the heart of the city. Reserve your table tonight.',
          bg: 'linear-gradient(135deg, #7C2D12 0%, #9a3412 50%, #c2410c 100%)',
          cta: 'Reserve A Table',
          ctaHref: '#contact',
          cta2: 'Our Experience →',
          cta2Href: '#features',
        }
      },
      { id: 'f1', type: 'features', props: { heading: 'The Experience', subheading: 'Every detail crafted to delight every sense.', learnMoreHref: '#contact' } },
      { id: 'a1', type: 'about', props: { heading: 'Our Story', body: 'La Maison was born from a passion for authentic cuisine and warm hospitality. Our chef brings 20 years of Michelin-star experience to every plate.' } },
      { id: 't1', type: 'testimonials', props: { heading: 'What Guests Say' } },
      { id: 'c1', type: 'contact', props: { heading: 'Make A Reservation', subtitle: 'We look forward to welcoming you.' } },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'La Maison',
          copy: '© 2024 La Maison Restaurant.',
          footerLinks: [
            { label: 'About', href: '#about' },
            { label: 'Experience', href: '#features' },
            { label: 'Reserve', href: '#contact' },
          ],
        }
      },
    ],
  },

  music: {
    label: 'Music',
    description: 'A vibrant music artist or band landing page.',
    color: 'from-fuchsia-600 to-pink-600',
    emoji: '🎵',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'THE SOUNDS',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Tour', href: '#features' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Listen Now 🎧',
          ctaHref: '#hero',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'New Album Out Now',
          subtitle: 'Stream "Echoes in the Dark" on all platforms. World tour 2024 — tickets available now.',
          bg: 'linear-gradient(135deg, #4a044e 0%, #86198f 50%, #c026d3 100%)',
          cta: 'Listen Now 🎧',
          ctaHref: '#about',
          cta2: 'Tour Dates →',
          cta2Href: '#features',
        }
      },
      { id: 'a1', type: 'about', props: { heading: 'About The Band', body: 'The Sounds is an indie rock band formed in Gothenburg, Sweden. Known for their electrifying performances and anthemic songwriting, they\'ve been rocking stages worldwide since 2004.' } },
      { id: 'f1', type: 'features', props: { heading: 'Tour Dates', subheading: 'Catch us live this summer. Don\'t miss out.', learnMoreHref: '#contact' } },
      { id: 't1', type: 'testimonials', props: { heading: 'Fan Reviews' } },
      { id: 'c1', type: 'contact', props: { heading: 'Contact / Bookings', subtitle: 'For press, bookings, and licensing inquiries.' } },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'THE SOUNDS',
          copy: '© 2024 The Sounds. All rights reserved.',
          footerLinks: [
            { label: 'About', href: '#about' },
            { label: 'Tour', href: '#features' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },

  blank: {
    label: 'Blank',
    description: 'A completely empty canvas to start from scratch.',
    color: 'from-gray-300 to-gray-400',
    emoji: '✨',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'My Brand',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Services', href: '#features' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Get Started',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'Your Title Here',
          subtitle: 'Your subtitle goes here. Click any text to edit it.',
          bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          cta: 'Get Started',
          ctaHref: '#contact',
          cta2: 'Learn More →',
          cta2Href: '#features',
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'My Brand',
          copy: '© 2024 My Brand.',
          footerLinks: [
            { label: 'Privacy', href: '#privacy' },
            { label: 'Terms', href: '#terms' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },
}

