import 'dotenv/config';
import express from 'express';
import pkg from 'discord.js';
const { Client, GatewayIntentBits, EmbedBuilder } = pkg;

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

// ====== RANDOM HELPER ======
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
    if (msg.includes('هلا') || msg.includes('مرحبا')) return message.channel.send('هلا حبيبي، شخبارك من حضرموت؟ 😎');
    if (msg.includes('كيفك') || msg.includes('كيف الحال')) return message.channel.send('تمام الحمد لله، وانت؟ 🌴');
    if (msg.includes('وداع') || msg.includes('مع السلامة')) return message.channel.send('مع السلامة يا غالي 😎');

    // ====== FUN COMMANDS ======
    if (msg === 'وربي فكك') {
      const jokes = [
        'مرة حضرمي قال لصاحبه: ليش الحلوة غالية؟ قال: لأنها غالية 😂',
        'مرة حضرمي قال: الجوع ذبحني وانا مالي دخل 😎',
        'مرة حضرمي دخل السوق وقال: كم الريال؟ قالوا: 1، قال: اعطني كيلو 😂'
      ];
      return message.channel.send(randomChoice(jokes));
    }
    if (msg === 'امصباح') return message.channel.send('صباح الخير 🌞');
    if (msg === 'امليل') return message.channel.send('مساء الخير 🌙');

    // ====== PING COMMAND ======
    if (msg === '-موجود ولا بيغ بوس جا') {
      return message.channel.send(`موجود البيغ بوس ما جا 🏓 (البينغ: ${client.ws.ping}ms)`);
    }

    // ====== VOICE ROOM COMMANDS ======
    if (msg === '-يخال خش الروم') {
      if (!message.member.voice.channel) return message.channel.send('ادخل الروم أول 😅');
      const channel = message.member.voice.channel;
      await message.guild.members.me.voice.setChannel(channel);
      return message.channel.send('دخلت الروم 😎');
    }

    if (msg === '-يخال اطلع من الروم') {
      const botMember = message.guild.members.me;
      if (!botMember.voice.channel) return message.channel.send('أنا مو في أي روم 😅');
      await botMember.voice.disconnect();
      return message.channel.send('طلعت من الروم 😎');
    }

    // ====== ADMIN COMMANDS ======
    if (msg.startsWith('كي قفل فمك')) {
      if (!message.member.permissions.has('ModerateMembers')) return message.channel.send('ما عندك صلاحية 😎');
      const user = message.mentions.members.first();
      if (!user) return message.channel.send('اختر عضو عشان تعطيه ميوت 😅');
      try {
        await user.timeout(60000);
        return message.channel.send(`عضو ${user.user.username} صار ميوت 🕶️`);
      } catch {
        return message.channel.send('ما قدرت اعطيه ميوت — تأكد صلاحيات البوت ورتبته 😅');
      }
    }

    if (msg.startsWith('ترحيل الكلب')) {
      if (!message.member.permissions.has('BanMembers')) return message.channel.send('ما عندك صلاحية 😎');
      const user = message.mentions.members.first();
      if (!user) return message.channel.send('اختر عضو عشان تطرده 😅');
      try {
        await user.ban();
        return message.channel.send(`عضو ${user.user.username} انبند 😎`);
      } catch {
        return message.channel.send('ما قدرت انبنده — تأكد صلاحيات البوت ورتبته 😅');
      }
    }

    if (msg.startsWith('روح لفلف بمدودة وتعال')) {
      if (!message.member.permissions.has('KickMembers')) return message.channel.send('ما عندك صلاحية 😎');
      const user = message.mentions.members.first();
      if (!user) return message.channel.send('اختر عضو عشان تطرده مؤقت 😅');
      try {
        await user.kick();
        return message.channel.send(`عضو ${user.user.username} طُرد مؤقت 😎`);
      } catch {
        return message.channel.send('ما قدرت اطرحه — تأكد صلاحيات البوت ورتبته 😅');
      }
    }

    if (msg.startsWith('نظف المكان')) {
      if (!message.member.permissions.has('ManageMessages')) return message.channel.send('ما عندك صلاحية 😎');
      const parts = msg.split(' ');
      const amount = parseInt(parts[2]);
      if (isNaN(amount) || amount < 1 || amount > 100) return message.channel.send('حدد عدد بين 1 و100 😅');
      try {
        await message.channel.bulkDelete(amount);
        return message.channel.send(`${amount} رسائل تم مسحها 😎`);
      } catch {
        return message.channel.send('ما قدرت امسح الرسائل — جرب مره ثانية 😅');
      }
    }

    // ====== HELP COMMAND ======
    if (msg === 'امجوازنة الحقني' || msg === '!help') {
      return message.channel.send(`هذي الأوامر يا غالي 😎:
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
        .setTitle('تعريف عن البوت 👇')
        .setDescription('هذي رسالة تعريف عن البوت و الأشخاص المرتبطين به')
        .addFields(
          { name: 'الهدف', value: 'البوت يقوم بالرد على الأوامر واللعب مع المستخدمين', inline: false },
          { name: 'مطور البوت', value: 'Golden Boy (العم ياسر)', inline: true },
          { name: 'الأشخاص المعروفين', value: 'عمار، ياسر، أحمد، يوسف', inline: true },
          { name: 'استخدام الأوامر', value: 'استخدم -امصباح، -امليل، -وربي فكك، -من انت وغيرها', inline: false }
        )
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

    // ====== BOT INFO COMMAND ======
    if (msg === '-من انت') {
      const embed = new EmbedBuilder()
        .setColor(0x00ff99)
        .setTitle('معلومات عن البوت 👇')
        .setDescription('هذي معلومات عن البوت:')
        .addFields(
          { name: 'اسم البوت', value: client.user.username, inline: true },
          { name: 'الحالة', value: client.presence?.status || 'online', inline: true },
          { name: 'المؤسس', value: 'العم ياسر', inline: true },
          { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
          { name: 'تاريخ الإنشاء', value: client.user.createdAt.toDateString(), inline: false },
          { name: 'معلومات إضافية', value: 'نسخة حضرمية من البوت 😎', inline: false }
        )
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }

  } catch (err) {
    console.error('messageCreate error:', err);
  }
});

// ====== LOGIN ======
client.login(process.env.DISCORD_TOKEN);
