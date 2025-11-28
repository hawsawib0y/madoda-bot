import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import express from 'express';

// ==== إعداد البوت ====
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// ==== تعريف الأشخاص ====
const members = {
    "احمد": {
        "الاسم كامل": "احمد فتحي احمد باحميد",
        "الجنسية": "اليمن",
        "الديار": "مدودة",
        "ايش يرجع": "طيورة",
        "الصفات": "خال، رجال، جلاد يوسف"
    },
    "يوسف": {
        "الاسم كامل": "يوسف القحطاني (ابو قحط)",
        "الجنسية": "نص يمن نص سعودية",
        "الديار": "ماعنده مترحل من مدودة",
        "ايش يرجع": "قاضي او قحطاني",
        "الصفات": "كابوس احمد، خال، نشبة، مطوع"
    },
    "ياسر": {
        "الاسم كامل": "ياسر الباشا",
        "الجنسية": "اليمن",
        "الديار": "الرياض",
        "ايش يرجع": "خير وبركة",
        "الصفات": "قائد، طيب، ذكي، محبوب"
    },
    "عمار": {
        "الاسم كامل": "عمار الحمدي",
        "الجنسية": "اليمن",
        "الديار": "صنعاء",
        "ايش يرجع": "إبداع ونجاح",
        "الصفات": "مجتهد، صبور، طموح، محبوب"
    }
};

// ==== النكت ====
const jokes = [
    "مرة حضرمي قال لصاحبه: وين رايح؟ قال: أدور على صبر لأمي!",
    "الحضرمي لما شاف المطر، قال: الحمد لله، الأرض أخيراً ارتاحت.",
    "واحد حضرمي حاول يطبخ، بس نسي الملح، قال: الطعم مثل السفر الطويل، بلا نهاية."
];

// ==== الغرفة الحالية ====
let currentRoom = null;

// ==== تسجيل الأوامر في Discord ====
const commands = [
    { name: 'ping', description: 'يرد MS' },
    { name: 'موجود', description: 'يرد لا ماجا' },
    { name: 'نكتة', description: 'يعطي نكتة' },
    { name: 'من_انت', description: 'يعطي معلومات عن الأشخاص' },
    {
        name: 'room',
        description: 'يدخل روم محدد',
        options: [
            { name: 'id', type: 3, description: 'معرف الروم', required: true }
        ]
    },
    { name: 'خرج', description: 'يخرج من الروم الحالي' }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Refreshing application (/) commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Commands registered successfully.');
    } catch (error) {
        console.error(error);
    }
})();

// ==== التعامل مع الأوامر ====
client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;
        const { commandName } = interaction;

        if (commandName === 'موجود') await interaction.reply('لا ماجا');
        if (commandName === 'ping') await interaction.reply('MS');
        if (commandName === 'نكتة') {
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            await interaction.reply(joke);
        }
        if (commandName === 'من_انت') {
            const description = Object.keys(members).map(name => {
                const m = members[name];
                return `${name}:\nالاسم كامل: ${m["الاسم كامل"]}\nالجنسية: ${m["الجنسية"]}\nالديار: ${m["الديار"]}\nايش يرجع: ${m["ايش يرجع"]}\nالصفات: ${m["الصفات"]}`;
            }).join("\n\n");
            await interaction.reply(description);
        }
        if (commandName === 'room') {
            const roomId = interaction.options.getString('id');
            currentRoom = roomId;
            await interaction.reply(`دخلت الروم: ${roomId} ولن أخرج إلا إذا قلت اطلع`);
        }
        if (commandName === 'خرج') {
            if (currentRoom) {
                await interaction.reply(`خرجت من الروم: ${currentRoom}`);
                currentRoom = null;
            } else {
                await interaction.reply('أنا مش داخل أي روم حالياً.');
            }
        }

    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            await interaction.reply({ content: 'حصل خطأ ⚠️', ephemeral: true });
        } else {
            await interaction.editReply('حصل خطأ ⚠️');
        }
    }
});

// ==== Express Web Server ====
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('بوت Discord شغال كـ Web Service!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// ==== تسجيل دخول البوت ====
client.login(process.env.TOKEN);
