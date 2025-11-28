import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// تعريف الأشخاص
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

// النكت الحضرمية
const jokes = [
    "مرة حضرمي قال لصاحبه: وين رايح؟ قال: أدور على صبر لأمي!",
    "الحضرمي لما شاف المطر، قال: الحمد لله، الأرض أخيراً ارتاحت.",
    "واحد حضرمي حاول يطبخ، بس نسي الملح، قال: الطعم مثل السفر الطويل، بلا نهاية."
];

// حالة دخول البوت لروم محدد
let currentRoom = null;

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;
        const { commandName } = interaction;

        if (commandName === 'موجود') {
            await interaction.reply('لا ماجا');
        }

        if (commandName === 'ping') {
            await interaction.reply('MS');
        }

        if (commandName === 'من_انت') {
            let description = Object.keys(members).map(name => {
                const m = members[name];
                return `${name}:\nالاسم كامل: ${m["الاسم كامل"]}\nالجنسية: ${m["الجنسية"]}\nالديار: ${m["الديار"]}\nايش يرجع: ${m["ايش يرجع"]}\nالصفات: ${m["الصفات"]}`;
            }).join("\n\n");
            await interaction.reply(description);
        }

        if (commandName === 'نكتة') {
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            await interaction.reply(joke);
        }

        if (commandName === 'gpt') {
            await interaction.deferReply();
            const question = interaction.options.getString('question');
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: question }]
            });
            await interaction.editReply(response.choices[0].message.content);
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

client.login(process.env.TOKEN);
