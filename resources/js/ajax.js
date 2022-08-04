function httpGetAsync(theUrl, params={}, headers={}) {
    if (typeof params == "function") {
        params = {};
    }
    let url = new URL(theUrl);
    for (var i in params) {
        console.log(params[i], typeof params[i]);
        if (typeof params[i] == "array" || typeof params[i] == "object") {
            url.searchParams.append(i, JSON.stringify(params[i]));
        }
        else {
            url.searchParams.append(i, params[i]);
        }

    }
    return new Promise(async function(resolve, reject){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                try {
                    let json = JSON.parse(xmlHttp.responseText);
                    resolve(json);
                }
                catch {
                    reject();
                }
            }
            else if (xmlHttp.readyState == 4){
                try {
                    let json = JSON.parse(xmlHttp.responseText);
                    reject(json);
                }
                catch {
                    reject();
                }
            }
        }
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        for (var i in headers) {
            xmlHttp.setRequestHeader(i, headers[i]);
        }

        xmlHttp.send(null);
    });
}
module.exports.get = httpGetAsync;


function httpPostAsync(theUrl, params, headers={}, method="POST") {
    return new Promise(async function(resolve, reject) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                try {
                    let json = JSON.parse(xmlHttp.responseText);
                    resolve(json);
                }
                catch {
                    reject();
                }
            }
            else if (xmlHttp.readyState == 4) {
                try {
                    let json = JSON.parse(xmlHttp.responseText);
                    reject(json);
                }
                catch {
                    reject();
                }
            }
        }
        xmlHttp.open(method, theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.setRequestHeader("Accept", "application/json");

        for (var i in headers) {
            xmlHttp.setRequestHeader(i, headers[i]);
        }

        xmlHttp.send(JSON.stringify(params));
    });
}
module.exports.post = httpPostAsync;
function patch(theUrl, params, headers={}) {
    return httpPostAsync(theUrl, params, headers, "PATCH");
}
module.exports.patch = patch;

function put(theUrl, params, headers={}) {
    return httpPostAsync(theUrl, params, headers, "PUT");
}
module.exports.put = put;

function deleteAjax(theUrl, params, headers={}) {
    return httpPostAsync(theUrl, params, headers, "DELETE");
}
module.exports.delete = deleteAjax;
