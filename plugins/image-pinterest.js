import fetch from 'node-fetch'
import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const handler = async (m, { usedPrefix, command, conn, args }) => {
    if (!args[0]) throw `❌ مثال: ${usedPrefix}${command} فتاة أنيمي`;
    m.reply(wait);

    try {
        const q = encodeURIComponent(args.join(' '));
        const response = await fetch(`${APIs.ryzumi}/api/search/pinterest?query=${q}`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length < 1) {
            return m.reply('❌ لم يتم العثور على صور');
        }

        const results = data.sort(() => Math.random() - 0.5).slice(0, Math.min(5, data.length));
        const nem = await conn.getName(m.sender);
        const push = [];

        async function createImage(url) {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': url
                }
            });
            if (!res.ok) throw new Error(`❌ فشل تحميل الصورة: ${res.status}`);
            const buffer = Buffer.from(await res.arrayBuffer());
            const { imageMessage } = await generateWAMessageContent(
                { image: buffer },
                { upload: conn.waUploadToServer }
            );
            return imageMessage;
        }

        for (const result of results) {
            const imageMsg = await createImage(result.directLink);
            push.push({
                body: proto.Message.InteractiveMessage.Body.create({ text: result.link }),
                footer: proto.Message.InteractiveMessage.Footer.create({ text: global.footer }),
                header: proto.Message.InteractiveMessage.Header.create({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: imageMsg
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [{
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: 'عرض في Pinterest',
                            cta_type: '1',
                            url: result.link
                        })
                    }]
                })
            });
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({ text: `📸 إجمالي النتائج: ${push.length}` }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: `مرحباً ${nem} 👋\nنتائج بحث Pinterest` }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({ cards: push })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch (e) {
        throw `❌ خطأ: ${e.message}`;
    }
};

handler.help = ['pinterest'];
handler.tags = ['internet'];
handler.command = /^pin(terest)?$/i;
handler.limit = 2;
handler.register = true;

export default handler;
