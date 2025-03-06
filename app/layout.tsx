import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sheet } from '@/components/ui/sheet';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '友達本屋',
  description: '友達がやってる本屋さん',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="wf-loading" suppressHydrationWarning>
      <body className={`${inter.className} bg-black`}>
        <Script id="adobe-fonts" strategy="beforeInteractive">
          {`
            (function(d) {
              var config = {
                kitId: 'ibu3suh',
                scriptTimeout: 3000,
                async: true
              },
              h = d.documentElement,
              t = setTimeout(function(){ 
                h.className = h.className.replace(/\\bwf-loading\\b/g, "") + " wf-inactive"; 
              }, config.scriptTimeout),
              tk = d.createElement("script"), 
              f = false, 
              s = d.getElementsByTagName("script")[0], 
              a;
              h.className += " wf-loading";
              tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
              tk.async = true;
              tk.onload = tk.onreadystatechange = function(){
                a = this.readyState;
                if (f || a && a !== "complete" && a !== "loaded") return;
                f = true;
                clearTimeout(t);
                try { 
                  Typekit.load(config); 
                } catch(e) {}
              };
              s.parentNode.insertBefore(tk, s);
            })(document);
          `}
        </Script>
        <main className="pt-16">
          {children}
        </main>
        <Sheet>
        </Sheet>
      </body>
    </html>
  );
}
