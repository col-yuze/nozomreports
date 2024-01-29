import Head from 'next/head'

import { Inter } from 'next/font/google'

import 'prismjs/themes/prism-okaidia.css'
import '@style/site.css'

import Footer from '@component/Footer'
import Header from '@component/Header'
import HeaderBanner from '@component/HeaderBanner'

export const metadata = {
  metadataBase: new URL('https://nozomlabsreports.dev'),
  title: 'Nozom reports',
  description: 'reports for summaries and stats.',
  openGraph: {
    title: 'Nozom reports',
    description: 'reports for summaries and stats.',
    url: 'https://nozomlabsreports.dev',
    siteName: 'NozomReports',
    type: 'website',
    images: ['https://www.nozomreports.dev/og.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nozom reports',
    description: 'reports for summaries and stats.',
  },
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html className="h-full scroll-smooth" lang="en" dir="ltr">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <HeaderBanner />

        <main className="bg-white">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
