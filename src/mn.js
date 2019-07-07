const puppeteer = require('puppeteer');
const { mn } = require('./config/default');
const srcToImg = require('./helper/srcToImg');

(async () => {
    const brower = await puppeteer.launch();
    const page = await brower.newPage();
    await page.goto('https://image.baidu.com/');
    console.log('go to -> https://image.baidu.com/');
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    console.log('reset brower viewport');

    await page.focus('#kw');
    await page.keyboard.sendCharacter('美女');
    await page.click('.s_search');
    console.log('搜索列表页');

    var i = 0;
    page.on('load', async () => {
        console.log('页面加载完成，开始，，，');
         //如果不够30页 则一直获取
        while (i < 30) {
            await scrollPage(++i);
        }
        await brower.close();
    });


    /* 页面滚动方法 */
    async function scrollPage(i) {
        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });
        console.log(`get ${srcs.length} images, start download`);
        srcs.forEach(async (src) => {
            // sleep
            page.waitFor(1000);
            await srcToImg(src, mn);
        });

    }

})()