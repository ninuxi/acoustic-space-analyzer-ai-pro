// Material Database with Acoustic Properties
window.MATERIALS = {
    'plasterboard': { 
        name: 'Plasterboard', 
        absorption: { 125: 0.29, 250: 0.10, 500: 0.05, 1000: 0.04, 2000: 0.07, 4000: 0.09 }, 
        color: '#e0e0e0',
        category: 'wall',
        description: 'Standard drywall/plasterboard for interior walls'
    },
    'solid_wood': { 
        name: 'Solid Wood', 
        absorption: { 125: 0.15, 250: 0.11, 500: 0.10, 1000: 0.07, 2000: 0.06, 4000: 0.07 }, 
        color: '#8b4513',
        category: 'wall',
        description: 'Natural solid wood paneling'
    },
    'glass': { 
        name: 'Glass', 
        absorption: { 125: 0.35, 250: 0.25, 500: 0.18, 1000: 0.12, 2000: 0.07, 4000: 0.04 }, 
        color: '#87ceeb',
        category: 'wall',
        description: 'Standard window glass or glass panels'
    },
    'concrete': { 
        name: 'Concrete', 
        absorption: { 125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.03, 4000: 0.03 }, 
        color: '#808080',
        category: 'structural',
        description: 'Raw concrete surface'
    },
    'carpet': { 
        name: 'Carpet', 
        absorption: { 125: 0.08, 250: 0.24, 500: 0.57, 1000: 0.69, 2000: 0.71, 4000: 0.73 }, 
        color: '#8b0000',
        category: 'floor',
        description: 'Medium pile carpet with padding'
    },
    'heavy_curtain': { 
        name: 'Heavy Curtain', 
        absorption: { 125: 0.14, 250: 0.35, 500: 0.55, 1000: 0.72, 2000: 0.70, 4000: 0.65 }, 
        color: '#4b0082',
        category: 'treatment',
        description: 'Thick fabric curtains'
    },
    'acoustic_panel': { 
        name: 'Acoustic Panel', 
        absorption: { 125: 0.20, 250: 0.65, 500: 0.85, 1000: 0.95, 2000: 0.95, 4000: 0.90 }, 
        color: '#2f4f4f',
        category: 'treatment',
        description: 'Professional acoustic absorption panel'
    },
    'plaster': { 
        name: 'Plaster', 
        absorption: { 125: 0.02, 250: 0.02, 500: 0.03, 1000: 0.04, 2000: 0.05, 4000: 0.05 }, 
        color: '#f5f5dc',
        category: 'wall',
        description: 'Smooth plaster wall finish'
    },
    'brick': { 
        name: 'Brick', 
        absorption: { 125: 0.03, 250: 0.03, 500: 0.03, 1000: 0.04, 2000: 0.05, 4000: 0.07 }, 
        color: '#a52a2a',
        category: 'wall',
        description: 'Exposed brick wall'
    },
    'hardwood': { 
        name: 'Hardwood Floor', 
        absorption: { 125: 0.04, 250: 0.04, 500: 0.07, 1000: 0.06, 2000: 0.06, 4000: 0.07 }, 
        color: '#daa520',
        category: 'floor',
        description: 'Solid hardwood flooring'
    },
    'ceramic_tile': {
        name: 'Ceramic Tile',
        absorption: { 125: 0.01, 250: 0.01, 500: 0.01, 1000: 0.02, 2000: 0.02, 4000: 0.02 },
        color: '#f8f8ff',
        category: 'floor',
        description: 'Glazed ceramic floor tiles'
    },
    'marble': {
        name: 'Marble',
        absorption: { 125: 0.01, 250: 0.01, 500: 0.01, 1000: 0.02, 2000: 0.02, 4000: 0.02 },
        color: '#ffffff',
        category: 'floor',
        description: 'Polished marble surface'
    },
    'vinyl_flooring': {
        name: 'Vinyl Flooring',
        absorption: { 125: 0.02, 250: 0.03, 500: 0.03, 1000: 0.03, 2000: 0.03, 4000: 0.02 },
        color: '#d2b48c',
        category: 'floor',
        description: 'Resilient vinyl floor covering'
    },
    'metal_surface': {
        name: 'Metal Surface',
        absorption: { 125: 0.05, 250: 0.04, 500: 0.02, 1000: 0.03, 2000: 0.05, 4000: 0.05 },
        color: '#c0c0c0',
        category: 'structural',
        description: 'Painted or bare metal surface'
    },
    'fabric_upholstery': {
        name: 'Fabric Upholstery',
        absorption: { 125: 0.08, 250: 0.25, 500: 0.45, 1000: 0.65, 2000: 0.75, 4000: 0.80 },
        color: '#6b4423',
        category: 'treatment',
        description: 'Thick fabric furniture upholstery'
    },
    'leather_upholstery': {
        name: 'Leather Upholstery',
        absorption: { 125: 0.15, 250: 0.25, 500: 0.35, 1000: 0.45, 2000: 0.50, 4000: 0.45 },
        color: '#964b00',
        category: 'treatment',
        description: 'Natural leather seating surfaces'
    },
    'foam_panel': {
        name: 'Foam Panel',
        absorption: { 125: 0.12, 250: 0.45, 500: 0.80, 1000: 0.95, 2000: 0.90, 4000: 0.85 },
        color: '#2f2f2f',
        category: 'treatment',
        description: 'Acoustic foam treatment panel'
    },
    'rockwool_panel': {
        name: 'Rockwool Panel',
        absorption: { 125: 0.25, 250: 0.70, 500: 0.90, 1000: 0.95, 2000: 0.98, 4000: 0.95 },
        color: '#8b7355',
        category: 'treatment',
        description: 'Mineral wool acoustic panel'
    },
    'fiberglass_panel': {
        name: 'Fiberglass Panel',
        absorption: { 125: 0.17, 250: 0.86, 500: 0.99, 1000: 0.99, 2000: 0.99, 4000: 0.99 },
        color: '#f0e68c',
        category: 'treatment',
        description: 'Fiberglass acoustic insulation panel'
    },
    'perforated_metal': {
        name: 'Perforated Metal',
        absorption: { 125: 0.15, 250: 0.25, 500: 0.40, 1000: 0.50, 2000: 0.50, 4000: 0.45 },
        color: '#708090',
        category: 'treatment',
        description: 'Perforated metal panel with backing'
    }
};

