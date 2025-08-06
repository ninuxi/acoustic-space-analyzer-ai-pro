// File: src/components/3d/MaterialAssignment.jsx

import React, { useState, useEffect } from 'react';
import { MATERIALS, MATERIAL_CATEGORIES, MaterialUtils } from '../../constants/materials.js';
import { CheckIcon } from '../ui/Icons.jsx';

const MaterialAssignment = ({ roomModel, assignments, onAssignmentsChange }) => {
    const [surfaceTypes, setSurfaceTypes] = useState([]);
    
    useEffect(() => {
        if (roomModel?.analysis?.surfaces) {
            const types = [...new Set(roomModel.analysis.surfaces.map(s => s.type))];
            // Assicura che i tipi principali siano presenti
            ['floor', 'ceiling', 'wall'].forEach(type => {
                if (!types.includes(type)) types.push(type);
            });
            setSurfaceTypes(types);
        }
    }, [roomModel]);

    if (!roomModel) {
        return (
            <div className="card bg-white border border-gray-200">
                <div className="card-body text-center py-16">
                    <div className="text-4xl mb-4">✋</div>
                    <h3 className="text-2xl font-bold text-gray-300">Waiting for 3D Model</h3>
                    <p className="text-gray-600 mt-2">Please load a 3D model in the previous tab to proceed.</p>
                </div>
            </div>
        );
    }

    const handleMaterialChange = (surfaceType, materialKey) => {
        onAssignmentsChange({ ...assignments, [surfaceType]: materialKey });
    };
    
    const materialOptions = Object.entries(MATERIAL_CATEGORIES).map(([catKey, category]) => {
        const materialsInCategory = Object.entries(MaterialUtils.getMaterialsByCategory(catKey));
        return {
            label: category.name,
            options: materialsInCategory.map(([matKey, material]) => ({
                value: matKey,
                label: material.name
            }))
        };
    });

    const SurfaceCard = ({ surfaceType }) => {
        const surfaces = roomModel.analysis.surfaces.filter(s => s.type === surfaceType);
        const totalArea = surfaces.reduce((sum, s) => sum + s.area, 0);
        if (totalArea < 0.01) return null;

        const currentMaterialKey = assignments[surfaceType] || 'plasterboard';
        const currentMaterial = MATERIALS[currentMaterialKey];
        const nrc = MaterialUtils.calculateNRC(currentMaterialKey);
        const icons = { floor: '👞', ceiling: '💡', wall: '🧱' };

        return (
            <div className="card hover-lift transition-all duration-300">
                <div className="card-header flex items-center justify-between">
                    <h4 className="text-xl font-semibold flex items-center">
                        <span className="text-2xl mr-3">{icons[surfaceType] || '📐'}</span>
                        <span className="capitalize">{`${surfaceType} Surfaces`}</span>
                    </h4>
                    <div className="badge badge-info">{`${surfaces.length} surfaces`}</div>
                </div>
                <div className="card-body space-y-4">
                    <div className="text-center p-4 bg-gray-200 rounded-lg">
                        <div className="text-3xl font-bold text-cyan-400">{`${totalArea.toFixed(1)}m²`}</div>
                        <div className="text-sm text-gray-600">Total Surface Area</div>
                    </div>
                    <div>
                        <label htmlFor={`material-${surfaceType}`} className="block text-sm font-medium text-gray-600 mb-2">
                            Assigned Material
                        </label>
                        <select
                            id={`material-${surfaceType}`}
                            value={currentMaterialKey}
                            onChange={(e) => handleMaterialChange(surfaceType, e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-500"
                        >
                            {materialOptions.map(group => (
                                <optgroup key={group.label} label={group.label}>
                                    {group.options.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    {currentMaterial && (
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-white rounded-lg">
                                <div className="text-lg font-bold text-green-400">{nrc.toFixed(2)}</div>
                                <div className="text-xs text-gray-500">NRC</div>
                            </div>
                            <div className="p-3 bg-white rounded-lg">
                                <div className="material-preview w-full h-4 rounded-full" style={{ backgroundColor: currentMaterial.color }} />
                                <div className="text-xs text-gray-500 mt-1">Appearance</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text mb-2">Material Assignment</h2>
                <p className="text-gray-600 text-lg">Assign acoustic materials to your room surfaces</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {surfaceTypes.map(type => <SurfaceCard key={type} surfaceType={type} />)}
            </div>
            
            <div className="status-card status-card-success p-4 rounded-lg mt-8">
                <div className="flex items-center">
                    <CheckIcon size={20} className="mr-2" />
                    <span className="font-semibold">Materials Assigned</span>
                    <span className="ml-2 text-sm opacity-75">- Ready for AI Analysis</span>
                </div>
            </div>
        </div>
    );
};

export default MaterialAssignment;