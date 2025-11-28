// ====== KEEP ALIVE FOR RENDER ======
const express = require('express');
const app = express();

// صفحة بسيطة لفتح Port 3000
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT ======
const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content;

    // ====== !help ======
    if (msg === '!help') {
        return message.channel.send(`
🟢 **أوامر البوت المتاحة:**

!تعريف — لعرض قائمة الأشخاص واختيار واحد منهم  
يخال — ردود مخصصة  
يخال اجلد يوسف — ردود خاصة 😂  
السلام عليكم — رد تلقائي  

🔧 أوامر جديدة قريبًا!
        `);
    }

    // ====== !تعريف ======
    if (msg === '!تعريف') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('yasser').setLabel('ياسر').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ahmed').setLabel('أحمد').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ammar').setLabel('عمار').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('yousef').setLabel('يوسف').setStyle(ButtonStyle.Primary)
            );

        return message.channel.send({
            content: 'اختر اسم الشخص للتعريف 👇',
            components: [row]
        });
    }

    // ====== ردود خاصة ======
    if (msg.includes('يخال اجلد يوسف')) {
        const replies = [
            'اهدا يا يوسف وربي اجيب لك مارتيرز',
            'تبغا سمبوسه بيض؟',
            'الحين بيجيك ولد طيورة يأدبك',
            'انت يباالك ترحيل من مدودة'
        ];
        return message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    }

    if (msg === 'يخال') {
        const replies = [
            'الخوال هم العم ياسر وابو فهد',
            'الخال ياسر واحمد'
        ];
        return message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    }

    if (msg === 'السلام عليكم') {
        return message.channel.send('السلام 🌴');
    }
});

// ====== BUTTON INTERACTIONS ======
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'yasser') {
        return interaction.reply('ياسر: عمي وعم الكل هنا، رجل قوي، موضع احترام 🌴');
    }

    if (interaction.customId === 'ahmed') {
        return interaction.reply(`
أحمد:
الاسم كامل: احمد فتحي احمد باحميد
الجنسية: اليمن
الديار: مدودة
ايش يرجع: طيورة
الصفات: خال، رجال، جلاد يوسف
        `);
    }

    if (interaction.customId === 'ammar') {
        return interaction.reply('عمار: نائب البيغ بوس، شخص قوي ومؤثر 🌴😎');
    }

    if (interaction.customId === 'yousef') {
        return interaction.reply(`
يوسف:
يوسف القحطاني (ابو قحط)
الجنسية: نص يمن نص سعودية
الديار: ماعنده مترحل من مدودة
ايش يرجع: قاضي او قحطاني
الصفات: كابوس احمد، خال، نشبة، مطوع
        `);
    }
});

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
