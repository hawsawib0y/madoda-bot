import 'dotenv/config';
import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import express from 'express';

// ====== KEEP ALIVE FOR RENDER ======
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT ======
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
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

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.trim();

    if (!msg.startsWith('-')) return;
    const parts = msg.split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    try {
        // ---- موجود ولا بيغ بوس جا ----
        if (command === '-موجود' || command === '-موجود_ولا_بيغ_بوس_جا') {
            return message.reply(`موجود البيغ بوس ما جا 🏓 (البينغ: ${client.ws.ping}ms)`);
        }

        // ---- نكتة ----
        if (command === '-نكتة') {
            return message.reply(jokes[Math.floor(Math.random() * jokes.length)]);
        }

        // ---- من_انت ----
        if (command === '-من_انت') {
            const description = Object.keys(members).map(name => {
                const m = members[name];
                return `${name}:\nالاسم كامل: ${m["الاسم كامل"]}\nالجنسية: ${m["الجنسية"]}\nالديار: ${m["الديار"]}\nايش يرجع: ${m["ايش يرجع"]}\nالصفات: ${m["الصفات"]}`;
            }).join("\n\n");
            return message.reply(description);
        }

        // ---- ور بي فكك ----
        if (command === '-وربي_فكك') {
            const jokesFun = [
                'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟ قال: لأنها غالية 😂',
                'مرة حضرمي قال: الجوع ذبحني وانا مالي دخل 😎',
                'مرة حضرمي دخل السوق وقال: كم الريال؟ قالوا: 1، قال: اعطني كيلو 😂'
            ];
            return message.reply(jokesFun[Math.floor(Math.random() * jokesFun.length)]);
        }

        // ---- صباح ومساء ----
        if (command === '-امصباح') return message.reply('صباح الخير 🌞');
        if (command === '-امليل') return message.reply('مساء الخير 🌙');

        // ---- الروم ----
        if (command === '-يخال' && args[0] !== 'خش') {
            // -يخال -> خروج من الروم
            if (currentRoom) {
                await message.reply(`خرجت من الروم: ${currentRoom}`);
                currentRoom = null;
            } else {
                await message.reply('أنا مش داخل أي روم حالياً.');
            }
        }

        if (command === '-يخال' && args[0] === 'خش') {
            const roomId = args[1];
            if (!roomId) return message.reply('حدد رقم الروم!');
            currentRoom = roomId;
            return message.reply(`دخلت الروم: ${roomId} ولن أخرج إلا إذا قلت -يخال`);
        }

        // ---- أوامر إدارية ----
        if (command === '-كي_قفل_فمك') {
            if (!message.member.permissions.has('ModerateMembers')) return message.reply('ما عندك صلاحية 😎');
            const user = message.mentions.members.first();
            if (!user) return message.reply('اختر عضو عشان تعطيه ميوت 😅');
            try {
                await user.timeout(60000);
                return message.reply(`عضو ${user.user.username} صار ميوت 🕶️`);
            } catch {
                return message.reply('ما قدرت اعطيه ميوت — تأكد صلاحيات البوت ورتبته 😅');
            }
        }

        if (command === '-ترحيل_الكلب') {
            if (!message.member.permissions.has('BanMembers')) return message.reply('ما عندك صلاحية 😎');
            const user = message.mentions.members.first();
            if (!user) return message.reply('اختر عضو عشان تطرده 😅');
            try {
                await user.ban();
                return message.reply(`عضو ${user.user.username} انبند 😎`);
            } catch {
                return message.reply('ما قدرت انبنده — تأكد صلاحيات البوت ورتبته 😅');
            }
        }

        if (command === '-روح_لفلف_بمدودة_وتعال') {
            if (!message.member.permissions.has('KickMembers')) return message.reply('ما عندك صلاحية 😎');
            const user = message.mentions.members.first();
            if (!user) return message.reply('اختر عضو عشان تطرده مؤقت 😅');
            try {
                await user.kick();
                return message.reply(`عضو ${user.user.username} طُرد مؤقت 😎`);
            } catch {
                return message.reply('ما قدرت اطرحه — تأكد صلاحيات البوت ورتبته 😅');
            }
        }

        if (command === '-نظف_المكان') {
            if (!message.member.permissions.has('ManageMessages')) return message.reply('ما عندك صلاحية 😎');
            const amount = parseInt(args[0]);
            if (!amount || amount < 1 || amount > 100) return message.reply('حدد عدد بين 1 و100 😅');
            try {
                await message.channel.bulkDelete(amount);
                return message.reply(`${amount} رسائل تم مسحها 😎`);
            } catch {
                return message.reply('ما قدرت امسح الرسائل — جرب مره ثانية 😅');
            }
        }

        // ---- تعريف ----
        if (command === '-تعريف') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('yasser').setLabel('ياسر').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('ahmed').setLabel('أحمد').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('ammar').setLabel('عمار').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('yousef').setLabel('يوسف').setStyle(ButtonStyle.Primary)
                );
            return message.reply({ content: 'اختر اسم الشخص للتعريف 👇', components: [row] });
        }

    } catch (err) {
        console.error(err);
    }
});

// ====== BUTTON & SELECT MENU INTERACTIONS ======
client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isButton()) {
            if (interaction.customId === 'yasser') return interaction.reply({ content: 'ياسر: عمي وعم الكل هنا، رجل قوي، موضع احترام 🌴', ephemeral: false });
            if (interaction.customId === 'ahmed') return interaction.reply({ content: `أحمد:
الاسم كامل: احمد فتحي احمد باحميد
الجنسية: اليمن
الديار: مدودة
ايش يرجع: طيورة
الصفات: خال، رجال، جلاد يوسف`, ephemeral: false });
            if (interaction.customId === 'ammar') return interaction.reply({ content: 'عمار: نائب البيغ بوس، شخص قوي ومؤثر 🌴😎', ephemeral: false });
            if (interaction.customId === 'yousef') return interaction.reply({ content: `يوسف:
يوسف القحطاني (ابو قحط)
الجنسية: نص يمن نص سعودية
الديار: ماعنده مترحل من مدودة
ايش يرجع: قاضي او قحطاني
الصفات: كابوس احمد، خال، نشبة، مطوع`, ephemeral: false });
        }
    } catch (err) {
        console.error(err);
    }
});

// ====== LOGIN ======
if (!process.env.TOKEN) {
    console.error("❌ الرجاء إضافة TOKEN في Environment Variables");
    process.exit(1);
}
client.login(process.env.TOKEN);
