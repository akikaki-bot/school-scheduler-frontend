import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Root } from './root'
import { NavigationBar } from '@/components/navbar'
import { NprogressProvider } from '@/provider/nProgress'

const inter = Noto_Sans_JP({ subsets: ['latin'] })



export const metadata: Metadata = {
	title: 'HS API Developers',
	description: 'High School Scaduler API Develpersのホームページ',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="ja">
			<body className={inter.className}>
				<Root>
					<NprogressProvider>
						<NavigationBar />
						{children}
					</NprogressProvider>
				</Root>
			</body>
		</html>
	)
}
