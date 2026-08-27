/**
 * StringResourceLoader (StringService)
 * Loads string.xml from assets/ and provides string lookup and automatic template interpolation.
 * Supports syntax like {{variableName}}, ${variableName}, or $variableName right inside HTML.
 */
export class StringResourceLoader {
    static strings = new Map();
    static isLoaded = false;

    /**
     * Fetch and parse string.xml into a Map
     * @param {string} xmlPath 
     */
    static async load(xmlPath = 'assets/string.xml') {
        if (this.isLoaded) return this.strings;

        try {
            const response = await fetch(xmlPath);
            if (!response.ok) {
                throw new Error(`Failed to load ${xmlPath}: status ${response.status}`);
            }
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

            const stringNodes = xmlDoc.querySelectorAll('resources > string');
            stringNodes.forEach(node => {
                const name = node.getAttribute('name');
                if (name) {
                    this.strings.set(name, node.textContent);
                }
            });

            this.isLoaded = true;
        } catch (error) {
            console.error('Error loading string.xml resources:', error);
        }
        return this.strings;
    }

    /**
     * Get a string value by its key (e.g. getString('app_title'))
     * @param {string} key 
     * @param {string} defaultValue 
     * @returns {string}
     */
    static getString(key, defaultValue = '') {
        return this.strings.get(key) ?? defaultValue;
    }

    /**
     * Interpolates string variables inside text/HTML.
     * Supports:
     * - $variable_name
     * - ${variable_name}
     * - {{variable_name}}
     * @param {string} text 
     * @returns {string}
     */
    static interpolate(text) {
        if (!text) return text;
        
        // 1. Match ${varName} or {{varName}}
        let interpolated = text.replace(/(\${|{{)\s*([a-zA-Z0-9_]+)\s*(}|}})/g, (match, open, key) => {
            return this.strings.has(key) ? this.strings.get(key) : match;
        });

        // 2. Match $varName (word boundary after $)
        interpolated = interpolated.replace(/\$([a-zA-Z0-9_]+)\b/g, (match, key) => {
            return this.strings.has(key) ? this.strings.get(key) : match;
        });

        return interpolated;
    }

    /**
     * Recursively traverses DOM and replaces $variableName / ${variableName} in text nodes and attributes.
     */
    static applyToDOM(root = document.body) {
        // Document Title
        if (this.strings.has('app_title')) {
            document.title = this.interpolate(document.title) || this.strings.get('app_title');
        }

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToProcess = [];
        let currentNode = walker.nextNode();
        while (currentNode) {
            if (currentNode.nodeValue && currentNode.nodeValue.includes('$')) {
                nodesToProcess.push(currentNode);
            }
            currentNode = walker.nextNode();
        }

        // Process text nodes
        nodesToProcess.forEach(textNode => {
            const raw = textNode.nodeValue;
            const interpolated = this.interpolate(raw);
            if (interpolated !== raw) {
                // If the resolved string contains HTML formatting (e.g. <strong>, <i>), parse into HTML
                if (/<[a-z][\s\S]*>/i.test(interpolated)) {
                    const temp = document.createElement('span');
                    temp.innerHTML = interpolated;
                    textNode.replaceWith(...temp.childNodes);
                } else {
                    textNode.nodeValue = interpolated;
                }
            }
        });

        // Also check element attributes if any contain $variables (like title, placeholder, aria-label, etc.)
        root.querySelectorAll('*').forEach(el => {
            for (let attr of el.attributes) {
                if (attr.value && attr.value.includes('$')) {
                    attr.value = this.interpolate(attr.value);
                }
            }
        });
    }
}
