// ====== KEEP ALIVE FOR RENDER ======
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT ======
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase().trim();

    // ====== FUN COMMANDS ======
    if (msg === 'وربي فكك') {
        const jokes = [
            'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟ قال: لأنها معمولة بالحب والعمل الشاق!',
            'حضارم ما يحبون الجوع، مرة حضرمي قال: الجوع ذبحني، وأنا أبحث عن لقمة! ',
            'مرة حضرمي دخل السوق وقال: كم الريال؟ قالوا: 1، قال: اعطني كيلو الحلاوة الأفضل!'
        ];
        return message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }

    if (msg === 'امصباح') return message.channel.send('صباح الخير');
    if (msg === 'امليل') return message.channel.send('مساء الخير');
    if (msg === 'موجود ولا بيغ بوس جا؟') return message.channel.send(`لا ماجا، البنق عندي ${client.ws.ping}ms`);

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
        return message.channel.send(`هذي الأوامر:
وربي فكك → نكتة حضرمية
امصباح → صباح الخير
امليل → مساء الخير
موجود ولا بيغ بوس جا؟ → يكتب لا ماجا والبنق
كي قفل فمك @عضو → ميوت
ترحيل الكلب @عضو → باند
روح لفلف بمدودة وتعال @عضو → طرد مؤقت
نظف المكان عدد → يمسح الرسائل
!تعريف → أزرار للتعريف
من انت → معلومات عن البوت`);
    }

    // ====== التعريف ======
    if (msg === '!تعريف') {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('def_menu')
                    .setPlaceholder('اختر اسم للتعريف')
                    .addOptions([
                        { label: 'ياسر', value: 'yasser' },
                        { label: 'أحمد', value: 'ahmed' },
                        { label: 'عمار', value: 'ammar' },
                        { label: 'يوسف', value: 'yousef' }
                    ])
            );
        return message.channel.send({ content: 'اختر اسم الشخص للتعريف', components: [row] });
    }

    // ====== الردود الخاصة ======
    if (msg.includes('يخال اجلد يوسف')) {
        const replies = [
            'اهدا يا يوسف، لا تقلق.',
            'تبغا سمبوسة؟',
            'الطفل الطيورة جاي يعلمك الأدب!',
            'احذر، يمكن ترحيلك من مدودة'
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
            description: 'هذي معلومات البوت',
            fields: [
                { name: 'اسم البوت', value: client.user.username, inline: true },
                { name: 'الحالة', value: client.presence?.status || 'online', inline: true },
                { name: 'المؤسس', value: 'Golden Boy', inline: true },
                { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: 'معلومات إضافية', value: 'نسخة حضرمية من البوت', inline: false },
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
                        { label: 'ألعاب', description: 'لعبتين ممتعة', value: 'games' },
                        { label: 'Fun Commands', description: 'وربي فكك، امصباح، امليل', value: 'fun' },
                        { label: 'نكت حضرمية', description: 'نكت جديدة كل مرة', value: 'jokes' }
                    ])
            );

        return message.channel.send({ embeds: [embed], components: [row] });
    }
});

// ====== BUTTON & SELECT MENU INTERACTIONS ======
client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'def_menu') {
            if (interaction.values[0] === 'yasser') return interaction.reply('ياسر: عمي وعم الكل هنا، رجل قوي، موضع احترام');
            if (interaction.values[0] === 'ahmed') return interaction.reply('أحمد: الاسم كامل: احمد فتحي احمد باحميد، الجنسية: اليمن، الديار: مدودة، ايش يرجع: طيورة، الصفات: خال، رجال، جلاد يوسف');
            if (interaction.values[0] === 'ammar') return interaction.reply('عمار: نائب البيغ بوس، شخص قوي ومؤثر');
            if (interaction.values[0] === 'yousef') return interaction.reply('يوسف: يوسف القحطاني (ابو قحط)، الجنسية: نص يمن نص سعودية، الديار: ماعنده مترحل من مدودة، ايش يرجع: قاضي او قحطاني، الصفات: كابوس احمد، خال، نشبة، مطوع');
        }
        if (interaction.customId === 'more_options') {
            if (interaction.values[0] === 'commands') return interaction.reply({ content: 'أوامر البوت الإدارية: كي قفل فمك، ترحيل الكلب، روح لفلف بمدودة وتعال، نظف المكان، من انت، اكتشف بنفسك', ephemeral: true });
            if (interaction.values[0] === 'games') return interaction.reply({ content: 'الألعاب المتاحة: رمي نرد (اكتب !dice)، عملة (Coinflip) (اكتب !coin)', ephemeral: true });
            if (interaction.values[0] === 'fun') return interaction.reply({ content: 'وربي فكك، امصباح، امليل، موجود ولا بيغ بوس جا؟', ephemeral: true });
            if (interaction.values[0] === 'jokes') {
                const jokes = [
                    'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟ لأنها معمولة بالحب والعمل الشاق!',
                    'حضارم ما يحبون الجوع، مرة حضرمي قال: الجوع ذبحني وأنا أبحث عن لقمة!',
                    'مرة حضرمي دخل السوق وقال: كم الريال؟ قالوا: 1، قال: اعطني كيلو الحلاوة الأفضل!'
                ];
                return interaction.reply({ content: jokes[Math.floor(Math.random() * jokes.length)], ephemeral: true });
            }
        }
    }
});

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
