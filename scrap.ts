import puppeteer from 'puppeteer'

export const scrapUrl = async (url: string) => {
  const browser = await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--single-process',
      '--no-zygote',
    ],
    executablePath:
      process.env.NODE_ENV === 'production'
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  })
  const page = await browser.newPage()
  await page.goto(url)

  const image = await page.screenshot({ path: 'screenshot.png' })

  await browser.close()

  return image
}
