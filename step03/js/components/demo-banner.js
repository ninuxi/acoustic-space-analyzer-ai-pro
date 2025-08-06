// Icon Components using React and SVG

const MicIcon = ({ size = 24, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }),
        React.createElement('path', { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
        React.createElement('line', { x1: "12", x2: "12", y1: "19", y2: "22" })
    )
);

const CameraIcon = ({ size = 24, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }),
        React.createElement('circle', { cx: "12", cy: "13", r: "3" })
    )
);

const BrainIcon = ({ size = 24, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }),
        React.createElement('path', { d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" })
    )
);

const PlayIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('polygon', { points: "6 3 20 12 6 21 6 3" })
    )
);

const PauseIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('rect', { x: "14", y: "4", width: "4", height: "16", rx: "1" }),
        React.createElement('rect', { x: "6", y: "4", width: "4", height: "16", rx: "1" })
    )
);

const StopIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('rect', { x: "5", y: "5", width: "14", height: "14", rx: "2" })
    )
);

const SettingsIcon = ({ size = 24, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
        React.createElement('circle', { cx: "12", cy: "12", r: "3" })
    )
);

const DownloadIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
        React.createElement('polyline', { points: "7 10 12 15 17 10" }),
        React.createElement('line', { x1: "12", x2: "12", y1: "15", y2: "3" })
    )
);

const UploadIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
        React.createElement('polyline', { points: "17 8 12 3 7 8" }),
        React.createElement('line', { x1: "12", x2: "12", y1: "3", y2: "15" })
    )
);

const RotateCcwIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
        React.createElement('path', { d: "M3 3v5h5" })
    )
);

const KeyIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" }),
        React.createElement('path', { d: "m21 2-9.6 9.6" }),
        React.createElement('circle', { cx: "7.5", cy: "15.5", r: "5.5" })
    )
);

const GithubIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        className: className
    },
        React.createElement('path', { 
            d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" 
        })
    )
);

const VolumeIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
        React.createElement('path', { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
        React.createElement('path', { d: "M19.07 4.93a10 10 0 0 1 0 14.14" })
    )
);

const WaveformIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M2 12h4l3-9 4 18 3-9h4" })
    )
);

const EyeIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
        React.createElement('circle', { cx: "12", cy: "12", r: "3" })
    )
);

const FilterIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('polygon', { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })
    )
);

const BarChartIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('line', { x1: "12", x2: "12", y1: "20", y2: "10" }),
        React.createElement('line', { x1: "18", x2: "18", y1: "20", y2: "4" }),
        React.createElement('line', { x1: "6", x2: "6", y1: "20", y2: "16" })
    )
);

const ZapIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('polygon', { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
    )
);

const CheckIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('polyline', { points: "20 6 9 17 4 12" })
    )
);

const XIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "M18 6 6 18" }),
        React.createElement('path', { d: "m6 6 12 12" })
    )
);

const AlertTriangleIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('path', { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
        React.createElement('path', { d: "M12 9v4" }),
        React.createElement('path', { d: "m12 17 .01 0" })
    )
);

const InfoIcon = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className
    },
        React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
        React.createElement('path', { d: "M12 16v-4" }),
        React.createElement('path', { d: "m12 8 .01 0" })
    )
);

// Animated Icons
const LoadingSpinner = ({ size = 20, className = "" }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: `animate-spin ${className}`
    },
        React.createElement('path', { d: "M21 12A9 9 0 1 1 12 3" })
    )
);

const PulsingDot = ({ size = 8, className = "", color = "currentColor" }) => (
    React.createElement('div', {
        className: `animate-pulse ${className}`,
        style: {
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%'
        }
    })
);