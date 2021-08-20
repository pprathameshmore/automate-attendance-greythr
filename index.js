require("dotenv").config();
const { chromium } = require("playwright");
const cron = require("node-cron");

const { sendMail } = require("./mail-config");

async function doMyAttendance(login = false) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(process.env.COMPANY_DOMAIN);
  /* Insert username and password */
  await page.fill("#username", process.env.EMAIL);
  await page.fill("#password", process.env.PASSWORD);
  await page.click("button");

  if (login) {
    await page.click("text=Sign In");
    setTimeout(async () => {
      const proofImg = await page.screenshot();
      const buffer = proofImg.toString("base64");
      await sendMail(buffer);
      await browser.close();
    }, 15000);
  } else {
    await page.click("text=Sign Out");
    setTimeout(async () => {
      const proofImg = await page.screenshot();
      const buffer = proofImg.toString("base64");
      await sendMail(buffer);
      await browser.close();
    }, 15000);
  }
}

/* 

Monday - Friday at 7pm => 0 19 * * 1-5 
Monday - Friday at 9am => 0 9 * * 1-5

*/

async function begin() {
  cron.schedule("10 9 * * 1-5", async function () {
    console.log("Logging...");
    await doMyAttendance(true);
  });

  cron.schedule("0 19 * * 1-5", async function () {
    console.log("Log outing...");
    await doMyAttendance();
  });
}

begin();
