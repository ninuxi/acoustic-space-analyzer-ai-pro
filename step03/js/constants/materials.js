// Material Database with Acoustic Properties
const MATERIALS = {
    'plasterboard': { 
        name: 'Plasterboard', 
        absorption: { 125: 0.29, 250: 0.10, 500: 0.05, 1000: 0.04, 2000: 0.07, 4000: 0.09 }, 
        color: '#e0e0e0',
        category: 'wall'
    },
    'solid_wood': { 
        name: 'Solid Wood', 
        absorption: { 125: 0.15, 250: 0.11, 500: 0.10, 1000: 0.07, 2000: 0.06, 4000: 0.07 }, 
        color: '#8b4513',
        category: 'wall'
    },
    'glass': { 
        name: 'Glass', 
        absorption: { 125: 0.35, 250: 0.25, 500: 0.18, 1000: 0.12, 2000: 0.07, 4000: 0.04 }, 
        color: '#87ceeb',
        category: 'wall'
    },
    'concrete': { 
        name: 'Concrete', 
        absorption: { 125: 0.01, 250: 0.01, 500: 0.02, 1000: 0.02, 2000: 0.03, 4000: 0.03 }, 
        color: '#808080',
        category: 'structural'
    },
    'carpet': { 
        name: 'Carpet', 
        absorption: { 125: 0.08, 250: 0.24, 500: 0.57, 1000: 0.69, 2000: 0.71, 4000: 0.73 }, 
        color: '#8b0000',
        category: 'floor'
    },
    'heavy_curtain': { 
        name: 'Heavy Curtain', 
        absorption: { 125: 0.14, 250: 0.35, 500: 0.55, 1000: 0.72, 2000: 0.70, 4000: 0.65 }, 
        color: '#4b0082',
        category: 'treatment'
    },
    'acoustic_panel': { 
        name: 'Acoustic Panel', 
        absorption: { 125: 0.20, 250: 0.65, 500: 0.85, 1000: 0.95, 2000: 0.95, 4000: 0.90 }, 
        color: '#2f4f4f',
        category: 'treatment'
    },
    'plaster': { 
        name: 'Plaster', 
        absorption: { 125: 0.02, 250: 0.02, 500: 0.03, 1000: 0.04, 2000: 0.05, 4000: 0.05 }, 
        color: '#f5f5dc',
        category: 'wall'
    },
    'brick': { 
        name: 'Brick', 
        absorption: { 125: 0.03, 250: 0.03, 500: 0.03, 1000: 0.04, 2000: 0.05, 4000: 0.07 }, 
        color: '#a52a2a',
        category: 'wall'
    },
    'hardwood': { 
        name: 'Hardwood Floor', 
        absorption: { 125: 0.04, 250: 0.04, 500: 0.07, 1000: 0.06, 2000: 0.06, 4000: 0.07 }, 
        color: '#daa520',
        category: 'floor'
    },
    // Additional professional materials
    'ceramic_tile': {
        name: 'Ceramic Tile',
        absorption: { 125: 0.01, 250: 0.01, 500: 0.01, 1000: 0.02, 2000: 0.02, 4000: 0.02 },
        color: '#f8f8ff',
        category: 'floor'
    },
    'marble': {
        name: 'Marble',
        absorption: { 125: 0.01, 250: 0.01, 500: 0.01, 1000: 0.02, 2000: 0.02, 4000: 0.02 },
        color: '#ffffff',
        category: 'floor'
    },
    'vinyl_flooring': {
        name: 'Vinyl Flooring',
        absorption: { 125: 0.02, 250: 0.03, 500: 0.03, 1000: 0.03, 2000: 0.03, 4000: 0.02 },
        color: '#d2b48c',
        category: 'floor'
    },
    'metal_surface': {
        name: 'Metal Surface',
        absorption: { 125: 0.05, 250: 0.04, 500: 0.02, 1000: 0.03, 2000: 0.05, 4000: 0.05 },
        color: '#c0c0c0',
        category: 'structural'
    },
    'fabric_upholstery': {
        name: 'Fabric Upholstery',
        absorption: { 125: 0.08, 250: 0.25, 500: 0.45, 1000: 0.65, 2000: 0.75, 4000: 0.80 },
        color: '#6b4423',
        category: 'treatment'
    },
    'leather_upholstery': {
        name: 'Leather Upholstery',
        absorption: { 125: 0.15, 250: 0.25, 500: 0.35, 1000: 0.45, 2000: 0.50, 4000: 0.45 },
        color: '#964b00',
        category: 'treatment'
    },
    'foam_panel': {
        name: 'Foam Panel',
        absorption: { 125: 0.12, 250: 0.45, 500: 0.80, 1000: 0.95, 2000: 0.90, 4000: 0.85 },
        color: '#2f2f2f',
        category: 'treatment'
    },
    'rockwool_panel': {
        name: 'Rockwool Panel',
        absorption: { 125: 0.25, 250: 0.70, 500: 0.90, 1000: 0.95, 2000: 0.98, 4000: 0.95 },
        color: '#8b7355',
        category: 'treatment'
    }
};

// Material categories for filtering
const MATERIAL_CATEGORIES = {
    'structural': 'Structural Materials',
    'wall': 'Wall Materials', 
    'floor': 'Floor Materials',
    'treatment': 'Acoustic Treatments'
};

// Get materials by category
const getMaterialsByCategory = (category) => {
    return Object.entries(MATERIALS)
        .filter(([key, material]) => material.category === category)
        .reduce((acc, [key, material]) => {
            acc[key] = material;
            return acc;
        }, {});
};

// Calculate average absorption coefficient
const calculateAverageAbsorption = (materialKey) => {
    const material = MATERIALS[materialKey];
    if (!material) return 0;
    
    const absorptions = Object.values(material.absorption);
    return absorptions.reduce((sum, val) => sum + val, 0) / absorptions.length;
};

// Get material recommendation based on room characteristics
const getMaterialRecommendation = (roomType, surfaceType) => {
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
        }
    };
    
    return recommendations[roomType]?.[surfaceType] || 'plasterboard';
};