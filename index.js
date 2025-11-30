import 'dotenv/config';
import express from 'express';
import { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  EmbedBuilder 
} from 'discord.js';

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

// دالة لاختيار عشوائي
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

client.once('ready', () => {
  console.log(`البوت شغال! اسم البوت: ${client.user.username}`);
});

// ====== MESSAGE HANDLER ======
client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    const msg = message.content.toLowerCase().trim();

    // ====== تحيات وسلامات ======
    if (msg.includes('هلا') || msg.includes('مرحبا')) return message.channel.send('هلا حبيبي، شخبارك من حضرموت؟');
    if (msg.includes('كيفك') || msg.includes('كيف الحال')) return message.channel.send('تمام الحمد لله، وانت؟');
    if (msg.includes('وداع') || msg.includes('مع السلامة')) return message.channel.send('مع السلامة يا غالي');

    // ====== FUN COMMANDS ======
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

    // ====== PING COMMAND ======
    if (msg === '-موجود ولا بيغ بوس جا') {
      return message.channel.send(`موجود البيغ بوس ما جا (البينغ: ${client.ws.ping}ms)`);
    }

    // ====== VOICE ROOM COMMANDS ======
    if (msg === '-يخال خش الروم') {
      if (!message.member.voice.channel) return message.channel.send('ادخل الروم أول');
      const channel = message.member.voice.channel;
      const botMember = message.guild.members.me;
      await botMember.voice.setChannel(channel);
      return message.channel.send('دخلت الروم');
    }

    if (msg === '-يخال اطلع من الروم') {
      const botMember = message.guild.members.me;
      if (!botMember.voice.channel) return message.channel.send('أنا مو في أي روم');
      await botMember.voice.disconnect();
      return message.channel.send('طلعت من الروم');
    }

    // ====== ADMIN COMMANDS ======
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
        await user.bban();
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

    // ====== HELP COMMAND ======
    if (msg === 'امجوازنة الحقني' || msg === '!help') {
      return message.channel.send(`هذي الأوامر يا غالي:
وربي فكك → يرسل نكتة حضرمية
امصباح → صباح الخير
امليل → مساء الخير
-موجود ولا بيغ بوس جا → يطلع بينغ
كي قفل فمك @عضو → ميوت للعضو
ترحيل الكلب @عضو → باند للعضو
روح لفلف بمدودة وتعال @عضو → طرد مؤقت للعضو
نظف المكان عدد → يمسح عدد الرسائل
-تعريف → يطلع رسالة تعريف
-من انت → معلومات عن البوت`);
    }

    // ====== DEFINITION COMMAND ======
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

    // ====== BOT INFO COMMAND ======
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

    // ====== ROULETTE GAME (HADRAMI) ======
    if (msg === 'روليت') {
      const bullets = [
        '💥 *طراااخ!* — وربي جاتك الرصاصة يا رجال 🤣',
        '😮‍💨 فاضي… نجوت يا خال بس لا تعيدها كثير!',
        '💥 الله يرحمك… طلقة مباشرة في مخك 😂',
        '😎 فاضي يا خوي… شكلك اليوم محظوظ',
        '💥 عاد ما توقعتك تموت بهذه السرعة يا رجال 🤣'
      ];
      return message.channel.send(randomChoice(bullets));
    }

    // ====== RANDOM RESPONSE FOR YOUSUF AND AHMED ======
    if (msg === 'يخال اجلد يوسف') {
      const responses = [
        'يوسف وربي اجيب لك سمبوسة بيض',
        'يوسف بيجيب لك مارتيزر',
        'مالك الا ولد مدودة يجي يجلدك',
        'نجيب سمبوسة بيض ولا كيف؟'
      ];
      return message.channel.send(randomChoice(responses));
    }

    if (msg === 'يخال اجلد احمد') {
      const responses = [
        'ابي اعطيك O2 ولا كيف',
        'بجيب لك يوسف',
        'بجيب لك ابو قحط',
        'مالك الا يوسف يرحلك'
      ];
      return message.channel.send(randomChoice(responses));
    }

  } catch (err) {
    console.error('messageCreate error:', err);
  }
});

// ====== SELECT MENU HANDLER ======
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  const value = interaction.values[0];

  let desc = '';
  if (value === 'ammar' || value === 'yasser') {
    desc = 'عيال مدودة';
  }
  if (value === 'ahmed') {
    desc = `الاسم كامل: احمد فتحي احمد باحميد
الجنسية: اليمن
الديار: مدودة
ايش يرجع: طيورة
الصفات: خال، رجال، جلاد يوسف`;
  }
  if (value === 'yousef') {
    desc = `الاسم كامل: يوسف القحطاني (ابو قحط)
الجنسية: نص يمن نص سعودية
الديار: ماعنده مترحل من مدودة
ايش يرجع: قاضي او قحطاني
الصفات: كابوس احمد، خال، نشبة، مطوع`;
  }

  const embed = new EmbedBuilder()
    .setColor(0xff9900)
    .setTitle(`تعريف ${value}`)
    .setDescription(desc)
    .setTimestamp();

  await interaction.update({ embeds: [embed] });
});

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
