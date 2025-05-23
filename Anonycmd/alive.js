const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function aliveCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: 'Tested' });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `
┏━━   🤖ANONYMOUS-MD   ━━┓
┃ ⏱️ Uptime   : ${uptimeFormatted}
┃ 🔖 Version  : v${settings.version}
┃ 😌  status  : *ONLINE*
┃ 🇺🇬                     🇺🇬
┗━━━━━━━━━━━━━━━━┛`.trim();

        // Send image with caption
        await sock.sendMessage(chatId, {
            image: { url: 'https://files.catbox.moe/aid1i4.jpg' },
            mimetype: 'image/jpeg',
            caption: botInfo,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363397100406773@newsletter',
                    newsletterName: 'Anonymous MD by Terrivez',
                    serverMessageId: -1
                }
            },
            quoted: message
        });

        // Send audio as voice note
        await sock.sendMessage(chatId, {
            audio: { url: 'https://files.catbox.moe/nkjmd7.m4a' },
            mimetype: 'audio/mp4',
            ptt: true,
            quoted: message
        });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get bot status.' });
    }
}

module.exports = aliveCommand;
