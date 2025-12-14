import 'dotenv/config';
import express from 'express';
import { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    EmbedBuilder,
    ActivityType
} from 'discord.js';
import { Player } from 'discord-player';
import { joinVoiceChannel } from '@discordjs/voice';
import { SoundCloudExtractor, SpotifyExtractor, YouTubeExtractor } from "@discord-player/extractor"; 

// ====== KEEP ALIVE FOR RENDER (كودك الأصلي) ======
const app = express();
app.get('/', (req, res) => res.send('البوت يعمل وجاهز!'));
app.listen(3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT (كودك الأصلي) ======
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// ====== MUSIC PLAYER (كودك الأصلي) ======
const player = new Player(client);

player.extractors.register(YouTubeExtractor, {});
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(SoundCloudExtractor, {});

player.events.on("playerStart", (queue, track) => {
    queue.metadata.channel.send(`🎶 شغلت: **${track.title}**`);
});

// ====== HELPER FUNCTION (كودك الأصلي) ======
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ====================================================================
// ===== يوزرات الديسكورد والإنستغرام - كود الفحص الجديد (غير مضمون) =====
// ====================================================================

const TARGET_GUILD_ID = '1094781166009192460';
const TARGET_CHANNEL_ID = '1449763940601958593';
// الفحص كل ساعة واحدة. (يمكنك تغيير 1 إلى 0.5 للفحص كل نصف ساعة)
const CHECK_INTERVAL_MS = 1 * 60 * 60 * 1000; 
// المتغير لتخزين اليوزرات التي تم إرسال تنبيه بشأنها بالفعل
const knownAvailableUsernames = new Set(); 
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * دالة تولد قائمة باليوزرات النادرة (2، 3، و 4 أحرف/أرقام)
 */
function generateRareUsernames() {
    const usernames = [];
    // نولد 10,000 يوزر في كل دورة كحد أقصى لتخفيف الضغط
    const maxGenerationCount = 10000; 
    let count = 0;

    // توليد يوزرات ثنائية (2 حرف/رقم)
    for (const c1 of CHARS) {
        for (const c2 of CHARS) {
            usernames.push(c1 + c2);
            count++;
            if (count >= maxGenerationCount) return usernames;
        }
    }
    
    // توليد يوزرات ثلاثية (3 حروف/أرقام)
    for (const c1 of CHARS) {
        for (const c2 of CHARS) {
            for (const c3 of CHARS) {
                usernames.push(c1 + c2 + c3);
                count++;
                if (count >= maxGenerationCount) return usernames;
            }
        }
    }

    // توليد يوزرات رباعية (4 حروف/أرقام)
    for (const c1 of CHARS) {
        for (const c2 of CHARS) {
            for (const c3 of CHARS) {
                for (const c4 of CHARS) {
                    usernames.push(c1 + c2 + c3 + c4);
                    count++;
                    if (count >= maxGenerationCount) return usernames;
                }
            }
        }
    }
    
    // إعادة ترتيب القائمة عشوائياً
    usernames.sort(() => Math.random() - 0.5);
    return usernames.slice(0, maxGenerationCount);
}

/**
 * المهمة الدائمة للتحقق الوهمي من اليوزرات وإرسال تنبيهات
 */
async function checkDiscordUsernames() {
    console.log('تشغيل مهمة فحص اليوزرات النادرة...');
    
    if (!client.isReady()) return;

    const channel = client.channels.cache.get(TARGET_CHANNEL_ID);
    
    if (!channel || channel.guild.id !== TARGET_GUILD_ID) {
        console.error('🚫 لم يتم العثور على القناة المحددة أو البوت ليس في السيرفر المستهدف.');
        return;
    }
    
    const usernamesToWatch = generateRareUsernames();
    let discordAvailable = [];
    let instaAvailable = [];

    for (const username of usernamesToWatch) {
        
        // ===============================================================
        // *** هذا الكود وهمي (Simulated Check) ويعتمد على الاحتمالية ***
        // *** يجب استبداله بـ API حقيقي لضمان التوفر ***
        // ===============================================================
        
        // محاكاة فحص الديسكورد
        const isDiscordAvailable = Math.random() < 0.03; // 3% فرصة
        
        // محاكاة فحص إنستغرام
        const isInstaAvailable = Math.random() < 0.05; // 5% فرصة
        
        
        if (isDiscordAvailable) {
            const key = `discord_${username}`;
            if (!knownAvailableUsernames.has(key)) {
                discordAvailable.push(username);
                knownAvailableUsernames.add(key); 
            }
        } else {
            knownAvailableUsernames.delete(`discord_${username}`);
        }
        
        if (isInstaAvailable) {
            const key = `insta_${username}`;
            if (!knownAvailableUsernames.has(key)) {
                instaAvailable.push(username);
                knownAvailableUsernames.add(key);
            }
        } else {
            knownAvailableUsernames.delete(`insta_${username}`);
        }
    }

    // إرسال تنبيه لليوزرات المتاحة على ديسكورد
    if (discordAvailable.length > 0) {
        const embed = new EmbedBuilder()
            .setColor('#5865F2') // لون الديسكورد
            .setTitle('🎉 يوزرات ديسكورد نادرة جديدة متوفرة! (فحص وهمي)')
            .setDescription(`تم العثور على الأسماء التالية وهي متاحة حالياً (2, 3, 4 حروف/أرقام) على **الديسكورد**:\n*يجب التحقق يدوياً لعدم ضمان التوفر.*`)
            .addFields(
                { name: 'الأسماء المتاحة', value: discordAvailable.map(u => `✅ \`${u}\``).join('\n') }
            )
            .setTimestamp()
            .setFooter({ text: 'الفحص يعمل فقط في هذا السيرفر' });

        await channel.send({ embeds: [embed] });
        console.log(`✅ تم إرسال تنبيه لـ ${discordAvailable.length} يوزر ديسكورد جديد.`);
    } 
    
    // إرسال تنبيه لليوزرات المتاحة على إنستغرام
    if (instaAvailable.length > 0) {
        const embed = new EmbedBuilder()
            .setColor('#E1306C') // لون إنستغرام
            .setTitle('📸 يوزرات انستغرام نادرة جديدة متوفرة! (فحص وهمي)')
            .setDescription(`تم العثور على الأسماء التالية وهي متاحة حالياً (2, 3, 4 حروف/أرقام) على **انستغرام**:\n*يجب التحقق يدوياً لعدم ضمان التوفر.*`)
            .addFields(
                { name: 'الأسماء المتاحة', value: instaAvailable.map(u => `✅ \`${u}\``).join('\n') }
            )
            .setTimestamp()
            .setFooter({ text: 'الفحص يعمل فقط في هذا السيرفر' });

        await channel.send({ embeds: [embed] });
        console.log(`✅ تم إرسال تنبيه لـ ${instaAvailable.length} يوزر إنستغرام جديد.`);
    }

    if (discordAvailable.length === 0 && instaAvailable.length === 0) {
        console.log('⚠️ لم يتم العثور على يوزرات جديدة متاحة في هذه الدورة.');
    }
}


// ====== READY EVENT (كودك الأصلي مع إضافة تشغيل الفحص) ======
client.once('ready', () => {
    console.log(`البوت شغال! اسم البوت: ${client.user.username}`);
    client.user.setActivity('يخال', { type: ActivityType.Custom });
    
    // تشغيل دالة فحص اليوزرات عند بدء تشغيل البوت
    checkDiscordUsernames(); 
    // تعيين حلقة دائمة لتشغيل الدالة كل فترة زمنية محددة
    setInterval(checkDiscordUsernames, CHECK_INTERVAL_MS);
});

// ====== MESSAGE HANDLER (كودك الأصلي) ======
client.on('messageCreate', async (message) => {
    // ... [باقي كود messageCreate كما هو]
    try {
        if (message.author.bot) return;
        const msg = message.content.toLowerCase().trim();

        // ====== SIMPLE RESPONSES ======
        if (msg.includes('هلا') || msg.includes('مرحبا')) return message.channel.send('هلا حبيبي، شخبارك من حضرموت؟');
        if (msg.includes('كيفك') || msg.includes('كيف الحال')) return message.channel.send('تمام الحمد لله، وانت؟');
        if (msg.includes('وداع') || msg.includes('مع السلامة')) return message.channel.send('مع السلامة يا غالي');

        if (msg === 'وربي فكك') {
            const jokes = [
                'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟ قال: لأنها غالية',
                'مرة حضرمي قال: الجوع ذبحني وانا مالي دخل',
                'مرة حضرمي دخل السوق وقال: كم الريال؟ قالوا: 1، قال: اعطني كيلو'
            ];
            return message.channel.send(randomChoice(jokes));
        }

        if (msg === 'امصباح') return message.channel.send('صباح الخير');
        if (msg === 'امليل') return message.channel.send('مساء الخير');

        if (msg === '-موجود ولا بيغ بوس جا') {
            return message.channel.send(`موجود البيغ بوس ما جا (البينغ: ${client.ws.ping}ms)`);
        }

        // ====== VOICE CHANNEL COMMANDS (تم تحديث الأوامر) ======
        if (msg === '-خش الروم' || msg === '-خش') {
            const channel = message.member.voice.channel;
            if (!channel) return message.channel.send('ادخل الروم أول');

            try {
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                return message.channel.send('دخلت الروم');
            } catch (err) {
                console.error(err);
                return message.channel.send('صارت مشكلة ومو قادر ادخل الروم');
            }
        }

        if (msg === '-اطلع من الروم') {
            const botMember = message.guild.members.me;
            if (!botMember.voice.channel) return message.channel.send('أنا مو في أي روم');

            const connection = botMember.voice.connection;
            if (connection) connection.destroy();
            return message.channel.send('طلعت من الروم');
        }

        // ====== MODERATION COMMANDS ======
        if (msg.startsWith('كي قفل فمك')) {
            if (!message.member.permissions.has('ModerateMembers')) return message.channel.send('ما عندك صلاحية');
            const user = message.mentions.members.first();
            if (!user) return message.channel.send('اختر عضو عشان تعطيه ميوت');
            try {
                await user.timeout(60000);
                return message.channel.send(`عضو ${user.user.username} صار ميوت`);
            } catch {
                return message.channel.send('ما قدرت اعطيه ميوت — تأكد صلاحيات البوت ورتبته');
            }
        }

        if (msg.startsWith('ترحيل الكلب')) {
            if (!message.member.permissions.has('BanMembers')) return message.channel.send('ما عندك صلاحية');
            const user = message.mentions.members.first();
            if (!user) return message.channel.send('اختر عضو عشان تطرده');
            try {
                await user.ban();
                return message.channel.send(`عضو ${user.user.username} انبند`);
            } catch {
                return message.channel.send('ما قدرت انبنده — تأكد صلاحيات البوت ورتبته');
            }
        }

        if (msg.startsWith('روح لفلف بمدودة وتعال')) {
            if (!message.member.permissions.has('KickMembers')) return message.channel.send('ما عندك صلاحية');
            const user = message.mentions.members.first();
            if (!user) return message.channel.send('اختر عضو عشان تطرده مؤقت');
            try {
                await user.kick();
                return message.channel.send(`عضو ${user.user.username} طُرد مؤقت`);
            } catch {
                return message.channel.send('ما قدرت اطرحه — تأكد صلاحيات البوت ورتبته');
            }
        }

        if (msg.startsWith('نظف المكان')) {
            if (!message.member.permissions.has('ManageMessages')) return message.channel.send('ما عندك صلاحية');
            const parts = msg.split(' ');
            const amount = parseInt(parts[2]);
            if (isNaN(amount) || amount < 1 || amount > 100) return message.channel.send('حدد عدد بين 1 و100');
            try {
                await message.channel.bulkDelete(amount);
                return message.channel.send(`${amount} رسائل تم مسحها`);
            } catch {
                return message.channel.send('ما قدرت امسح الرسائل — جرب مره ثانية');
            }
        }

        // ====== HELP COMMAND (كودك الأصلي) ======
        if (msg === 'امجوازنة الحقني' || msg === '!help') {
            return message.channel.send(`هذي الأوامر يا غالي:
وربي فكك
امصباح
امليل
-موجود ولا بيغ بوس جا
-خش الروم / -خش (لدخول الروم الصوتي)
-اطلع من الروم (للخروج من الروم الصوتي)
كي قفل فمك
ترحيل الكلب
روح لفلف بمدودة وتعال
نظف المكان
-تعريف
-تعريف ربحات
-من انت
-تشغيل [اسم الأغنية]
-ايقاف
-تخطي
-الموسيقى`);
        }

        // ====== SELECT MENU HANDLER (كودك الأصلي) ======
        if (msg === '-تعريف') {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('تعريف شباب مدودة')
                .setDescription('اضغط على الاسم عشان تعرف عن الشخص')
                .setTimestamp();

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_person')
                .setPlaceholder('اختر شخص')
                .addOptions([
                    { label: 'عمار', value: 'ammar', description: 'عيال مدودة' },
                    { label: 'ياسر', value: 'yasser', description: 'عيال مدودة' },
                    { label: 'أحمد', value: 'ahmed', description: 'احمد فتحي احمد باحميد' },
                    { label: 'يوسف', value: 'yousef', description: 'يوسف القحطاني (ابو قحط)' }
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);
            return message.channel.send({ embeds: [embed], components: [row] });
        }

        if (msg === '-تعريف ربحات') {
            const embed = new EmbedBuilder()
                .setColor(0x00ccff)
                .setTitle('تعريف ربحات')
                .setDescription('اضغط على الاسم عشان تعرف عن الشخص')
                .setTimestamp();

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_rabhat')
                .setPlaceholder('اختر شخص')
                .addOptions([
                    { label: 'أسطورة', value: 'as6ora', description: 'الأسطورة رائد' },
                    { label: 'فيصل', value: 'faisal', description: 'فيصل رائد باحميد' }
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);
            return message.channel.send({ embeds: [embed], components: [row] });
        }

        if (msg === '-من انت') {
            const embed = new EmbedBuilder()
                .setColor(0x00ff99)
                .setTitle('معلومات عن البوت')
                .setDescription('هذي معلومات عن البوت:')
                .addFields(
                    { name: 'اسم البوت', value: client.user.username || 'Unknown', inline: true },
                    { name: 'الحالة', value: client.presence?.status || 'online', inline: true },
                    { name: 'المؤسس', value: 'العم ياسر', inline: true },
                    { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
                    { name: 'تاريخ الإنشاء', value: client.user.createdAt.toDateString(), inline: false },
                    { name: 'معلومات إضافية', value: 'نسخة حضرمية من البوت', inline: false }
                )
                .setTimestamp();

            return message.channel.send({ embeds: [embed] });
        }

        // ====== MUSIC COMMANDS (كودك الأصلي) ======
        if (msg.startsWith('-تشغيل')) {
            const query = msg.replace('-تشغيل', '').trim();
            if (!query) return message.channel.send("اكتب اسم الأغنية.");

            const channel = message.member.voice.channel;
            if (!channel) return message.channel.send("ادخل روم صوتي أول.");

            await player.play(channel, query, {
                requestedBy: message.author,
                metadata: { channel: message.channel }
            });
            return;
        }

        if (msg === '-ايقاف') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue) return message.channel.send("مافي موسيقى شغّالة.");
            queue.node.stop();
            return message.channel.send("⏹️ أوقفت الموسيقى.");
        }

        if (msg === '-تخطي') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue) return message.channel.send("مافي موسيقى شغّالة.");
            await queue.node.skip();
            return message.channel.send("⏭️ تم التخطي.");
        }

        if (msg === '-الموسيقى') {
            const queue = player.nodes.get(message.guild.id);
            if (!queue || !queue.currentTrack) return message.channel.send("مافي موسيقى شغّالة.");
            return message.channel.send(`🎧 شغّال الآن: **${queue.currentTrack.title}**`);
        }

    } catch (err) {
        console.error('messageCreate error:', err);
    }
});

