const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/Code Web.html','utf8');
const old=JSON.stringify({admin:{className:'LỚP 12TA3'},students:[{name:'Old student'}]});
const storage=new Map([['chuyen_tau_data',old],['chuyen_tau_google_admin_key','old-test-key']]);
const ctx={window:{CLASS_CONFIG:{apiUrl:'https://example.invalid/test'},setTimeout:()=>{}},state:{admin:{className:'LỚP 10IT'},students:[]},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},applyStateDefaults:()=>{},initDefaultStudents:()=>{},saveData:()=>{},renderLayout:()=>{},updateDocumentTitle:()=>{},isParentPortalMode:()=>false};
vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('window.startApp = function()'),html.indexOf('\n        function saveData()',html.indexOf('window.startApp = function()'))),ctx);ctx.window.startApp();assert.equal(ctx.state.students.length,0);assert.equal(ctx.state.admin.className,'LỚP 10IT');assert.equal(storage.get('chuyen_tau_data'),old);
for(const name of ['Code Web.html','btvn.html']) {const code=fs.readFileSync(__dirname+'/'+name,'utf8');assert(!code.includes('AKfycbw7QpHI'));for(const m of code.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);}
console.log('PASS: 10IT does not load 12TA3 browser data; separate API config; all scripts parse');
