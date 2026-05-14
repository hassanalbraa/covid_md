import syntaxerror from 'syntax-error'
import { format } from 'util'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

let handler = async (m, { conn, usedPrefix, noPrefix, args, groupMetadata }) => {

    let old = m.exp * 1
    let _syntax = ''
    let result

    let text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix

    try {
        if (!text) throw '❌ لا يوجد كود'

        let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

        let func = new AsyncFunction(
            'print', 'm', 'conn', 'args', 'groupMetadata', 'require', 'process',
            text
        )

        result = await func.call(
            conn,
            (...args) => {
                conn.reply(m.chat, format(args), m)
            },
            m,
            conn,
            args,
            groupMetadata,
            require,
            process
        )

    } catch (e) {
        let err = syntaxerror(text, 'Eval', {
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true,
            sourceType: 'module'
        })

        if (err) _syntax = '```' + err + '```\n\n'
        result = e
    }

    conn.reply(m.chat, _syntax + format(result), m)
    m.exp = old
}

handler.help = ['=>', '= ']
handler.tags = ['advanced']
handler.customPrefix = /^=?> /
handler.command = /(?:)/i
handler.owner = true

export default handler