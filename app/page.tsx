"use client";
import { About } from '@/components/about';
import { ParticlesBackGround } from '@/components/background-particles';
import { LetsStart } from '@/components/letsget';
import { Inter } from 'next/font/google';
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })


export default function Home() {

	return (
		<main className="flex min-h-screen flex-col p-6 sm:p-12 lg:p-24">
			<ParticlesBackGround />
			<div className={`flex flex-col font-bold text-7xl sm:text-9xl min-h-screen left-10 sm:left-20 z-10 ${inter.className}`}>
				<p className="py-10 text-slate-900"> <span className="text-amber-300">M</span>emory. </p>
				<p className="py-10 text-slate-900"> <span className="text-amber-300">S</span>chedule. </p>
				<p className="py-10 text-slate-900"> <span className="text-amber-500">D</span>evelop. </p>
			</div>
			<div className="z-10">
				<About />
				<LetsStart />
			</div>
		</main>
	)
}
