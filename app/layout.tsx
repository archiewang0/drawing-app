import './globals.css'
import { NavBar } from '@/components/layout/navbar'

export default function RootLayout({ children,}: { children: React.ReactNode}) {
    return (
        <html lang="en">
            {/*
                <head /> will contain the components returned by the nearest parent
                head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
            */}
            <head />
            <body>
                <div className="flex flex-col min-h-screen">
                    <NavBar />
                    <main className="flex-grow">
                            {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
