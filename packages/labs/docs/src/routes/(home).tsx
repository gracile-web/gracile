import { defineRoute } from '@gracile/server/route';
import { docsConfig, featureList } from '@gracile-docs/content';

import { document } from '../document/document.js';
import { SplashScreen } from '../features/splash-screen.js';
import { FooterMain } from '../features/footer-main.js';
import { NavMain } from '../features/nav-main.js';
import { NavRight } from '../features/nav-right.js';

const { home } = docsConfig;

export default defineRoute({
	handler: async () => ({
		mainReadme: await import('/src/content/README.md'),
		// starterProjects: home.starterProjectsPath
		// 	? await import(/* @vite-ignore */ home.starterProjectsPath)
		// 	: null,
		// faq: home.faqPath
		// 	? await import(/* @vite-ignore */ home.faqPath)
		// 	: null,
		starterProjects:
			await import('/src/content/docs/04-starter-projects/README.md'),
		faq: await import('/src/content/docs/35-faq.md'),
	}),

	document: ({ url, props }) =>
		document({
			url,
			title: props.mainReadme.title,
			description: props.mainReadme.excerpt,
			layout: 'bare',
		}),

	template: ({ url, props }) => (
		<>
			<NavMain logoHtml={home.logoHtml} name={null} />

			<SplashScreen
				descriptionHtml={home.descriptionHtml}
				installCommand={home.installCommand}
				logoHtml={home.logoHtml}
				splashLinks={home.splashLinks}
			/>

			<main>
				<article class="prose">
					<h1>
						{/* <i-c o="ph:toolbox" /> */}
						Works With
					</h1>
					<section class="works-with">
						<ul>
							{[...home.worksWith].map((item) => (
								<for:each key={item.label}>
									<li>
										<img src={item.iconUrl} alt={item.alt} style={item.style} />
										<div>
											<strong>{item.label}</strong>
											{item.detail ? (
												<>
													<br /> {item.detail}
												</>
											) : null}
										</div>
									</li>
								</for:each>
							))}
						</ul>
					</section>

					<h1>
						{/* <i-c o="ph:toolbox" /> */}
						Main Features
					</h1>

					<section class="features cards">
						<div>
							{[...featureList].map((feature) => (
								<for:each key={feature.title}>
									<a class="card" href={feature.href || '#'}>
										<article class="card-content">
											<div>
												<strong class="feature-title">{feature.title}</strong>
												<p>
													{(feature.desc || feature.description || '').slice(
														0,
														75,
													)}
													{(feature.desc || feature.description || '').length >
													75
														? '...'
														: ''}
												</p>
											</div>
										</article>
									</a>
								</for:each>
							))}
						</div>

						<footer class="features-more">
							<a href="/docs/learn/usage/">See more…</a>
						</footer>
					</section>

					{props.starterProjects ? (
						<>
							<h1 $:html={props.starterProjects.titleHtml} />
							<section class="cards tiles">
								{(props.starterProjects.toc.at(0)?.children || []).map(
									(lvl) => (
										<for:each key={lvl.id}>
											<div class="card card-link">
												<a
													href={`/docs/starter-projects/#doc_${lvl.id}`}
													class="card-content"
												>
													{lvl.value}
												</a>
											</div>
										</for:each>
									),
								)}
							</section>
						</>
					) : null}

					<section class="home-readme" $:html={props.mainReadme.content} />

					{props.faq ? (
						<>
							<h1 $:html={props.faq.titleHtml} />

							<section class="cards tiles">
								{(props.faq.toc.at(0)?.children || []).map((lvl) => (
									<for:each key={lvl.id}>
										<div class="card card-link">
											<a href={`/docs/faq/#doc_${lvl.id}`} class="card-content">
												{lvl.value}
											</a>
										</div>
									</for:each>
								))}
							</section>
						</>
					) : null}
				</article>
			</main>

			<NavRight markdownModule={null} />

			<FooterMain url={url} filename={props.mainReadme.path} />
		</>
	),
});
