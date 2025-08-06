// File: src/components/3d/MaterialAssignment.jsx

window.MaterialAssignment = ({ roomModel, assignments, onAssignmentsChange }) => {
    const { useState, useEffect } = React;

    if (!roomModel) {
        return React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-body text-center py-16' },
                React.createElement('div', { className: 'text-4xl mb-4' }, '✋'),
                React.createElement('h3', { className: 'text-2xl font-bold text-gray-300' }, 'Waiting for 3D Model'),
                React.createElement('p', { className: 'text-gray-400 mt-2' }, 'Please load a 3D model in the previous tab to proceed.')
            )
        );
    }

    const [surfaceTypes, setSurfaceTypes] = useState([]);
    
    useEffect(() => {
        if (roomModel?.analysis?.surfaces) {
            const types = [...new Set(roomModel.analysis.surfaces.map(s => s.type))];
            
            ['floor', 'ceiling', 'wall'].forEach(type => {
                if (!types.includes(type)) types.push(type);
            });
            
            setSurfaceTypes(types);
        }
    }, [roomModel]);

    const handleMaterialChange = (surfaceType, materialKey) => {
        onAssignmentsChange({
            ...assignments,
            [surfaceType]: materialKey
        });
    };
    
    const materialOptions = Object.entries(window.MATERIAL_CATEGORIES).map(([catKey, category]) => {
        const materialsInCategory = Object.entries(window.MaterialUtils.getMaterialsByCategory(catKey));
        return {
            label: category.name,
            options: materialsInCategory.map(([matKey, material]) => ({
                value: matKey,
                label: material.name
            }))
        };
    });

    const renderSurfaceCard = (surfaceType) => {
        const surfaces = roomModel.analysis.surfaces.filter(s => s.type === surfaceType);
        const totalArea = surfaces.reduce((sum, s) => sum + s.area, 0);
        if (totalArea < 0.01) return null; // Don't render cards for empty surface types
        
        const currentMaterialKey = assignments[surfaceType] || 'plasterboard';
        const currentMaterial = window.MATERIALS[currentMaterialKey];
        const nrc = window.MaterialUtils.calculateNRC(currentMaterialKey);

        const icons = {
            floor: '👞',
            ceiling: '💡',
            wall: '🧱'
        };

        return React.createElement('div', { 
            key: surfaceType, 
            className: 'card hover-lift transition-all duration-300' 
        },
            React.createElement('div', { className: 'card-header flex items-center justify-between' },
                React.createElement('h4', { className: 'text-xl font-semibold flex items-center' },
                    React.createElement('span', { className: 'text-2xl mr-3' }, icons[surfaceType] || '📐'),
                    React.createElement('span', { className: 'capitalize' }, `${surfaceType} Surfaces`)
                ),
                React.createElement('div', { className: 'badge badge-info' }, `${surfaces.length} surfaces`)
            ),
            React.createElement('div', { className: 'card-body space-y-4' },
                React.createElement('div', { className: 'text-center p-4 bg-gray-700/50 rounded-lg' },
                    React.createElement('div', { className: 'text-3xl font-bold text-cyan-400' }, 
                        `${totalArea.toFixed(1)}m²`
                    ),
                    React.createElement('div', { className: 'text-sm text-gray-400' }, 'Total Surface Area')
                ),
                React.createElement('div', null,
                    React.createElement('label', { 
                        htmlFor: `material-${surfaceType}`, 
                        className: 'block text-sm font-medium text-gray-400 mb-2' 
                    }, 'Assigned Material'),
                    React.createElement('select', {
                        id: `material-${surfaceType}`,
                        value: currentMaterialKey,
                        onChange: (e) => handleMaterialChange(surfaceType, e.target.value),
                        className: 'w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all'
                    },
                        materialOptions.map(group => 
                            React.createElement('optgroup', { key: group.label, label: group.label },
                                group.options.map(option => 
                                    React.createElement('option', { key: option.value, value: option.value }, option.label)
                                )
                            )
                        )
                    )
                ),
                currentMaterial && React.createElement('div', { className: 'grid grid-cols-2 gap-4 text-center' },
                    React.createElement('div', { className: 'p-3 bg-gray-800 rounded-lg' },
                        React.createElement('div', { className: 'text-lg font-bold text-green-400' }, nrc.toFixed(2)),
                        React.createElement('div', { className: 'text-xs text-gray-500' }, 'NRC')
                    ),
                    React.createElement('div', { className: 'p-3 bg-gray-800 rounded-lg' },
                        React.createElement('div', { className: 'material-preview w-full h-4 rounded-full', style: { backgroundColor: currentMaterial.color } }),
                        React.createElement('div', { className: 'text-xs text-gray-500 mt-1' }, 'Appearance')
                    )
                )
            )
        );
    };

    return React.createElement('div', { className: 'space-y-8' },
        React.createElement('div', { className: 'text-center' },
            React.createElement('h2', { className: 'text-3xl font-bold gradient-text mb-2' }, 'Material Assignment'),
            React.createElement('p', { className: 'text-gray-400 text-lg' }, 'Assign acoustic materials to your room surfaces')
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
            surfaceTypes.map(type => renderSurfaceCard(type))
        ),
        React.createElement('div', { className: 'status-card status-card-success p-4 rounded-lg mt-8' },
            React.createElement('div', { className: 'flex items-center' },
                React.createElement(window.Icons.CheckIcon, { size: 20, className: 'mr-2' }),
                React.createElement('span', { className: 'font-semibold' }, 'Materials Assigned'),
                React.createElement('span', { className: 'ml-2 text-sm opacity-75' }, '- Ready for AI Analysis')
            )
        )
    );
};

console.log('MaterialAssignment component loaded');