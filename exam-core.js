function erSubjects(){return ['TOAN','VAN','ANH','LY','HOA','TIN'];}
// Subject mappings cross-checked against official university admissions tables (2026).
function erBlocks(){return {A00:['TOAN','LY','HOA'],A01:['TOAN','LY','ANH'],C01:['VAN','TOAN','LY'],C02:['VAN','TOAN','HOA'],C05:['VAN','LY','HOA'],D01:['VAN','TOAN','ANH'],D07:['TOAN','HOA','ANH'],D11:['VAN','LY','ANH'],D12:['VAN','HOA','ANH'],X02:['TOAN','VAN','TIN'],X06:['TOAN','LY','TIN'],X10:['TOAN','HOA','TIN'],X26:['TOAN','TIN','ANH']};}
function erNumber(v){if(v===null||v===undefined||String(v).trim()==='')return null;const t=String(v).trim().replace(',','.');if(!/^\d+(\.\d{1,2})?$/.test(t))return null;const n=Number(t);return n>=0&&n<=10?n:null;}
function erTotal(scores,subjects){if(!subjects||!subjects.length||subjects.some(s=>scores[s]===null||scores[s]===undefined))return null;return subjects.reduce((sum,s)=>sum+Math.round(scores[s]*100),0)/100;}
function erStats(value,values){const nums=values.filter(v=>v!==null&&Number.isFinite(v));return {value,average:nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:null,rank:value===null?null:1+nums.filter(v=>Math.round(v*100)>Math.round(value*100)).length,count:nums.length};}
function erRecommend(scores){
 const electives=['ANH','LY','HOA','TIN'];
 if(electives.some(k=>erNumber(scores[k])===null))return {ready:false,pairs:[],message:'Cần đủ điểm Anh, Lý, Hóa, Tin để gợi ý công bằng.'};
 const pairs=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)pairs.push({subjects:[electives[i],electives[j]],total:Math.round((erNumber(scores[electives[i]])+erNumber(scores[electives[j]]))*100)/100});
 pairs.sort((a,b)=>b.total-a.total);return {ready:true,pairs:pairs.filter(p=>p.total===pairs[0].total),message:'Gợi ý theo 2 điểm môn cao nhất ở kỳ này; không phải đăng ký môn thi. Điểm giữa các môn có thể khác độ khó.'};
}
function erReport(period,student,roster){
 const rows=period.rows,own=rows.find(r=>r.code===student.code)||{scores:{},electives:[]};
 const subjects=erSubjects().map(code=>({code,...erStats(erNumber(own.scores[code]),rows.map(r=>erNumber(r.scores[code])))}));
 const recommendation=erRecommend(own.scores),map=erBlocks();
 const blocks=Object.keys(map).map(code=>({code,subjects:map[code],...erStats(erTotal(own.scores,map[code]),rows.map(r=>erTotal(r.scores,map[code])))}));
 blocks.sort((a,b)=>(b.value??-1)-(a.value??-1)||a.code.localeCompare(b.code));
 return {id:period.id,title:period.title,year:period.year,date:period.date,subjects,blocks,recommendation};
}
