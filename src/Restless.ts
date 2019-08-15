import { request } from "http";

export enum Method{
  GET = "GET",
  POST = "POST"
}

export enum ContentType{
  JSON = "application/json",
  FORM_URL_ENCODED = "application/x-www-form-urlencoded"
}


export interface IEndpoints{
  [ep:string]: Method
}

export class Restless {
  [x: string]: any;
  private contentType: ContentType = ContentType.FORM_URL_ENCODED;
  private url: string | undefined;
  private eps: IEndpoints = {};
  
  constructor(url: string, contenType: ContentType, eps: IEndpoints) {
    this.url = url;
    this.contentType = contenType;
    this.eps = eps;
  }

  client(){
    return new Proxy(this, {
      get(obj, prop: string) {
        if( prop in obj.eps){
          return async function(...data: any){
           return await obj.request(prop, obj.eps[prop], data);
          }   
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
        return `${this.url}/${prop}/${data.join("/")}?${this.params(data[data.length - 1])}`;
      //Situation 3: User.get(param1, param2) -> url/get/param1/param2
      else
        return `${this.url}/${prop}/${data.join("/")}`;
    }
    else{
      return `${this.url}/${prop}/${data.join("/")}`;
    }
  }

  private params(data: any) {
    return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
  }
}