const label = 'Toggle color mode';

export const ColorModeToggle = () => (
	<button class="c-color-mode-toggle" data-color-mode-switch aria-label={label}>
		<i-c class="moon" o="moon-stars-duotone" s="1.5rem"></i-c>
		<i-c class="sun" o="sun-duotone" s="1.5rem"></i-c>
	</button>
);
