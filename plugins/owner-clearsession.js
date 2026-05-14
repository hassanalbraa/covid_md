import { join } from 'path'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, __dirname }) => {
    try {

        const sessionsDir = join(__dirname, '../sessions')

        if (!existsSync(sessionsDir)) {
            return m.reply('❌ مجلد sessions غير موجود')
        }

        const files = readdirSync(sessionsDir)

        let deleted = 0

        for (let file of files) {

            if (file === 'creds.json') continue

            const filePath = join(sessionsDir, file)

            try {
                const stats = statSync(filePath)

                if (stats.isDirectory()) continue

                unlinkSync(filePath)
                deleted++

            } catch (e) {
                console.log('Skip:', file, e.message)
            }
        }

        return m.reply(`✅ تم حذف ${deleted} ملف جلسة بنجاح`)

    } catch (e) {
        console.error(e)
        return m.reply('❌ حدث خطأ أثناء حذف الجلسات')
    }
}

handler.command = /^(clearsession|clear|تنظيف)$/i
handler.owner = true

export default handler