# Acoustic Space Analyzer AI Pro 🎚️

> **[🇺🇸 English Version](README_EN.md)** | **[🌐 Live Demo](https://ninuxi.github.io/acoustic-space-analyzer-ai-pro)**

<img width="1413" height="774" alt="Screenshot 2025-07-30 alle 16 40 03" src="https://github.com/user-attachments/assets/449980bb-71ab-4efb-ac24-6c4b58504ac7" />

Strumento professionale di analisi acustica con generazione di catena DSP basata su IA.

## ✨ **Funzionalità principali**

- 🎤 **Analisi spettrale in tempo reale** - FFT ad alta risoluzione (16384 punti)
- 📐 **Scansione 3D dello spazio acustico** - Supporto .usdz, .ply, .obj, .glb, .json
- 🧠 **Generazione AI di catene DSP** - Powered by OpenRouter/Groq
- 📊 **Equalizzatore parametrico 16 bande** - Controllo preciso delle frequenze
- 🎚️ **Processori DSP professionali** - EQ, Compressor, Limiter, Gate, Reverb, Delay
- 📈 **Calcolo RT60 automatico** - Basato sui materiali assegnati
- 🇮🇹 **Interfaccia completamente in italiano**
- 📱 **Responsive design** - Funziona su desktop e mobile
- 💾 **Esportazione risultati JSON** - Per backup e condivisione

## 🚀 **Demo Live**

**[🌐 Prova subito la demo online](https://ninuxi.github.io/acoustic-space-analyzer-ai-pro)**

- ✅ Nessuna installazione richiesta
- ✅ Demo garage pre-caricata
- ✅ Tutte le funzionalità attive
- ✅ Compatibile con tutti i browser moderni

## 🛠️ **Tecnologie utilizzate**

- **Frontend**: React 18 (via CDN), Tailwind CSS
- **3D Rendering**: Three.js r128
- **Audio Processing**: Web Audio API nativa
- **AI Integration**: OpenRouter API, Groq API
- **File Support**: GLTFLoader, JSON parsing
- **Responsive**: Mobile-first design

## 📖 **Come utilizzare**

### 1️⃣ **Configurazione API AI**
```bash
# Ottieni una API key gratuita:
- OpenRouter: https://openrouter.ai
- Groq: https://console.groq.com

# Configura nel pannello "Configurazione API AI"
```

### 2️⃣ **Processo di analisi**
1. **Inizializza il microfono** - Consenti l'accesso audio
2. **Registra pink noise** - 15 secondi di campionamento
3. **Carica scansione 3D** - O usa la demo del garage
4. **Assegna materiali** - Seleziona i materiali per ogni superficie
5. **Genera DSP Chain** - L'AI analizza e suggerisce la catena ottimale

### 3️⃣ **Risultati ottenuti**
- Catena DSP ottimizzata
- Curva EQ a 16 bande
- Score di qualità (1-10)
- Lista problemi identificati
- Suggerimenti software specifici
- File JSON esportabile

## 🏗️ **Configurazione sviluppo**

```bash
# Clona il repository
git clone https://github.com/ninuxi/acoustic-space-analyzer-ai-pro.git

# Nessuna dipendenza necessaria (tutto via CDN)
# Apri semplicemente index.html nel browser

# Per sviluppo locale con server:
npx serve .
# Oppure
python -m http.server 8000
```

## 📁 **Struttura progetto**

```
acoustic-space-analyzer-ai-pro/
├── index.html              # 🇮🇹 App principale (italiano)
├── en/index.html           # 🇺🇸 Versione inglese
├── samples/                # File demo 3D
├── README.md              # Documentazione italiana
├── README_EN.md           # Documentazione inglese
└── LICENSE                # Licenza MIT
```

## 🎯 **Formati supportati**

### Audio
- **Input**: Microfono (Web Audio API)
- **Analisi**: Pink noise reference, FFT 16384 punti
- **Output**: JSON con dati spettrali completi

### 3D Scanning
- **.usdz** - iPhone LiDAR Scanner
- **.ply** - Point cloud data
- **.obj** - Wavefront 3D object
- **.glb** - Binary glTF
- **.json** - Custom room data format

### Export
- **JSON completo** - Tutti i dati di analisi
- **Configurazione EQ** - 16 bande parametriche
- **Catena DSP** - Processori e parametri

## 🧠 **Capacità AI**

L'intelligenza artificiale integrata è specializzata in:

- **Analisi acustica avanzata** - Identificazione problemi modali
- **Ottimizzazione DSP** - Catene di processamento ottimali
- **Correzione software-only** - Nessun trattamento fisico
- **Suggerimenti professionali** - Plugin VST, room correction software
- **Parametrizzazione precisa** - Valori ottimali per ogni processore

## 🗺️ **Roadmap**

### Versione 2.0
- [ ] **Supporto ASIO/CoreAudio** - Interfacce audio professionali  
- [ ] **Analisi multi-punto** - Sweep automatizzati
- [ ] **Esportazione VST preset** - Integrazione DAW diretta
- [ ] **Modalità confronto A/B** - Before/after analysis
- [ ] **Database materiali esteso** - Libreria coefficienti acustici

### Versione 2.5
- [ ] **Machine Learning locale** - TensorFlow.js integration
- [ ] **Predizione RT60 avanzata** - Algoritmi proprietari
- [ ] **Simulazione ray-tracing** - Modellazione riflessi accurata
- [ ] **Plugin ecosystem** - Architettura modulare

### Versione 3.0
- [ ] **Realtà aumentata** - Visualizzazione trattamenti AR
- [ ] **Collaboration tools** - Condivisione progetti team
- [ ] **API pubblica** - Integrazione terze parti
- [ ] **Desktop app** - Versione Electron standalone

## 🤝 **Contribuire**

Contributi benvenuti! 

```bash
# Fork il repository
# Crea un branch per la tua feature
git checkout -b feature/nuova-funzionalita

# Commit delle modifiche
git commit -m "Aggiunge nuova funzionalità"

# Push e apri una Pull Request
```

### Aree di contributo
- 🐛 **Bug fixes** - Segnalazioni e correzioni
- ✨ **Nuove funzionalità** - Espansione capacità
- 🌍 **Localizzazione** - Traduzioni aggiuntive
- 📚 **Documentazione** - Guide e tutorial
- 🎨 **UI/UX** - Miglioramenti interfaccia

## 📄 **Licenza**

MIT License - Libero utilizzo per scopi non commerciali.

Vedi [LICENSE](LICENSE) per i dettagli completi.

## 🎖️ **Crediti**


- **Architettura**: React + Three.js + Web Audio API
- **AI Integration**: OpenRouter, Groq
- **Design**: Tailwind CSS, Gradient aesthetics  
- **3D Rendering**: Three.js community
- **Audio DSP**: Web Audio API specifications

---

<div align="center">

**[🌐 Demo Live](https://ninuxi.github.io/acoustic-space-analyzer-ai-pro)** • **[📖 English Docs](README_EN.md)** • **[🐛 Issues](https://github.com/ninuxi/acoustic-space-analyzer-ai-pro/issues)** • **[⭐ Star](https://github.com/ninuxi/acoustic-space-analyzer-ai-pro)**

Made with 🎚️ for the audio community

</div>
