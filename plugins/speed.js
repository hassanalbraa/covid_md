import { cpus as _cpus, totalmem, freemem } from 'os'
import os from 'os'
import { performance } from 'perf_hooks'

var handler = async (m, { conn }) => {

  try {

    let start = performance.now()

    await conn.reply(m.chat, '⏳ جاري القياس...', m)

    let end = performance.now()

    let speed = end - start

    let text = `
📡 PING: ${Math.round(speed)} ms
💾 *الرام*: ${((totalmem() - freemem()) / 1024 / 1024).toFixed(2)} MB
🖥️ *النظام*: ${os.platform()}
`

    await conn.reply(m.chat, text, m)

  } catch (e) {
    console.log(e)
    await conn.reply(m.chat, '❌ خطأ في أمر ping', m)
  }
}

handler.command = /^(بنق)$/i
export default handler