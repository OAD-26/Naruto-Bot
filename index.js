// ===============================
// Naruto Bot 🍥
// ===============================

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Naruto Bot is alive 🍥");
});

app.get("/status", (req, res) => {
  res.json({
    bot: "Naruto Bot",
    status: "online",
    owner: "Oluwafemi Ayo David",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");
const settings = require("./settings");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["NarutoBot", "Chrome", "1.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("📲 Scan this QR code:");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") {
      console.log("✅ Naruto Bot connected successfully!");
      // Optionally send a message to owner or a specific group
    }
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        startBot();
      }
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;
    if (action === "add") {
        const imagePath = path.join(__dirname, 'Assets/When_Bot_Is_Allowed_In_Group.jpeg');
        const welcomeMsg = "🍥 *Welcome to the group!* 🔥 Believe it! We're glad to have you here!";
        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(id, { image: fs.readFileSync(imagePath), caption: welcomeMsg, mentions: participants });
        } else {
            await sock.sendMessage(id, { text: welcomeMsg, mentions: participants });
        }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    if (!text.startsWith(settings.prefix)) return;

    const args = text.slice(settings.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const commandPath = path.join(__dirname, "Command", `${commandName}.js`);
    if (fs.existsSync(commandPath)) {
      try {
        const commandFile = require(commandPath);
        if (typeof commandFile === "function") {
          await commandFile(sock, from, msg, args);
        } else if (commandFile && typeof commandFile.execute === "function") {
          await commandFile.execute(sock, msg, args);
        }
      } catch (e) {
        console.error(`Error executing command ${commandName}:`, e);
      }
    }
  });
}

startBot();
