
const fs = require('fs');
const puppeteer = require('puppeteer');
const MAIN_URL = 'http://www.shuwulou.com/shu/80.html';
const CACHE_DIR = './cache';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // MBP的chrome
    page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36");
    await page.goto(MAIN_URL);

    // 所有章节的索引
    const episodeIndexes = await getEpisodeIndexes(page);
    // console.log(episodeIndexes);

    for (let episode of episodeIndexes) {
      const episodeEx = await getEpisode(page, episode);
      await writeEpisode(episodeEx);
    }

    await browser.close();
  } catch (e) {
    console.log(e);
  }
})();

async function getEpisodeIndexes (page) {
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

async function getEpisode (page, episode) {
  const contentSelector = '#content';
  const [title, url] = episode;
  await page.goto(url);
  await page.waitForSelector(contentSelector);

  const content = await page.evaluate(selector => {
    const content = document.querySelector(selector);
    return content.textContent;
  }, contentSelector);

  return [title, content, url];
}

async function writeEpisode (episode) {
  let [title, content, url] = episode;
  title = title.replace(' ', '-');

  fs.writeFileSync(`${CACHE_DIR}/${title}`, content);
}

async function downloadEpisode(page, url) {
  page.goto(url);

  const contentElem = await page.$('#content');
  const contentHtml = contentElem.getProperty('innerHtml');
}

