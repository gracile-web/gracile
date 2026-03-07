import type { MarkdownModule } from '@gracile/markdown/module';

export const blogPosts = import.meta.glob<MarkdownModule>(
	'../content/blog/*.md',
	{
		eager: true,
		import: 'default',
	},
);

const BLOG_POST_REGEX = /\.\/blog\/(.*)\.md$/;

export function getBlogPostHref(path: string) {
	return path.replace(BLOG_POST_REGEX, (_, slug) => `/blog/${slug}/`);
}
