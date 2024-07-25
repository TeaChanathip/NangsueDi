export function textSizeConverter(
	textSize:
		| 'sm'
		| 'base'
		| 'lg'
		| 'xl'
		| '2xl'
		| '3xl'
		| '4xl'
		| '5xl'
		| '6xl'
		| '7xl'
		| '8xl'
		| '9xl',
): { fontSize: string; lineHeight: string } {
	switch (textSize) {
		case 'sm': {
			return { fontSize: '0.875rem', lineHeight: '1.25rem' };
		}
		case 'base': {
			return { fontSize: '1rem', lineHeight: '1.5rem' };
		}
		case 'lg': {
			return { fontSize: '1.125rem', lineHeight: '1.75rem' };
		}
		case 'xl': {
			return { fontSize: '1.25rem', lineHeight: '1.75rem' };
		}
		case '2xl': {
			return { fontSize: '1.5rem', lineHeight: '2rem' };
		}
		case '3xl': {
			return { fontSize: '1.875rem', lineHeight: '2.25rem' };
		}
		case '4xl': {
			return { fontSize: '2.25rem', lineHeight: '2.5rem' };
		}
		case '5xl': {
			return { fontSize: '3rem', lineHeight: '1rem' };
		}
		case '6xl': {
			return { fontSize: '3.75rem', lineHeight: '1rem' };
		}
		case '7xl': {
			return { fontSize: '4.5rem', lineHeight: '1rem' };
		}
		case '8xl': {
			return { fontSize: '6rem', lineHeight: '1rem' };
		}
		case '9xl': {
			return { fontSize: '8rem', lineHeight: '1rem' };
		}
	}
}
