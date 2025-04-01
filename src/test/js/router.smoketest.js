/**
 * Smoketest für Router-Mappings
 * Prüft ob alle gemappten Dateien tatsächlich existieren
 */

describe('Router Mapping Tests', () => {
    const fs = require('fs');
    const path = require('path');

    // Pfade zu den relevanten Verzeichnissen
    const STATIC_DIR = path.resolve(__dirname, '../../main/resources/static');
    const MODULES_DIR = path.join(STATIC_DIR, 'modules');
    const JS_DIR = path.join(STATIC_DIR, 'js');

    // Hilfsfunktion zum Prüfen der Dateiexistenz
    function fileExists(filepath) {
        try {
            return fs.existsSync(filepath);
        } catch (err) {
            return false;
        }
    }

    // Hole die tatsächlichen Router-Mappings
    const routerPath = path.join(JS_DIR, 'router.js');
    const routerContent = fs.readFileSync(routerPath, 'utf8');
    
    // Extrahiere die Mappings aus router.js
    function extractMappings(content) {
        const moduleMapping = {};
        const jsFileMapping = {};
        
        // Extrahiere moduleMapping
        const moduleMappingMatch = content.match(/const\s+moduleMapping\s*=\s*{([^}]*)}/s);
        if (moduleMappingMatch) {
            const mappingLines = moduleMappingMatch[1].split('\n');
            mappingLines.forEach(line => {
                const match = line.match(/'([^']+)':\s*{file:\s*'([^']+)'/);
                if (match) {
                    moduleMapping[match[1]] = match[2];
                }
            });
        }

        // Extrahiere jsFileMapping
        const jsFileMappingMatch = content.match(/const\s+jsFileMapping\s*=\s*{([^}]*)}/s);
        if (jsFileMappingMatch) {
            const mappingLines = jsFileMappingMatch[1].split('\n');
            mappingLines.forEach(line => {
                const match = line.match(/'([^']+)':\s*'([^']+)'/);
                if (match) {
                    jsFileMapping[match[1]] = match[2];
                }
            });
        }

        return { moduleMapping, jsFileMapping };
    }

    const { moduleMapping, jsFileMapping } = extractMappings(routerContent);

    describe('HTML Module Mappings', () => {
        Object.entries(moduleMapping).forEach(([key, value]) => {
            test(`Modul "${key}" -> "${value}" sollte eine gültige HTML-Datei haben`, () => {
                const htmlPath = path.join(MODULES_DIR, `${value}.html`);
                expect(fileExists(htmlPath)).toBe(true,
                    `HTML-Datei nicht gefunden: ${value}.html\nPfad: ${htmlPath}`);
            });
        });
    });

    describe('JavaScript File Mappings', () => {
        Object.entries(jsFileMapping).forEach(([key, value]) => {
            test(`Mapping "${key}" -> "${value}" sollte eine gültige JS-Datei haben`, () => {
                const jsPath = path.join(JS_DIR, `${value}.js`);
                expect(fileExists(jsPath)).toBe(true,
                    `JavaScript-Datei nicht gefunden: ${value}.js\nPfad: ${jsPath}`);
            });
        });
    });

    describe('Konsistenz-Checks', () => {
        test('Alle HTML-Module sollten entsprechende JS-Dateien haben', () => {
            const htmlFiles = fs.readdirSync(MODULES_DIR)
                .filter(file => file.endsWith('.html'))
                .map(file => file.replace('.html', ''));

            htmlFiles.forEach(basename => {
                const jsPath = path.join(JS_DIR, `${basename}.js`);
                expect(fileExists(jsPath)).toBe(true,
                    `Keine JS-Datei für HTML-Modul gefunden: ${basename}.js`);
            });
        });

        test('Alle JS-Dateien sollten in mindestens einem Mapping verwendet werden', () => {
            const jsFiles = fs.readdirSync(JS_DIR)
                .filter(file => file.endsWith('.js'))
                .map(file => file.replace('.js', ''));

            const mappedFiles = new Set([
                ...Object.values(jsFileMapping),
                ...Object.values(moduleMapping)
            ]);

            jsFiles.forEach(basename => {
                // Ignoriere spezielle Dateien
                if (!['router', 'theme-switcher'].includes(basename)) {
                    expect(mappedFiles.has(basename)).toBe(true,
                        `JS-Datei wird in keinem Mapping verwendet: ${basename}.js`);
                }
            });
        });
    });
});
