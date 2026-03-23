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

  // ────────────────────────────────────────────────────────────────────── //
  //  PORTFOLIO — John Chen, Senior Product Designer                        //
  // ────────────────────────────────────────────────────────────────────── //
  portfolio: {
    label: 'Portfolio',
    description: 'A sleek personal portfolio to showcase your work.',
    color: 'from-indigo-500 to-purple-600',
    emoji: '🧑‍🎨',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'John Chen',
          links: [
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#features' },
            { label: 'Testimonials', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Hire Me →',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'I Design Products People Love',
          subtitle: 'Senior Product Designer with 8+ years crafting award-winning digital experiences for Fortune 500 companies. Currently open to senior roles and freelance projects.',
          cta: 'See My Work ↓',
          ctaHref: '#features',
          cta2: 'Download CV →',
          cta2Href: '#contact',
        }
      },
      {
        id: 'a1', type: 'about', props: {
          heading: 'About Me',
          body: 'Hi, I\'m John Chen — a product designer based in San Francisco. I specialize in turning complex problems into elegant, user-centered solutions. Over the past 8 years, I\'ve led design at companies like Airbnb, Stripe, and three venture-backed startups. My work has been recognized by Awwwards, CSS Design Awards, and Fast Company\'s Innovation by Design.\n\nWhen I\'m not pushing pixels, you\'ll find me rock-climbing, contributing to open-source design systems, or mentoring junior designers on ADPList.'
        }
      },
      {
        id: 'f1', type: 'features', props: {
          heading: 'What I Do Best',
          subheading: 'A full spectrum of design skills — from zero-to-one product thinking through pixel-perfect execution.',
          featureList: [
            { icon: '🎯', title: 'Product Strategy', desc: 'I collaborate with PMs and engineers to define vision, run discovery sprints, and create roadmaps that balance user needs with business goals.' },
            { icon: '🖌️', title: 'UI / Visual Design', desc: 'Clean, intentional interfaces with meticulous attention to typography, color, and motion. I build and maintain scalable design systems.' },
            { icon: '🔬', title: 'UX Research', desc: 'From guerrilla usability tests to longitudinal diary studies, I use the right research method to de-risk decisions and build empathy with users.' },
          ],
          learnMoreHref: '#contact',
        }
      },
      {
        id: 't1', type: 'testimonials', props: {
          heading: 'Kind Words',
          reviews: [
            { quote: 'John has an extraordinary ability to translate ambiguous briefs into design systems that scale. He raised the bar for our entire product org.', name: 'Priya Mehta', role: 'VP of Product, Stripe' },
            { quote: 'Working with John was a turning point for our startup. He shipped a complete design system in 6 weeks and our conversion rate jumped 34%.', name: 'Tom Larsen', role: 'CEO, Flowbase' },
            { quote: 'The most thorough design thinker I\'ve encountered. His research work uncovered insights we had completely missed despite months of in-house effort.', name: 'Aisha Obi', role: 'Head of Design, Airbnb' },
          ]
        }
      },
      {
        id: 'c1', type: 'contact', props: {
          heading: 'Let\'s Work Together',
          subtitle: 'Available for senior IC roles, design leadership, and select freelance projects. Response time: under 24 hours.',
          submitTxt: 'Send Message →'
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'John Chen',
          copy: '© 2025 John Chen. Designed in SF, shipped everywhere.',
          footerLinks: [
            { label: 'Dribbble', href: '#' },
            { label: 'LinkedIn', href: '#' },
            { label: 'Twitter', href: '#' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────── //
  //  SAAS — Vaultly, AI-powered document intelligence platform             //
  // ────────────────────────────────────────────────────────────────────── //
  saas: {
    label: 'SaaS',
    description: 'A high-converting SaaS landing page with pricing.',
    color: 'from-blue-500 to-cyan-500',
    emoji: '🚀',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'Vaultly',
          links: [
            { label: 'Product', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Customers', href: '#testimonials' },
            { label: 'Blog', href: '#' },
          ],
          cta: 'Start Free Trial',
          ctaHref: '#pricing',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'Your Documents. Supercharged by AI.',
          subtitle: 'Vaultly ingests your PDFs, contracts, and reports — and turns them into a searchable, queryable knowledge base you can chat with. No hallucinations. No setup hell. Live in 60 seconds.',
          cta: 'Start Free — No CC Required',
          ctaHref: '#pricing',
          cta2: 'Watch 90-sec Demo →',
          cta2Href: '#features',
        }
      },
      {
        id: 'f1', type: 'features', props: {
          heading: 'Built for Teams That Move Fast',
          subheading: 'Everything you need to turn a mountain of documents into an unfair competitive advantage.',
          featureList: [
            { icon: '🧠', title: 'AI Document Q&A', desc: 'Ask questions in plain English across hundreds of documents simultaneously. Get cited, accurate answers in seconds — not hours of manual searching.' },
            { icon: '⚡', title: 'Instant Ingestion', desc: 'Drop in PDFs, Word docs, Notion exports, or Google Drive links. Vaultly indexes everything in under 60 seconds with 99.9% extraction accuracy.' },
            { icon: '🔒', title: 'Enterprise Security', desc: 'SOC-2 Type II certified. End-to-end encryption. RBAC permissions. Your data never trains our models. GDPR & HIPAA compliant out of the box.' },
          ],
          learnMoreHref: '#pricing',
        }
      },
      {
        id: 'p1', type: 'pricing', props: {
          heading: 'Predictable Pricing, No Surprises',
          plans: [
            {
              name: 'Starter',
              price: '$19',
              features: ['50 documents / mo', '5 GB storage', '3 team seats', 'Chat with docs', 'Email support'],
              cta: 'Start Free Trial',
              href: '#contact'
            },
            {
              name: 'Growth',
              price: '$79',
              features: ['Unlimited documents', '50 GB storage', '20 team seats', 'API access', 'Priority Slack support', 'Custom integrations'],
              popular: true,
              cta: 'Start Free Trial',
              href: '#contact'
            },
            {
              name: 'Enterprise',
              price: '$299',
              features: ['Unlimited everything', 'Dedicated infra', 'SSO / SAML', 'SLA 99.99%', 'Dedicated CSM', 'Custom AI fine-tuning'],
              cta: 'Talk to Sales →',
              href: '#contact'
            },
          ]
        }
      },
      {
        id: 't1', type: 'testimonials', props: {
          heading: 'Loved by 4,000+ Teams',
          reviews: [
            { quote: 'We cut our contract review time by 80% in the first week. Vaultly paid for itself in day one. Every legal team needs this.', name: 'Sarah Chen', role: 'General Counsel, Rippling' },
            { quote: 'Our analysts used to spend 2 days per report gathering data. Now they get everything in 15 minutes. It\'s genuinely transformative.', name: 'Marcus Webb', role: 'Director of Research, Andreessen Horowitz' },
            { quote: 'The accuracy is unreal. Unlike other AI tools, Vaultly actually cites its sources so we can verify every answer. That trust factor is everything.', name: 'Leila Hassan', role: 'Head of Compliance, JPMorgan' },
          ]
        }
      },
      {
        id: 'c1', type: 'contact', props: {
          heading: 'Talk to Our Team',
          subtitle: 'Enterprise plans, custom integrations, or just a demo — we typically respond within 2 hours on business days.',
          submitTxt: 'Send Message →'
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'Vaultly',
          copy: '© 2025 Vaultly Inc. SOC-2 Certified. All rights reserved.',
          footerLinks: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
            { label: 'Security', href: '#' },
            { label: 'Status', href: '#' },
            { label: 'Blog', href: '#' },
          ],
        }
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────── //
  //  AGENCY — APEX Studio, award-winning creative digital studio           //
  // ────────────────────────────────────────────────────────────────────── //
  agency: {
    label: 'Agency',
    description: 'A bold, dark agency site that commands attention.',
    color: 'from-gray-900 to-gray-700',
    emoji: '🏢',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'APEX Studio',
          links: [
            { label: 'Work', href: '#features' },
            { label: 'Services', href: '#about' },
            { label: 'Clients', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Start a Project',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'We Build Brands That Command Attention',
          subtitle: 'APEX is an award-winning creative studio specializing in brand identity, digital experiences, and high-converting campaigns for ambitious companies. 60+ brands transformed. $2B+ in client revenue driven.',
          cta: 'See Our Work →',
          ctaHref: '#features',
          cta2: 'Start a Project',
          cta2Href: '#contact',
        }
      },
      {
        id: 'f1', type: 'features', props: {
          heading: 'Full-Stack Creative Services',
          subheading: 'From strategy to execution — we do it all under one roof so nothing gets lost in translation.',
          featureList: [
            { icon: '🎨', title: 'Brand Identity', desc: 'Logo systems, visual identities, brand guidelines, and style toolkits that are built to scale — from seed deck to Super Bowl ad.' },
            { icon: '💻', title: 'Digital Products', desc: 'Websites, web apps, and interactive campaigns engineered for Awwwards. We obsess over performance, accessibility, and conversion.' },
            { icon: '📈', title: 'Growth Marketing', desc: 'Performance ad creative, landing page optimization, and CRO programs that turn clicks into customers. Average 3.4× ROAS for our clients.' },
          ],
          learnMoreHref: '#contact',
        }
      },
      {
        id: 'a1', type: 'about', props: {
          heading: 'Our Story',
          body: 'Founded in 2017 by two ex-IDEO designers, APEX has grown from a two-person studio in a Shoreditch flat to a 45-person global team with offices in London, New York, and Singapore.\n\nWe\'ve partnered with brands like Deliveroo, Monzo, Spotify, and dozens of VC-backed startups building the next generation of consumer and enterprise products. Three Awwwards SOTD. Four D&AD Pencils. One very large espresso machine.'
        }
      },
      {
        id: 't1', type: 'testimonials', props: {
          heading: 'Client Stories',
          reviews: [
            { quote: 'APEX rebranded us in 8 weeks and our NPS jumped 22 points in the following quarter. The team has an exceptional grasp of brand strategy, not just aesthetics.', name: 'Georgia Park', role: 'CMO, Monzo' },
            { quote: 'The website APEX built for us won two Awwwards and drove a 47% increase in inbound leads. Working with them is the highest-ROI thing we\'ve done this year.', name: 'James Okafor', role: 'CEO, Arch Finance' },
            { quote: 'Sharp creative instincts, zero ego, and exceptional project management. They felt like an extension of our internal team from day one.', name: 'Isabella Torres', role: 'Head of Brand, Deliveroo' },
          ]
        }
      },
      {
        id: 'c1', type: 'contact', props: {
          heading: 'Start a Project',
          subtitle: 'Tell us what you\'re building and we\'ll come back with a tailored proposal within 48 hours.',
          submitTxt: 'Send Brief →'
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'APEX Studio',
          copy: '© 2025 APEX Creative Studio Ltd. London · New York · Singapore',
          footerLinks: [
            { label: 'Work', href: '#features' },
            { label: 'About', href: '#about' },
            { label: 'Careers', href: '#' },
            { label: 'Privacy', href: '#' },
          ],
        }
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────── //
  //  RESTAURANT — Ember & Oak, fine dining restaurant                      //
  // ────────────────────────────────────────────────────────────────────── //
  restaurant: {
    label: 'Restaurant',
    description: 'A warm, inviting site for food & dining businesses.',
    color: 'from-orange-500 to-red-500',
    emoji: '🍽️',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'Ember & Oak',
          links: [
            { label: 'Menu', href: '#features' },
            { label: 'Our Story', href: '#about' },
            { label: 'Reviews', href: '#testimonials' },
            { label: 'Reserve', href: '#contact' },
          ],
          cta: 'Reserve a Table',
          ctaHref: '#contact',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'Where Fire Meets Flavour',
          subtitle: 'Ember & Oak is a Michelin-rated wood-fire restaurant in the heart of Notting Hill. Seasonal British produce. Inspired by flame. Reserve your table for an experience you won\'t forget.',
          cta: 'Reserve a Table',
          ctaHref: '#contact',
          cta2: 'Explore the Menu →',
          cta2Href: '#features',
        }
      },
      {
        id: 'f1', type: 'features', props: {
          heading: 'A Full Sensory Experience',
          subheading: 'Every detail — from the Josper-grilled produce to the hand-thrown ceramics — is chosen with obsessive care.',
          featureList: [
            { icon: '🔥', title: 'Wood-Fire Cooking', desc: 'Our Josper grill burns sustainably sourced oak and cherry wood, imparting a signature smokiness that can\'t be replicated. Every dish passes through the flame.' },
            { icon: '🌿', title: 'Seasonal & Hyperlocal', desc: 'Our menu changes weekly based on what\'s at peak season from our 12 farm partners within 50 miles of London. Zero imported produce on the mains.' },
            { icon: '🍷', title: 'Natural Wine List', desc: 'Over 150 labels curated by our sommelier Clara Voss — biodynamic, organic, and minimal-intervention wines that pair beautifully with live-fire cooking.' },
          ],
          learnMoreHref: '#contact',
        }
      },
      {
        id: 'a1', type: 'about', props: {
          heading: 'Our Story',
          body: 'Ember & Oak was born in 2019 when chef Marcus Thorne, fresh from two years cooking at Hiša Franko in Slovenia, returned to London with a singular obsession: what happens when exceptional British produce meets the primal magic of live fire.\n\nFrom a 24-cover room above a Notting Hill butcher, Marcus\'s cooking earned a Michelin Bib Gourmand in its first year, and a full star in 2022. We\'ve since moved to our current 60-cover home on Westbourne Park Road — but the ethos hasn\'t changed. Season. Fire. Intention.'
        }
      },
      {
        id: 't1', type: 'testimonials', props: {
          heading: 'What Our Guests Say',
          reviews: [
            { quote: 'The best meal I\'ve had in London in a decade, full stop. The wood-roasted celeriac alone is worth the trip from Paris. Book weeks in advance — this place fills up fast.', name: 'Dominic Lapointe', role: 'Food critic, Le Monde' },
            { quote: 'Ember & Oak captures everything brilliant about the current British dining moment — honest, seasonal, ingredient-led, and genuinely thrilling. The wine list is a dream.', name: 'Fay Maschler', role: 'Former Evening Standard critic' },
            { quote: 'We celebrated our anniversary here and it was flawless. The tasting menu is perfectly paced, the staff have genuine knowledge, and the setting is quietly spectacular.', name: 'Sarah & James R.', role: 'Regular guests' },
          ]
        }
      },
      {
        id: 'c1', type: 'contact', props: {
          heading: 'Make a Reservation',
          subtitle: 'We accept reservations up to 60 days in advance. For parties of 7+, please email us directly at hello@emberandoak.co.uk',
          submitTxt: 'Request Reservation →'
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'Ember & Oak',
          copy: '© 2025 Ember & Oak. 142 Westbourne Park Rd, London W2 5PL',
          footerLinks: [
            { label: 'Menu', href: '#features' },
            { label: 'Gift Vouchers', href: '#' },
            { label: 'Private Dining', href: '#' },
            { label: 'Press', href: '#' },
          ],
        }
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────── //
  //  MUSIC — Nova Sol, indie electronic artist                             //
  // ────────────────────────────────────────────────────────────────────── //
  music: {
    label: 'Music',
    description: 'A vibrant music artist or band landing page.',
    color: 'from-fuchsia-600 to-pink-600',
    emoji: '🎵',
    components: [
      {
        id: 'n1', type: 'navbar', props: {
          logo: 'NOVA SOL',
          links: [
            { label: 'Music', href: '#about' },
            { label: 'Tour', href: '#features' },
            { label: 'Press', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ],
          cta: 'Stream Now 🎧',
          ctaHref: '#about',
        }
      },
      {
        id: 'h1', type: 'hero', props: {
          title: 'LUMINANCE — New Album Out Now',
          subtitle: 'Nova Sol\'s sophomore album \'LUMINANCE\' is a 12-track journey through synthetic textures and raw emotion. Produced with Arca & Blood Orange. Available on all platforms.',
          cta: 'Listen on Spotify 🎧',
          ctaHref: '#',
          cta2: 'Tour Dates →',
          cta2Href: '#features',
        }
      },
      {
        id: 'a1', type: 'about', props: {
          heading: 'About Nova Sol',
          body: 'Nova Sol is the project of London-based producer and vocalist Seren Maddox. Fusing hyperpop, ambient techno, and confessional songwriting, her music occupies a space where club and bedroom meet.\n\nDebut EP \'Glass Structures\' (2022) amassed 4M streams within three months of release. \'LUMINANCE\' (2025) marks her first full-length record — a vulnerable, maximalist statement co-produced with Arca. Featured in Pitchfork, The FADER, Resident Advisor, and Vogue UK.'
        }
      },
      {
        id: 'f1', type: 'features', props: {
          heading: 'Tour Dates — Summer 2025',
          subheading: 'Catching Nova Sol live is a fully immersive audio-visual experience. Limited capacity shows — tickets go fast.',
          featureList: [
            { icon: '🇬🇧', title: 'London — June 14', desc: 'Fabric, London EC1A · Doors 10pm · Tickets from £22 · Supporting Act: Shygirl' },
            { icon: '🇩🇪', title: 'Berlin — June 21', desc: 'Berghain, Berlin · Doors 11pm · Tickets from €18 · 24-hour special extended set' },
            { icon: '🇺🇸', title: 'New York — July 4', desc: 'Elsewhere, Brooklyn · Doors 9pm · Tickets from $25 · US debut performance' },
          ],
          learnMoreHref: '#contact',
        }
      },
      {
        id: 't1', type: 'testimonials', props: {
          heading: 'Press',
          reviews: [
            { quote: '\'LUMINANCE\' is one of the most thrilling debut albums of 2025. Nova Sol writes pop music for the void — devastating, danceable, and utterly her own.', name: 'Pitchfork', role: 'Album Review — 8.4 / 10' },
            { quote: 'A visceral live experience. Seren Maddox commands the room with an effortless magnetism that most artists spend careers chasing.', name: 'Resident Advisor', role: 'Live Review — Fabric London' },
            { quote: 'Nova Sol is one of the UK\'s most exciting new voices. \'LUMINANCE\' confirms that she\'s already operating at a level beyond her years.', name: 'The FADER', role: 'Feature Interview' },
          ]
        }
      },
      {
        id: 'c1', type: 'contact', props: {
          heading: 'Booking & Press',
          subtitle: 'For bookings, licensing, sync enquiries, and press access. Management: Nova Sol Music Ltd, London.',
          submitTxt: 'Send Enquiry →'
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'NOVA SOL',
          copy: '© 2025 Nova Sol Music Ltd. All rights reserved.',
          footerLinks: [
            { label: 'Spotify', href: '#' },
            { label: 'Apple Music', href: '#' },
            { label: 'Instagram', href: '#' },
            { label: 'Press Kit', href: '#' },
          ],
        }
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────── //
  //  BLANK — Starter                                                       //
  // ────────────────────────────────────────────────────────────────────── //
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
          title: 'Your Headline Goes Here',
          subtitle: 'Replace this with a clear, compelling value proposition. Click any text to edit it. Drag the ⠿ handle to reorder sections. Click + in the left panel to add new sections.',
          cta: 'Primary Action',
          ctaHref: '#contact',
          cta2: 'Secondary Action →',
          cta2Href: '#features',
        }
      },
      {
        id: 'ft1', type: 'footer', props: {
          brand: 'My Brand',
          copy: `© ${new Date().getFullYear()} My Brand. All rights reserved.`,
          footerLinks: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
            { label: 'Contact', href: '#contact' },
          ],
        }
      },
    ],
  },
}
