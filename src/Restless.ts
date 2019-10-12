import { request } from "http";

export enum Method{
  GET = "GET",
  POST = "POST"
}

export enum ContentType{
  JSON = "application/json",
  FORM_URL_ENCODED = "application/x-www-form-urlencoded"
}

export class Restless {
  [x: string]: any;
  public contentType: ContentType = ContentType.FORM_URL_ENCODED;
  public url: string | undefined;
  public seq: string[];

  constructor(url: string) {
    this.url = url;
    this.seq = [];
  }

  static init(url: string){
    return new Restless(url).client();
  }

  public client(){
    return new Proxy(this, {
      get(obj, prop: string) {
        if(prop == "_this") return obj;
        if(prop == "$get"){
          return async function(...data: any){
            return await obj.request(obj.seq.join("/"), Method.GET, data);
          }
        }
        else if(prop == "$post"){
          return async function(...data: any){
            return await obj.request(obj.seq.join("/"), Method.POST, data);
          }
        }
        else if(prop == "$dup"){
          return function(...data: any){
            const copy = Restless.init(obj.url + `/${obj.seq.join("/")}`);
            copy._this.contentType = obj.contentType;
            obj.seq = [];
            return copy;
          }
        }
        else{
          obj.seq.push(prop);
          return obj.client();
        }
      }
    });
  }

  private async request(prop: string, method: Method, data: any) {
    const props: RequestInit = {
      method: this.method,
      headers: {
        'Content-Type': this.contentType
      }
    };
    if(method == Method.POST)
      props.body = this.contentType == ContentType.FORM_URL_ENCODED  ? new FormData(data) : JSON.stringify(data);
    this.seq = [];
    console.log(this.normalize(prop, method, data));
    return (await fetch(this.normalize(prop, method, data), props)).json()
  }

  private normalize(prop: string, method: Method, data: any){
    if(method == Method.GET){
      //Situation 1: User.get() -> url/get
      if(data.length == 0){
        return `${this.url}/${prop}`;
      }
      //Situation 2: User.get(param1, {prop}) -> url/get/param1?prop=prop
      if(data[data.length - 1] instanceof Object)
        return `${this.url}/${prop}/${data.slice(0, -1).join("/")}?${this.params(data[data.length - 1])}`;
      //Situation 3: User.get(param1, param2) -> url/get/param1/param2
      else
        return `${this.url}/${prop ? prop + "/" : ""}${data.join("/")}`;
    }
    else{
      return `${this.url}/${prop ? prop + "/" : ""}${data.join("/")}`;
    }
  }

  private params(data: any) {
    return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
  }
}