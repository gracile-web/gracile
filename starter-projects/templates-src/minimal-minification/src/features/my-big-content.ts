/* eslint-disable max-lines */
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-big-content')
export class MyGreetings extends LitElement {
	static styles = [
		css`
			pre {
				overflow-x: scroll;
				padding: 1rem;
			}

			:host {
				display: block;
			}
		`,
	];

	@property() someProperty = 'None :(';

	#somePart = html`<nav>
		<ul>
			<li><a href="#introduction">Introduction</a></li>
			<li>
				<a href="#what-is-minification">What is Minification?</a>
			</li>
			<li>
				<a href="#minifying-javascript">Minifying JavaScript</a>
			</li>
			<li><a href="#minifying-html">Minifying HTML</a></li>
			<li><a href="#minifying-css">Minifying CSS</a></li>
			<li>
				<a href="#tools-for-minification">Tools for Minification</a>
			</li>
			<li>
				<a href="#drawbacks">Potential Drawbacks of Minification</a>
			</li>
			<li><a href="#conclusion">Conclusion</a></li>
		</ul>
	</nav>`;

	render() {
		return html`
			<div>You are passing this property: ${this.someProperty}!</div>

			<hr />

			<div>
				A custom element:<br />
				<my-greetings></my-greetings>
			</div>

			<hr />

			<p>
				<em>Gibberish text generated with AI</em>
			</p>

			<hr />

