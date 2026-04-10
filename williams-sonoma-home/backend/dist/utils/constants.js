"use strict";
// Predefined options for user preferences
// These will be used to train the ML model for personalized recommendations
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERFACE_PREFERENCES = exports.LIGHTING_CONDITIONS = exports.AGE_GROUPS = exports.PREFERRED_COLORS = exports.PREFERRED_STYLES = exports.LIFESTYLE_TAGS = void 0;
exports.LIFESTYLE_TAGS = [
    'Modern Minimalist',
    'Traditional',
    'Eclectic',
    'Rustic',
    'Contemporary',
    'Mid-Century Modern',
    'Industrial',
    'Bohemian',
    'Scandinavian',
    'Maximalist',
    'Vintage',
    'Art Deco',
    'Mediterranean',
    'Country',
    'Transitional',
];
exports.PREFERRED_STYLES = [
    'Contemporary',
    'Modern',
    'Traditional',
    'Transitional',
    'Industrial',
    'Rustic',
    'Mid-Century Modern',
    'Scandinavian',
    'Minimalist',
    'Maximalist',
    'Eclectic',
    'Bohemian',
    'Farmhouse',
    'Art Deco',
    'Mediterranean',
];
exports.PREFERRED_COLORS = [
    'Neutral Tones (Beige, Gray, White)',
    'Warm Earth Tones (Brown, Terracotta, Tan)',
    'Cool Tones (Blue, Gray, Silver)',
    'Bold/Jewel Tones (Emerald, Navy, Burgundy)',
    'Warm Colors (Red, Orange, Yellow)',
    'Cool Colors (Purple, Blue, Green)',
    'Black & White',
    'Pastel Colors',
    'Natural Wood Tones',
    'Multi-color Patterns',
];
exports.AGE_GROUPS = [
    '18-25',
    '26-35',
    '36-45',
    '46-55',
    '56-65',
    '65+',
];
exports.LIGHTING_CONDITIONS = [
    'Bright/Natural',
    'Moderate',
    'Low/Dim',
    'Mixed Lighting',
];
exports.INTERFACE_PREFERENCES = {
    lifestyleTags: exports.LIFESTYLE_TAGS,
    preferredStyles: exports.PREFERRED_STYLES,
    preferredColors: exports.PREFERRED_COLORS,
    ageGroups: exports.AGE_GROUPS,
    lightingConditions: exports.LIGHTING_CONDITIONS,
};
