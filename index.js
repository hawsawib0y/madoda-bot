import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import express from 'express';

// بوت Discord
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// الأشخاص
const members = {
    "احمد": { "الاسم كامل": "احمد فتحي احمد باحميد", "الجنسية": "اليمن", "الديار": "مدودة", "ايش يرجع": "طيورة", "الصفات": "خال، رجال، جلاد يوسف" },
    "يوسف": { "الاسم كامل": "يوسف القحطاني (ابو قحط)", "الجنسية": "نص يمن نص سعودية", "الديار": "ماعنده مترحل من مدودة", "ايش يرجع": "قاضي او قحطاني", "الصفات": "كابوس احمد، خال، نشبة، مطوع" },
    "ياسر": { "الاسم كامل": "ياسر الباشا", "الجنسية": "اليمن", "الديار": "الرياض", "ايش يرجع": "خير وبركة", "الصفات": "قائد، طيب، ذكي، محبوب" },
    "عمار": { "الاسم كامل": "عمار الحمدي", "الجنسية": "اليمن", "الديار": "صنعاء", "ايش يرجع": "إبداع ونجاح", "الصفات": "مجتهد، صبور، طموح، محبوب" }
};

// نكت
const jokes = [
    "مرة حضرمي قال لصاحبه: وين رايح؟ قال: أدور على صبر لأمي!",
    "الحضرمي لما شاف المطر، قال: الحمد لله، الأرض أخيراً ارتاحت.",
    "واحد حضرمي حاول يطبخ، بس نسي الملح، قال: الطعم مثل السفر الطويل، بلا نهاية."
];

// الغرفة الحالية
let currentRoom = null;

// التعامل مع الرسائل
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const content = message.content.trim();
    if (!content.startsWith('-')) return;

    const command = content.slice(1).split(' ')[0];
    const args = content.split(' ').slice(1);

    try {
        if (command === 'ping') {
            await message.reply('MS');
        } else if (command === 'موجود') {
            await message.reply('لا ماجا');
        } else if (command === 'نكتة') {
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            await message.reply(joke);
        } else if (command === 'من_انت') {
            const description = Object.keys(members).map(name => {
                const m = members[name];
                return `${name}:\nالاسم كامل: ${m["الاسم كامل"]}\nالجنسية: ${m["الجنسية"]}\nالديار: ${m["الديار"]}\nايش يرجع: ${m["ايش يرجع"]}\nالصفات: ${m["الصفات"]}`;
            }).join("\n\n");
            await message.reply(description);
        } else if (command === 'room') {
            const roomId = args[0];
            currentRoom = roomId;
            await message.reply(`دخلت الروم: ${roomId} ولن أخرج إلا إذا قلت -خرج`);
        } else if (command === 'خرج') {
            if (currentRoom) {
                await message.reply(`خرجت من الروم: ${currentRoom}`);
                currentRoom = null;
            } else {
                await message.reply('أنا مش داخل أي روم حالياً.');
            }
        }
    } catch (error) {
        console.error(error);
        await message.reply('حصل خطأ ⚠️');
    }
});

// Express Web Server
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('بوت Discord شغال كـ Web Service!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// تسجيل الدخول
if (!process.env.TOKEN) {
    console.error("❌ الرجاء إضافة TOKEN في Environment Variables على Render");
    process.exit(1);
}
client.login(process.env.TOKEN);
