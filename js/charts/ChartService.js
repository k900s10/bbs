/**
 * ChartService
 * Common chart utility functions and configuration helpers.
 */
export class ChartService {
    static FONT_FAMILY = 'Plus Jakarta Sans';

    /**
     * Wrap long text labels into multiline arrays for Chart.js
     * @param {string} str 
     * @param {number} maxChars 
     * @returns {string|string[]}
     */
    static wrapLabel(str, maxChars = 16) {
        if (typeof str !== 'string' || str.length <= maxChars) return str;
        const words = str.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + ' ' + word).trim().length > maxChars) {
                if (currentLine) lines.push(currentLine.trim());
                currentLine = word;
            } else {
                currentLine += (currentLine ? ' ' : '') + word;
            }
        });

        if (currentLine) lines.push(currentLine.trim());
        return lines;
    }

    /**
     * Standard tooltip callback configuration to handle wrapped labels properly
     */
    static getStandardTooltipConfig() {
        return {
            callbacks: {
                title: function(tooltipItems) {
                    const item = tooltipItems[0];
                    const label = item.chart.data.labels[item.dataIndex];
                    if (Array.isArray(label)) {
                        return label.join(' ');
                    }
                    return label;
                }
            }
        };
    }
}
