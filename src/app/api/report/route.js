import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1350658584085790791/LteMegecBpb5I_LLhiPF0QLEctAYFA6t_LlC6vUNz2wD8v7sOlgg5Igd4cnyQJZeeF_s";

export async function POST(request) {
  try {
    const {
      content,
      type,
      schoolName,
      schoolId,
      commentId,
      reason,
      reporter
    } = await request.json();

    // Use Discord CDN hosted image
    const logoUrl = "https://media.discordapp.net/attachments/1316026098672467978/1351020902116233297/Rateministere_350x350.png?ex=67d8dbc3&is=67d78a43&hm=5bcefb44b90286d243a6a3bbcc41ba7e35bebf237cf14e66979cf2683ece294c&=&format=webp&quality=lossless&width=626&height=626";

    const discordMessage = {
      embeds: [{
        title: "🚨 NEW REPORT ALERT 🚨",
        color: 0xFF0000,
        description: "### 📢 A new report requires attention!\n\n*Please review the following information:*",
        fields: [
          {
            name: "💡 Report Type",
            value: "```yaml\n" + type + "```",
            inline: true
          },
          {
            name: "📊 Status",
            value: "```diff\n+ Pending Review```",
            inline: true
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true
          },
          {
            name: "👤 Reporter Name",
            value: "```yaml\n" + reporter.name + "```",
            inline: true
          },
          {
            name: "📧 Reporter Email",
            value: "```yaml\n" + reporter.email + "```",
            inline: true
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true
          },
          {
            name: "🏫 School",
            value: "```yaml\n" + (schoolName || "N/A") + "```",
            inline: true
          },
          {
            name: "🔢 School ID",
            value: "```yaml\n" + (schoolId || "N/A") + "```",
            inline: true
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true
          },
          {
            name: "📝 Comment ID",
            value: "```yaml\n" + (commentId || "N/A") + "```",
            inline: false
          },
          {
            name: "⚠️ Reason for Report",
            value: "```fix\n" + (reason || "No reason provided") + "```",
            inline: false
          },
          {
            name: "📄 Reported Content",
            value: "```yaml\n" + (content || "No content") + "```",
            inline: false
          }
        ],
        thumbnail: {
          url: logoUrl
        },
        footer: {
          text: "🔍 RateMinistere Report System | Report ID: " + Date.now(),
          icon_url: logoUrl
        },
        timestamp: new Date().toISOString()
      }]
    };

    // Remove logo verification since we're using Discord CDN
    // Proceed directly to sending the webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json(
      { error: 'Failed to process report' },
      { status: 500 }
    );
  }
}