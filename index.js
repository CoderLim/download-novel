
const fs = require('fs');
const puppeteer = require('puppeteer');
const MAIN_URL = 'http://www.shuwulou.com/shu/80.html';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36");
    await page.goto(MAIN_URL);


    const novelList = await getNovelList(page);
    console.log(novelList);

    await browser.close();
  } catch (e) {
    console.log(e);
  }
})();

async function getNovelList (page) {
  const novelListSelector = 'dd > a';
  await page.waitForSelector(novelListSelector);
  const links = await page.evaluate(selector => {
    const anchors = Array.from(document.querySelectorAll(selector));
    return anchors.map(anchor => {
      const title = anchor.textContent.split('|')[0].trim();
      return [title, anchor.href];
    });
  }, novelListSelector);
  return links;
}

async function download (page, episode) {
  const [title, url] = episode;
  await page.goto(url);
}

async function downloadEpisode(page, url) {
  page.goto(url);

  const contentElem = await page.$('#content');
  const contentHtml = contentElem.getProperty('innerHtml');
}

