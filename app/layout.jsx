import { Outfit, Raleway } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SmoothScrollProvider } from '../src/lib/SmoothScrollProvider';
import 'lenis/dist/lenis.css';
import '../src/index.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://darshan-gowdaa.vercel.app'),
  title: 'Darshan Gowda G S | Full-Stack Developer & Data Analytics Portfolio',
  description:
    'Darshan Gowda G S - Full-Stack Developer & Data Analytics Student at Christ University. MERN stack expert, building scalable web applications. View my projects, skills, and experience.',
  keywords: [
    'Darshan Gowda G S',
    'Darshan Gowda',
    'Full Stack Developer',
    'MERN Stack',
    'React Developer',
    'Data Analytics',
    'Portfolio',
    'Web Developer',
    'Bengaluru',
    'Christ University',
    'JavaScript',
    'Node.js',
    'MongoDB',
    'Python',
  ],
  authors: [{ name: 'Darshan Gowda G S' }],
  creator: 'Darshan Gowda G S',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://darshan-gowdaa.vercel.app/',
    title: 'Darshan Gowda G S | Full-Stack Developer & Data Analytics Portfolio',
    description:
      'Full-Stack Developer & Data Analytics Student. MERN stack expert building scalable web applications. View my projects and experience.',
    siteName: 'Darshan Gowda G S Portfolio',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.avif',
        width: 1200,
        height: 630,
        alt: 'Darshan Gowda G S - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darshan Gowda G S | Full-Stack Developer & Data Analytics Portfolio',
    description:
      'Full-Stack Developer & Data Analytics Student. MERN stack expert building scalable web applications.',
    images: [
      {
        url: '/og-image.avif',
        alt: 'Darshan Gowda G S - Full-Stack Developer Portfolio',
      },
    ],
    creator: '@DarshanG_S',
  },
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': 'Bengaluru',
    'color-scheme': 'dark',
    'revisit-after': '7 days',
    'msapplication-TileColor': '#050505',
  },
  icons: {
    icon: [{ url: '/favicon.avif', type: 'image/avif' }],
    apple: [{ url: '/favicon.avif' }],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    title: 'Darshan Gowda',
    statusBarStyle: 'black-translucent',
  },
  category: 'portfolio',
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Darshan Gowda G S',
  alternateName: 'Darshan Gowda',
  url: 'https://darshan-gowdaa.vercel.app/',
  image: 'https://darshan-gowdaa.vercel.app/profile-picture.avif',
  jobTitle: 'Full-Stack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance / Open to Opportunities',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Christ University',
      department: 'Data Analytics',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: "St. Joseph's University",
      department: 'Computer Applications',
    },
  ],
  knowsAbout: [
    'MERN Stack',
    'React',
    'Node.js',
    'MongoDB',
    'Python',
    'Data Analytics',
    'Machine Learning',
    'Web Development',
  ],
  sameAs: [
    'https://github.com/darshan-gowdaa',
    'https://www.linkedin.com/in/Darshan-Gowda-G-S',
  ],
  email: 'mailto:darshangowdaa223@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Darshan Gowda G S Portfolio',
  alternateName: 'Darshan Gowda G S - Full Stack Developer',
  url: 'https://darshan-gowdaa.vercel.app/',
  description:
    'Portfolio website of Darshan Gowda G S, a Full-Stack Developer and Data Analytics student',
  author: {
    '@type': 'Person',
    name: 'Darshan Gowda G S',
  },
};


const profileSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  dateCreated: '2023-01-01T00:00:00+00:00',
  dateModified: new Date().toISOString(),
  mainEntity: personSchema
};

export const viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${raleway.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
        />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#050505', color: '#fff' }}>
        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'white', background: '#050505' }}>
            This website requires JavaScript. Please enable it to continue.
          </div>
        </noscript>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
