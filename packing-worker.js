'use strict';
let requestId=null,registered=false,stopRequested=false;
async function requestStop(){
 if(!registered||!stopRequested)return;
 try{
  const response=await fetch('/api/stop',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId})});
  if(!response.ok)throw Error('停止分析失敗：'+response.status);
 }catch(error){self.postMessage({type:'control-error',message:error.message})}
}
self.onmessage=async event=>{
 if(event.data.command==='stop'){stopRequested=true;await requestStop();return}
 requestId=event.data.requestId;
 try{
  const response=await fetch('/api/solve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event.data)});
  if(!response.ok)throw Error('求解服務錯誤：'+response.status);
  const reader=response.body.getReader(),decoder=new TextDecoder();let pending='',finished=false;
  while(true){
   const {value,done}=await reader.read();pending+=decoder.decode(value||new Uint8Array(),{stream:!done});let end;
   while((end=pending.indexOf('\n'))>=0){
    const line=pending.slice(0,end);pending=pending.slice(end+1);if(!line)continue;
    const message=JSON.parse(line);
    if(message.type==='started'){registered=true;await requestStop()}
    if(message.type==='complete'||message.type==='error')finished=true;
    self.postMessage(message);
   }
   if(done)break;
  }
  if(!finished)throw Error('分析連線已中斷，尚未收到完成結果');
 }catch(error){self.postMessage({type:'error',message:error.message})}
};
