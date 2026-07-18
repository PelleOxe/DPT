/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, RotateCw, Upload, Code, Sun, Moon, Share2, Search, Sparkles, X, Info, FileCode, Globe, History, Download, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { DEVICES } from './devices.js';
import { DEMO_PWAS } from './demoPWAs.js';
import { PWAButton } from './components/PWAButton.js';
import { DeviceFrame } from './components/DeviceFrame.js';
import { ShareModal } from './components/ShareModal.js';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
// Simple HTML template for customized testing code
const DEFAULT_STARTER_HTML = `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Min Anpassade PWA</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-center items-center p-6 text-center font-sans">
  <div class="max-w-xs bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-xl">
    <div class="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
      ⚡
    </div>
    <h1 class="text-xl font-bold tracking-tight">Anpassad Sandbox</h1>
    <p class="text-xs text-slate-400 mt-2 leading-relaxed">
      Ändra HTML-koden i redigeraren till vänster för att se dina ändringar uppdateras live här i simulatorn!
    </p>
    <div class="mt-5 pt-4 border-t border-slate-700/50 flex flex-col gap-2">
      <button onclick="alert('Du klickade på en knapp i sandboxen!')" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all">
        Klicka på mig
      </button>
    </div>
  </div>
</body>
</html>`;
const VERSION_HISTORY = [{
  version: 'v0.01.05',
  date: '2026-07-14',
  changes: ['Uppdaterat gränssnittet till Sleek Interface-tema med djupsvart mörkt läge.', 'Lagt till glassmorphism-kontroller och integrerat statusindikatorer i verktygsfältet.', 'Strömlinjeformat layout och färgkontraster för förbättrad visuell estetik.']
}, {
  version: 'v0.01.04',
  date: '2026-07-14',
  changes: ['Lagt till Dela-knapp med högupplöst QR-kodgenerator.', 'Bakat in app-favicon mitt i QR-koden.', 'Fintrimmat taktil knapp-press-effekt till exakt 80ms returrespons.', 'Säkerställt minsta teckenstorlek på 11px i hela applikationen.']
}, {
  version: 'v0.01.03',
  date: '2026-07-10',
  changes: ['Lagt till Light/Dark färgteman för testmiljön.', 'Skapat filuppladdningsruta med Drag & Drop-stöd för egna HTML-filer.', 'Lagt till interaktiv sandbox-kodredigerare för direktkodning.']
}, {
  version: 'v0.01.02',
  date: '2026-07-05',
  changes: ['Integrerat 4 kompletta offline-klara Demo-PWA:er (TaskFlow, VäderKoll, CalcSmart och Tre På Rad).', 'Skapat mockat gränssnitt för iOS statusfält, Android-navigering och dynamic islands.']
}, {
  version: 'v0.01.01',
  date: '2026-06-28',
  changes: ['Lagt till stöd för surfplattor som iPad Air, iPad Pro, Galaxy Tab och Lenovo.', 'Skapat automatisk storleksskalning ("Auto-Fit") för att passa alla skärmar.']
}, {
  version: 'v0.01.00',
  date: '2026-06-20',
  changes: ['Initial lansering av PWA-testverktyg.', 'Implementerat grundläggande iPhone-mallar i liggande och stående läge.']
}];
export default function App() {
  // Device Selection & Framing State
  const [selectedDeviceId, setSelectedDeviceId] = useState('iphone-14-pro');
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(0); // 0 means 'Auto-Fit'

  // PWA Content Source State
  const [pwaMode, setPwaMode] = useState('demo');
  const [selectedDemoId, setSelectedDemoId] = useState('todo-pwa');
  const [pwaUrl, setPwaUrl] = useState('https://example.com');
  const [customCode, setCustomCode] = useState(DEFAULT_STARTER_HTML);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedHtml, setUploadedHtml] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Sidebar Resizing State (for desktop)
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint in Tailwind is 1024px
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const startResizing = mouseDownEvent => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };
  useEffect(() => {
    const handleMouseMove = e => {
      if (!isResizing) return;
      const containerElement = document.getElementById('workspace-container');
      if (containerElement) {
        const rect = containerElement.getBoundingClientRect();
        // The new width is the distance from the left edge of the workspace-container to the mouse cursor
        const newWidth = e.clientX - rect.left;
        setSidebarWidth(Math.max(280, Math.min(newWidth, 640)));
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [deviceBrandFilter, setDeviceBrandFilter] = useState('all');

  // App settings (Theme, Modals)
  const [theme, setTheme] = useState('dark');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize Dark Mode Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Find currently active device object
  const currentDevice = DEVICES.find(d => d.id === selectedDeviceId) || DEVICES[0];

  // Filters device database
  const filteredDevices = DEVICES.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) || device.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = deviceTypeFilter === 'all' || device.type === deviceTypeFilter;
    const matchesBrand = deviceBrandFilter === 'all' || device.brand === deviceBrandFilter;
    return matchesSearch && matchesType && matchesBrand;
  });

  // Get active HTML content for rendering inside the iframe
  const getActiveHtmlContent = () => {
    if (pwaMode === 'demo') {
      const demo = DEMO_PWAS.find(p => p.id === selectedDemoId);
      return demo ? demo.html : '';
    }
    if (pwaMode === 'uploaded') {
      return uploadedHtml || `<!DOCTYPE html><html lang="sv"><body class="bg-slate-100 flex items-center justify-center min-h-screen text-slate-500 text-sm">Släpp en HTML-fil för att starta...</body></html>`;
    }
    if (pwaMode === 'custom') {
      return customCode;
    }
    return '';
  };

  // Get active PWA metadata title
  const getActivePwaTitle = () => {
    if (pwaMode === 'demo') {
      const demo = DEMO_PWAS.find(p => p.id === selectedDemoId);
      return demo ? demo.name : 'Demo PWA';
    }
    if (pwaMode === 'uploaded') {
      return uploadedFileName || 'Uppladdad fil';
    }
    if (pwaMode === 'custom') {
      return 'Sandlåda PWA';
    }
    return 'Extern länk';
  };

  // Open the active PWA/demo page in a new browser tab/window
  const handleOpenInNewTab = () => {
    if (pwaMode === 'url') {
      if (pwaUrl) {
        window.open(pwaUrl, '_blank');
      }
    } else {
      const htmlContent = getActiveHtmlContent();
      const blob = new Blob([htmlContent], {
        type: 'text/html;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  // Open the parent PWA Tester Pro application itself in a new tab (to bypass iframe sandboxing)
  const handleOpenAppInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  // Handle HTML drag-and-drop
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/html' || file.name.endsWith('.html')) {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target && typeof event.target.result === 'string') {
            setUploadedHtml(event.target.result);
            setUploadedFileName(file.name);
            setPwaMode('uploaded');
          }
        };
        reader.readAsText(file);
      } else {
        alert('Vänligen ladda upp en giltig .html-fil');
      }
    }
  };

  // Handle traditional file upload
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target && typeof event.target.result === 'string') {
          setUploadedHtml(event.target.result);
          setUploadedFileName(file.name);
          setPwaMode('uploaded');
        }
      };
      reader.readAsText(file);
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200",
    children: [/*#__PURE__*/_jsxs("header", {
      className: "sticky top-0 z-40 bg-white/90 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30",
          children: "T"
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-baseline gap-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-sm font-semibold tracking-tight text-slate-900 dark:text-white uppercase",
              children: "PWA TESTER PRO"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] text-slate-500 dark:text-slate-400 font-mono",
              children: "vers 0.01.05"
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[11px] text-slate-400 dark:text-slate-500 font-medium",
            children: "Verktyg f\xF6r plattformsverifiering \u2022 Offline-klar"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsxs("button", {
          className: "hidden md:flex pwa-button glass-panel dark:glass-panel bg-slate-100/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 px-3 py-1.5 rounded-full text-[11px] font-medium items-center gap-2 select-none text-slate-600 dark:text-slate-300",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-2 h-2 rounded-full bg-green-500 animate-pulse"
          }), "SYSTEM STATUS: ONLINE"]
        }), /*#__PURE__*/_jsxs(PWAButton, {
          variant: "ghost",
          onClick: () => setIsChangelogOpen(true),
          className: "flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400",
          title: "\xC4ndringslogg",
          children: [/*#__PURE__*/_jsx(History, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline",
            children: "Historik"
          })]
        }), /*#__PURE__*/_jsxs(PWAButton, {
          variant: "ghost",
          onClick: () => setIsInstallOpen(true),
          className: "flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400",
          title: "Installera appen",
          children: [/*#__PURE__*/_jsx(Download, {
            className: "w-4 h-4 animate-bounce"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline font-bold",
            children: "Installera"
          })]
        }), /*#__PURE__*/_jsxs(PWAButton, {
          variant: "ghost",
          onClick: handleOpenAppInNewTab,
          className: "flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium",
          title: "\xD6ppna PWA Tester Pro i ny flik f\xF6r att slippa iframe-begr\xE4nsningar",
          children: [/*#__PURE__*/_jsx(ExternalLink, {
            className: "w-4 h-4 text-indigo-600 dark:text-indigo-400"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline font-bold",
            children: "\xD6ppna i ny flik"
          })]
        }), /*#__PURE__*/_jsx("span", {
          className: "h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"
        }), /*#__PURE__*/_jsxs(PWAButton, {
          variant: "secondary",
          onClick: () => setIsShareOpen(true),
          className: "px-3.5 py-2 flex items-center gap-1.5",
          title: "Dela QR-kod",
          children: [/*#__PURE__*/_jsx(Share2, {
            className: "w-4 h-4 text-teal-500"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-xs font-bold hidden md:inline",
            children: "Dela app"
          })]
        }), /*#__PURE__*/_jsx(PWAButton, {
          variant: "icon",
          onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'),
          "aria-label": "Toggle f\xE4rgtema",
          title: theme === 'light' ? 'Byt till mörkt tema' : 'Byt till ljust tema',
          children: theme === 'light' ? /*#__PURE__*/_jsx(Moon, {
            className: "w-4 h-4 text-slate-700"
          }) : /*#__PURE__*/_jsx(Sun, {
            className: "w-4 h-4 text-amber-400"
          })
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      id: "workspace-container",
      className: "max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 relative items-stretch",
      children: [/*#__PURE__*/_jsxs("div", {
        className: `space-y-6 flex flex-col ${isSidebarCollapsed ? 'hidden' : ''}`,
        style: isLargeScreen ? {
          width: `${sidebarWidth}px`,
          flexShrink: 0,
          display: isSidebarCollapsed ? 'none' : 'flex'
        } : {
          display: isSidebarCollapsed ? 'none' : 'flex'
        },
        children: [/*#__PURE__*/_jsxs("div", {
          className: "bg-white/80 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-4.5 shadow-xs space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500",
              children: "1. V\xE4lj PWA-k\xE4lla"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
              children: "V\xE4lj vad du vill k\xF6ra i de simulerade enheterna"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: `grid ${sidebarWidth < 385 ? 'grid-cols-2' : 'grid-cols-4'} gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl`,
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => setPwaMode('demo'),
              className: `text-center py-2 text-[11px] font-bold rounded-lg transition-all ${pwaMode === 'demo' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`,
              children: "Inbyggda demoer"
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setPwaMode('url'),
              className: `text-center py-2 text-[11px] font-bold rounded-lg transition-all ${pwaMode === 'url' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`,
              children: "L\xE4nk (URL)"
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setPwaMode('uploaded'),
              className: `text-center py-2 text-[11px] font-bold rounded-lg transition-all ${pwaMode === 'uploaded' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`,
              children: "Sl\xE4pp fil"
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setPwaMode('custom'),
              className: `text-center py-2 text-[11px] font-bold rounded-lg transition-all ${pwaMode === 'custom' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`,
              children: "Skriv kod"
            })]
          }), pwaMode === 'demo' && /*#__PURE__*/_jsxs("div", {
            className: "space-y-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: `grid ${sidebarWidth < 325 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`,
              children: DEMO_PWAS.map(demo => /*#__PURE__*/_jsx("button", {
                onClick: () => setSelectedDemoId(demo.id),
                className: `text-left p-3 rounded-2xl border transition-all duration-[80ms] active:scale-[0.97] active:translate-y-[1px] ${selectedDemoId === demo.id ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500/80 text-indigo-950 dark:text-indigo-100 shadow-xs' : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'}`,
                children: /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "text-lg",
                    children: [demo.id === 'todo-pwa' && '💼', demo.id === 'weather-pwa' && '☀️', demo.id === 'calculator-pwa' && '🧮', demo.id === 'tictactoe-pwa' && '🎮']
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "text-xs font-bold leading-tight",
                      children: demo.name
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-[11px] text-slate-400 mt-0.5",
                      children: demo.category
                    })]
                  })]
                })
              }, demo.id))
            }), /*#__PURE__*/_jsxs("div", {
              className: "bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-normal flex gap-1.5",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                className: "w-4 h-4 text-amber-500 shrink-0"
              }), /*#__PURE__*/_jsx("span", {
                children: "Dessa \xE4r helt fungerande inbyggda offline-PWA:er som simulerar hur touch-knappar, statushistorik och layout beter sig p\xE5 riktigt!"
              })]
            })]
          }), pwaMode === 'url' && /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsx("label", {
                className: "text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block",
                children: "Webbplats / PWA URL:"
              }), /*#__PURE__*/_jsx("div", {
                className: "flex gap-2",
                children: /*#__PURE__*/_jsxs("div", {
                  className: "relative flex-1",
                  children: [/*#__PURE__*/_jsx(Globe, {
                    className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  }), /*#__PURE__*/_jsx("input", {
                    type: "url",
                    value: pwaUrl,
                    onChange: e => setPwaUrl(e.target.value),
                    className: "w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 font-mono",
                    placeholder: "https://min-pwa-app.web.app"
                  })]
                })
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl flex gap-2",
              children: [/*#__PURE__*/_jsx(Info, {
                className: "w-4 h-4 text-indigo-500 shrink-0 mt-0.5"
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-[11px] text-slate-500 dark:text-slate-400 leading-normal",
                children: ["Skriv in din lokala utvecklingsl\xE4nk (t.ex. ", /*#__PURE__*/_jsx("code", {
                  className: "bg-slate-200 dark:bg-slate-800 px-1 rounded",
                  children: "http://192.168.1.50:5173"
                }), ") eller valfri webbadress f\xF6r att se den direkt i enhetens ram."]
              })]
            })]
          }), pwaMode === 'uploaded' && /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("div", {
              onDragOver: handleDragOver,
              onDragLeave: handleDragLeave,
              onDrop: handleDrop,
              className: `border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${isDragging ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'}`,
              children: [/*#__PURE__*/_jsx("input", {
                type: "file",
                id: "html-file-upload",
                accept: ".html",
                onChange: handleFileChange,
                className: "hidden"
              }), /*#__PURE__*/_jsxs("label", {
                htmlFor: "html-file-upload",
                className: "cursor-pointer flex flex-col items-center",
                children: [/*#__PURE__*/_jsx(Upload, {
                  className: `w-8 h-8 mb-2 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs font-bold",
                  children: "Klicka eller dra HTML-fil hit"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[11px] text-slate-400 mt-1",
                  children: "Endast .html st\xF6ds f\xF6r tillf\xE4llet"
                })]
              })]
            }), uploadedFileName && /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 min-w-0",
                children: [/*#__PURE__*/_jsx(FileCode, {
                  className: "w-4 h-4 text-emerald-500 shrink-0"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-xs font-semibold truncate text-slate-700 dark:text-slate-300",
                  children: uploadedFileName
                })]
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => {
                  setUploadedHtml('');
                  setUploadedFileName('');
                },
                className: "p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-800",
                children: /*#__PURE__*/_jsx(X, {
                  className: "w-3.5 h-3.5"
                })
              })]
            })]
          }), pwaMode === 'custom' && /*#__PURE__*/_jsxs("div", {
            className: "space-y-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between",
                children: [/*#__PURE__*/_jsx("label", {
                  className: "text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block",
                  children: "Skriv / Klistra in HTML:"
                }), /*#__PURE__*/_jsx("button", {
                  onClick: () => setCustomCode(DEFAULT_STARTER_HTML),
                  className: "text-[11px] font-bold text-indigo-500 hover:underline",
                  children: "\xC5terst\xE4ll mall"
                })]
              }), /*#__PURE__*/_jsx("textarea", {
                value: customCode,
                onChange: e => setCustomCode(e.target.value),
                rows: 6,
                className: "w-full p-2 text-[11px] bg-slate-900 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-emerald-400 font-mono resize-none leading-relaxed",
                placeholder: "Skriv din HTML h\xE4r..."
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "bg-slate-100 dark:bg-slate-950 p-2 text-[10px] text-slate-400 rounded-lg",
              children: ["\uD83D\uDCA1 Tips: Du kan anv\xE4nda Tailwind direkt genom att infoga ", /*#__PURE__*/_jsx("code", {
                className: "bg-slate-200 dark:bg-slate-900 px-1 rounded text-[9px]",
                children: "https://cdn.tailwindcss.com"
              }), " skripttagg."]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-white/80 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-4.5 shadow-xs space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500",
                children: "2. V\xE4lj Enhetsmall"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
                children: "V\xE4lj specifik mobil eller platta att testa p\xE5"
              })]
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-xs font-semibold text-slate-400",
              children: [filteredDevices.length, " tillg\xE4ngliga"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-2.5",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "relative",
              children: [/*#__PURE__*/_jsx(Search, {
                className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              }), /*#__PURE__*/_jsx("input", {
                type: "text",
                value: searchQuery,
                onChange: e => setSearchQuery(e.target.value),
                placeholder: "S\xF6k m\xE4rke eller enhet (t.ex. iPhone SE)...",
                className: "w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: `flex ${sidebarWidth < 340 ? 'flex-col' : 'flex-row'} gap-1.5 text-[11px] font-bold`,
              children: [/*#__PURE__*/_jsx("button", {
                onClick: () => setDeviceTypeFilter('all'),
                className: `flex-1 py-1 px-2.5 rounded-lg border text-center transition-all ${deviceTypeFilter === 'all' ? 'bg-slate-800 dark:bg-slate-700 border-transparent text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`,
                children: "Alla"
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => setDeviceTypeFilter('phone'),
                className: `flex-1 py-1 px-2.5 rounded-lg border text-center transition-all flex items-center justify-center gap-1 ${deviceTypeFilter === 'phone' ? 'bg-slate-800 dark:bg-slate-700 border-transparent text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`,
                children: [/*#__PURE__*/_jsx(Smartphone, {
                  className: "w-3 h-3"
                }), " Mobiler"]
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => setDeviceTypeFilter('tablet'),
                className: `flex-1 py-1 px-2.5 rounded-lg border text-center transition-all flex items-center justify-center gap-1 ${deviceTypeFilter === 'tablet' ? 'bg-slate-800 dark:bg-slate-700 border-transparent text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}`,
                children: [/*#__PURE__*/_jsx(Tablet, {
                  className: "w-3 h-3"
                }), " Plattor"]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: `grid ${sidebarWidth < 340 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 text-[11px] font-semibold text-slate-500`,
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "block mb-1 text-slate-400",
                  children: "Varum\xE4rke:"
                }), /*#__PURE__*/_jsxs("select", {
                  value: deviceBrandFilter,
                  onChange: e => setDeviceBrandFilter(e.target.value),
                  className: "w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none",
                  children: [/*#__PURE__*/_jsx("option", {
                    value: "all",
                    children: "Alla m\xE4rken"
                  }), /*#__PURE__*/_jsx("option", {
                    value: "Apple",
                    children: "Apple (iOS)"
                  }), /*#__PURE__*/_jsx("option", {
                    value: "Samsung",
                    children: "Samsung (Android)"
                  }), /*#__PURE__*/_jsx("option", {
                    value: "Google",
                    children: "Google (Android)"
                  }), /*#__PURE__*/_jsx("option", {
                    value: "Lenovo",
                    children: "Lenovo"
                  }), /*#__PURE__*/_jsx("option", {
                    value: "OnePlus",
                    children: "OnePlus"
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "block mb-1 text-slate-400",
                  children: "Sk\xE4rmorientering:"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex gap-1",
                  children: [/*#__PURE__*/_jsx("button", {
                    onClick: () => setIsLandscape(false),
                    className: `flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${!isLandscape ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`,
                    children: "St\xE5ende"
                  }), /*#__PURE__*/_jsx("button", {
                    onClick: () => setIsLandscape(true),
                    className: `flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${isLandscape ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`,
                    children: "Liggande"
                  })]
                })]
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "max-h-52 overflow-y-auto space-y-1 pr-1 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 p-2",
            children: filteredDevices.length === 0 ? /*#__PURE__*/_jsx("p", {
              className: "text-center py-8 text-slate-400 text-xs italic",
              children: "Hittade inga matchande enheter"
            }) : filteredDevices.map(device => {
              const isSelected = device.id === selectedDeviceId;
              return /*#__PURE__*/_jsxs("button", {
                onClick: () => setSelectedDeviceId(device.id),
                className: `w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-[80ms] active:scale-[0.98] ${isSelected ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm' : 'hover:bg-slate-200/40 dark:hover:bg-slate-800/40 border border-transparent'}`,
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2.5 min-w-0",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: `p-1.5 rounded-lg ${isSelected ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' : 'bg-slate-200/60 dark:bg-slate-900 text-slate-400'}`,
                    children: device.type === 'phone' ? /*#__PURE__*/_jsx(Smartphone, {
                      className: "w-3.5 h-3.5"
                    }) : /*#__PURE__*/_jsx(Tablet, {
                      className: "w-3.5 h-3.5"
                    })
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "min-w-0",
                    children: [/*#__PURE__*/_jsx("p", {
                      className: `text-xs font-bold leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`,
                      children: device.name
                    }), /*#__PURE__*/_jsxs("p", {
                      className: "text-[10px] text-slate-400 font-medium",
                      children: [device.brand, " \u2022 ", device.os === 'ios' ? 'iOS' : 'Android']
                    })]
                  })]
                }), /*#__PURE__*/_jsx("div", {
                  className: "text-right shrink-0",
                  children: /*#__PURE__*/_jsxs("span", {
                    className: "text-[10px] bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono",
                    children: [device.width, "x", device.height]
                  })
                })]
              }, device.id);
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: `flex ${sidebarWidth < 350 ? 'flex-col gap-2 items-start' : 'items-center justify-between'} text-xs pt-1`,
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-slate-400 font-bold uppercase text-[10px] tracking-wider",
              children: "F\xF6rhandsvisning Skala:"
            }), /*#__PURE__*/_jsx("div", {
              className: "flex flex-wrap gap-1",
              children: [0, 0.5, 0.75, 1.0].map(s => /*#__PURE__*/_jsx("button", {
                onClick: () => setScale(s),
                className: `px-2 py-1 text-xs rounded-lg font-bold transition-all ${scale === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 text-slate-600 dark:text-slate-400'}`,
                children: s === 0 ? 'Auto-Fit' : `${s * 100}%`
              }, s))
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "bg-gradient-to-tr from-slate-50 to-indigo-50/20 dark:from-slate-900/40 dark:to-indigo-950/10 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs backdrop-blur-md",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "text-xs font-extrabold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5",
            children: [/*#__PURE__*/_jsx(Info, {
              className: "w-4 h-4"
            }), "Om denna PWA Test-App"]
          }), /*#__PURE__*/_jsxs("ul", {
            className: "mt-3.5 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium",
            children: [/*#__PURE__*/_jsxs("li", {
              className: "flex gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-teal-500 font-extrabold shrink-0",
                children: "\u2714"
              }), /*#__PURE__*/_jsxs("span", {
                children: ["Denna app \xE4r en ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold text-slate-800 dark:text-slate-200",
                  children: "100% fullfj\xE4drad PWA"
                }), ". Du kan l\xE4gga till den p\xE5 din Hemsk\xE4rm direkt via din mobils webbl\xE4sare f\xF6r att simulera den lokalt."]
              })]
            }), /*#__PURE__*/_jsxs("li", {
              className: "flex gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-teal-500 font-extrabold shrink-0",
                children: "\u2714"
              }), /*#__PURE__*/_jsxs("span", {
                children: ["Varje knapp i appen har en taktilitet p\xE5 ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold text-slate-800 dark:text-slate-200",
                  children: "exakt 80ms press-respons"
                }), " som krymper och s\xE4nker knappen f\xF6r fysisk feedback."]
              })]
            }), /*#__PURE__*/_jsxs("li", {
              className: "flex gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-teal-500 font-extrabold shrink-0",
                children: "\u2714"
              }), /*#__PURE__*/_jsxs("span", {
                children: ["Alla typsnitt och texter \xE4r designade med minst ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold text-slate-800 dark:text-slate-200",
                  children: "11px storlek"
                }), " f\xF6r optimal l\xE4sbarhet p\xE5 alla plattformar."]
              })]
            })]
          })]
        })]
      }), isLargeScreen && !isSidebarCollapsed && /*#__PURE__*/_jsx("div", {
        onMouseDown: startResizing,
        className: `w-2.5 -mx-4.5 cursor-col-resize flex items-center justify-center transition-all group select-none relative z-20 self-stretch ${isResizing ? 'bg-indigo-500/20' : 'hover:bg-slate-300/30 dark:hover:bg-slate-700/30'}`,
        title: "Dra f\xF6r att \xE4ndra storlek",
        children: /*#__PURE__*/_jsxs("div", {
          className: `w-1.5 h-12 rounded-full transition-all flex flex-col justify-between p-[2px] items-center ${isResizing ? 'bg-indigo-500 shadow-md shadow-indigo-500/50' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-500'}`,
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-0.5 h-0.5 rounded-full bg-white/60"
          }), /*#__PURE__*/_jsx("div", {
            className: "w-0.5 h-0.5 rounded-full bg-white/60"
          }), /*#__PURE__*/_jsx("div", {
            className: "w-0.5 h-0.5 rounded-full bg-white/60"
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden flex flex-col min-h-[650px] relative",
        style: isLargeScreen ? {
          flex: 1,
          minWidth: 0
        } : {},
        children: [/*#__PURE__*/_jsxs("div", {
          className: "px-6 py-4.5 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block",
                children: "Aktiv testram"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-xs font-black text-slate-800 dark:text-slate-100",
                children: [currentDevice.name, " (", isLandscape ? 'Liggande' : 'Stående', ")"]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-slate-400 font-bold bg-slate-200/60 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg",
              children: getActivePwaTitle()
            }), /*#__PURE__*/_jsx(PWAButton, {
              variant: "icon",
              onClick: () => setIsLandscape(!isLandscape),
              title: "Rotera sk\xE4rmen",
              "aria-label": "Rotera sk\xE4rmen",
              children: /*#__PURE__*/_jsx(RotateCw, {
                className: "w-4 h-4 text-slate-600 dark:text-slate-300"
              })
            }), /*#__PURE__*/_jsx(PWAButton, {
              variant: "icon",
              onClick: handleOpenInNewTab,
              title: "\xD6ppna test-PWA i ny flik",
              "aria-label": "\xD6ppna test-PWA i ny flik",
              children: /*#__PURE__*/_jsx(ExternalLink, {
                className: "w-4 h-4 text-slate-600 dark:text-slate-300"
              })
            }), /*#__PURE__*/_jsx(PWAButton, {
              variant: "icon",
              onClick: () => setIsSidebarCollapsed(!isSidebarCollapsed),
              title: isSidebarCollapsed ? "Återställ layout (Visa vänsterpanel)" : "Maximera aktiv testram (Dölj vänsterpanel)",
              "aria-label": isSidebarCollapsed ? "Återställ layout" : "Maximera aktiv testram",
              children: isSidebarCollapsed ? /*#__PURE__*/_jsx(Minimize2, {
                className: "w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]"
              }) : /*#__PURE__*/_jsx(Maximize2, {
                className: "w-4 h-4 text-slate-600 dark:text-slate-300"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 bg-slate-100/60 dark:bg-slate-950/80 overflow-hidden flex items-center justify-center relative",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "absolute top-6 left-6 hidden sm:flex items-center gap-4 z-10 text-[11px] font-medium text-slate-500 dark:text-slate-400",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx("span", {
                className: "w-2 h-2 bg-indigo-500 rounded-full"
              }), /*#__PURE__*/_jsxs("span", {
                className: "uppercase tracking-wider",
                children: ["Aktiv enhet: ", currentDevice.name]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "h-4 w-px bg-slate-200 dark:bg-slate-800"
            }), /*#__PURE__*/_jsxs("div", {
              className: "uppercase tracking-wider",
              children: ["Uppl\xF6sning: ", isLandscape ? `${currentDevice.height} x ${currentDevice.width}` : `${currentDevice.width} x ${currentDevice.height}`, " (", isLandscape ? 'Landscape' : 'Portrait', ")"]
            })]
          }), /*#__PURE__*/_jsx(DeviceFrame, {
            device: currentDevice,
            isLandscape: isLandscape,
            scale: scale,
            pwaTitle: getActivePwaTitle(),
            pwaHtml: getActiveHtmlContent(),
            pwaUrl: pwaUrl,
            mode: pwaMode
          }), isInspectorOpen && /*#__PURE__*/_jsxs("div", {
            className: "absolute inset-y-0 right-0 w-80 bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 z-30 p-5 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between border-b border-slate-200/20 dark:border-slate-800 pb-3 mb-4",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-indigo-400",
                children: [/*#__PURE__*/_jsx(Code, {
                  className: "w-4 h-4"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-xs font-black uppercase tracking-widest",
                  children: "PWA Inspektion"
                })]
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => setIsInspectorOpen(false),
                className: "p-1 rounded bg-slate-800 text-slate-400 hover:text-white",
                children: /*#__PURE__*/_jsx(X, {
                  className: "w-4 h-4"
                })
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 overflow-y-auto space-y-4 pr-1 text-slate-300",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block",
                  children: "Applikationsk\xE4lla"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-950/50 p-2.5 rounded-xl border border-slate-200/10 dark:border-slate-800 flex items-center justify-between text-xs font-semibold",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-slate-400",
                    children: "Typ:"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-indigo-400",
                    children: pwaMode === 'demo' ? 'Inbyggd Demo' : pwaMode === 'url' ? 'Extern URL' : pwaMode === 'uploaded' ? 'HTML-fil' : 'Anpassad Sandlåda'
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block",
                  children: "Manifest-verifiering"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-1",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "bg-slate-950/50 p-2 rounded-xl border border-slate-200/10 dark:border-slate-800 flex items-center justify-between text-xs",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "text-slate-400",
                      children: "Web App Manifest:"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-emerald-500 font-bold flex items-center gap-1",
                      children: "\u2714 Hittad"
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "bg-slate-950/50 p-2 rounded-xl border border-slate-200/10 dark:border-slate-800 flex items-center justify-between text-xs",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "text-slate-400",
                      children: "Service Worker:"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-emerald-500 font-bold flex items-center gap-1",
                      children: "\u2714 Registrerad"
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "bg-slate-950/50 p-2 rounded-xl border border-slate-200/10 dark:border-slate-800 flex items-center justify-between text-xs",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "text-slate-400",
                      children: "Installationsbar:"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-emerald-500 font-bold flex items-center gap-1",
                      children: "\u2714 Redo"
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "bg-slate-950/50 p-2 rounded-xl border border-slate-200/10 dark:border-slate-800 flex items-center justify-between text-xs",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "text-slate-400",
                      children: "Responsiv vyport:"
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-emerald-500 font-bold flex items-center gap-1",
                      children: "\u2714 Optimerad"
                    })]
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block",
                    children: "Simulerad manifest.json"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-[9px] bg-indigo-950/50 text-indigo-400 border border-indigo-900/40 px-1.5 rounded font-mono",
                    children: "STANDALONE"
                  })]
                }), /*#__PURE__*/_jsx("pre", {
                  className: "p-3 bg-slate-950 text-[10px] text-emerald-400 rounded-xl border border-slate-200/10 dark:border-slate-800 font-mono overflow-x-auto leading-relaxed max-h-56",
                  children: `{
  "name": "${getActivePwaTitle()}",
  "short_name": "${getActivePwaTitle().slice(0, 12)}",
  "start_url": ".",
  "display": "standalone",
  "background_color": "${theme === 'dark' ? '#0f172a' : '#ffffff'}",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "favicon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/30 text-[11px] text-slate-400 leading-normal",
                children: ["\uD83D\uDCA1 ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold text-indigo-300",
                  children: "Tips:"
                }), " N\xE4r du laddar ner din PWA som en frist\xE5ende app sparar webbl\xE4saren dessa metadata-inst\xE4llningar f\xF6r hemsk\xE4rmen."]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "h-12 bg-slate-50/80 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between shrink-0",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex gap-4",
            children: [/*#__PURE__*/_jsxs("button", {
              onClick: () => setIsInspectorOpen(!isInspectorOpen),
              className: `text-[11px] font-medium flex items-center gap-1.5 pwa-button transition-colors cursor-pointer ${isInspectorOpen ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`,
              children: [/*#__PURE__*/_jsx("svg", {
                width: "14",
                height: "14",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/_jsx("path", {
                  d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                })
              }), "Inspektion"]
            }), /*#__PURE__*/_jsxs("button", {
              onClick: () => setIsLandscape(!isLandscape),
              className: "text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 pwa-button cursor-pointer",
              children: [/*#__PURE__*/_jsx("svg", {
                width: "14",
                height: "14",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/_jsx("path", {
                  d: "M12 2v20m0-20l-4 4m4-4l4 4"
                })
              }), "Orientering"]
            }), /*#__PURE__*/_jsxs("button", {
              onClick: handleOpenAppInNewTab,
              className: "text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 pwa-button cursor-pointer",
              title: "\xD6ppna PWA Tester Pro i en ny flik f\xF6r fullt st\xF6d",
              children: [/*#__PURE__*/_jsx("svg", {
                width: "14",
                height: "14",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/_jsx("path", {
                  d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
                })
              }), "\xD6ppna i ny flik"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 text-[11px] font-medium text-slate-500",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-[10px] text-slate-400 dark:text-slate-600 font-bold tracking-wider",
              children: "ZOOM:"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-mono text-slate-600 dark:text-slate-400",
              children: scale === 0 ? 'Auto-Fit' : `${scale * 100}%`
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx(ShareModal, {
      isOpen: isShareOpen,
      onClose: () => setIsShareOpen(false),
      appUrl: window.location.href
    }), isInstallOpen && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Download, {
              className: "w-5 h-5 text-indigo-500"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-base font-extrabold tracking-tight",
              children: "Installera p\xE5 Hemsk\xE4rmen"
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setIsInstallOpen(false),
            className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-5 h-5"
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-6 space-y-4",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium",
            children: "Denna app \xE4r en fullt konfigurerad Progressive Web App (PWA). F\xF6lj instruktionerna nedan f\xF6r att l\xE4gga till den p\xE5 din hemsk\xE4rm p\xE5 din mobil eller surfplatta!"
          }), /*#__PURE__*/_jsxs("div", {
            className: "bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md",
                children: "iOS / Safari"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-xs text-slate-400 font-bold",
                children: "iPhone & iPad"
              })]
            }), /*#__PURE__*/_jsxs("ol", {
              className: "list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1 leading-relaxed font-medium",
              children: [/*#__PURE__*/_jsxs("li", {
                children: ["\xD6ppna appen i ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "Safari-webbl\xE4saren"
                }), " p\xE5 din enhet."]
              }), /*#__PURE__*/_jsxs("li", {
                children: ["Klicka p\xE5 ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "Dela-knappen"
                }), " (ikonen med en ruta och pil upp\xE5t) i menyf\xE4ltet."]
              }), /*#__PURE__*/_jsxs("li", {
                children: ["Bl\xE4ddra ned\xE5t och v\xE4lj ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "\"L\xE4gg till p\xE5 hemsk\xE4rmen\""
                }), "."]
              }), /*#__PURE__*/_jsxs("li", {
                children: ["Klicka p\xE5 ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold text-indigo-600",
                  children: "L\xE4gg till"
                }), " i \xF6vre h\xF6gra h\xF6rnet."]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm font-black text-teal-500 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md",
                children: "Android / Chrome"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-xs text-slate-400 font-bold",
                children: "Samsung, Google, m.fl."
              })]
            }), /*#__PURE__*/_jsxs("ol", {
              className: "list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1 leading-relaxed font-medium",
              children: [/*#__PURE__*/_jsxs("li", {
                children: ["\xD6ppna appen i ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "Chrome-webbl\xE4saren"
                }), "."]
              }), /*#__PURE__*/_jsxs("li", {
                children: ["Klicka p\xE5 de ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "tre punkterna"
                }), " i \xF6vre h\xF6gra h\xF6rnet."]
              }), /*#__PURE__*/_jsxs("li", {
                children: ["V\xE4lj ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "\"Installera app\""
                }), " eller ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold",
                  children: "\"L\xE4gg till p\xE5 startsk\xE4rmen\""
                }), "."]
              }), /*#__PURE__*/_jsxs("li", {
                children: ["Bekr\xE4fta genom att klicka p\xE5 ", /*#__PURE__*/_jsx("span", {
                  className: "font-bold text-teal-600",
                  children: "Installera"
                }), "."]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 flex justify-end",
          children: /*#__PURE__*/_jsx(PWAButton, {
            variant: "primary",
            onClick: () => setIsInstallOpen(false),
            children: "Jag f\xF6rst\xE5r"
          })
        })]
      })
    }), isChangelogOpen && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100 max-h-[85vh]",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(History, {
              className: "w-5 h-5 text-indigo-500"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-base font-extrabold tracking-tight",
              children: "Versionshistorik & \xC4ndringar"
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setIsChangelogOpen(false),
            className: "p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-5 h-5"
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-6 flex-1 overflow-y-auto space-y-5",
          children: [/*#__PURE__*/_jsxs("p", {
            className: "text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed",
            children: ["H\xE4r \xE4r versionshistoriken f\xF6r ", /*#__PURE__*/_jsx("span", {
              className: "font-bold text-slate-800 dark:text-slate-200",
              children: "PWA Device Tester"
            }), ". Varje f\xF6rb\xE4ttring \xF6kar versionsnumret med ", /*#__PURE__*/_jsx("span", {
              className: "bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded font-bold text-indigo-500 font-mono",
              children: "+0.0.01"
            }), "."]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-4",
            children: VERSION_HISTORY.map((v, idx) => /*#__PURE__*/_jsxs("div", {
              className: "relative pl-5 border-l-2 border-slate-200 dark:border-slate-800",
              children: [/*#__PURE__*/_jsx("div", {
                className: `absolute -left-[6px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-slate-900 ${idx === 0 ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-700'}`
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: `text-xs font-black ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`,
                  children: v.version
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-slate-400 font-bold",
                  children: v.date
                })]
              }), /*#__PURE__*/_jsx("ul", {
                className: "mt-1.5 space-y-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium",
                children: v.changes.map((c, i) => /*#__PURE__*/_jsxs("li", {
                  className: "flex gap-1.5",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-indigo-500",
                    children: "\u2022"
                  }), /*#__PURE__*/_jsx("span", {
                    children: c
                  })]
                }, i))
              })]
            }, v.version))
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 flex justify-end",
          children: /*#__PURE__*/_jsx(PWAButton, {
            variant: "secondary",
            onClick: () => setIsChangelogOpen(false),
            children: "St\xE4ng"
          })
        })]
      })
    })]
  });
}