			<header>
				<h1>Comprehensive Guide to Minification of Web Assets</h1>
				<p>
					Explore the intricacies of minifying JavaScript, HTML, and CSS to
					enhance the performance and efficiency of your web applications.
				</p>
				${this.#somePart}
			</header>

			<main>
				<section id="introduction">
					<h2>Introduction</h2>
					<p>
						In today's fast-paced digital world, web performance plays a
						critical role in determining the success of an online presence. One
						key aspect of optimizing web performance is
						<strong>minification</strong>. This process involves reducing the
						size of your web assets—such as JavaScript, HTML, and CSS
						files—without altering their functionality. Minification is often
						employed in conjunction with other optimization techniques like
						<em>caching</em> and <em>compression</em>.
					</p>
					<p>
						In this guide, we will dive into the concept of minification,
						exploring its benefits, the various techniques used, tools
						available, and potential drawbacks you should be aware of.
					</p>
					<figure>
						<img
							src="https://via.placeholder.com/600x200"
							alt="Diagram showing the process of minification"
						/>
						<figcaption>
							A diagram illustrating the process of minifying web assets.
						</figcaption>
					</figure>
				</section>

				<section id="what-is-minification">
					<h2>What is Minification?</h2>
					<p>
						Minification is the process of removing all unnecessary characters
						from source code without changing its functionality. These
						unnecessary characters include:
					</p>
					<ul>
						<li>Whitespace characters (spaces, tabs, line breaks)</li>
						<li>Comments that are not required for execution</li>
						<li>Unnecessary semicolons</li>
						<li>
							Unused code (e.g., variables that are declared but never used)
						</li>
						<li>
							Long variable names (which can be shortened during the
							minification process)
						</li>
					</ul>
					<p>
						The goal of minification is to improve the loading speed of web
						pages by reducing the size of the files that need to be downloaded
						by the browser. This is especially important in the context of
						mobile devices and users with slower internet connections.
					</p>
					<blockquote
						cite="https://web.dev/fast/#reduce-the-size-of-your-javascript"
					>
						<p>
							"Minifying your code can reduce the file size by up to 60%,
							depending on the complexity of the code and the level of
							optimization used."
						</p>
					</blockquote>
				</section>

				<section id="minifying-javascript">
					<h2>Minifying JavaScript</h2>
					<p>
						JavaScript is a critical component of most modern web applications.
						It enables dynamic content, interactivity, and a wide range of
						features that are essential for user engagement. However, JavaScript
						files can become quite large, especially as applications grow in
						complexity. Minification can significantly reduce the size of these
						files, leading to faster load times and a better user experience.
					</p>

					<article>
						<h3>Steps in JavaScript Minification</h3>
						<p>
							The process of minifying JavaScript typically involves several
							steps:
						</p>
						<ol>
							<li>
								<strong>Whitespace Removal:</strong> Removing all unnecessary
								whitespace, including spaces, tabs, and newlines.
							</li>
							<li>
								<strong>Shortening Variable Names:</strong> Renaming variables,
								functions, and object properties to shorter names.
							</li>
							<li>
								<strong>Removing Comments:</strong> Stripping out comments that
								do not affect the execution of the code.
							</li>
							<li>
								<strong>Consolidating Code:</strong> Merging adjacent lines of
								code where possible.
							</li>
						</ol>
					</article>

					<article>
						<h3>Before and After: A JavaScript Example</h3>
						<p>
							Below is an example of a JavaScript function before and after
							minification:
						</p>
						<p><strong>Before Minification:</strong></p>
						<pre><code>function greetUser(name) {
    console.log("Hello, " + name + "!");
}

function displayDate() {
    const today = new Date();
    console.log("Today's date is: " + today.toDateString());
}</code></pre>
						<p><strong>After Minification:</strong></p>
						<pre><code>function greetUser(a){console.log("Hello, "+a+"!")}function displayDate(){const a=new Date;console.log("Today's date is: "+a.toDateString())}</code></pre>
						<p>
							As you can see, the minified version of the code is much shorter,
							which helps in reducing the overall file size.
						</p>
					</article>

					<aside>
						<h4>Did You Know?</h4>
						<p>
							Minifying JavaScript not only helps with load times but can also
							make your code harder to reverse-engineer, providing a basic level
							of obfuscation.
						</p>
					</aside>
				</section>

				<section id="minifying-html">
					<h2>Minifying HTML</h2>
					<p>
						HTML is the backbone of any web page, defining its structure and
						content. Although HTML files are generally smaller compared to
						JavaScript and CSS, minifying HTML can still provide significant
						performance benefits, particularly for large and complex pages.
					</p>

					<article>
						<h3>Key Techniques in HTML Minification</h3>
						<p>HTML minification involves several techniques, including:</p>
						<ul>
							<li>
								<strong>Removing Whitespace:</strong> Extra spaces and line
								breaks between tags are removed.
							</li>
							<li>
								<strong>Stripping Comments:</strong> Comments that are not
								necessary for rendering are removed.
							</li>
							<li>
								<strong>Eliminating Redundant Attributes:</strong> Default or
								redundant attributes (e.g.,
								<code>type="text/javascript"</code> for scripts) are removed.
							</li>
							<li>
								<strong>Minifying Inline JavaScript and CSS:</strong> If your
								HTML includes inline JavaScript or CSS, these can also be
								minified.
							</li>
						</ul>
					</article>

					<article>
						<h3>HTML Minification Example</h3>
						<p>
							Here's an example of an HTML snippet before and after
							minification:
						</p>
						<p><strong>Before Minification:</strong></p>
						<pre><code>&lt;div class="container"&gt;
    &lt;h1&gt;Welcome to My Website&lt;/h1&gt;
    &lt;p&gt;This is a sample website to demonstrate HTML minification.&lt;/p&gt;
    &lt;!-- This is a comment --&gt;
    &lt;script type="text/javascript"&gt;
        console.log("Hello, World!");
    &lt;/script&gt;
&lt;/div&gt;</code></pre>
						<p><strong>After Minification:</strong></p>
						<pre><code>&lt;div class="container"&gt;&lt;h1&gt;Welcome to My Website&lt;/h1&gt;&lt;p&gt;This is a sample website to demonstrate HTML minification.&lt;/p&gt;&lt;script&gt;console.log("Hello, World!");&lt;/script&gt;&lt;/div&gt;</code></pre>
						<p>
							The minified HTML is more compact and will load faster in the
							browser.
						</p>
					</article>
				</section>

				<section id="minifying-css">
					<h2>Minifying CSS</h2>
					<p>
						CSS (Cascading Style Sheets) defines the presentation of your web
						pages, including layouts, colors, fonts, and more. As websites grow
						in complexity, so too does the CSS that styles them. Minifying CSS
						can drastically reduce the size of your style sheets, leading to
						faster rendering of your web pages.
					</p>

					<article>
						<h3>Steps in CSS Minification</h3>
						<p>Minifying CSS generally involves the following steps:</p>
						<ol>
							<li>
								<strong>Whitespace Removal:</strong> All unnecessary spaces,
								tabs, and line breaks are removed.
							</li>
							<li>
								<strong>Shortening Color Codes:</strong> Hex color codes are
								shortened (e.g., <code>#ffffff</code> becomes
								<code>#fff</code>).
							</li>
							<li>
								<strong>Removing Comments:</strong> All comments are stripped
								from the code.
							</li>
							<li>
								<strong>Combining Rules:</strong> Identical rules are combined
								to reduce redundancy.
							</li>
						</ol>
					</article>

					<article>
						<h3>CSS Minification Example</h3>
						<p>Consider the following CSS before and after minification:</p>
						<p><strong>Before Minification:</strong></p>
						<pre><code>body {
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

/* This is a comment */
h1 {
    color: #333333;
    font-size: 24px;
}</code></pre>
						<p><strong>After Minification:</strong></p>
						<pre><code>body{background-color:#fff;margin:0;padding:0;font-family:Arial,sans-serif}h1{color:#333;font-size:24px}</code></pre>
						<p>
							The minified CSS is more compact and will load faster,
							contributing to quicker page rendering.
						</p>
					</article>

					<aside>
						<h4>Tip:</h4>
						<p>
							Always test your minified CSS to ensure it renders correctly
							across different browsers and devices. Sometimes, the minification
							process can inadvertently alter the appearance of your website.
						</p>
					</aside>
				</section>

				<section id="tools-for-minification">
					<h2>Tools for Minification</h2>
					<p>
						Several tools are available to help you automate the minification
						process for JavaScript, HTML, and CSS. These tools range from simple
						command-line utilities to more complex build tools integrated into
						your development workflow.
					</p>

					<article>
						<h3>JavaScript Minification Tools</h3>
						<ul>
							<li>
								<strong>UglifyJS:</strong> A widely-used JavaScript minifier
								that also offers options for compressing and obfuscating code.
							</li>
							<li>
								<strong>Terser:</strong> A modern alternative to UglifyJS,
								designed to produce smaller minified files with ES6+ support.
							</li>
							<li>
								<strong>Google Closure Compiler:</strong> A powerful tool from
								Google that minifies and optimizes JavaScript by analyzing and
								rewriting code.
							</li>
						</ul>
					</article>

					<article>
						<h3>HTML Minification Tools</h3>
						<ul>
							<li>
								<strong>HTMLMinifier:</strong> A highly customizable tool that
								can minify HTML by removing comments, whitespace, and optional
								tags.
							</li>
							<li>
								<strong>Minify:</strong> An all-in-one tool that can minify
								HTML, CSS, and JavaScript files.
							</li>
							<li>
								<strong>gulp-htmlmin:</strong> A Gulp plugin for HTML
								minification, useful for automating the minification process in
								your build pipeline.
							</li>
						</ul>
					</article>

					<article>
						<h3>CSS Minification Tools</h3>
						<ul>
							<li>
								<strong>cssnano:</strong> A modular minifier that can be
								integrated into build tools like PostCSS.
							</li>
							<li>
								<strong>CleanCSS:</strong> A fast and efficient CSS optimizer
								and minifier with many configuration options.
							</li>
							<li>
								<strong>YUI Compressor:</strong> An older but still reliable
								tool for minifying CSS (and JavaScript).
							</li>
						</ul>
					</article>

					<aside>
						<h4>Note:</h4>
						<p>
							When using these tools, always back up your original files before
							minifying them, and test the minified versions thoroughly to
							ensure they function as expected.
						</p>
					</aside>
				</section>

				<section id="drawbacks">
					<h2>Potential Drawbacks of Minification</h2>
					<p>
						While minification offers many benefits, there are also some
						potential drawbacks to consider:
					</p>
					<ul>
						<li>
							<strong>Debugging Complexity:</strong> Minified code is harder to
							debug because variable names are shortened, and comments are
							removed. To mitigate this, many developers use source maps, which
							map the minified code back to the original source code.
						</li>
						<li>
							<strong>Build Process Overhead:</strong> The process of
							minification adds an additional step to your build process, which
							can increase build times, especially for large projects.
						</li>
						<li>
							<strong>Potential for Errors:</strong> In some cases, the
							minification process can introduce errors, particularly if the
							minifier doesn't correctly handle certain syntax or edge cases.
						</li>
					</ul>
					<p>
						Despite these drawbacks, the benefits of minification generally
						outweigh the risks, especially when using modern tools that have
						been thoroughly tested and widely adopted.
					</p>
				</section>

				<section id="conclusion">
					<h2>Conclusion</h2>
					<p>
						Minification is an essential practice for modern web development,
						helping to reduce the size of your web assets, improve load times,
						and enhance the overall user experience. Whether you are working
						with JavaScript, HTML, or CSS, there are many tools available to
						help you automate the minification process.
					</p>
					<p>
						By incorporating minification into your development workflow, you
						can ensure that your web applications perform efficiently, even
						under the constraints of slower networks or less powerful devices.
						However, it's important to be aware of the potential drawbacks and
						to test your minified code thoroughly before deploying it to
						production.
					</p>
					<p>
						<strong>Remember:</strong> Optimization is a continuous process, and
						minification is just one of many techniques you can use to keep your
						web applications running smoothly.
					</p>
				</section>
			</main>

			<footer>
				<p>&copy; 2024 Web Optimization Tips</p>
				<p>
					<a href="https://www.example.com">Visit our website for more tips</a>
				</p>
				<nav>
					<ul>
						<li><a href="#introduction">Back to Top</a></li>
						<li>
							<a href="#minifying-javascript">JavaScript Minification</a>
						</li>
						<li><a href="#minifying-html">HTML Minification</a></li>
						<li><a href="#minifying-css">CSS Minification</a></li>
					</ul>
				</nav>
			</footer>
			<!--  -->
		`;
	}
}
