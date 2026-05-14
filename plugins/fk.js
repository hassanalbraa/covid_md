import nodemailer from 'nodemailer'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    const config = {
        senderEmail: 'jockercraft994@gmail.com', 
        appPassword: 'mxxz kefg ztmk ykrz', 
        subject: 'ОФИЦИАЛЬНАЯ ПРЕТЕНЗИЯ: Незаконная блокировка и немедленное требование восстановления доступа',
        
        template: `Уважаемая команда технической поддержки и юридический отдел WhatsApp,
Я обращаюсь к вам с официальной претензией по поводу неправомерной приостановки обслуживания моего аккаунта, привязанного к номеру телефона: [NUMBER] 
Данная блокировка была произведена вашей автоматизированной системой без предварительного уведомления и без каких-либо законных оснований. Я официально заявляю, что использование данного номера полностью соответствует вашим "Условиям предоставления услуг". Я не нарушал политику безопасности, не использовал стороннее программное обеспечение и не занимался массовой рассылкой сообщений.
Ваши действия нарушают мои права на связь и доступ к личной и деловой информации. Ошибка в работе ваших алгоритмов модерации наносит мне прямой моральный и материальный ущерб.
Я КАТЕГОРИЧЕСКИ ТРЕБУЮ:
1. Провести немедленную повторную проверку моего аккаунта вручную квалифицированным специалистом.
2. Снять все ограничения и восстановить доступ ко всем функциям мессенджера в приоритетном порядке.
3. Предоставить официальное разъяснение причин приостановки, если вы считаете свои действия правомерными.
Я настаиваю на том, что блокировка является технической ошибкой. В случае игнорирования данного обращения я оставляю за собой право обратиться в соответствующие инстанции по защите прав потребителей.
Ожидаю немедленного решения проблемы и уведомления о восстановлении доступа.
С уважением,
Пользователь WhatsApp.
Контактный номер: [NUMBER] .`
    }

    const recipients = ['support@support.whatsapp.com', 'consumer@support.whatsapp.com']

    if (!text) return m.reply(`يرجى كتابة رقم الهاتف بالصيغة الدولية.\n\nمثال:\n${usedPrefix + command} +249123456789`)
    
    let phoneNumber = text.trim()
    if (phoneNumber.length < 9) return m.reply('يرجى كتابة رقم هاتف صحيح كامل مع رمز الدولة.')

    let finalMessage = config.template.replace(/\[NUMBER\]/g, phoneNumber)

    // إعداد السيرفر بمنفذ 587 وهو الأكثر استقراراً في السودان
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // يجب أن تكون false للمنفذ 587
        auth: {
            user: config.senderEmail,
            pass: config.appPassword
        },
        family: 4, // إجبار استخدام IPv4 لتجاوز خطأ ENETUNREACH
        tls: {
            rejectUnauthorized: false // تجاوز تدقيق الشهادات لتسريع الاتصال في الشبكات الضعيفة
        }
    })

    let mailOptions = {
        from: `"WhatsApp Support" <${config.senderEmail}>`,
        to: recipients.join(','),
        subject: config.subject,
        text: finalMessage
    }

    try {
        await m.reply('جاري إرسال الاعتراض الرسمي لمكاتب واتساب...')
        
        await transporter.sendMail(mailOptions)
        
        let successMsg = `تم إرسال طلب فك الحظر بنجاح\n\n`
        successMsg += `الرقم المرفوع: ${phoneNumber}\n`
        successMsg += `ملاحظة: شركة واتساب بترد غالباً خلال دقائق على إيميلك الشخصي.`
        
        await m.reply(successMsg)

    } catch (e) {
        console.error('Email Error:', e)
        let errorMsg = `فشل الإرسال\n\n`
        if (e.message.includes('EAUTH')) {
            errorMsg += `السبب: كلمة مرور التطبيق (App Password) غير صحيحة.`
        } else if (e.message.includes('ENETUNREACH') || e.message.includes('ETIMEDOUT')) {
            errorMsg += `السبب: مشكلة في اتصال الشبكة أو حظر من الشركة المزودة، يفضل تشغيل VPN.`
        } else {
            errorMsg += `السبب: ${e.message}`
        }
        m.reply(errorMsg)
    }
}

handler.help = ['فك']
handler.tags = ['tools']
handler.command = /^(فك|unban|support_wa)$/i

export default handler
