import 'dotenv/config';
import express from 'express';
import { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  EmbedBuilder 
} from 'discord.js';
import { Player } from 'discord-player';
import { joinVoiceChannel } from '@discordjs/voice';
// +++ الإضافة المطلوبة: استيراد مكتبة OpenAI +++
import { OpenAI } from 'openai'; 

// ====== تهيئة OpenAI ======
// تأكد من إضافة OPENAI_API_KEY=YOUR_KEY في ملف .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ====== KEEP ALIVE FOR RENDER ======
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web service running on port 3000'));

// ====== DISCORD BOT ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ====== MUSIC PLAYER ======
const player = new Player(client);
player.events.on("playerStart", (queue, track) => {
  queue.metadata.channel.send(`🎶 شغلت: **${track.title}**`);
});

// ====== HELPER FUNCTION ======
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ====== READY EVENT ======
client.once('ready', () => {
  console.log(`البوت شغال! اسم البوت: ${client.user.username}`);
});

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async (message) => {
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

    // +++ الإضافة المطلوبة: أمر الشات (-يخال) +++
    if (msg.startsWith('-يخال')) {
      const prompt = msg.replace('-يخال', '').trim();
        
      if (!prompt) {
        return message.channel.send('اسأل يا خال، أنا جاهز. استخدم -يخال ثم سؤالك.');
      }

      // إظهار حالة الكتابة للمستخدم أثناء انتظار الرد
      await message.channel.sendTyping();

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", 
          messages: [
            { 
              role: "system", 
              content: "أنت روبوت ديسكورد بلهجة حضرمية ودودة، رد باختصار وأدب كأنك صديق للجميع. استخدم مصطلحات مثل 'يا خال' أو 'يا غالي'." 
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          max_tokens: 300, 
        });

        const reply = response.choices[0].message.content;
        return message.channel.send(reply);

      } catch (error) {
        console.error('OpenAI Error:', error.message);
        return message.channel.send('يا خال، ما قدرت أتواصل مع الشات جي بي تي. تأكد من إعدادات المفتاح.');
      }
    }
    // --- نهاية الإضافة المطلوبة ---


    // ====== VOICE CHANNEL COMMANDS ======
    if (msg === '-يخال خش الروم') {
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

    if (msg === '-يخال اطلع من الروم') {
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

    // ====== HELP COMMAND (تم تحديثه) ======
    if (msg === 'امجوازنة الحقني' || msg === '!help') {
      return message.channel.send(`هذي الأوامر يا غالي:
وربي فكك
امصباح
امليل
-موجود ولا بيغ بوس جا
**-يخال [سؤالك]** (محادثة شات)
-يخال خش الروم
-يخال اطلع من الروم
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

    // ====== SELECT MENU HANDLER ======
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

    // ====== MUSIC COMMANDS ======
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
      if (!queue) return message.channel.send("مافي موسيقى شغّالة.");
      return message.channel.send(`🎧 شغّال الآن: **${queue.currentTrack.title}**`);
    }

  } catch (err) {
    console.error('messageCreate error:', err);
  }
});

// ====== SELECT MENU INTERACTIONS ======
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const value = interaction.values[0];
  let desc = '';

  if (interaction.customId === 'select_person') {
    if (value === 'ammar' || value === 'yasser') desc = 'عيال مدودة';
    if (value === 'ahmed') desc = `الاسم كامل: احمد فتحي احمد باحميد\nالجنسية: اليمن\nالديار: مدودة\nايش يرجع: طيورة\nالصفات: خال، رجال، جلاد يوسف`;
    if (value === 'yousef') desc = `الاسم كامل: يوسف القحطاني (ابو قحط)\nالجنسية: نص يمن نص سعودية\nالديار: ماعنده مترحل من مدودة\nايش يرجع: قاضي او قحطاني\nالصفات: كابوس احمد، خال، نشبة، مطوع`;

    const embed = new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle(`تعريف ${value}`)
      .setDescription(desc)
      .setTimestamp();

    return interaction.update({ embeds: [embed] });
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

    return interaction.update({ embeds: [embed] });
  }
});

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
