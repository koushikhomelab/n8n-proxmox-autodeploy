const body = $input.first().json.body || $input.first().json;

// Generate a random Client ID between 110 and 250 (maps to CT ID, WireGuard IP, and LAN IP)
const clientId = Math.floor(Math.random() * (250 - 110 + 1)) + 110;
const publicPort = 20000 + clientId; // e.g., 20145
const wgIp = `10.99.0.${clientId}`;
const lxcLanIp = `192.168.5.${clientId}`; // Free range on your LAN so n8n can SSH in

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
let dbPass = '';
for (let i = 0; i < 16; i++) {
  dbPass += chars.charAt(Math.floor(Math.random() * chars.length));
}

const engine = (body.engine || 'mysql').toLowerCase();
const internalPort = engine === 'mysql' ? 3306 : (engine === 'redis' ? 6379 : 5432);

return [{
  json: {
    email: body.email,
    engine,
    ramMb: Number(body.ram_mb || 512),
    vmid: clientId,
    publicPort,
    internalPort,
    wgIp,
    lxcLanIp,
    dbUser: `user_${clientId}`,
    dbPass,
    dbName: 'sandbox'
  }
}];
