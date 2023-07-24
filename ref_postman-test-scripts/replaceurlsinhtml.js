//AUTOMATES GETTING AN HTML CONTENT BLOCK, CATALOGING ALL OF THE URLS, LOOKING UP EACH URL IN A DATABASE, GETTING THE URL TO REPLACE THE ORIGINAL WITH, AND THEN REPLACING IT

//1 GET THE HTML BLOCK AND ISOLAT THE URLS
    //TESTS
    const response = pm.response.json()

    //Handle auth error
    const errors = response.errors
    if (errors.length > 0) {
        const code = errors[0].code
        console.log('ERROR:',errors)
        pm.variables.set('returnTo', 'reqOne')
        (code == "602") && postman.setNextRequest('Refresh Auth')
    }
    
    //Get the email content
    const result = response.result[0].content
    pm.variables.set('fullContent', result)
    //console.log('response.content = ',result)
    
    //make array of all the old urls
    const regexp3 = /(['"])(https?:\/\/\S+)\1/gi
    const matchUrl = result.match(regexp3)
    const cleanUrl = () => {
        const arr = []
        for (let i = 0; i < matchUrl.length; i++) {
            const newItem = matchUrl[i].replace(/["']/g,"")
            arr.push(newItem)
        }
        return arr
    } 
    const dataUrls = cleanUrl()
    pm.variables.set('arrOldUrls', dataUrls)
    console.log('full list of urls: ', dataUrls)

//2 GET the data on whether this url shoudl be replaced and with what new url
    //pre-script
    console.log('*** 2 emailId- ***')
const dataUrls = pm.variables.get('arrOldUrls')
console.log(dataUrls)

const string = dataUrls.shift()
console.log('string/initial url:', string)
//const currentUrl = encodeURI(string)
const re23 = /#/gi
const re26 = /&/gi
const re25 = /%/gi

const currentUrl = string.replaceAll(re25, '%25').replaceAll(re23, '%23').replaceAll(re26, '%26')
console.log('currentUrl/uri encoded:',currentUrl)

pm.variables.set('arrOldUrls', dataUrls)
pm.variables.set('currentUrl', currentUrl)
    //Test
    console.log('*GET req made to local host 4000*')
    const response = pm.response.json()
    console.log('reponse:',response)
    const replaceUrl = response.replaceUrl
    const arr = pm.variables.get('arrOldUrls')
    
    const saveToFile = () => {
        const fullContent = pm.variables.get('fullContent')
        const emailId = pm.iterationData.get('emailId')
        // Please read the documentation https://github.com/sivcan/ResponseToFile-Postman
        // The opts for the server, also includes the data to be written to file
        let opts = {
            requestName: request.name || request.url,
            fileExtension: "html",
            mode: "writeFile", // Change this to any function of the fs library of node to use it.
            uniqueIdentifier: emailId,
            responseData: fullContent
        };
        pm.sendRequest(
            {
                url: "http://localhost:3000/write",
                method: "POST",
                header: "Content-Type:application/json",
                body: {
                    mode: "raw",
                    raw: JSON.stringify(opts)
                }
            },
            function (err, res) {
                console.log(err ? err : res);
            }
        );
        console.log('*File saved, moving onto 3*')
        postman.setNextRequest('3 update full content')
    }
    
    //continue looping thorugh arr of urls or save html to file and move on
    const nextRequest = () => {
        if (arr.length > 0) {
            postman.setNextRequest('emailId-')
        } else {
            const content = pm.variables.get('fullContent')
            saveToFile(content)
        }
    }
    
    //are we replacing the url?
    if (replaceUrl) {
        const fullContent = pm.variables.get('fullContent')
        const newUrl = response.newUrl
        const oldUrl = response.oldUrl
        console.log('new:',newUrl)
        console.log('old:',oldUrl)
        //find urls in full content and replace
        const re = new RegExp(oldUrl, "gi");    
        const updatedHtml = fullContent.replaceAll(re, newUrl)
        //console.log('updatedHtml:',updatedHtml)
        pm.variables.set('fullContent', updatedHtml)
        nextRequest()
    } else {
        nextRequest()
    }
    
//3 Update the html block
    //pre-script
    console.log('***3 POST update email content***')
    const emailId = pm.iterationData.get('emailId')
    const fileName = 'emailId-'+emailId
    pm.variables.set('fileName', fileName)
    //Test
    const response = pm.response.json()
const success = response.success

//Handle auth error
const errors = response.errors
if (errors.length > 0) {
    const code = errors[0].code
    console.log('ERROR:',errors)
    (code == "602") ? pm.variables.set('returnTo', 'reqThree') && postman.setNextRequest('Refresh Auth') 
    :
    console.log('error:',response.errors) && postman.setNextRequest('3 update full content')
} else if (success) {
    console.log('*Success: moving onto next email*')
    postman.setNextRequest(null)
} else{
    console.log('neither success nor errors, wtf')
    postman.setNextRequest(null)
}   