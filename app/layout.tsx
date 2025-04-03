import './globals.css';
import {NavBar} from '@/components/layout/navbar';
import {AuthProvider} from '@/components/layout/auth-provider';
import {SpeedInsights} from '@vercel/speed-insights/next';
import 'react-loading-skeleton/dist/skeleton.css';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <head />
            <body>
                <AuthProvider>
                    <div className="flex flex-col min-h-screen">
                        <NavBar />
                        <main className="flex-grow">
                            {children}
                            <SpeedInsights />
                        </main>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
