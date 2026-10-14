'use strict';
self.onmessage=async event=>{
 try{
  const response=await fetch('/api/solve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event.data)});
  if(!response.ok)throw Error('求解服務錯誤：'+response.status);
  const reader=response.body.getReader(),decoder=new TextDecoder();let pending='';
  while(true){const {value,done}=await reader.read();pending+=decoder.decode(value||new Uint8Array(),{stream:!done});let end;while((end=pending.indexOf('\n'))>=0){const line=pending.slice(0,end);pending=pending.slice(end+1);if(line)self.postMessage(JSON.parse(line))}if(done)break}
 }catch(error){self.postMessage({type:'error',message:error.message})}
};
