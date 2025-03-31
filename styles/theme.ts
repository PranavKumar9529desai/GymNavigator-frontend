export const gymTheme = {
	colors: {
		primary: {
			50: '#e6f1ff',
			100: '#c2dcff',
			200: '#99c3ff',
			300: '#66a9ff',
			400: '#3390ff',
			500: '#0077ff',
			600: '#0062d6',
			700: '#004eac',
			800: '#003a83',
			900: '#002659',
		},
		gradients: {
			primaryBlue: 'from-blue-400 via-blue-500 to-blue-600',
			heroBackground: 'from-blue-900 via-black to-gray-950',
			greenCard: 'from-green-500 to-green-600',
			purpleCard: 'from-purple-500 to-purple-600',
			orangeCard: 'from-orange-500 to-orange-600',
			badge: 'from-blue-400 to-purple-500',
		},
		text: {
			primary: 'text-white',
			secondary: 'text-gray-300',
			muted: 'text-gray-400',
			accent: 'text-blue-400',
			gradient:
				'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent',
		},
		backgrounds: {
			card: 'bg-white/5',
			cardHover: 'hover:bg-gray-800/50',
			buttonHover: 'hover:bg-white/5',
		},
		borders: {
			light: 'border-white/10',
			accent: 'border-blue-500/20',
			button: 'border-gray-700',
			buttonHover: 'hover:border-blue-500',
		},
	},
	animation: {
		gradient: 'animate-gradient',
		pulse: 'animate-pulse',
	},
	borderRadius: {
		card: 'rounded-xl',
		button: 'rounded-lg',
		badge: 'rounded-full',
	},
};

export type GymTheme = typeof gymTheme;
