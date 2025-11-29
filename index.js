// ====== ENV & KEEP ALIVE ======
require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, MessageEmbed } = require('discord.js');

const app = express();
app.get('/', (req, res) => res.send('بوت Discord شغال كـ Web Service!'));
app.listen(process.env.PORT || 3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT ======
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ====== MEMBERS INFO ======
const members = {
    "احمد": { "الاسم كامل": "احمد فتحي احمد باحميد", "الجنسية": "اليمن", "الديار": "مدودة", "ايش يرجع": "طيورة", "الصفات": "خال، رجال، جلاد يوسف" },
    "يوسف": { "الاسم كامل": "يوسف القحطاني (ابو قحط)", "الجنسية": "نص يمن نص سعودية", "الديار": "ماعنده مترحل من مدودة", "ايش يرجع": "قاضي او قحطاني", "الصفات": "كابوس احمد، خال، نشبة، مطوع" },
    "ياسر": { "الاسم كامل": "ياسر الباشا", "الجنسية": "اليمن", "الديار": "الرياض", "ايش يرجع": "خير وبركة", "الصفات": "قائد، طيب، ذكي، محبوب" },
    "عمار": { "الاسم كامل": "عمار الحمدي", "الجنسية": "اليمن", "الديار": "صنعاء", "ايش يرجع": "إبداع ونجاح", "الصفات": "مجتهد، صبور، طموح، محبوب" }
};

// ====== JOKES ======
const jokes = [
    "مرة حضرمي قال لصاحبه: وين رايح؟ قال: أدور على صبر لأمي!",
    "الحضرمي لما شاف المطر، قال: الحمد لله، الأرض أخيراً ارتاحت.",
    "واحد حضرمي حاول يطبخ، بس نسي الملح، قال: الطعم مثل السفر الطويل، بلا نهاية."
];

// ====== ROOM ======
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
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const content = message.content.trim();
    if (!content.startsWith('-')) return;

    const command = content.slice(1).split(' ')[0];
    const args = content.split(' ').slice(1);

    try {
        // ====== ROOM COMMANDS ======
        if (command === 'يخال') {
            const sub = args[0];
            if (sub === 'خش') {
                const roomId = args.slice(1).join(' ');
                currentRoom = roomId;
                return message.reply(`دخلت الروم: ${roomId} ولن أخرج إلا إذا قلت -يخال اطلع`);
            } else if (sub === 'اطلع') {
                if (currentRoom) {
                    const oldRoom = currentRoom;
                    currentRoom = null;
                    return message.reply(`خرجت من الروم: ${oldRoom}`);
                } else {
                    return message.reply('أنا مش داخل أي روم حالياً.');
                }
            }
        }

        // ====== PING ======
        if (command === 'موجود' || command === 'موجود ولا بيغ بوس جا') {
            return message.reply(`موجود البيغ بوس ما جا 🏓 (البينغ: ${client.ws.ping}ms)`);
        }

        // ====== JOKE ======
        if (command === 'نكتة') {
            return message.reply(randomChoice(jokes));
        }

        // ====== MEMBERS INFO ======
        if (command === 'من انت') {
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('معلومات عن البوت')
                .setDescription('هذي معلومات البوت 👇')
                .addFields(
                    { name: 'اسم البوت', value: client.user.username || 'Unknown', inline: true },
                    { name: 'الحالة', value: (client.user.presence && client.user.presence.status) ? client.user.presence.status : 'online', inline: true },
                    { name: 'المؤسس', value: 'العم ياسر', inline: true },
                    { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                    { name: 'تاريخ الإنشاء', value: client.user.createdAt.toDateString(), inline: true },
                    { name: 'معلومات إضافية', value: 'هذي نسخة حضرمية من البوت 😎', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Bot Info' });

            return message.reply({ embeds: [embed] });
        }

        // ====== DEFINITION MENU ======
        if (command === 'تعريف') {
            const embed = new MessageEmbed()
                .setColor('#00ff99')
                .setTitle('تعريف الأشخاص')
                .setDescription('هذي معلومات الأشخاص اللي تعرفهم:\n- ترتيب الأسماء: عمار، ياسر، احمد، يوسف')
                .addFields(
                    { name: 'عمار', value: 'نائب البيغ بوس، شخص قوي ومؤثر 🌴😎', inline: false },
                    { name: 'ياسر', value: 'قائد، طيب، ذكي، محبوب', inline: false },
                    { name: 'احمد', value: 'الاسم كامل: احمد فتحي احمد باحميد\nالجنسية: اليمن\nالديار: مدودة\nايش يرجع: طيورة\nالصفات: خال، رجال، جلاد يوسف', inline: false },
                    { name: 'يوسف', value: 'الاسم كامل: يوسف القحطاني (ابو قحط)\nالجنسية: نص يمن نص سعودية\nالديار: ماعنده مترحل من مدودة\nايش يرجع: قاضي او قحطاني\nالصفات: كابوس احمد، خال، نشبة، مطوع', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'تعريف الأشخاص' });

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('person_menu')
                        .setPlaceholder('اضغط للاختيار')
                        .addOptions([
                            { label: 'عمار', value: 'ammar' },
                            { label: 'ياسر', value: 'yasser' },
                            { label: 'احمد', value: 'ahmed' },
                            { label: 'يوسف', value: 'yousef' }
                        ])
                );

            return message.reply({ embeds: [embed], components: [row] });
        }

    } catch (err) {
        console.error(err);
        message.reply('حصل خطأ ⚠️');
    }
});

// ====== INTERACTION HANDLER ======
client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isStringSelectMenu()) {
            const choice = interaction.values[0];
            if (choice === 'ammar') return interaction.reply({ content: members['عمار'].الصفات, ephemeral: true });
            if (choice === 'yasser') return interaction.reply({ content: members['ياسر'].الصفات, ephemeral: true });
            if (choice === 'ahmed') return interaction.reply({ content: members['احمد'].الصفات, ephemeral: true });
            if (choice === 'yousef') return interaction.reply({ content: members['يوسف'].الصفات, ephemeral: true });
        }
    } catch (err) {
        console.error(err);
    }
});

// ====== LOGIN ======
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ الرجاء إضافة DISCORD_TOKEN في Environment Variables");
    process.exit(1);
}
client.login(process.env.DISCORD_TOKEN);