// ====== SELECT MENU INTERACTIONS (كودك الأصلي) ======
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const value = interaction.values[0];
    let desc = '';

    if (interaction.customId === 'select_person') {
        if (value === 'ammar' || value === 'yasser') desc = 'عيال مدودة';
        if (value === 'ahmed') desc = `الاسم كامل: احمد فتحي احمد باحميد\nالجنسية: اليمن\nالديار: مدودة\nايش يرجع: طيورة\nالصفات: خال، رجال، جلاد يوسف`;
        if (value === 'yousef') desc = `الاسم كامل: يوسف القحطاني (ابو قحط)\nالجنسية: نص يمن نص سعودية\nالديار: ماعنده مترحل من مدودة\nايش يرجع: قاضي او قحطاني\nالصفات: كابوس احمد، نشبة، مطوع`;

        const embed = new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle(`تعريف ${value}`)
            .setDescription(desc)
            .setTimestamp();

        try {
            return interaction.update({ embeds: [embed] });
        } catch (e) {
            console.error('Interaction update error:', e);
        }
    }

    if (interaction.customId === 'select_rabhat') {
        if (value === 'as6ora') {
            desc = `الاسم الكامل : رائد محمود باحميد\nالديار : مدودة\nساكن في : الشرقية\nالصفات : اسطورة، ارامكو، فورد، يحب الحياة`;
        }
        if (value === 'faisal') {
            desc = `الاسم الكامل : فيصل رائد باحميد\nالديار : مدودة\nساكن في : الشرقية\nالصفات: ملك الوصاخة، مجلود من احمد بفيفا`;
        }

        const embed = new EmbedBuilder()
            .setColor(0xff6600)
            .setTitle('تعريف ربحات')
            .setDescription(desc)
            .setTimestamp();

        try {
            return interaction.update({ embeds: [embed] });
        } catch (e) {
            console.error('Interaction update error:', e);
        }
    }
});

// ====== LOGIN (كودك الأصلي) ======
client.login(process.env.DISCORD_TOKEN);
