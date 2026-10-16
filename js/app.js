let questions=JSON.parse(localStorage.getItem('questions')||'[]');
function save(){localStorage.setItem('questions',JSON.stringify(questions));render();}
function addQuestion(){questions.push({text:'新しい質問',type:'単一選択'});save();}
function del(i){questions.splice(i,1);save();}
function upd(i,key,val){questions[i][key]=val;save();}
function render(){let q=document.getElementById('questions');let p=document.getElementById('preview');q.innerHTML='';p.innerHTML='';questions.forEach((x,i)=>{q.innerHTML+=`<div class=q><input value='${x.text}' oninput="upd(${i},'text',this.value)"><select onchange="upd(${i},'type',this.value)"><option ${x.type=='単一選択'?'selected':''}>単一選択</option><option ${x.type=='複数選択'?'selected':''}>複数選択</option><option ${x.type=='自由記述'?'selected':''}>自由記述</option><option ${x.type=='画像選択'?'selected':''}>画像選択</option></select><button onclick='del(${i})'>削除</button></div>`;p.innerHTML+=`<div class=card><b>${x.text}</b><br>${x.type}</div>`})}
render();
