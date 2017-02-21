
//qUERY VIEW ITEMS
function executeJson(url,method,headers,payload) 
{
    method = method || 'GET';
    headers = headers || {};
    headers["Accept"] = "application/json;odata=verbose";
    if(method == "POST") {
        headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val();
    }      
    var ajaxOptions = 
    {       
       url: url,   
       type: method,  
       contentType: "application/json;odata=verbose",
       headers: headers
    };
    if (typeof payload != 'undefined') {
      ajaxOptions.data = JSON.stringify(payload);
    }  
    return $.ajax(ajaxOptions);
}
function getListItems(webUrl,listTitle, queryText) 
{
    var viewXml = '<View><Query>' + queryText + '</Query></View>';
    var url = webUrl + "/_api/web/lists/getbytitle('" + listTitle + "')/getitems"; 
    var queryPayload = {  
               'query' : {
                      '__metadata': { 'type': 'SP.CamlQuery' }, 
                      'ViewXml' : viewXml  
               }
    };
    return executeJson(url,"POST",null,queryPayload);
}


function getListViewItems(webUrl,listTitle,viewTitle)
{
     var url = webUrl + "/_api/web/lists/getByTitle('" + listTitle + "')/Views/getbytitle('" + viewTitle + "')/ViewQuery";
     return executeJson(url).then(
         function(data){         
             var viewQuery = data.d.ViewQuery;
             return getListItems(webUrl,listTitle,viewQuery); 
         });
}

getListViewItems('https://devintranet.spdev/NewsEvents','Events','Current Events')
.done(function(data)
{
     var items = data.d.results;
     for(var i = 0; i < items.length;i++) {
         console.log(items[i].Title);
     }    
})
.fail(
function(error){
    console.log(JSON.stringify(error));
});
