/**
 * Tailwind CSS Configuration
 * Single source of truth for design tokens, custom colors, and typography.
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                brand: {
                    emerald: '#059669',
                    emeraldDark: '#047857',
                    orange: '#ea580c',
                    orangeLight: '#ffedd5',
                    sky: '#0284c7',
                    slateDark: '#0f172a',
                    slateBg: '#f8fafc'
                }
            }
        }
    }
};
