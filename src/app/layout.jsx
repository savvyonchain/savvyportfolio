import { Inter, Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata = {
  title: 'Savvy | Frontend Developer & Automation Specialist',
  description: 'Portfolio of Savvy, a no-code/automation specialist.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className={`${inter.className} antialiased relative min-h-screen selection:bg-brand selection:text-white`}>
        {/* Global Animated Mesh Background */}
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0A0612] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--color-brand)] rounded-full mix-blend-screen blur-[120px] opacity-[0.25] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--color-secondary)] rounded-full mix-blend-screen blur-[150px] opacity-[0.20] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] bg-[#9b51e0] rounded-full mix-blend-screen blur-[130px] opacity-[0.15]" />
        </div>

        <Navbar />

        <main className="relative z-10 w-full min-w-0 overflow-x-hidden">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
