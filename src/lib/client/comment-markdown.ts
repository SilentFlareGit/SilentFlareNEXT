import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
	breaks: true,
	html: false,
	linkify: true,
	typographer: false,
});

markdown.disable("image");

const defaultLinkOpen =
	markdown.renderer.rules.link_open ??
	((tokens, index, options, _environment, renderer) =>
		renderer.renderToken(tokens, index, options));

markdown.renderer.rules.link_open = (
	tokens,
	index,
	options,
	environment,
	renderer,
) => {
	tokens[index].attrSet("target", "_blank");
	tokens[index].attrSet("rel", "nofollow noopener noreferrer");
	return defaultLinkOpen(tokens, index, options, environment, renderer);
};

export function renderCommentMarkdown(source: string) {
	return markdown.render(source);
}
