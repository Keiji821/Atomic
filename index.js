const net = require('net');

const portScan = async (host, ports) => {
const results = [];
for (let i = 0; i < ports.length; i++) {
const port = ports[i];
const socket = new net.Socket();
socket.connect(port, host);
socket.setTimeout(1000); // Agregamos un timeout de 1 segundo

socket.on('connect', () => {
results.push(`${port} is open`);
socket.destroy();
});

socket.on('timeout', () => {
results.push(`${port} is closed`);
socket.destroy();
});

socket.on('error', (err) => {
results.push(`${port} is closed`);
});
}
return results;
};

const securityScan = async (host) => {
const ports = await portScan(host, [80, 443, 22]);
const results = [];

ports.forEach((port) => {
if (port.includes('open')) {
results.push(`Puerto ${port} abierto`);
} else {
results.push(`Puerto ${port} cerrado`);
}
});

return results;
};

const ddosAttack = async (host, numConnections, attackDuration) => {
// Aquí va el código de ataque DDoS
console.log(`Iniciando ataque DDoS contra ${host}...`);
};

const updateCode = async () => {
// Aquí va el código para actualizar el código
console.log(`Actualizando código...`);
};

const showMenu = () => {
console.clear();
console.log('[31m              DDoS attack    ');
console.log('                           ');
console.log('[36m       ⭐️ Desarrollado por Keiji821');
console.log('[33m ⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃');
console.log('[32m ︳1. Iniciar ataque DDoS                ︳');
console.log('[36m ︳2. Actualizar código                  ︳');
console.log('[32m ︳3. Configurar conexiones simultaneas  ︳');
console.log('[33m ︳4. Aumentar potencia del ataque       ︳');
console.log('[32m ︳5. Realizar análisis de seguridad     ︳');
console.log('[31m ︳6. Salir                              ︳');
console.log('[33m ⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸍');
rl.setPrompt('[32m  🌐➤ ');
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
console.log(`Análisis de seguridad para ${url}:`);
results.forEach((result) => console.log(result));
showMenu();
}).catch((err) => console.error(err));
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