// Material categories for filtering and organization
window.MATERIAL_CATEGORIES = {
    'structural': {
        name: 'Structural Materials',
        description: 'Basic building materials',
        icon: '🏗️'
    },
    'wall': {
        name: 'Wall Materials', 
        description: 'Wall surface treatments',
        icon: '🧱'
    },
    'floor': {
        name: 'Floor Materials',
        description: 'Floor surface materials',
        icon: '🏠'
    },
    'treatment': {
        name: 'Acoustic Treatments',
        description: 'Specialized acoustic materials',
        icon: '🎵'
    }
};

// Utility functions
window.MaterialUtils = {
    // Get materials by category
    getMaterialsByCategory: (category) => {
        return Object.entries(window.MATERIALS)
            .filter(([key, material]) => material.category === category)
            .reduce((acc, [key, material]) => {
                acc[key] = material;
                return acc;
            }, {});
    },

    // Calculate average absorption coefficient
    calculateAverageAbsorption: (materialKey) => {
        const material = window.MATERIALS[materialKey];
        if (!material) return 0;
        
        const absorptions = Object.values(material.absorption);
        return absorptions.reduce((sum, val) => sum + val, 0) / absorptions.length;
    },

    // Get material recommendation based on room characteristics
    getMaterialRecommendation: (roomType, surfaceType) => {
        const recommendations = {
            'studio': {
                'floor': 'carpet',
                'wall': 'acoustic_panel',
                'ceiling': 'foam_panel'
            },
            'home_theater': {
                'floor': 'carpet',
                'wall': 'fabric_upholstery',
                'ceiling': 'acoustic_panel'
            },
            'office': {
                'floor': 'carpet',
                'wall': 'plasterboard',
                'ceiling': 'acoustic_panel'
            },
            'garage': {
                'floor': 'concrete',
                'wall': 'brick',
                'ceiling': 'plasterboard'
            },
            'living_room': {
                'floor': 'hardwood',
                'wall': 'plaster',
                'ceiling': 'plasterboard'
            },
            'concert_hall': {
                'floor': 'hardwood',
                'wall': 'solid_wood',
                'ceiling': 'plaster'
            }
        };
        
        return recommendations[roomType]?.[surfaceType] || 'plasterboard';
    },

    // Get absorption coefficient for specific frequency
    getAbsorptionAtFrequency: (materialKey, frequency) => {
        const material = window.MATERIALS[materialKey];
        if (!material) return 0.05; // Default minimal absorption
        
        // Find closest frequency
        const frequencies = Object.keys(material.absorption).map(Number);
        const closest = frequencies.reduce((prev, curr) => 
            Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
        );
        
        return material.absorption[closest] || 0.05;
    },

    // Calculate total absorption for a surface
    calculateSurfaceAbsorption: (materialKey, area, frequency) => {
        const absorption = window.MaterialUtils.getAbsorptionAtFrequency(materialKey, frequency);
        return area * absorption;
    },

    // Get material color with opacity
    getMaterialColorWithOpacity: (materialKey, opacity = 1) => {
        const material = window.MATERIALS[materialKey];
        if (!material) return `rgba(128, 128, 128, ${opacity})`;
        
        const hex = material.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },

    // Get materials suitable for specific absorption range
    getMaterialsInAbsorptionRange: (minAbsorption, maxAbsorption, frequency = 1000) => {
        return Object.entries(window.MATERIALS).filter(([key, material]) => {
            const absorption = material.absorption[frequency] || 0;
            return absorption >= minAbsorption && absorption <= maxAbsorption;
        });
    },

    // Calculate NRC (Noise Reduction Coefficient)
    calculateNRC: (materialKey) => {
        const material = window.MATERIALS[materialKey];
        if (!material) return 0;
        
        const frequencies = [250, 500, 1000, 2000];
        const sum = frequencies.reduce((total, freq) => 
            total + (material.absorption[freq] || 0), 0
        );
        
        return Math.round((sum / frequencies.length) * 20) / 20; // Round to nearest 0.05
    }
};

console.log('Materials database loaded:', Object.keys(window.MATERIALS).length, 'materials');