#!/bin/zsh

# https://github.com/AlDanial/cloc
# apt install cloc
# brew install cloc

echo "\n# $(date '+%D') \n\n\`\`\`\n" >>code-line-counts.md &&
	cloc --match-f=$(git ls-files packages/{gracile,engine,internal,server,client}/**/*.{js,ts} ':!:packages/**/*.test.ts') \
		--exclude-dir='integration' >>code-line-counts.md &&
	echo '\n```\n' >>code-line-counts.md

pnpm prettier --write ./code-line-counts.md
