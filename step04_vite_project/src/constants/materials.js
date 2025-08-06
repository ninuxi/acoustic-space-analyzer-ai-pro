export const MATERIALS = {
    'plasterboard': { name: 'Plasterboard', absorption: { 125: 0.29, 250: 0.10, 500: 0.05, 1000: 0.04, 2000: 0.07, 4000: 0.09 }, color: '#e0e0e0', category: 'wall', description: 'Standard drywall' },
    // ... tutti gli altri materiali qui ...
    'perforated_metal': { name: 'Perforated Metal', absorption: { 125: 0.15, 250: 0.25, 500: 0.40, 1000: 0.50, 2000: 0.50, 4000: 0.45 }, color: '#708090', category: 'treatment', description: 'Perforated metal panel' }
};

export const MATERIAL_CATEGORIES = {
    'structural': { name: 'Structural Materials', description: 'Basic building materials', icon: '🏗️' },
    'wall': { name: 'Wall Materials', description: 'Wall surface treatments', icon: '🧱' },
    'floor': { name: 'Floor Materials', description: 'Floor surface materials', icon: '🏠' },
    'treatment': { name: 'Acoustic Treatments', description: 'Specialized acoustic materials', icon: '🎵' }
};

export const MaterialUtils = {
    getMaterialsByCategory: (category) => {
        return Object.entries(MATERIALS).filter(([, material]) => material.category === category)
            .reduce((acc, [key, material]) => ({ ...acc, [key]: material }), {});
    },
    calculateAverageAbsorption: (materialKey) => {
        const material = MATERIALS[materialKey];
        if (!material) return 0;
        const absorptions = Object.values(material.absorption);
        return absorptions.reduce((sum, val) => sum + val, 0) / absorptions.length;
    },
    getMaterialRecommendation: (roomType, surfaceType) => {
        const recommendations = {
            'studio': { 'floor': 'carpet', 'wall': 'acoustic_panel', 'ceiling': 'foam_panel' },
            'home_theater': { 'floor': 'carpet', 'wall': 'fabric_upholstery', 'ceiling': 'acoustic_panel' },
            'garage': { 'floor': 'concrete', 'wall': 'brick', 'ceiling': 'plasterboard' },
            'living_room': { 'floor': 'hardwood', 'wall': 'plaster', 'ceiling': 'plasterboard' },
        };
        return recommendations[roomType]?.[surfaceType] || 'plasterboard';
    },
    getAbsorptionAtFrequency: (materialKey, frequency) => {
        const material = MATERIALS[materialKey];
        if (!material) return 0.05;
        const frequencies = Object.keys(material.absorption).map(Number);
        const closest = frequencies.reduce((prev, curr) => Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev);
        return material.absorption[closest] || 0.05;
    },
    calculateNRC: (materialKey) => {
        const material = MATERIALS[materialKey];
        if (!material) return 0;
        const frequencies = [250, 500, 1000, 2000];
        const sum = frequencies.reduce((total, freq) => total + (material.absorption[freq] || 0), 0);
        return Math.round((sum / frequencies.length) * 20) / 20;
    }
};