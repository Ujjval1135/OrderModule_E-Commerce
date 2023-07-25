import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(
    import.meta.url));

i18n.configure({
    objectNotation: true,
    autoReload: true,
    defaultLocale: "en",
    locales: ['en', 'hi', 'gu', 'fr'], // * Array of locales
    directory: path.join(__dirname, '../../../locales'), // * JSON file location
    // * Sets a custom cookie name to parse locale settings from
});

export default i18n;