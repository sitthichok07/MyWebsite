// IoT Dashboard Controller Logic

// 1. Session check
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
} else {
    // Set username dynamically if saved
    const savedUser = sessionStorage.getItem('username');
    if (savedUser) {
        const nameDisplays = [document.getElementById('userNameDisplay'), document.querySelector('.content-header .highlight')];
        nameDisplays.forEach(el => {
            if (el) el.textContent = savedUser;
        });
    }
}

// 2. Real-time Digital Clock
function updateClock() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    timeDisplay.textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// 3. Logger Terminal Helper
function addLog(message, type = 'info') {
    const terminal = document.getElementById('terminalLogs');
    if (!terminal) return;
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const logLine = document.createElement('div');
    
    // Choose CSS text class based on log type
    let typeClass = 'text-info';
    let prefix = '[INFO]';
    
    if (type === 'system') {
        typeClass = 'text-system';
        prefix = '[SYSTEM]';
    } else if (type === 'sensor') {
        typeClass = 'text-sensor';
        prefix = '[SENSOR]';
    } else if (type === 'control') {
        typeClass = 'text-control';
        prefix = '[CONTROL]';
    }
    
    logLine.className = `log-line ${typeClass}`;
    logLine.textContent = `[${timeStr}] ${prefix} ${message}`;
    
    terminal.appendChild(logLine);
    
    // Auto scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

// 4. Device Switches Controller
function toggleDevice(deviceName, isChecked) {
    const statusText = document.getElementById(`status${deviceName}Text`);
    const box = document.getElementById(`switch${deviceName}Box`);
    
    const stateStr = isChecked ? 'เปิดใช้งาน' : 'ปิดใช้งาน';
    const logState = isChecked ? 'เปิด (ON)' : 'ปิด (OFF)';
    
    if (statusText) statusText.textContent = stateStr;
    
    // Update container design with active colors
    if (box) {
        const activeClass = `active-${deviceName.toLowerCase()}`;
        if (isChecked) {
            box.classList.add(activeClass);
        } else {
            box.classList.remove(activeClass);
        }
    }
    
    // Log action to terminal
    addLog(`สวิตช์ ${deviceName} ถูก ${logState} โดยผู้ใช้`, 'control');
}

// 5. Sensor Simulator (Legacy support for "Random Temperature" requested)
function triggerRandomSimulation() {
    // Random Temp: 15 to 40 °C
    const newTemp = (Math.random() * (40 - 15) + 15).toFixed(1);
    // Random Humidity: 40 to 90%
    const newHumid = Math.floor(Math.random() * (90 - 40) + 40);
    // Random Power consumption: 50 to 500 Watts
    const newPower = Math.floor(Math.random() * (500 - 50) + 50);

    // Update UI elements
    const tempVal = document.getElementById('tempValue');
    const humidVal = document.getElementById('humidityValue');
    const powerVal = document.getElementById('powerValue');

    if (tempVal) tempVal.textContent = newTemp;
    if (humidVal) humidVal.textContent = newHumid;
    if (powerVal) powerVal.textContent = newPower;

    // Log to terminal
    addLog(`สุ่มจำลองค่าสำเร็จ: อุณหภูมิ ${newTemp}°C, ความชื้น ${newHumid}%, สิ้นเปลืองไฟ ${newPower}W`, 'sensor');
}

// 6. Automatic Simulation Interval
let simInterval = null;

function toggleAutoSimulate() {
    const simBtn = document.getElementById('simBtn');
    const simIcon = document.getElementById('simIcon');
    const simText = document.getElementById('simText');
    
    if (simInterval) {
        // Stop simulation
        clearInterval(simInterval);
        simInterval = null;
        simBtn.classList.remove('active');
        simText.textContent = 'จำลองข้อมูลอัตโนมัติ';
        simIcon.setAttribute('data-lucide', 'play');
        addLog('หยุดการจำลองข้อมูลอัตโนมัติ', 'system');
    } else {
        // Start simulation (update every 3s)
        simInterval = setInterval(() => {
            // Add slight drift instead of complete random to feel more realistic
            const tempVal = document.getElementById('tempValue');
            const humidVal = document.getElementById('humidityValue');
            const powerVal = document.getElementById('powerValue');

            if (tempVal && humidVal && powerVal) {
                let currentTemp = parseFloat(tempVal.textContent);
                let currentHumid = parseInt(humidVal.textContent);
                let currentPower = parseInt(powerValue.textContent);

                // Add small changes
                let tempDrift = (Math.random() * 0.8 - 0.4).toFixed(1);
                let humidDrift = Math.floor(Math.random() * 3 - 1);
                let powerDrift = Math.floor(Math.random() * 20 - 10);

                let nextTemp = (currentTemp + parseFloat(tempDrift)).toFixed(1);
                let nextHumid = Math.max(10, Math.min(100, currentHumid + humidDrift));
                let nextPower = Math.max(0, currentPower + powerDrift);

                tempVal.textContent = nextTemp;
                humidVal.textContent = nextHumid;
                powerVal.textContent = nextPower;

                addLog(`อัปเดตข้อมูลเซ็นเซอร์ (Auto): Temp ${nextTemp}°C, Humid ${nextHumid}%, Power ${nextPower}W`, 'sensor');
            }
        }, 3000);
        
        simBtn.classList.add('active');
        simText.textContent = 'กำลังจำลองข้อมูล...';
        simIcon.setAttribute('data-lucide', 'square');
        addLog('เริ่มต้นการจำลองข้อมูลอัตโนมัติ (รอบการทำงาน 3 วินาที)', 'system');
    }
    
    // Re-render Lucide icons
    lucide.createIcons();
}

// 7. Clear Logs
function clearLogs() {
    const terminal = document.getElementById('terminalLogs');
    if (terminal) {
        terminal.innerHTML = '';
        addLog('ล้างประวัติบันทึกเรียบร้อย', 'system');
    }
}

// 8. Logout logic
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
}