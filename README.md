# Acoustic Space Analyzer AI Pro 🎚️

> **[🇮🇹 Versione Italiana](README_ita.md)** | **[🌐 Live Demo](https://ninuxi.github.io/acoustic-space-analyzer-ai-pro)**

<img width="1413" height="774" alt="Screenshot 2025-07-30 alle 16 40 03" src="https://github.com/user-attachments/assets/449980bb-71ab-4efb-ac24-6c4b58504ac7" />

Professional acoustic analysis tool with AI-based DSP chain generation.

## ✨ **Key Features**

- 🎤 **Real-time spectral analysis** - High-resolution FFT (16384 points)
- 📐 **3D acoustic space scanning** - Support for .usdz, .ply, .obj, .glb, .json
- 🧠 **AI DSP chain generation** - Powered by OpenRouter/Groq
- 📊 **16-band parametric equalizer** - Precise frequency control
- 🎚️ **Professional DSP processors** - EQ, Compressor, Limiter, Gate, Reverb, Delay
- 📈 **Automatic RT60 calculation** - Based on assigned materials
- 🇬🇧 **Full English interface**
- 📱 **Responsive design** - Works on desktop and mobile
- 💾 **JSON results export** - For backup and sharing

## 🚀 **Live Demo**

**[🌐 Try the online demo now](https://ninuxi.github.io/acoustic-space-analyzer-ai-pro/en)**

- ✅ No installation required
- ✅ Pre-loaded garage demo
- ✅ All features active
- ✅ Compatible with all modern browsers

## 🛠️ **Technologies Used**

- **Frontend**: React 18 (via CDN), Tailwind CSS
- **3D Rendering**: Three.js r128
- **Audio Processing**: Native Web Audio API
- **AI Integration**: OpenRouter API, Groq API
- **File Support**: GLTFLoader, JSON parsing
- **Responsive**: Mobile-first design

## 📖 **How to Use**

### 1️⃣ **AI API Configuration**
```bash
# Get a free API key:
- OpenRouter: https://openrouter.ai
- Groq: https://console.groq.com

# Configure in the "AI API Configuration" panel
```

### 2️⃣ **Analysis Process**
1. **Initialize microphone** - Allow audio access
2. **Record pink noise** - 15 seconds of sampling
3. **Upload 3D scan** - Or use the garage demo
4. **Assign materials** - Select materials for each surface
5. **Generate DSP Chain** - AI analyzes and suggests optimal chain

### 3️⃣ **Results Obtained**
- Optimized DSP chain
- 16-band EQ curve
- Quality score (1-10)
- List of identified issues
- Specific software suggestions
- Exportable JSON file

## 🏗️ **Development Setup**

```bash
# Clone the repository
git clone https://github.com/ninuxi/acoustic-space-analyzer-ai-pro.git

# No dependencies needed (everything via CDN)
# Simply open index.html in your browser

# For local development with server:
npx serve .
# Or
python -m http.server 8000
```

## 📁 **Project Structure**

```
acoustic-space-analyzer-ai-pro/
├── index.html              # 🇮🇹 Main app (Italian)
├── en/index.html           # 🇺🇸 English version
├── samples/                # Demo 3D files
├── README.md              # Italian documentation
├── README_EN.md           # English documentation
└── LICENSE                # MIT License
```

## 🎯 **Supported Formats**

### Audio
- **Input**: Microphone (Web Audio API)
- **Analysis**: Pink noise reference, 16384-point FFT
- **Output**: JSON with complete spectral data

### 3D Scanning
- **.usdz** - iPhone LiDAR Scanner
- **.ply** - Point cloud data
- **.obj** - Wavefront 3D object
- **.glb** - Binary glTF
- **.json** - Custom room data format

### Export
- **Complete JSON** - All analysis data
- **EQ Configuration** - 16 parametric bands
- **DSP Chain** - Processors and parameters

## 🧠 **AI Capabilities**

The integrated artificial intelligence specializes in:

- **Advanced acoustic analysis** - Modal problem identification
- **DSP optimization** - Optimal processing chains
- **Software-only correction** - No physical treatment
- **Professional suggestions** - VST plugins, room correction software
- **Precise parameterization** - Optimal values for each processor

## 🗺️ **Roadmap**

### Version 2.0
- [ ] **ASIO/CoreAudio support** - Professional audio interfaces
- [ ] **Multi-point analysis** - Automated sweeps
- [ ] **VST preset export** - Direct DAW integration
- [ ] **A/B comparison mode** - Before/after analysis
- [ ] **Extended materials database** - Acoustic coefficients library

### Version 2.5
- [ ] **Local Machine Learning** - TensorFlow.js integration
- [ ] **Advanced RT60 prediction** - Proprietary algorithms
- [ ] **Ray-tracing simulation** - Accurate reflection modeling
- [ ] **Plugin ecosystem** - Modular architecture

### Version 3.0
- [ ] **Augmented Reality** - AR treatment visualization
- [ ] **Collaboration tools** - Team project sharing
- [ ] **Public API** - Third-party integration
- [ ] **Desktop app** - Standalone Electron version

## 🤝 **Contributing**

Contributions welcome!

```bash
# Fork the repository
# Create a branch for your feature
git checkout -b feature/new-functionality

# Commit your changes
git commit -m "Add new functionality"

# Push and open a Pull Request
```

### Contribution Areas
- 🐛 **Bug fixes** - Reports and corrections
- ✨ **New features** - Capability expansion
- 🌍 **Localization** - Additional translations
- 📚 **Documentation** - Guides and tutorials
- 🎨 **UI/UX** - Interface improvements

## 📄 **License**

MIT License - Free use for non-commercial purposes.

See [LICENSE](LICENSE) for complete details.

## 🎖️ **Credits**


- **Architecture**: React + Three.js + Web Audio API
- **AI Integration**: OpenRouter, Groq
- **Design**: Tailwind CSS, Gradient aesthetics
- **3D Rendering**: Three.js community
- **Audio DSP**: Web Audio API specifications

---

<div align="center">

**[🌐 Live Demo](https://ninuxi.github.io/acoustic-space-analyzer-ai-pro/en)** • **[📖 Italian Docs](README.md)** • **[🐛 Issues](https://github.com/ninuxi/acoustic-space-analyzer-ai-pro/issues)** • **[⭐ Star](https://github.com/ninuxi/acoustic-space-analyzer-ai-pro)**

Made with 🎚️ for the audio community

</div>

