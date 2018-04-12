
const fs = require('fs');
const path = require('path');
const Progress = require('progress');
const puppeteer = require('puppeteer');

const MBP_CHROME_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36";
const MAIN_URL = 'http://www.shuwulou.com/shu/80.html';
const CACHE_DIR = './cache';

//  如果cache目录不存在则创建
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent(MBP_CHROME_USER_AGENT);

    // 跳转到列表页
    await page.goto(MAIN_URL);

    // 所有章节的索引
    const episodeIndexes = await getEpisodeIndexes(page);
    // console.log(episodeIndexes);

    // 进度条
    const progressBar = createProgressBar(episodeIndexes.length);

    // 根据索引获取章节，并写入文件
    for (let episodeIdx of episodeIndexes) {
      const episodeEx = await getEpisode(page, episodeIdx);
      await writeEpisode(episodeEx);
      progressBar.tick();
    }

    await browser.close();
  } catch (e) {
    console.log(e);
  }
})();

/**
 *  获取所有章节的索引
 *  @param page
 *  @return [
 *    [title, url],
 *    [title, url],
 *    ...
 *  ]
 */
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

/**
 *  获取章节实例
 *  @param page
 *  @param episode [title, url]
 *  @return [title, content, url]
 */
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

/**
 *  写文件
 *  @param episode [title, content, url]
 */
async function writeEpisode (episode) {
  let [title, content, url] = episode;
  title = title.replace(' ', '-');

  // 为了方便shell合并文件，把序列号加到前面
  const seqNum  = title.match(/\d+/)[0];
  title = `${seqNum}_${title}`;

  fs.writeFileSync(`${CACHE_DIR}/${title}`, content);
}

/**
 *  创建进度条
 *  @param total
 */
function createProgressBar (total) {
   return new Progress('  downloading [:bar] :rate/bps :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total
    });
}
