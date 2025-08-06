// Demo Banner Component
window.DemoBanner = () => {
    const { useState, useEffect } = React;
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setTimeLeft(`${hours}:${minutes}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    return React.createElement('div', {
        className: "demo-banner text-center py-3 text-white font-bold text-sm relative overflow-hidden cursor-pointer",
        onClick: () => setIsVisible(false)
    },
        React.createElement('div', {
            className: "relative z-10 flex items-center justify-center space-x-4"
        },
            React.createElement('span', { className: "animate-bounce" }, '🎙️'),
            React.createElement('span', null, 'ONLINE DEMO'),
            React.createElement('span', { className: "hidden sm:inline" }, '•'),
            React.createElement('span', { className: "hidden sm:inline" }, 'Acoustic Space Analyzer AI Pro'),
            React.createElement('span', { className: "text-yellow-300" }, '•'),
            React.createElement('span', { className: "font-mono text-xs" }, timeLeft),
            React.createElement('button', {
                className: "ml-4 hover:bg-white/20 rounded p-1 transition-colors",
                onClick: (e) => {
                    e.stopPropagation();
                    setIsVisible(false);
                }
            }, '✕')
        )
    );
};

console.log('DemoBanner component loaded');