require("dotenv").config();
const { chromium } = require("playwright");
const cron = require("node-cron");

async function doMyAttendance(login = false) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://hfn.greythr.com/");
  /* Insert username and password */
  await page.fill("#username", process.env.USERNAME);
  await page.fill("#password", process.env.PASSWORD);
  await page.click("button");

  if (login) {
    await page.click("text=Sign In");
    await browser.close();
  } else {
    await page.click("text=Sign Out");
    await browser.close();
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
