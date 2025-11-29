import 'dotenv/config';
import { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, MessageEmbed } from 'discord.js';
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

// ====== DATA ======
const members = {
    "احمد": { "الاسم كامل": "احمد فتحي احمد باحميد", "الجنسية": "اليمن", "الديار": "مدودة", "ايش يرجع": "طيورة", "الصفات": "خال، رجال، جلاد يوسف" },
    "يوسف": { "الاسم كامل": "يوسف القحطاني (ابو قحط)", "الجنسية": "نص يمن نص سعودية", "الديار": "ماعنده مترحل من مدودة", "ايش يرجع": "قاضي او قحطاني", "الصفات": "كابوس احمد، خال، نشبة، مطوع" },
    "ياسر": { "الاسم كامل": "ياسر الباشا", "الجنسية": "اليمن", "الديار": "الرياض", "ايش يرجع": "خير وبركة", "الصفات": "قائد، طيب، ذكي، محبوب" },
    "عمار": { "الاسم كامل": "عمار الحمدي", "الجنسية": "اليمن", "الديار": "صنعاء", "ايش يرجع": "إبداع ونجاح", "الصفات": "مجتهد، صبور، طموح، محبوب" }
};

const jokes = [
    "مرة حضرمي قال لصاحبه: وين رايح؟ قال: أدور على صبر لأمي!",
    "الحضرمي لما شاف المطر، قال: الحمد لله، الأرض أخيراً ارتاحت.",
    "واحد حضرمي حاول يطبخ، بس نسي الملح، قال: الطعم مثل السفر الطويل، بلا نهاية."
];

let currentRoom = null;

// ====== HELPER ======
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ====== READY ======
client.once('ready', () => {
    console.log(`البوت شغال! اسم البوت: ${client.user.username}`);
});

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const content = message.content.trim();
    if (!content.startsWith('-')) return;

    const command = content.slice(1).split(' ')[0];
    const args = content.split(' ').slice(1);

    try {
        // ====== الأوامر العامة ======
        if (command === 'موجود' || command === 'موجود_ولا_بيغ_بوس_جا') {
            await message.reply(`موجود البيغ بوس ما جا 🏓 (البينغ: ${client.ws.ping}ms)`);
        } else if (command === 'نكتة') {
            await message.reply(randomChoice(jokes));
        } else if (command === 'وربي') {
            await message.reply(randomChoice(jokes));
        } else if (command === 'امصباح') {
            await message.reply('صباح الخير 🌞');
        } else if (command === 'امليل') {
            await message.reply('مساء الخير 🌙');
        }

        // ====== أوامر الروم ======
        else if (command === 'يخال') {
            if (args[0] === 'خش' && args[1] === 'الروم') {
                const roomId = args[2] || 'unknown';
                currentRoom = roomId;
                await message.reply(`دخلت الروم: ${roomId} ولن أخرج إلا إذا قلت -يخال`);
            } else {
                if (currentRoom) {
                    await message.reply(`خرجت من الروم: ${currentRoom}`);
                    currentRoom = null;
                } else {
                    await message.reply('أنا مش داخل أي روم حالياً.');
                }
            }
        }

        // ====== أمر من انت ======
        else if (command === 'من') {
            if (args[0] === 'انت') {
                const embed = {
                    color: 0x0099ff,
                    title: 'معلومات عن البوت',
                    description: 'هذي معلومات البوت 👇',
                    fields: [
                        { name: 'اسم البوت', value: client.user.username || 'Unknown', inline: true },
                        { name: 'الحالة', value: (client.user.presence && client.user.presence.status) ? client.user.presence.status : 'online', inline: true },
                        { name: 'المؤسس', value: 'العم ياسر', inline: true },
                        { name: 'تاريخ الإنشاء', value: client.user.createdAt.toDateString(), inline: true },
                        { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                        { name: 'معلومات إضافية', value: 'نسخة حضرمية من البوت 😎', inline: false }
                    ],
                    timestamp: new Date(),
                    footer: { text: 'Bot Info' }
                };
                await message.reply({ embeds: [embed] });
            }
        }

        // ====== تعريف الأشخاص ======
        else if (command === 'تعريف') {
            const embed = {
                color: 0x00ff00,
                title: 'تعريف الأشخاص',
                description: 'هذا التعريف يشرح من هم الأشخاص الموجودين:\n- عمار\n- ياسر\n- احمد\n- يوسف\n\nاختر الشخص من القائمة لتعرف تفاصيله',
                timestamp: new Date(),
                footer: { text: 'تعريف الأشخاص' }
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select_member')
                        .setPlaceholder('اختر الاسم')
                        .addOptions([
                            { label: 'عمار', value: 'عمار' },
                            { label: 'ياسر', value: 'ياسر' },
                            { label: 'احمد', value: 'احمد' },
                            { label: 'يوسف', value: 'يوسف' }
                        ])
                );
            await message.reply({ embeds: [embed], components: [row] });
        }

    } catch (error) {
        console.error(error);
        await message.reply('حصل خطأ ⚠️');
    }
});

// ====== INTERACTIONS ======
client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isStringSelectMenu()) {
            const name = interaction.values[0];
            if (members[name]) {
                const m = members[name];
                const embed = {
                    color: 0x00ffff,
                    title: `معلومات عن ${name}`,
                    description: `هذي تفاصيل ${name}:`,
                    fields: [
                        { name: 'الاسم كامل', value: m["الاسم كامل"], inline: false },
                        { name: 'الجنسية', value: m["الجنسية"], inline: true },
                        { name: 'الديار', value: m["الديار"], inline: true },
                        { name: 'ايش يرجع', value: m["ايش يرجع"], inline: true },
                        { name: 'الصفات', value: m["الصفات"], inline: false }
                    ],
                    timestamp: new Date(),
                    footer: { text: 'تعريف الشخص' }
                };
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    } catch (err) {
        console.error('interactionCreate error:', err);
    }
});

// ====== LOGIN ======
if (!process.env.TOKEN) {
    console.error("❌ الرجاء إضافة TOKEN في Environment Variables");
    process.exit(1);
}
client.login(process.env.TOKEN);
