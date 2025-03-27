import './globals.css'
import { NavBar } from '@/components/layout/navbar'
import { AuthProvider } from '@/components/layout/auth-provider'
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children,}: { children: React.ReactNode}) {
    return (
        <html lang="en">
            {/*
                <head /> will contain the components returned by the nearest parent
                head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
            */}
            <head />
            <body>
                <AuthProvider>
                    <div className="flex flex-col min-h-screen">
                        <NavBar />
                        <main className="flex-grow">
                            {children}
                            <SpeedInsights/>
                        </main>
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
