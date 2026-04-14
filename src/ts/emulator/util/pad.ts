export const padRight = (len:number, s:string, symbol:string=" ") => {
  while (s.length < len) s = s + symbol;
  return s;
}
export const padLeft = (len:number, s:string, symbol:string=" ") => {
  while (s.length < len) s = symbol + s;
  return s;
}
export const bufNum = (len:number, i:string) =>{
  let s = String(i);
  while (s.length < len) s = "0" + s;
  return s;
}



export const line =()=> { return "=".repeat(65) + "\n"; } 

