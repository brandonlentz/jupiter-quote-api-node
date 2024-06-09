import axios from "axios";

const telegramToken = process.env.telegramtoken;
const chatId = "1468539726";

export async function sendTelegramNotification(message: string) {
  if (!telegramToken || !chatId) {
    console.error("Telegram token or chat ID not provided.");
    return;
  }

  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    console.log("Telegram notification sent.");
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}
