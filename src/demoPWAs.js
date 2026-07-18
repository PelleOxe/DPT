/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEMO_PWAS = [{
  id: 'todo-pwa',
  name: 'TaskFlow PWA',
  description: 'En modern att-göra-lista med kategorier, status-mätare och lokal lagring.',
  category: 'Productivity',
  icon: 'CheckSquare',
  html: `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskFlow PWA</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen pb-12">
  <div class="max-w-md mx-auto px-4 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">TaskFlow</h1>
        <p class="text-xs text-slate-500 font-medium">Håll ordning på din dag • Offline-redo</p>
      </div>
      <div id="stats" class="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-full text-xs">
        0/0 Avklarade
      </div>
    </div>

    <!-- Progress bar -->
    <div class="bg-slate-200 h-2 w-full rounded-full overflow-hidden mb-6">
      <div id="progressBar" class="bg-indigo-600 h-full w-0 transition-all duration-300"></div>
    </div>

    <!-- Add Task -->
    <form id="taskForm" class="mb-6">
      <div class="flex gap-2">
        <input 
          type="text" 
          id="taskInput" 
          placeholder="Vad behöver du göra?" 
          required 
          class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
        <button 
          type="submit" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm active:scale-95"
        >
          Lägg till
        </button>
      </div>
      
      <!-- Categories -->
      <div class="flex gap-2 mt-3 overflow-x-auto pb-1">
        <label class="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full cursor-pointer border border-indigo-100">
          <input type="radio" name="category" value="Arbete" checked class="hidden">
          💼 Arbete
        </label>
        <label class="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full cursor-pointer border border-transparent hover:bg-slate-200">
          <input type="radio" name="category" value="Privat" class="hidden">
          🏠 Privat
        </label>
        <label class="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full cursor-pointer border border-transparent hover:bg-slate-200">
          <input type="radio" name="category" value="Inköp" class="hidden">
          🛒 Inköp
        </label>
      </div>
    </form>

    <!-- Filters -->
    <div class="flex gap-1 mb-4 bg-slate-200/60 p-1 rounded-lg">
      <button onclick="filterTasks('all')" class="filter-btn flex-1 text-center py-1.5 text-xs font-semibold rounded-md bg-white text-slate-800 shadow-sm transition-all">Alla</button>
      <button onclick="filterTasks('active')" class="filter-btn flex-1 text-center py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:bg-slate-100 transition-all">Aktiva</button>
      <button onclick="filterTasks('completed')" class="filter-btn flex-1 text-center py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:bg-slate-100 transition-all">Klara</button>
    </div>

    <!-- Task List -->
    <ul id="taskList" class="space-y-2.5">
      <!-- Dynamic list -->
    </ul>

    <!-- Quick Seed Data for Testing -->
    <div class="mt-8 pt-6 border-t border-slate-200">
      <button 
        onclick="seedDemoData()" 
        class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-semibold py-2 px-4 rounded-xl transition-all"
      >
        ✨ Fyll i testsysslor för demonstration
      </button>
    </div>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let activeFilter = 'all';

    const form = document.getElementById('taskForm');
    const input = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const statsText = document.getElementById('stats');
    const progressBar = document.getElementById('progressBar');

    // Handle Category radio buttons visually
    document.querySelectorAll('input[name="category"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        document.querySelectorAll('input[name="category"]').forEach(r => {
          r.parentElement.className = "flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full cursor-pointer border border-transparent hover:bg-slate-200";
        });
        if (e.target.checked) {
          e.target.parentElement.className = "flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full cursor-pointer border border-indigo-100 font-medium";
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      const category = document.querySelector('input[name="category"]:checked').value;
      if (!text) return;

      const newTask = {
        id: Date.now(),
        text,
        category,
        completed: false
      };

      tasks.unshift(newTask);
      saveTasks();
      render();
      input.value = '';
    });

    function toggleTask(id) {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveTasks();
      render();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filterTasks(filter) {
      activeFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'text-slate-800', 'shadow-sm');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      });
      event.target.classList.add('bg-white', 'text-slate-800', 'shadow-sm');
      event.target.classList.remove('text-slate-600', 'hover:bg-slate-100');
      render();
    }

    function seedDemoData() {
      tasks = [
        { id: 1, text: "Skapa en vacker design för min PWA", category: "Arbete", completed: true },
        { id: 2, text: "Lägg till service worker för offline-stöd", category: "Arbete", completed: false },
        { id: 3, text: "Köpa mjölk och kaffe till kontoret", category: "Inköp", completed: false },
        { id: 4, text: "Träna på gymmet 45 minuter", category: "Privat", completed: false },
      ];
      saveTasks();
      render();
    }

    function render() {
      taskList.innerHTML = '';
      
      const filtered = tasks.filter(t => {
        if (activeFilter === 'active') return !t.completed;
        if (activeFilter === 'completed') return t.completed;
        return true;
      });

      const completedCount = tasks.filter(t => t.completed).length;
      statsText.textContent = completedCount + "/" + tasks.length + " Klara";
      
      const percentage = tasks.length ? (completedCount / tasks.length) * 100 : 0;
      progressBar.style.width = percentage + "%";

      if (filtered.length === 0) {
        taskList.innerHTML = \`<li class="text-center py-8 text-slate-400 text-sm">Inga sysslor att visa</li>\`;
        return;
      }

      filtered.forEach(task => {
        const item = document.createElement('li');
        item.className = "flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs transition-all " + (task.completed ? "opacity-60" : "");
        
        const catEmoji = task.category === 'Arbete' ? '💼' : task.category === 'Privat' ? '🏠' : '🛒';
        
        item.innerHTML = \`
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <input 
              type="checkbox" 
              \${task.completed ? 'checked' : ''} 
              onclick="toggleTask(\${task.id})"
              class="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-slate-800 break-words \${task.completed ? 'line-through text-slate-400' : ''}">
                \${task.text}
              </p>
              <span class="inline-block text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md mt-0.5">\${catEmoji} \${task.category}</span>
            </div>
          </div>
          <button 
            onclick="deleteTask(\${task.id})" 
            class="text-slate-300 hover:text-rose-500 p-1.5 transition-colors"
            title="Ta bort"
          >
            🗑️
          </button>
        \`;
        taskList.appendChild(item);
      });
    }

    render();
  </script>
</body>
</html>`
}, {
  id: 'weather-pwa',
  name: 'VäderKoll PWA',
  description: 'En snygg väderapplikation med temperaturgrafer och interaktiva städer.',
  category: 'Travel',
  icon: 'CloudSun',
  html: `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VäderKoll</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-b from-sky-400 to-indigo-600 text-white min-h-screen pb-12 font-sans">
  <div class="max-w-md mx-auto px-4 pt-6">
    <!-- Search -->
    <div class="relative mb-6">
      <select id="citySelect" onchange="changeCity()" class="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white">
        <option value="stockholm" class="text-slate-800">🇸🇪 Stockholm</option>
        <option value="goteborg" class="text-slate-800">🇸🇪 Göteborg</option>
        <option value="malmo" class="text-slate-800">🇸🇪 Malmö</option>
        <option value="oslo" class="text-slate-800">🇳🇴 Oslo</option>
        <option value="copenhagen" class="text-slate-800">🇩🇰 Köpenhamn</option>
      </select>
    </div>

    <!-- Main Temperature Display -->
    <div class="text-center py-6">
      <p id="weatherIcon" class="text-7xl mb-2 drop-shadow-md animate-bounce">☀️</p>
      <h2 id="cityName" class="text-3xl font-extrabold tracking-tight">Stockholm</h2>
      <p id="weatherDesc" class="text-sm opacity-90 font-medium">Klart och soligt</p>
      <div class="text-7xl font-thin tracking-tighter my-3 relative inline-block">
        <span id="temp">22</span><span class="text-4xl absolute -top-1">°</span>
      </div>
      
      <!-- High/Low -->
      <div class="flex justify-center gap-4 text-xs opacity-90 mt-2">
        <span id="high">H: 24°</span>
        <span id="low">L: 14°</span>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-3 gap-2.5 mb-6">
      <div class="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
        <p class="text-[10px] uppercase tracking-wider opacity-75">Vind</p>
        <p id="wind" class="text-sm font-semibold mt-1">4.2 m/s</p>
      </div>
      <div class="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
        <p class="text-[10px] uppercase tracking-wider opacity-75">Luftfuktighet</p>
        <p id="humidity" class="text-sm font-semibold mt-1">54%</p>
      </div>
      <div class="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-center">
        <p class="text-[10px] uppercase tracking-wider opacity-75">UV-index</p>
        <p id="uv" class="text-sm font-semibold mt-1">Medel (4)</p>
      </div>
    </div>

    <!-- Hourly Forecast -->
    <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
      <h3 class="text-xs font-bold uppercase tracking-wider opacity-80 mb-3.5">Timprognos</h3>
      <div class="flex justify-between overflow-x-auto gap-4 pb-2">
        <div class="text-center min-w-[50px]">
          <p class="text-xs opacity-70">Nu</p>
          <p class="text-xl my-1.5">☀️</p>
          <p id="hTemp1" class="text-sm font-semibold">22°</p>
        </div>
        <div class="text-center min-w-[50px]">
          <p class="text-xs opacity-70">14:00</p>
          <p class="text-xl my-1.5">⛅</p>
          <p id="hTemp2" class="text-sm font-semibold">23°</p>
        </div>
        <div class="text-center min-w-[50px]">
          <p class="text-xs opacity-70">16:00</p>
          <p class="text-xl my-1.5">⛅</p>
          <p id="hTemp3" class="text-sm font-semibold">21°</p>
        </div>
        <div class="text-center min-w-[50px]">
          <p class="text-xs opacity-70">18:00</p>
          <p class="text-xl my-1.5">🌦️</p>
          <p id="hTemp4" class="text-sm font-semibold">18°</p>
        </div>
        <div class="text-center min-w-[50px]">
          <p class="text-xs opacity-70">20:00</p>
          <p class="text-xl my-1.5">☁️</p>
          <p id="hTemp5" class="text-sm font-semibold">16°</p>
        </div>
      </div>
    </div>
  </div>

  <script>
    const data = {
      stockholm: {
        name: "Stockholm",
        temp: 22,
        high: 24,
        low: 14,
        desc: "Klart och soligt",
        icon: "☀️",
        wind: "4.2 m/s",
        humidity: "54%",
        uv: "Medel (4)",
        hourly: [22, 23, 21, 18, 16],
        bg: "linear-gradient(to bottom, #38bdf8, #4f46e5)"
      },
      goteborg: {
        name: "Göteborg",
        temp: 18,
        high: 20,
        low: 12,
        desc: "Lätt regn och dis",
        icon: "🌦️",
        wind: "7.5 m/s",
        humidity: "82%",
        uv: "Lågt (2)",
        hourly: [18, 19, 17, 15, 14],
        bg: "linear-gradient(to bottom, #94a3b8, #475569)"
      },
      malmo: {
        name: "Malmö",
        temp: 20,
        high: 22,
        low: 13,
        desc: "Halvklart",
        icon: "⛅",
        wind: "5.1 m/s",
        humidity: "68%",
        uv: "Medel (3)",
        hourly: [20, 21, 20, 18, 16],
        bg: "linear-gradient(to bottom, #60a5fa, #2563eb)"
      },
      oslo: {
        name: "Oslo",
        temp: 16,
        high: 18,
        low: 10,
        desc: "Mulet",
        icon: "☁️",
        wind: "3.2 m/s",
        humidity: "75%",
        uv: "Lågt (1)",
        hourly: [16, 17, 16, 14, 12],
        bg: "linear-gradient(to bottom, #cbd5e1, #64748b)"
      },
      copenhagen: {
        name: "Köpenhamn",
        temp: 21,
        high: 23,
        low: 15,
        desc: "Varmt & Soligt",
        icon: "☀️",
        wind: "4.8 m/s",
        humidity: "60%",
        uv: "Högt (6)",
        hourly: [21, 22, 23, 20, 18],
        bg: "linear-gradient(to bottom, #fbbf24, #d97706)"
      }
    };

    function changeCity() {
      const cityKey = document.getElementById('citySelect').value;
      const city = data[cityKey];
      if (!city) return;

      document.getElementById('cityName').textContent = city.name;
      document.getElementById('temp').textContent = city.temp;
      document.getElementById('high').textContent = "H: " + city.high + "°";
      document.getElementById('low').textContent = "L: " + city.low + "°";
      document.getElementById('weatherDesc').textContent = city.desc;
      document.getElementById('weatherIcon').textContent = city.icon;
      document.getElementById('wind').textContent = city.wind;
      document.getElementById('humidity').textContent = city.humidity;
      document.getElementById('uv').textContent = city.uv;

      document.getElementById('hTemp1').textContent = city.hourly[0] + "°";
      document.getElementById('hTemp2').textContent = city.hourly[1] + "°";
      document.getElementById('hTemp3').textContent = city.hourly[2] + "°";
      document.getElementById('hTemp4').textContent = city.hourly[3] + "°";
      document.getElementById('hTemp5').textContent = city.hourly[4] + "°";

      document.body.style.background = city.bg;
    }
  </script>
</body>
</html>`
}, {
  id: 'calculator-pwa',
  name: 'CalcSmart PWA',
  description: 'En fullt fungerande miniräknare med färgteman och historiklogg.',
  category: 'Utilities',
  icon: 'Calculator',
  html: `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CalcSmart</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white min-h-screen flex flex-col justify-end pb-8 font-sans">
  <div class="max-w-md mx-auto w-full px-6">
    <!-- History Toggle -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-lg font-bold text-zinc-400">CalcSmart</h1>
      <button onclick="toggleHistory()" class="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
        📜 Historik
      </button>
    </div>

    <!-- History Panel -->
    <div id="historyPanel" class="hidden bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-4 max-h-32 overflow-y-auto text-xs text-zinc-400">
      <div id="historyList" class="space-y-1">
        <p class="italic">Ingen historik än.</p>
      </div>
    </div>

    <!-- Screen -->
    <div class="text-right mb-6">
      <div id="formula" class="text-sm text-zinc-500 min-h-[20px] tracking-wide"></div>
      <div id="display" class="text-5xl font-light tracking-tight truncate mt-1">0</div>
    </div>

    <!-- Buttons Grid -->
    <div class="grid grid-cols-4 gap-3">
      <!-- Row 1 -->
      <button onclick="clearScreen()" class="bg-zinc-800 hover:bg-zinc-700 text-amber-500 font-medium py-4 rounded-2xl text-lg active:scale-95 active:bg-zinc-600 transition-all">AC</button>
      <button onclick="backspace()" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-4 rounded-2xl text-lg active:scale-95 active:bg-zinc-600 transition-all">⌫</button>
      <button onclick="appendOperator('%')" class="bg-zinc-800 hover:bg-zinc-700 text-indigo-400 font-medium py-4 rounded-2xl text-lg active:scale-95 active:bg-zinc-600 transition-all">%</button>
      <button onclick="appendOperator('/')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 active:bg-indigo-500 transition-all">÷</button>
      
      <!-- Row 2 -->
      <button onclick="appendNumber('7')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">7</button>
      <button onclick="appendNumber('8')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">8</button>
      <button onclick="appendNumber('9')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">9</button>
      <button onclick="appendOperator('*')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 active:bg-indigo-500 transition-all">×</button>

      <!-- Row 3 -->
      <button onclick="appendNumber('4')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">4</button>
      <button onclick="appendNumber('5')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">5</button>
      <button onclick="appendNumber('6')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">6</button>
      <button onclick="appendOperator('-')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 active:bg-indigo-500 transition-all">−</button>

      <!-- Row 4 -->
      <button onclick="appendNumber('1')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">1</button>
      <button onclick="appendNumber('2')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">2</button>
      <button onclick="appendNumber('3')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">3</button>
      <button onclick="appendOperator('+')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 active:bg-indigo-500 transition-all">+</button>

      <!-- Row 5 -->
      <button onclick="appendNumber('0')" class="col-span-2 bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl text-left pl-8 active:scale-95 transition-all">0</button>
      <button onclick="appendDecimal('.')" class="bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl text-xl active:scale-95 transition-all">,</button>
      <button onclick="calculate()" class="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold py-4 rounded-2xl text-xl active:scale-95 active:bg-amber-400 transition-all">=</button>
    </div>
  </div>

  <script>
    let currentInput = '0';
    let formula = '';
    let isCalculated = false;
    let history = [];

    const display = document.getElementById('display');
    const formulaDisplay = document.getElementById('formula');
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');

    function updateScreen() {
      display.textContent = currentInput.replace('.', ',');
      formulaDisplay.textContent = formula;
    }

    function appendNumber(num) {
      if (currentInput === '0' || isCalculated) {
        currentInput = num;
        isCalculated = false;
      } else {
        currentInput += num;
      }
      updateScreen();
    }

    function appendDecimal() {
      if (isCalculated) {
        currentInput = '0.';
        isCalculated = false;
      } else if (!currentInput.includes('.')) {
        currentInput += '.';
      }
      updateScreen();
    }

    function appendOperator(op) {
      if (isCalculated) {
        formula = currentInput + ' ' + op + ' ';
        isCalculated = false;
      } else {
        formula += currentInput + ' ' + op + ' ';
      }
      currentInput = '0';
      updateScreen();
    }

    function clearScreen() {
      currentInput = '0';
      formula = '';
      isCalculated = false;
      updateScreen();
    }

    function backspace() {
      if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
      } else {
        currentInput = '0';
      }
      updateScreen();
    }

    function calculate() {
      if (!formula) return;
      
      const expression = formula + currentInput;
      try {
        // Safe evaluation helper
        const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
        const roundedResult = Math.round(result * 1000000) / 1000000;
        
        history.unshift(\`\${expression} = \${roundedResult}\`);
        if (history.length > 10) history.pop();
        updateHistoryUI();

        formula = expression + ' =';
        currentInput = roundedResult.toString();
        isCalculated = true;
        updateScreen();
      } catch (err) {
        currentInput = 'Fel';
        updateScreen();
      }
    }

    function toggleHistory() {
      historyPanel.classList.toggle('hidden');
    }

    function updateHistoryUI() {
      if (history.length === 0) {
        historyList.innerHTML = '<p class="italic">Ingen historik än.</p>';
        return;
      }
      historyList.innerHTML = history.map(item => \`<p class="py-1 border-b border-zinc-800 last:border-0">\${item}</p>\`).join('');
    }
  </script>
</body>
</html>`
}, {
  id: 'tictactoe-pwa',
  name: 'Tre på Rad Game',
  description: 'Klassiskt sällskapsspel. Spela mot en smart AI med poängräkning.',
  category: 'Games',
  icon: 'Gamepad2',
  html: `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tre på Rad</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white min-h-screen flex flex-col justify-between pb-8 font-sans">
  <div class="max-w-md mx-auto w-full px-6 pt-6 flex-1 flex flex-col justify-between">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">TRE PÅ RAD</h1>
      <p class="text-xs text-slate-400 mt-1">Spela mot datorn (AI)</p>
    </div>

    <!-- Scores -->
    <div class="grid grid-cols-3 gap-3 my-4">
      <div class="bg-slate-800/80 border border-slate-700/50 p-2.5 rounded-xl text-center">
        <p class="text-[10px] uppercase text-teal-400 font-bold">Du (X)</p>
        <p id="playerScore" class="text-lg font-bold">0</p>
      </div>
      <div class="bg-slate-800/80 border border-slate-700/50 p-2.5 rounded-xl text-center flex flex-col justify-center">
        <p class="text-[10px] uppercase text-slate-400 font-bold">Oavgjort</p>
        <p id="tiesScore" class="text-lg font-bold">0</p>
      </div>
      <div class="bg-slate-800/80 border border-slate-700/50 p-2.5 rounded-xl text-center">
        <p class="text-[10px] uppercase text-rose-400 font-bold">AI (O)</p>
        <p id="aiScore" class="text-lg font-bold">0</p>
      </div>
    </div>

    <!-- Turn indicator -->
    <div class="text-center py-2 text-sm font-semibold tracking-wide text-slate-300" id="status">
      Din tur att lägga!
    </div>

    <!-- Game Board -->
    <div class="flex justify-center my-4">
      <div class="grid grid-cols-3 gap-3 w-72 h-72">
        <button onclick="makeMove(0)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(1)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(2)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(3)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(4)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(5)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(6)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(7)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
        <button onclick="makeMove(8)" class="board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center transition-all focus:outline-none active:scale-95"></button>
      </div>
    </div>

    <!-- Reset -->
    <div class="px-6 mt-4">
      <button onclick="resetBoard()" class="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3 rounded-xl transition-all shadow-md active:scale-95">
        BÖRJA OM RUNDA
      </button>
    </div>
  </div>

  <script>
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { player: 0, ai: 0, ties: 0 };

    const cells = document.querySelectorAll('.board-cell');
    const statusText = document.getElementById('status');

    function makeMove(index) {
      if (board[index] !== '' || !gameActive) return;

      // Player move (X)
      board[index] = 'X';
      updateBoardUI();

      if (checkWin('X')) {
        endGame('player');
        return;
      }

      if (board.every(cell => cell !== '')) {
        endGame('tie');
        return;
      }

      // AI's turn
      gameActive = false;
      statusText.textContent = "AI tänker...";
      
      setTimeout(() => {
        const aiIndex = findBestMove();
        board[aiIndex] = 'O';
        updateBoardUI();

        if (checkWin('O')) {
          endGame('ai');
          return;
        }

        if (board.every(cell => cell !== '')) {
          endGame('tie');
          return;
        }

        gameActive = true;
        statusText.textContent = "Din tur!";
      }, 500);
    }

    function findBestMove() {
      // 1. Try to win
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          if (checkWin('O')) { board[i] = ''; return i; }
          board[i] = '';
        }
      }

      // 2. Block player win
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          if (checkWin('X')) { board[i] = ''; return i; }
          board[i] = '';
        }
      }

      // 3. Take center
      if (board[4] === '') return 4;

      // 4. Random empty cell
      const empties = board.map((cell, i) => cell === '' ? i : null).filter(val => val !== null);
      return empties[Math.floor(Math.random() * empties.length)];
    }

    function checkWin(player) {
      const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diags
      ];
      return wins.some(comb => comb.every(i => board[i] === player));
    }

    function endGame(winner) {
      gameActive = false;
      if (winner === 'player') {
        scores.player++;
        statusText.textContent = "🎉 Du vann runden!";
        statusText.className = "text-center py-2 text-sm font-extrabold tracking-wide text-teal-400";
      } else if (winner === 'ai') {
        scores.ai++;
        statusText.textContent = "🤖 AI vann runden!";
        statusText.className = "text-center py-2 text-sm font-extrabold tracking-wide text-rose-400";
      } else {
        scores.ties++;
        statusText.textContent = "🤝 Oavgjort spel!";
        statusText.className = "text-center py-2 text-sm font-extrabold tracking-wide text-slate-300";
      }
      updateScoresUI();
    }

    function updateBoardUI() {
      cells.forEach((cell, i) => {
        cell.textContent = board[i];
        if (board[i] === 'X') {
          cell.className = "board-cell bg-slate-800 rounded-2xl text-4xl font-extrabold flex items-center justify-center text-teal-400 transition-all shadow-inner";
        } else if (board[i] === 'O') {
          cell.className = "board-cell bg-slate-800 rounded-2xl text-4xl font-extrabold flex items-center justify-center text-rose-400 transition-all shadow-inner";
        } else {
          cell.className = "board-cell bg-slate-800 hover:bg-slate-700 rounded-2xl text-4xl font-extrabold flex items-center justify-center text-slate-600 transition-all active:scale-95";
        }
      });
    }

    function updateScoresUI() {
      document.getElementById('playerScore').textContent = scores.player;
      document.getElementById('aiScore').textContent = scores.ai;
      document.getElementById('tiesScore').textContent = scores.ties;
    }

    function resetBoard() {
      board = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      statusText.textContent = "Din tur att lägga!";
      statusText.className = "text-center py-2 text-sm font-semibold tracking-wide text-slate-300";
      updateBoardUI();
    }

    updateBoardUI();
  </script>
</body>
</html>`
}];