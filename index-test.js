
const fs = require('fs');
const path = require('path');
const Progress = require('progress');
const puppeteer = require('puppeteer');

const MBP_CHROME_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36";
// const MAIN_URL = 'http://www.shuwulou.com/shu/80.html';
const MAIN_URL = `https://kibana.lecloud.com/app/kibana#/visualize/edit/485dfce0-3ba2-11e8-8343-5781455febfd?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:'2018-03-31T16:00:00.000Z',mode:absolute,to:'2018-04-30T15:59:59.999Z'))&_a=(filters:!(),linked:!f,query:(language:lucene,query:'(supplier_name:%22KVM%22%20OR%20brand_name_lingshu:%22KVM%2FKVM%22)%20AND%20!!servicetree1:%22%E4%B9%90%E8%A7%86%E4%BA%91%22%20AND%20!!sum_price:0'),uiState:(spy:(mode:(fill:!f,name:table)),vis:(params:(sort:(columnIndex:2,direction:desc)))),vis:(aggs:!((enabled:!t,id:'3',params:(field:servicetree1.keyword,order:desc,orderBy:'1',size:100),schema:bucket,type:terms),(enabled:!t,id:'11',params:(field:servicetree2.keyword,order:desc,orderBy:'1',size:500),schema:bucket,type:terms),(enabled:!t,id:'12',params:(field:revenue.keyword,order:desc,orderBy:'9',size:1000),schema:bucket,type:terms),(enabled:!t,id:'4',params:(customLabel:SN,field:sn_str,order:desc,orderBy:'1',size:999999),schema:bucket,type:terms),(enabled:!t,id:'6',params:(customLabel:IDC,field:idc.keyword,order:desc,orderBy:'1',size:100),schema:bucket,type:terms),(enabled:!t,id:'5',params:(customLabel:CPU,field:cpu_clear.keyword,order:desc,orderBy:'1',size:999999),schema:bucket,type:terms),(enabled:!t,id:'7',params:(customLabel:MEM,field:mem_clear.keyword,order:desc,orderBy:'1',size:999999),schema:bucket,type:terms),(enabled:!t,id:'8',params:(customLabel:DISK,field:disk_clear.keyword,order:desc,orderBy:'1',size:999999),schema:bucket,type:terms),(enabled:!t,id:'9',params:(customLabel:%E5%BC%80%E5%A7%8B%E6%97%B6%E9%97%B4,field:ts),schema:metric,type:min),(enabled:!t,id:'10',params:(customLabel:%E7%BB%93%E6%9D%9F%E6%97%B6%E9%97%B4,field:ts),schema:metric,type:max),(enabled:!t,id:'1',params:(),schema:metric,type:count),(enabled:!t,id:'2',params:(field:sum_price),schema:metric,type:sum)),params:(perPage:40,showMeticsAtAllLevels:!f,showPartialRows:!f,showTotal:!f,sort:(columnIndex:!n,direction:!n),totalFunc:sum),title:%E8%B4%A6%E5%8D%95%E6%A0%B8%E5%AF%B9--%E6%B1%87%E6%80%BB%E4%BA%91%E4%B8%BB%E6%9C%BA%E8%B4%A6%E5%8D%95,type:table))`;
const CACHE_DIR = './cache';

(async () => {
  try {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      args: ['--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    // page.setUserAgent(MBP_CHROME_USER_AGENT);

    // 跳转到列表页
    await page.goto(MAIN_URL);
    await page.authenticate({username: 'admin', password: '46a89c5651d14d77452b6e601917052f'});

    const content = page.content();
    console.log(content);
    const selector = '.small[ng-click="aggTable.exportAsCsv(true)"]';
    page.click(selector);

    await page.close();
    await browser.close();
  } catch (e) {
    console.log(e);
  }
})();
