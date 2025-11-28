// ====== KEEP ALIVE FOR RENDER ======
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT ======
const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    StringSelectMenuBuilder 
} = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// ====== REMOVE PREVIOUS LISTENERS ======
client.removeAllListeners('messageCreate');
client.removeAllListeners('interactionCreate');

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase().trim();

    // ====== FUN COMMANDS ======
    if (msg === 'وربي فكك') {
        const jokes = [
            'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟ قال: لأنها غالية',
            'حضارم ما يحبون الجوع، مرة حضرمي قال: الجوع ذبحني',
            'مرة حضرمي دخل السوق وقال: كم الريال؟ قالوا: 1، قال: اعطني كيلو'
        ];
        return message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }

    if (msg === 'امصباح') return message.channel.send('صباح الخير');
    if (msg === 'امليل') return message.channel.send('مساء الخير');
    if (msg === 'موجود ولا بيغ بوس جا؟') return message.channel.send(`انا موجود وبنقي 🏓 (البينغ: ${client.ws.ping}ms)`);

    // ====== ADMIN COMMANDS ======
    if (msg.startsWith('كي قفل فمك')) {
        if (!message.member.permissions.has('ModerateMembers')) return message.channel.send('ما عندك صلاحية');
        const user = message.mentions.members.first();
        if (!user) return message.channel.send('اختر عضو عشان تعطيه ميوت');
        await user.timeout(60000);
        return message.channel.send(`عضو ${user.user.username} صار ميوت`);
    }

    if (msg.startsWith('ترحيل الكلب')) {
        if (!message.member.permissions.has('BanMembers')) return message.channel.send('ما عندك صلاحية');
        const user = message.mentions.members.first();
        if (!user) return message.channel.send('اختر عضو عشان تطرده');
        await user.ban();
        return message.channel.send(`عضو ${user.user.username} انبند`);
    }

    if (msg.startsWith('روح لفلف بمدودة وتعال')) {
        if (!message.member.permissions.has('KickMembers')) return message.channel.send('ما عندك صلاحية');
        const user = message.mentions.members.first();
        if (!user) return message.channel.send('اختر عضو عشان تطرده مؤقت');
        await user.kick();
        return message.channel.send(`عضو ${user.user.username} طُرد مؤقت`);
    }

    // ====== CLEAR ======
    if (msg.startsWith('نظف المكان')) {
        if (!message.member.permissions.has('ManageMessages')) return message.channel.send('ما عندك صلاحية');
        const args = msg.split(' ');
        const amount = parseInt(args[2]);
        if (!amount || amount < 1 || amount > 100) return message.channel.send('حدد عدد بين 1 و100');
        await message.channel.bulkDelete(amount);
        return message.channel.send(`${amount} رسائل تم مسحها`);
    }

    // ====== HELP ======
    if (msg === '!help' || msg === 'امجوازنة الحقني') {
        return message.channel.send(`هذي الأوامر يا غالي:
وربي فكك → يرسل نكتة حضرمية
امصباح → صباح الخير
امليل → مساء الخير
موجود ولا بيغ بوس جا؟ → انا موجود وبنقي 🏓
كي قفل فمك @عضو → ميوت للعضو
ترحيل الكلب @عضو → باند للعضو
روح لفلف بمدودة وتعال @عضو → طرد مؤقت للعضو
نظف المكان عدد → يمسح عدد الرسائل
امجوازنة الحقني → يعرض كل الأوامر
!تعريف → يطلع أزرار للتعريف بأشخاص
من انت → معلومات عن البوت وأزرار خيارات`);
    }

    // ====== التعريف ======
    if (msg === '!تعريف') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('yasser').setLabel('ياسر').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ahmed').setLabel('أحمد').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('ammar').setLabel('عمار').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('yousef').setLabel('يوسف').setStyle(ButtonStyle.Primary)
            );
        return message.channel.send({ content: 'اختر اسم الشخص للتعريف 👇', components: [row] });
    }

    // ====== الردود الخاصة ======
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

    if (msg === 'السلام عليكم') return message.channel.send('وعليكم السلام ورحمة الله وبركاته');

    // ====== من انت ======
    if (msg === 'من انت') {
        const embed = {
            color: 0x0099ff,
            title: 'معلومات عن البوت',
            description: 'هذي معلومات البوت 👇',
            fields: [
                { name: 'اسم البوت', value: client.user.username, inline: true },
                { name: 'الحالة', value: client.presence?.status || 'online', inline: true },
                { name: 'المؤسس', value: 'Golden Boy', inline: true },
                { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: 'معلومات إضافية', value: 'هذي نسخة حضرمية من البوت', inline: false },
            ],
            timestamp: new Date(),
            footer: { text: 'Bot Info' }
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('more_options')
                    .setPlaceholder('اضغط للاختيارات')
                    .addOptions([
                        { label: 'أوامر البوت', description: 'عرض جميع الأوامر', value: 'commands' },
                        { label: 'ألعاب', description: 'جرب لعب صغيرة', value: 'games' },
                        { label: 'Fun Commands', description: 'وربي فكك، امصباح، امليل', value: 'fun' },
                        { label: 'نكت حضرمية', description: 'نكت جديدة كل مرة', value: 'jokes' }
                    ])
            );

        return message.channel.send({ embeds: [embed], components: [row] });
    }
});

// ====== BUTTON & SELECT MENU INTERACTIONS ======
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'yasser') return interaction.reply('ياسر: عمي وعم الكل هنا، رجل قوي، موضع احترام');
        if (interaction.customId === 'ahmed') return interaction.reply(`أحمد: الاسم كامل: احمد فتحي احمد باحميد
الجنسية: اليمن
الديار: مدودة
ايش يرجع: طيورة
الصفات: خال، رجال، جلاد يوسف`);
        if (interaction.customId === 'ammar') return interaction.reply('عمار: نائب البيغ بوس، شخص قوي ومؤثر');
        if (interaction.customId === 'yousef') return interaction.reply(`يوسف: يوسف القحطاني (ابو قحط)
الجنسية: نص يمن نص سعودية
الديار: ماعنده مترحل من مدودة
ايش يرجع: قاضي او قحطاني
الصفات: كابوس احمد، خال، نشبة، مطوع`);
    }

    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'more_options') {
            if (interaction.values[0] === 'commands') {
                return interaction.reply({ content: 'هذي قائمة كل الأوامر', ephemeral: true });
            }
            if (interaction.values[0] === 'games') {
                return interaction.reply({ content: 'جرب لعبة رمي نرد أو Coinflip', ephemeral: true });
            }
            if (interaction.values[0] === 'fun') {
                return interaction.reply({ content: 'وربي فكك، امصباح، امليل، موجود ولا بيغ بوس جا؟', ephemeral: true });
            }
            if (interaction.values[0] === 'jokes') {
                const jokes = [
                    'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟',
                    'الجوع ذبحني',
                    'مرة حضرمي دخل السوق وقال: اعطني كيلو'
                ];
                return interaction.reply({ content: jokes[Math.floor(Math.random() * jokes.length)], ephemeral: true });
            }
        }
    }
});

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
