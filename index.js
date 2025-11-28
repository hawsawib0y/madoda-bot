const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content;

    // !تعريف
    if (msg === '!تعريف') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('yasser').setLabel('ياسر').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ahmed').setLabel('أحمد').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ammar').setLabel('عمار').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('yousef').setLabel('يوسف').setStyle(ButtonStyle.Primary)
            );
        
        await message.channel.send({ 
            content: 'اختر اسم الشخص للتعريف 👇', 
            components: [row] 
        });
    }

    // الردود الخاصة
    if (msg.includes('يخال اجلد يوسف')) {
        const replies = [
            'اهدا يا يوسف وربي اجيب لك مارتيرز',
            'تبغا سمبوسه بيض؟',
            'الحين بيجيك ولد طيورة يأدبك',
            'انت يباالك ترحيل من مدودة'
        ];
        message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    }

    if (msg === 'يخال') {
        const replies = [
            'الخوال هم العم ياسر وابو فهد',
            'الخال ياسر واحمد'
        ];
        message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    }

    if (msg === 'السلام عليكم') {
        message.channel.send('السلام 🌴');
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'yasser') {
        await interaction.reply('ياسر: عمي وعم الكل هنا، رجل قوي، موضع احترام 🌴');
    }

    if (interaction.customId === 'ahmed') {
        await interaction.reply(`
أحمد:
الاسم كامل: احمد فتحي احمد باحميد
الجنسية: اليمن
الديار: مدودة
ايش يرجع: طيورة
الصفات: خال، رجال، جلاد يوسف
        `);
    }

    if (interaction.customId === 'ammar') {
        await interaction.reply('عمار: نائب البيغ بوس، شخص قوي ومؤثر 🌴😎');
    }

    if (interaction.customId === 'yousef') {
        await interaction.reply(`
يوسف:
يوسف القحطاني (ابو قحط)
الجنسية: نص يمن نص سعودية
الديار: ماعنده مترحل من مدودة
ايش يرجع: قاضي او قحطاني
الصفات: كابوس احمد، خال، نشبة، مطوع
        `);
    }
});

client.login(process.env.DISCORD_TOKEN);
