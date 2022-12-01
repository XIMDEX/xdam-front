// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')
const confmap = require('./TestConfig.js')

describe('Create Assessment', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Create Assessment 1', async function() {
    // Test name: Create Assessment 1
    // Step # | name | target | value
    // 1 | open | http://192.168.0.30:3000/home | 
    await driver.get(confmap.url)
    // 2 | setWindowSize | 1920x1080 | 
    await driver.manage().window().setRect({ width: 1920, height: 1080 })
    // 3 | click | xpath=//input | 
    await driver.findElement(By.xpath("//input")).click()
    // 4 | type | css=.Mui-focused > .MuiInputBase-input | superadmin@xdam.com
    await driver.findElement(By.css(".Mui-focused > .MuiInputBase-input")).sendKeys("superadmin@xdam.com")
    // 5 | click | xpath=//div[2]/div/input | 
    await driver.findElement(By.xpath("//div[2]/div/input")).click()
    // 6 | type | css=.Mui-focused > .MuiInputBase-input | 123123
    await driver.findElement(By.css(".Mui-focused > .MuiInputBase-input")).sendKeys("123123")
    // 7 | click | css=.MuiButton-label | 
    await driver.findElement(By.css(".MuiButton-label")).click()
    // 8 | assertElementNotPresent | css=li | 
    {
      const elements = await driver.findElements(By.css("li"))
      assert(!elements.length)
    }
    // 9 | waitForElementPresent | css=input:nth-child(2) | 30000
    await driver.wait(until.elementLocated(By.css("input:nth-child(2)")), 30000)
    // 10 | assertElementPresent | css=input:nth-child(2) | 
    {
      const elements = await driver.findElements(By.css("input:nth-child(2)"))
      assert(elements.length)
    }
    // 11 | click | css=.label > .divider | 
    await driver.findElement(By.css(".label > .divider")).click()
    // 12 | assertText | css=.visible > .item:nth-child(2) > .text | Public Organization Assessment collection
    assert(await driver.findElement(By.css(".visible > .item:nth-child(2) > .text")).getText() == "Public Organization Assessment collection")
    // 13 | click | css=.visible > .item:nth-child(2) > .text | 
    await driver.findElement(By.css(".visible > .item:nth-child(2) > .text")).click()
    // 14 | waitForElementPresent | css=.teal > .ui:nth-child(1) | 30000
    await driver.wait(until.elementLocated(By.css(".teal > .ui:nth-child(1)")), 30000)
    // 15 | assertText | css=.teal > .ui:nth-child(1) | New assessment
    assert(await driver.findElement(By.css(".teal > .ui:nth-child(1)")).getText() == "New assessment")
    // 16 | click | css=.teal > .ui:nth-child(1) | 
    await driver.findElement(By.css(".teal > .ui:nth-child(1)")).click()
    // 17 | click | css=.ui > label | 
    await driver.findElement(By.css(".ui > label")).click()
    // 18 | type | id=root_description_name | test 1
    await driver.findElement(By.xpath("//label[contains(.,\'name *\')]/following-sibling::input")).sendKeys("test 1")
    // 19 | type | id=root_description_external_url | www.test1.com
    await driver.findElement(By.xpath("//label[contains(.,\'external_url\')]/following-sibling::input")).sendKeys("www.test1.com")
    // 20 | type | id=root_description_description | test description
    await driver.findElement(By.xpath("//label[contains(.,\'description\')]/following-sibling::textarea")).sendKeys("test description")
    // 21 | click | css=.grouped:nth-child(6) .plus | 
    await driver.findElement(By.css(".grouped:nth-child(6) .plus")).click()
    // 22 | type | id=root_description_tags_0 | test 1
    await driver.findElement(By.id("root_description_tags_0")).sendKeys("test 1")
    // 23 | click | css=.grouped:nth-child(7) .plus | 
    await driver.findElement(By.css(".grouped:nth-child(7) .plus")).click()
    // 24 | type | id=root_description_categories_0 | test 1
    await driver.findElement(By.id("root_description_categories_0")).sendKeys("test 1")
    //subida de archivos
    //carga imagen previa
    await driver.findElement(By.xpath("//*[@id='form-content']/div/div[2]/div/div/div/div[3]/label/span/input")).sendKeys(confmap.testFile)
    //cargar archivo
    await driver.findElement(By.xpath("//*[@id='form-content']/div/div[2]/div/div/div/div[3]/label/span/input")).sendKeys(confmap.testFile)
    // 25 | click | css=.forms-main-btns > .ui:nth-child(1) | 
    await driver.findElement(By.css(".forms-main-btns > .ui:nth-child(1)")).click()
    // 26 | waitForElementPresent | xpath=//p[contains(.,'Resource created')] | 5000
    await driver.wait(until.elementLocated(By.xpath("//p[contains(.,\'Resource created\')]")), 5000)
    // 27 | verifyText | xpath=//p[contains(.,'Resource created')] | Resource created
    assert(await driver.findElement(By.xpath("//p[contains(.,\'Resource created\')]")).getText() == "Resource created")
    // 28 | click | css=.circular > .close | 
    await driver.findElement(By.css(".circular > .close")).click()
  })
  it('Delete Assessments', async function() {
    // Test name: Delete Assessments
    // Step # | name | target | value
    // 1 | open | http://192.168.0.30:3000/home | 
    await driver.get(confmap.url)
    // 2 | setWindowSize | 1920x1080 | 
    await driver.manage().window().setRect({ width: 1920, height: 1080 })
    // 3 | click | xpath=//input | 
    await driver.findElement(By.xpath("//input")).click()
    // 4 | type | css=.Mui-focused > .MuiInputBase-input | superadmin@xdam.com
    await driver.findElement(By.css(".Mui-focused > .MuiInputBase-input")).sendKeys("superadmin@xdam.com")
    // 5 | click | xpath=//div[2]/div/input | 
    await driver.findElement(By.xpath("//div[2]/div/input")).click()
    // 6 | type | css=.Mui-focused > .MuiInputBase-input | 123123
    await driver.findElement(By.css(".Mui-focused > .MuiInputBase-input")).sendKeys("123123")
    // 7 | click | css=.MuiButton-label | 
    await driver.findElement(By.css(".MuiButton-label")).click()
    // 8 | assertElementNotPresent | css=li | 
    {
      const elements = await driver.findElements(By.css("li"))
      assert(!elements.length)
    }
    // 9 | waitForElementPresent | css=input:nth-child(2) | 30000
    await driver.wait(until.elementLocated(By.css("input:nth-child(2)")), 30000)
    // 10 | assertElementPresent | css=input:nth-child(2) | 
    {
      const elements = await driver.findElements(By.css("input:nth-child(2)"))
      assert(elements.length)
    }
    // 11 | click | css=.label > .divider | 
    await driver.findElement(By.css(".label > .divider")).click()
    // 12 | assertText | css=.visible > .item:nth-child(2) > .text | Public Organization Assessment collection
    assert(await driver.findElement(By.css(".visible > .item:nth-child(2) > .text")).getText() == "Public Organization Assessment collection")
    // 13 | click | css=.visible > .item:nth-child(2) > .text | 
    await driver.findElement(By.css(".visible > .item:nth-child(2) > .text")).click()
    // 14 | waitForElementPresent | css=input:nth-child(2) | 5000
    await driver.wait(until.elementLocated(By.css("input:nth-child(2)")), 5000)
    // 15 | type | css=input:nth-child(2) | test 1
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys("test 1")
    // 16 | sendKeys | css=input:nth-child(2) | ${KEY_ENTER}
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.ENTER)
    // 17 | pause | 1500 | 1500
    await driver.sleep(1500)
    // 18 | storeXpathCount | xpath=//div[@id='main-r-c']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img | exist
    await driver.findElements(By.xpath("//div[@id=\'main-r-c\']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img")).then(elements => console.log(vars["exist"] = elements.length))
    // 19 | if | ${exist} > 0 | 
    if (!!await driver.executeScript("return (arguments[0] > 0)", vars["exist"])) {
      // 20 | pause | 1500 | 1500
      await driver.sleep(1500)
      // 21 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
      await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")), 5000)
      // 22 | assertElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
      {
        const elements = await driver.findElements(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))
        assert(elements.length)
      }
      // 23 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi |  
      await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")).click()
      // 24 | waitForElementPresent | css=.MuiTypography-h6 | 2500
      await driver.wait(until.elementLocated(By.css(".MuiTypography-h6")), 2500)
      // 25 | storeText | css=.MuiTypography-h6 | name1
      vars["name1"] = await driver.findElement(By.css(".MuiTypography-h6")).getText()
      // 26 | waitForElementPresent | css=.close | 30000
      await driver.wait(until.elementLocated(By.css(".close")), 30000)
      // 27 | click | css=.close | 
      await driver.findElement(By.css(".close")).click()
      // 28 | if | ${name1} == 'Test 1' | 
      if (!!await driver.executeScript("return (arguments[0] == \'Test 1\')", vars["name1"])) {
        // 30 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 5000
        await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")), 5000)
        // 31 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 
        await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")).click()
        // 32 | assertConfirmation | sure? | 
        assert(await driver.switchTo().alert().getText() == "sure?")
        // 33 | webdriverChooseOkOnVisibleConfirmation |  | 
        await driver.switchTo().alert().accept()
        // 34 | else |  | 
      } else {
        // 35 | waitForElementPresent | css=input:nth-child(2) | 5000
        await driver.wait(until.elementLocated(By.css("input:nth-child(2)")), 5000)
        // 36 | sendKeys | css=input:nth-child(2) | ${KEY_DELETE}
        await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.DELETE)
        // 37 | type | css=input:nth-child(2) | Test 1 Edited
        await driver.findElement(By.css("input:nth-child(2)")).sendKeys("Test 1 Edited")
        // 38 | sendKeys | css=input:nth-child(2) | ${KEY_ENTER}
        await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.ENTER)
        // 39 | pause | 1500 | 1500
        await driver.sleep(1500)
        // 40 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
        await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")), 5000)
        // 41 | assertElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
        {
          const elements = await driver.findElements(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))
          assert(elements.length)
        }
        // 42 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi |  
        await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")).click()
        // 43 | waitForElementPresent | css=.MuiTypography-h6 | 2500
        await driver.wait(until.elementLocated(By.css(".MuiTypography-h6")), 2500)
        // 44 | storeText | css=.MuiTypography-h6 | name1b
        vars["name1b"] = await driver.findElement(By.css(".MuiTypography-h6")).getText()
        // 45 | waitForElementPresent | css=.close | 30000
        await driver.wait(until.elementLocated(By.css(".close")), 30000)
        // 46 | click | css=.close | 
        await driver.findElement(By.css(".close")).click()
        // 47 | if | ${name1b} == 'Test 1 Edited' | 
        if (!!await driver.executeScript("return (arguments[0] == \'Test 1 Edited\')", vars["name1b"])) {
          // 49 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 5000
          await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")), 5000)
          // 50 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 
          await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")).click()
          // 51 | assertConfirmation | sure? | 
          assert(await driver.switchTo().alert().getText() == "sure?")
          // 52 | webdriverChooseOkOnVisibleConfirmation |  | 
          await driver.switchTo().alert().accept()
          // 53 | end |  | 
        }
        // 54 | end |  | 
      }
      // 55 | end |  | 
    }
    // 56 | waitForElementEditable | css=input:nth-child(2) | 30000
    await driver.wait(until.elementIsEnabled(await driver.findElement(By.css("input:nth-child(2)"))), 30000)
    // 57 | sendKeys | css=input:nth-child(2) | ${KEY_DELETE}
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.DELETE)
    // 58 | type | css=input:nth-child(2) | test 3
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys("test 3")
    // 59 | sendKeys | css=input:nth-child(2) | ${KEY_ENTER}
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.ENTER)
    // 60 | pause | 1500 | 1500
    await driver.sleep(1500)
    // 61 | storeXpathCount | xpath=//div[@id='main-r-c']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img | exist3
    await driver.findElements(By.xpath("//div[@id=\'main-r-c\']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img")).then(elements => console.log(vars["exist3"] = elements.length))
    // 62 | if | ${exist3} > 0 | 
    if (!!await driver.executeScript("return (arguments[0] > 0)", vars["exist3"])) {
      // 63 | pause | 1500 | 1500
      await driver.sleep(1500)
      // 64 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
      await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")), 5000)
      // 65 | waitForElementVisible | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
      await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))), 5000)
      // 66 | assertElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
      {
        const elements = await driver.findElements(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))
        assert(elements.length)
      }
      // 67 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
      await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")).click()
      // 68 | waitForElementPresent | css=.MuiTypography-h6 | 2500
      await driver.wait(until.elementLocated(By.css(".MuiTypography-h6")), 2500)
      // 69 | storeText | css=.MuiTypography-h6 | name3
      vars["name3"] = await driver.findElement(By.css(".MuiTypography-h6")).getText()
      // 70 | waitForElementPresent | css=.close | 30000
      await driver.wait(until.elementLocated(By.css(".close")), 30000)
      // 71 | click | css=.close | 
      await driver.findElement(By.css(".close")).click()
      // 72 | if | ${name3} == 'Test 3' | 
      if (!!await driver.executeScript("return (arguments[0] == \'Test 3\')", vars["name3"])) {
        // 74 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 30000
        await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")), 30000)
        // 75 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 
        await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")).click()
        // 76 | assertConfirmation | sure? | 
        assert(await driver.switchTo().alert().getText() == "sure?")
        // 77 | webdriverChooseOkOnVisibleConfirmation |  | 
        await driver.switchTo().alert().accept()
        // 78 | end |  | 
      }
      // 79 | end |  | 
    }
    // 80 | waitForElementPresent | css=input:nth-child(2) | 5000
    await driver.wait(until.elementLocated(By.css("input:nth-child(2)")), 5000)
    // 81 | sendKeys | css=input:nth-child(2) | ${KEY_DELETE}
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.DELETE)
    // 82 | type | css=input:nth-child(2) | test 2
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys("test 2")
    // 83 | sendKeys | css=input:nth-child(2) | ${KEY_ENTER}
    await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.ENTER)
    // 84 | pause | 1500 | 1500
    await driver.sleep(1500)
    // 85 | storeXpathCount | xpath=//div[@id='main-r-c']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img | exist2
    await driver.findElements(By.xpath("//div[@id=\'main-r-c\']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img")).then(elements => console.log(vars["exist2"] = elements.length))
    // 86 | if | ${exist2} > 0 | 
    if (!!await driver.executeScript("return (arguments[0] > 0)", vars["exist2"])) {
      // 87 | pause | 1500 | 1500
      await driver.sleep(1500)
      // 88 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
      await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")), 5000)
      // 89 | waitForElementVisible | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
      await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))), 5000)
      // 90 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
      await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")).click()
      // 91 | waitForElementPresent | css=.MuiTypography-h6 | 2500
      await driver.wait(until.elementLocated(By.css(".MuiTypography-h6")), 2500)
      // 92 | storeText | css=.MuiTypography-h6 | name2
      vars["name2"] = await driver.findElement(By.css(".MuiTypography-h6")).getText()
      // 93 | waitForElementPresent | css=.close | 30000
      await driver.wait(until.elementLocated(By.css(".close")), 30000)
      // 94 | click | css=.close | 
      await driver.findElement(By.css(".close")).click()
      // 95 | if | ${name2} = 'Test 2' | 
      if (!!await driver.executeScript("return (arguments[0] = \'Test 2\')", vars["name2"])) {
        // 97 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 5000
        await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")), 5000)
        // 98 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 
        await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")).click()
        // 99 | assertConfirmation | sure? | 
        assert(await driver.switchTo().alert().getText() == "sure?")
        // 100 | webdriverChooseOkOnVisibleConfirmation |  | 
        await driver.switchTo().alert().accept()
        // 101 | pause | 1500 | 1500
        await driver.sleep(1500)
        // 102 | end |  | 
      }
      // 103 | else |  | 
    } else {
      // 104 | waitForElementPresent | css=input:nth-child(2) | 5000
      await driver.wait(until.elementLocated(By.css("input:nth-child(2)")), 5000)
      // 105 | sendKeys | css=input:nth-child(2) | ${KEY_DELETE}
      await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.DELETE)
      // 106 | type | css=input:nth-child(2) | Agbe5uq354uw4569o79¡'`9`¡07'P+Ç´T89o0´R79´`N57i3567un262n6`'Nu6'Mnu
      await driver.findElement(By.css("input:nth-child(2)")).sendKeys("Agbe5uq354uw4569o79¡\'\`9\`¡07\'P+Ç´T89o0´R79´\`N57i3567un262n6\`\'Nu6\'Mnu")
      // 107 | sendKeys | css=input:nth-child(2) | ${KEY_ENTER}
      await driver.findElement(By.css("input:nth-child(2)")).sendKeys(Key.ENTER)
      // 108 | pause | 1000 | 1000
      await driver.sleep(1000)
      // 109 | storeXpathCount | xpath=//div[@id='main-r-c']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img | existrare
      await driver.findElements(By.xpath("//div[@id=\'main-r-c\']/div[2]/div/div/div[5]/div/div/div[2]/div/div/div/img")).then(elements => console.log(vars["existrare"] = elements.length))
      // 110 | if | ${existrare} > 0 | 
      if (!!await driver.executeScript("return (arguments[0] > 0)", vars["existrare"])) {
        // 111 | pause | 1500 | 1500
        await driver.sleep(1500)
        // 112 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
        await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")), 5000)
        // 113 | waitForElementVisible | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 5000
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))), 5000)
        // 114 | assertElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
        {
          const elements = await driver.findElements(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi"))
          assert(elements.length)
        }
        // 115 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi | 
        await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .sc-dlnjwi")).click()
        // 116 | waitForElementPresent | css=.MuiTypography-h6 | 2500
        await driver.wait(until.elementLocated(By.css(".MuiTypography-h6")), 2500)
        // 117 | storeText | css=.MuiTypography-h6 | name2b
        vars["name2b"] = await driver.findElement(By.css(".MuiTypography-h6")).getText()
        // 118 | waitForElementPresent | css=.close | 30000
        await driver.wait(until.elementLocated(By.css(".close")), 30000)
        // 119 | click | css=.close | 
        await driver.findElement(By.css(".close")).click()
        // 120 | if | ${name2b} == 'Agbe5uq354uw4569o79¡'`9`¡07'p+ç´t89o0´r79´`n57i3567un262n6`'nu6'mnu' | 
        if (!!await driver.executeScript("return (arguments[0] == \'Agbe5uq354uw4569o79¡\'\`9\`¡07\'p+ç´t89o0´r79´\`n57i3567un262n6\`\'nu6\'mnu\')", vars["name2b"])) {
          // 122 | waitForElementPresent | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 5000
          await driver.wait(until.elementLocated(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")), 5000)
          // 123 | click | css=.MuiGrid-root:nth-child(1) > .dam-item .trash | 
          await driver.findElement(By.css(".MuiGrid-root:nth-child(1) > .dam-item .trash")).click()
          // 124 | assertConfirmation | sure? | 
          assert(await driver.switchTo().alert().getText() == "sure?")
          // 125 | webdriverChooseOkOnVisibleConfirmation |  | 
          await driver.switchTo().alert().accept()
          // 126 | pause | 1500 | 1500
          await driver.sleep(1500)
          // 127 | end |  | 
        }
        // 128 | end |  | 
      }
      // 129 | end |  | 
    }
  })
})
