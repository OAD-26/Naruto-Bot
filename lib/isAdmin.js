async function isAdmin(sock, chatId, senderId) {
    const metadata = await sock.groupMetadata(chatId);
    const participants = metadata.participants || [];
    
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const senderIdFormatted = senderId.split(':')[0] + '@s.whatsapp.net';
    
    const botParticipant = participants.find(p => p.id === botId || p.id === sock.user.id);
    const senderParticipant = participants.find(p => p.id === senderIdFormatted || p.id === senderId);
    
    return {
        isBotAdmin: botParticipant ? (botParticipant.admin || botParticipant.isSuperAdmin) : false,
        isSenderAdmin: senderParticipant ? (senderParticipant.admin || senderParticipant.isSuperAdmin) : false
    };
}

module.exports = isAdmin;
