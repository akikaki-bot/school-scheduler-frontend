"use client";

import { Engine, IOptions, ISourceOptions, Particle, RecursivePartial } from "@tsparticles/engine";
import { useMemo, useEffect, useState } from "react";
import { loadBasic } from "@tsparticles/basic";
import Particles, { initParticlesEngine } from "@tsparticles/react"



export function ParticlesBackGround() {

	const [init, setInit] = useState(false);

	const options = useMemo(
		() => ({
			background: {
				color: {
					value: "#fff",
				},
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					onClick: {
						enable: true,
						mode: "push",
					},
					onHover: {
						enable: true,
						mode: "repulse",
					},
					resize: true,
				},
				modes: {
					push: {
						quantity: 4,
					},
					repulse: {
						distance: 200,
						duration: 0.4,
					},
				},
			},
			particles: {
				color: {
					value: "#fa0",
				},
				links: {
					color: "#eb0",
					distance: 100,
					enable: true,
					opacity: 0.5,
					width: 1,
					triangles: {
						enable: true,
						color: "#ffffff",
						opacity: 0.1
					}
				},
				move: {
					direction: "none",
					enable: true,
					outModes: {
						default: "out",
					},
					random: false,
					speed: 2,
					straight: false,
				},
				number: {
					density: {
						enable: true,
						area: 800,
					},
					value: 80,
				},
				opacity: {
					value: 0.5,
				},
				shape: {
					type: "circle",
				},
				size: {
					value: { min: 1, max: 3 },
				},
			},
			detectRetina: true,
		}),
		[]
	);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadBasic(engine);
		}).then(() => {
			setInit(true)
		})
	}, [])

	if (init) {
		return (
			<Particles
				className="-z-10"
				//@ts-ignore
				options={options}
			/>
		)
	}
	return <></>
}