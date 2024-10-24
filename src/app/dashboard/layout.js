// import './globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['100','300','400','500','700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
