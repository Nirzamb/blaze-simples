const WebSocket = require('ws');

let ultimoMinuto = null;
let sinalHora = null;
let bateu45 = false;

function formatar(h, m) {
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
}

const ws = new WebSocket('wss://api-v2.blaze.com/roulette_games/recent');

ws.on('open', () => {
  console.log("🟢 Sistema conectado");
});

ws.on('message', (msg) => {
  const data = JSON.parse(msg);

  const numero = data.roll;
  const dt = new Date(data.created_at);

  const minuto = dt.getMinutes();
  const hora = dt.getHours();

  let primeira = false;

  if (minuto !== ultimoMinuto) {
    primeira = true;
    ultimoMinuto = minuto;
  }

  if (minuto === 30 && primeira && numero === 11) {
    sinalHora = hora;
    bateu45 = false;

    let h45 = formatar(hora,45);
    let h55 = formatar(hora,55);

    console.log("");
    console.log("🚨 SINAL DETECTADO");
    console.log(`⚪️ ${h45}`);
    console.log(`⚪️ ${h55}`);
  }

  if (sinalHora !== null && minuto === 45 && hora === sinalHora) {
    if (numero === 0) {
      bateu45 = true;
    }
  }

  if (sinalHora !== null && minuto === 55 && hora === sinalHora) {

    if (bateu45 || numero === 0) {
      console.log("🟢 WIN");
    } else {
      console.log("🔴 LOSS");
    }

    sinalHora = null;
  }
});
