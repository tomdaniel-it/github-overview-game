export class HttpClient {
    url:string;
    callback:Function;
    format:string;
    async:boolean;

    constructor(url:string, callback:Function=()=>{}, format:string="JSON", async:boolean=true){
        this.url = url;
        this.callback = callback;
        this.format = format;
        this.async = async;
    }

    send():HttpClientResponse{
        let xhttp:XMLHttpRequest = new XMLHttpRequest();
        if(this.async){
            xhttp.onreadystatechange = function(this:XMLHttpRequest, callback:Function) {
                //this.status == 200
                if (this.readyState == 4) {
                    callback(this.status, this.responseText);
                }
            }.bind(xhttp, this.callback);
        }
        xhttp.open("GET", this.url, this.async);
        xhttp.send();
        if(!this.async){
            return {status:xhttp.status ,responseText:xhttp.responseText};
        }else{
            return {status:102, responseText:""};
        }
    }
}

export interface HttpClientResponse{
    status:number;
    responseText:string;
}