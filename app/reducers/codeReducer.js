export let showCode = (mainObj)=>{
    let objCopy = Object.assign({},mainObj);
    objCopy.showCode = true;
    //objCopy.selectedElement = '';
    let page = objCopy.PageObjects.find((page)=>{
        if (page.pageId === objCopy.activeTabPageId){
            return page;
        }
    });
    let pack = objCopy.SiteInfo.domainName + '.package.pages';
    page.package = page.package || pack;
    let el = objCopy.selectedElement;

    function c(){
    return 'package ' + page.package + 
        '\n\nimport '+ objCopy.SiteInfo.domainName +' .sections.*;'+
        '\n\nimport com.epam.jdi.uitests.web.selenium.elements.common.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.complex.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.composite.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.composite.WebPage;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.objects.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.simple.*;'+
        '\nimport org.openqa.selenium.support.FindBy;' + 
        '\n\npublic class ' + el.Name[0].toUpperCase() + el.Name.slice(1) + ' extends '+ el.Type +'{' +
        genCodeOfElements(el.elId, page.elements, objCopy.SimpleRules, objCopy.ComplexRules, objCopy.CompositeRules) + '\n}'
    }
    //found code and regenerate it
    let code = page.compositeCode.find((section) => {
        if (section.elId === el.elId){
            return section;
        }
    });
    if (!code){
        page.compositeCode.push({elId: el.elId, sectionCode: c()}) 
    } else {
        code.sectionCode = c();
    }
    
    objCopy.sectionCode = c();

    return objCopy;
}

function genCodeOfElements (parentId, arrOfElements, simple, complex, composite) {
    let result = '';
    for (let i = 0; i < arrOfElements.length; i++ ){
        if (arrOfElements[i].parentId === parentId){
            if (composite[arrOfElements[i].Type]){
                result += '\n\t@'+ (arrOfElements[i].Locator.indexOf('/') !== 0 ? 'Css("' : 'Xpath("') + arrOfElements[i].Locator +'") public ' + 
                arrOfElements[i].Name + ' ' + arrOfElements[i].Name.toLowerCase() + ';'   
            }
            if (complex[arrOfElements[i].Type]){
               if (arrOfElements[i].hasOwnProperty('Root') && arrOfElements[i].hasOwnProperty('Expand') 
               && arrOfElements[i].hasOwnProperty('List') && arrOfElements[i].hasOwnProperty('Value')) {
                result += '\n\t@J' + arrOfElements[i].Type + '(' +
                '\n\t\troot = @FindBy(' +  (arrOfElements[i].Root.indexOf('/') !== 0 ? 'css' : 'xpath') + ' = ' + arrOfElements[i].Root + '),' +
                '\n\t\texpand = @FindBy(' +  (arrOfElements[i].Expand.indexOf('/') !== 0 ? 'css' : 'xpath') + ' = ' + arrOfElements[i].Expand + '),' +
                '\n\t\tlist = @FindBy(' +  (arrOfElements[i].List.indexOf('/') !== 0 ? 'css' : 'xpath') + ' = ' + arrOfElements[i].List + '),' +
                '\n\t\tvalue = @FindBy(' +  (arrOfElements[i].Value.indexOf('/') !== 0 ? 'css' : 'xpath') + ' = ' + arrOfElements[i].Value + ')' + 
                '\n\t) public ' + arrOfElements[i].Type + ' ' + arrOfElements[i].Name + ';'
               }
            }
            if (simple[arrOfElements[i].Type]){
                result += '\n\t@'+ (arrOfElements[i].Locator.indexOf('/') !== 0 ? 'Css("' : 'Xpath("') + arrOfElements[i].Locator +'") public ' + 
                arrOfElements[i].Type + ' ' + arrOfElements[i].Name + ';'   
            }
        }
    }
    return result;
}

export let genCode = (mainObj) => {
    let objCopy = Object.assign({},mainObj);
    let page = objCopy.PageObjects.find((page)=>{
        if (page.pageId === objCopy.activeTabPageId){
            return page;
        }
    })
    page.POcode = "";
    objCopy.sectionCode = "";
    objCopy.showCode = true;
    objCopy.selectedElement = '';
    let pack = objCopy.SiteInfo.domainName + '.package.pages';
    page.package = page.package || pack; 
    let pageName = page.name.replace(/\s/g, '');

    page.POcode = 
        'package ' + page.package + 
        '\n\nimport ' + objCopy.SiteInfo.domainName + '.sections.*;' +
        '\n\nimport com.epam.jdi.uitests.web.selenium.elements.common.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.complex.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.composite.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.composite.WebPage;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.objects.*;'+
        '\nimport com.epam.jdi.uitests.web.selenium.elements.pageobjects.annotations.simple.*;'+
        '\nimport org.openqa.selenium.support.FindBy;'+
        '\n\npublic class '+ pageName[0].toUpperCase() + pageName.slice(1) + ' extends WebPage {'+
            genCodeOfElements(null, page.elements, objCopy.SimpleRules, objCopy.ComplexRules, objCopy.CompositeRules) + '\n}'

    return objCopy;
} 