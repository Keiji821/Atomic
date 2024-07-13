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
  }
};

const decorations = {
  underline: '[4m',
  bold: '[1m',
  italic: '[3m',
};

const async = require('async');
const axios = require('axios');
const geoip = require('geoip-lite');
const { exec } = require('child_process');

const showMenu = () => {
  console.clear();
  console.log('[31m[1m                DDoS attack   ');
  console.log('[36m[1m      ⭐️ Desarrollado por Keiji821');
  console.log('                ');
  console.log('[32m【1[32m】 [37m[1m Iniciar ataque DDoS');
  console.log('[32m【2[32m】 [37m[1m Actualizar código');
  console.log('[32m【3[32m】 [37m[1m Configurar conexiones simultáneas');
  console.log('[32m【4[32m】 [37m[1m Aumentar potencia del ataque');
  console.log('[32m【5[32m】 [37m[1m Información de DNS para una dirección IP');
  console.log('[32m【6[32m】 [37m[1m Análisis de IP');
  console.log('[32m【7[32m】 [37m[1m Información geográfica de IP');
  console.log('               ');
  console.log('[32m【0[32m】❌️ [31m[1m Salir');
  console.log('               ');
  rl.setPrompt('[37m[1m ｢🌐｣➤ ');
  rl.prompt();
};




