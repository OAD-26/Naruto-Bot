const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'menu',
    description: 'Show bot menu',
    execute: async (sock, msg, text) => {
        const jid = msg.key.remoteJid;
        const menu = `
✅ *Naruto Bot Commands*

!ping - Test the bot
!alive - Check if bot is alive
!gpt <question> - Ask AI a question
!goodbye - Goodbye message when someone leaves
!menu - Show this menu
        `;
        
        const imagePath = path.join(__dirname, '../Assets/Bot_Avatar.jpg');
        const stickerPath = path.join(__dirname, '../Assets/sticker-intro.webp');
        
        if (fs.existsSync(stickerPath)) {
            await sock.sendMessage(jid, { sticker: fs.readFileSync(stickerPath) }, { quoted: msg });
        }
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(jid, { 
                image: imageBuffer, 
                caption: menu 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, { text: menu }, { quoted: msg });
        }
    }
};
