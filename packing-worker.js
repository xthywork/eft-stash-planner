'use strict';
importScripts('packing-solver.js');
self.onmessage=event=>{
 try{solvePacking(event.data,message=>self.postMessage(message))}
 catch(error){self.postMessage({type:'error',message:error.message})}
};
