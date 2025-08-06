// File: src/components/analysis/SystemTuner.jsx

import React, { useState } from 'react';
import { MeasurementUtils } from '../../utils/measurement-utils.js';

const SystemTuner = ({ audioContext }) => {
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [measurementData, setMeasurementData] = useState(null);
    const [error, setError] = useState(null);

    const handleMeasure = async () => {
        setIsMeasuring(true);
        setError(null);
        setMeasurementData(null);
        try {
            const data = await MeasurementUtils.measureTransferFunction(audioContext);
            setMeasurementData(data);
        } catch (err) {
            setError(err.message);
            alert(err.message);
        } finally {
            setIsMeasuring(false);
        }
    };

    const GraphPlaceholder = ({ title }) => (
        <div className="bg-gray-50 border rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-gray-500">{title} Plot</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold gradient-text mb-2">System Tuner & Alignment</h2>
                <p className="text-gray-600 text-lg">Measure transfer function to align speaker systems.</p>
            </div>

            <div className="card bg-white border border-gray-200">
                <div className="card-body">
                    <div className="flex justify-center">
                        <button onClick={handleMeasure} disabled={isMeasuring} className="control-btn control-btn-primary text-lg py-4 px-8 rounded-lg">
                            {isMeasuring ? 'Measuring...' : 'Measure Transfer Function'}
                        </button>
                    </div>
                    {measurementData && (
                         <div className="text-center mt-4 text-xl font-bold text-green-600 animate-fade-in">
                           Detected Delay: {measurementData.delay} ms
                        </div>
                    )}
                    {error && <div className="text-center mt-4 text-red-500">{error}</div>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="card bg-white border border-gray-200">
                    <div className="card-header"><h3 className="text-xl font-semibold">Magnitude & Phase</h3></div>
                    <div className="card-body space-y-4">
                        <GraphPlaceholder title="Magnitude (Frequency Response)" />
                        <GraphPlaceholder title="Phase Response" />
                    </div>
                </div>
                <div className="card bg-white border border-gray-200">
                    <div className="card-header"><h3 className="text-xl font-semibold">Impulse Response</h3></div>
                    <div className="card-body">
                        <GraphPlaceholder title="Impulse Response" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemTuner;