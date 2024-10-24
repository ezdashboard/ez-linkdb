import './globals.css'
import './responsive.css'
import { Roboto } from 'next/font/google'
import { Providers } from './redux/propviders'

const roboto = Roboto({
  weight: ['100','300','400','500','700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Login Email',
  description: 'Login Email',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={roboto.className}>
        <Providers></Providers>
          
        {children}
        </body>
    </html>
  )
}
