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

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase().trim();

    // ====== FUN COMMANDS ======
    if (msg === 'وربي فكك') {
        const jokes = [
            'مرة حضرمي دخل السوق وقال للبائع: اعطني كيلو تمر، قال له البائع: ليش؟ قال: عشان الحلاوة ما تنقص من قلبي',
            'حضارم قال لصاحبه: اذا الجوع ذبحني، قلت له: اصبر يا غالي، الكركديه جاهز',
            'مرة حضرمي طلع البحر وقال: لو رحت نص الموجة ألقى كنز، رجع البيت لقى بس صدف'
        ];
        return message.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }

    if (msg === 'امصباح') return message.channel.send('صباح الخير');
    if (msg === 'امليل') return message.channel.send('مساء الخير');
    if (msg === 'موجود ولا بيغ بوس جا؟') return message.channel.send(`لا ماجا والبنق تبعي: ${client.ws.ping}ms`);

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
        return message.channel.send(`هذي الأوامر المتاحة:
وربي فكك → يرسل نكتة حضرمية
امصباح → صباح الخير
امليل → مساء الخير
موجود ولا بيغ بوس جا؟ → لا ماجا + البنق
كي قفل فمك @عضو → ميوت للعضو
ترحيل الكلب @عضو → باند للعضو
روح لفلف بمدودة وتعال @عضو → طرد مؤقت للعضو
نظف المكان عدد → يمسح عدد الرسائل
امجوازنة الحقني → يعرض كل الأوامر
!تعريف → يظهر منيو التعريف بالأشخاص
من انت → معلومات عن البوت + خيارات`);
    }

    // ====== التعريف ======
    if (msg === '!تعريف') {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('person_select')
                    .setPlaceholder('اختر الشخص')
                    .addOptions([
                        { label: 'ياسر', value: 'yasser' },
                        { label: 'أحمد', value: 'ahmed' },
                        { label: 'عمار', value: 'ammar' },
                        { label: 'يوسف', value: 'yousef' }
                    ])
            );
        return message.channel.send({ content: 'اختر الشخص للتعريف 👇', components: [row] });
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
                    .setPlaceholder('اختر خيار')
                    .addOptions([
                        { label: 'أوامر البوت', description: 'عرض كل الأوامر الإدارية', value: 'commands' },
                        { label: 'ألعاب', description: 'جرب ألعاب صغيرة', value: 'games' },
                        { label: 'نكت حضرمية', description: 'نكت جديدة كل مرة', value: 'jokes' }
                    ])
            );

        return message.channel.send({ embeds: [embed], components: [row] });
    }
});

// ====== BUTTON & SELECT MENU INTERACTIONS ======
client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'person_select') {
            if (interaction.values[0] === 'yasser') return interaction.reply('ياسر: عمي وعم الكل هنا، رجل قوي، موضع احترام');
            if (interaction.values[0] === 'ahmed') return interaction.reply(`أحمد: الاسم كامل: احمد فتحي احمد باحميد
الجنسية: اليمن
الديار: مدودة
ايش يرجع: طيورة
الصفات: خال، رجال، جلاد يوسف`);
            if (interaction.values[0] === 'ammar') return interaction.reply('عمار: نائب البيغ بوس، شخص قوي ومؤثر');
            if (interaction.values[0] === 'yousef') return interaction.reply(`يوسف: يوسف القحطاني (ابو قحط)
الجنسية: نص يمن نص سعودية
الديار: ماعنده مترحل من مدودة
ايش يرجع: قاضي او قحطاني
الصفات: كابوس احمد، خال، نشبة، مطوع`);
        }

        if (interaction.customId === 'more_options') {
            if (interaction.values[0] === 'commands') {
                return interaction.reply({ content: `أوامر البوت:
كي قفل فمك @عضو → ميوت للعضو
ترحيل الكلب @عضو → باند للعضو
روح لفلف بمدودة وتعال @عضو → طرد مؤقت
نظف المكان عدد → يمسح عدد الرسائل
من انت → معلومات عن البوت
اكتشف بنفسك`, ephemeral: true });
            }

            if (interaction.values[0] === 'games') {
                return interaction.reply({ content: `الألعاب المتاحة:
1. رمي نرد → اكتب !roll
2. رمي العملة → اكتب !coinflip`, ephemeral: true });
            }

            if (interaction.values[0] === 'jokes') {
                const jokes = [
                    'مرة حضرمي دخل السوق وقال للبائع: اعطني كيلو تمر، قال له البائع: ليش؟ قال: عشان الحلاوة ما تنقص من قلبي',
                    'حضارم قال لصاحبه: اذا الجوع ذبحني، قلت له: اصبر يا غالي، الكركديه جاهز',
                    'مرة حضرمي طلع البحر وقال: لو رحت نص الموجة ألقى كنز، رجع البيت لقى بس صدف'
                ];
                return interaction.reply({ con
