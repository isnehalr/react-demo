import $ from 'jquery'

declare let _spPageContextInfo;

export class Helper {


    //This is common method to execute call SPOnline REST API 
    public static executeJson(url: string, method: string, headers: any, payload: any) : any
    {
        method = method || 'GET';
        headers = headers || {};
        headers["Accept"] = "application/json;odata=verbose";
        
        if (method == 'POST')
        {
            //This is essential to always refresh form digest value for any SP REST post request
            //UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            headers["X-RequestDigest"] = $('#__REQUESTDIGEST').val();
        }
        
        var ajaxOptions = 
        {       
            url: url,   
            type: method,  
            contentType: "application/json;odata=verbose",
            headers: headers,
            fail: (request, status, error) => {
                console.log(request.responseText);
            }
        };
        
        if (typeof payload != undefined) {
          ajaxOptions["data"] = payload;
        }
        
        return $.ajax(ajaxOptions);
    }

    public static getUsers(): PromiseLike<any> {
        return new Promise((resolve, reject) => {

            const restUrl = _spPageContextInfo.webServerRelativeUrl +  "/_api/web/lists/getbytitle('Users')/items"
            
            Helper.executeJson(restUrl, "GET", null, null)
                .then((response) => {
                    resolve(response.d.results);
                }).catch((e) => {
                    resolve(null);
                });
        });
    }

    public static addUser(formData: any): PromiseLike<string> {
        
        // Return a promise
        return new Promise((resolve, reject) => {


            const restUrl = _spPageContextInfo.webServerRelativeUrl + `/_api/web/lists/getbytitle('Users')/items`;
            const headers = { 'accept': 'application/json;odata=verbose', 'content-Type': 'application/json;odata=verbose', 'X-HTTP-Method': 'POST' };
            const listTitle = "Users";
            const data = {
                            '__metadata': { 'type': 'SP.Data.' + listTitle + 'ListItem','results':[] },
                            Title : formData.Name,
                            Designation: formData.Designation,
                            Company: formData.Company  
                        }  
                        
       
                Helper.executeJson(restUrl, "POST", headers, JSON.stringify($.extend(true,{}, data)))
                .then((response) => {
                    // Resolve the request
                    
                    resolve("success");
                }).catch( (e) => {
                    
                        resolve(JSON.parse(e.responseText).error.message.value);
                });
            
        });
    
    }

    public static GetIDCDelete(idxData:any, idx: any): PromiseLike<any> {
        // Return a promise
        
        return new Promise((resolve, reject) => {
           
            const restUrl = _spPageContextInfo.webServerRelativeUrl + `/_api/web/lists/getbytitle('Users')/items?$select=ID,Title&$filter=Title eq '${idxData.Title}'`;
            const listTitle = "Users";
            const data = {
                '__metadata': { 'type': 'SP.Data.' + listTitle + 'ListItem','results':[] }
              
            } 

            Helper.executeJson(restUrl, "GET", null, null)
                .then((response) => {
                    // Resolve the request
                    resolve(response.d.results);
                    var id = response.d.results[0].Id
                  
                  Helper.DeleteRows(id, idx);
                }).catch((e) => {
                    resolve(null);
                   
                });
        });
    }

    public static DeleteRows(id:any,idx:any): PromiseLike<string> {
        
        // Return a promise
        return new Promise((resolve, reject) => {
            

            let restUrl = _spPageContextInfo.webServerRelativeUrl + `/_api/web/lists/getbytitle('Users')/items(${id})`  
            const headers = { 'accept': 'application/json;odata=verbose', 'content-Type': 'application/json;odata=verbose','X-HTTP-Method': 'DELETE','IF-MATCH': '*'};
 

                Helper.executeJson(restUrl, "POST", headers,null)
                .then((response) => {
                    // Resolve the request
                   
                    resolve("success");
                 
                }).catch( (e) => {
                
                        resolve(JSON.parse(e.responseText).error.message.value);
        
                });
            
        });
    
    }

}