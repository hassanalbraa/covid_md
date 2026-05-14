import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = m => m

handler.before = async function (m, { conn, isOwner }) {
    // التحقق من وجود رد وأنك صاحب البوت (أو مسجل كـ Owner)
    if (!m.quoted || !isOwner) return false

    // استخراج الرسالة المردود عليها (View Once)
    const quoted = m.quoted.message?.viewOnceMessageV2?.message || 
                   m.quoted.message?.viewOnceMessage?.message || 
                   m.quoted.message

    const quotedImage = quoted?.imageMessage
    const quotedVideo = quoted?.videoMessage

    // إذا كانت صورة عرض لمرة واحدة
    if (quotedImage && (quotedImage.viewOnce || m.quoted.mtype === 'viewOnceMessage')) {
        try {
            const stream = await downloadContentFromMessage(quotedImage, 'image')
            let buffer = Buffer.from([])
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
            
            await conn.sendMessage(m.sender, { 
                image: buffer, 
                caption: quotedImage.caption || '✅ تم الاستخراج بنجاح' 
            }, { quoted: m })
            
            return true
        } catch (e) {
            console.error(e)
        }
    } 
    
    // إذا كان فيديو عرض لمرة واحدة
    else if (quotedVideo && (quotedVideo.viewOnce || m.quoted.mtype === 'viewOnceMessage')) {
        try {
            const stream = await downloadContentFromMessage(quotedVideo, 'video')
            let buffer = Buffer.from([])
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
            
            await conn.sendMessage(m.sender, { 
                video: buffer, 
                caption: quotedVideo.caption || '✅ تم الاستخراج بنجاح' 
            }, { quoted: m })
            
            return true
        } catch (e) {
            console.error(e)
        }
    }

    return false
}

export default handler
