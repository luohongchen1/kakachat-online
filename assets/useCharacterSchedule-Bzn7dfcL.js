import{u as O,a as B,b_ as x,e as E,h as J,eo as V,aH as W,m as _,d as z}from"./index-DM3icIxJ.js";import"./vendor-jszip-2gEiRWaW.js";import"./vendor-howler-vCrZ82dH.js";const I=360*60*1e3;function L(n,e){const s=x().getCharacterSchedule(n,e);if(!s)return!0;const i=Number(s.generatedAt);return!Number.isFinite(i)||i<=0||!Array.isArray(s.slots)||s.slots.length===0?!0:Date.now()-i>I}function U(n){const e=n?.memory;if(!e)return"";const r=[],s=(e.core||[]).filter(t=>t&&t.enabled&&t.content);if(s.length>0){const t=s.filter(c=>c.priority!=="low").map(c=>c.content.trim()).filter(Boolean).slice(0,12);t.length>0&&r.push(t.join("；"))}const i=[],u=(e.longTerm||[]).filter(t=>t&&t.content&&t.status!=="failed").slice(-1),S=(e.shortTerm||[]).filter(t=>t&&t.content&&t.status!=="failed"&&!t.merged).slice(-2);for(const t of[...u,...S]){const c=t.content.trim();c&&i.push(c.slice(0,300))}return i.length>0&&r.push("近期动态："+i.join(`
`)),r.length>0?r.join(`
`):""}function q(n){try{const r=z().getPersonaForContact(n);if(!r)return"";const s=[];return r.name&&s.push(r.name),r.description&&s.push(r.description),s.join("，")}catch{return""}}function G(n){return!Array.isArray(n?.slots)||n.slots.length===0?"":n.slots.map(e=>`- ${e.startTime}-${e.endTime} ${e.activity}${e.location?` @${e.location}`:""}`).join(`
`)}async function Y(n,e,r={}){const s=O(),i=B(),u=x(),S=E(),{scheduleSave:t}=J(),c=r&&r.force===!0,m=r&&r.regenerate===!0;if(!c&&!L(n,e))return u.getCharacterSchedule(n,e);const l=s.contacts?.find(a=>a.id===n);if(!l||l.type==="group")return null;const j=(S.livenessConfig||{}).decisionConfigId||l.configId,d=i.configs?.find(a=>a.id===j)||i.configs?.[0];if(!d?.key||!d?.url)return null;const k=V(l.prompt),$=new Date(e+"T00:00:00"),g=$.toLocaleDateString("zh-CN",{weekday:"long"}),y=$.getDay(),H=y===0||y===6,C=U(l),T=q(n),p=u.getCharacterSchedule(n,e),b=G(p),v=`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;let A="";const N=u.getEventsForDate(e).filter(a=>a.shareWithAI);N.length>0&&(A=`
用户当天的安排：
${N.map(f=>{const h=f.startTime||f.dueTime||"";return`- ${h?h+" ":""}${f.title}`}).join(`
`)}
`);let M="";m&&b&&(M=`
上一次已生成过这份日程，请避免只是换个措辞重复它：
${b}
`);const P=H?`今天是${g}，是休息日。想想你周末一般做什么——是在家放松、出去玩、还是有别的安排？`:`今天是${g}，是工作日。想想你这天具体会做什么——上班/上学的节奏、午休怎么过、下班/放学后会干嘛？`,D=`你就是"${l.name}"。今天是${e}，${g}。请具体规划你今天这一天怎么过。

<persona>
${k}
</persona>${C?`

<memory>
${C}
</memory>`:""}${T?`

用户：${T}`:""}${A}${M}
${P}

重要：这是你今天（${e}，${g}）确定的日程，不是通用模板。每个时段写一件确定要做的事，不要写"A或B"这样的选择，也不要写"可能会……"。直接决定你这天要做什么。日程要体现今天是一周中的哪天：工作日和周末不一样，周一和周五的心情也不一样。
如果记忆里和用户有过约定或计划（比如答应一起做某事），把它安排进去。${m?`
这次是重新生成，请在保持设定合理的前提下，给出与上一版明显不同的新安排，不要只改几个词。`:""}

输出 JSON 数组（6-10个时段），interruptible 表示这个时段你是否方便回消息：
[{"startTime":"HH:MM","endTime":"HH:MM","activity":"一件具体的事","location":"具体地点","interruptible":true,"mood":""}]
只输出 JSON。`;try{const{content:a}=await W(d,[{role:"system",content:D},{role:"user",content:m?`请重新生成${l.name}在${e}（${g}）的日程安排。记住今天是${g}，每件事要具体确定，不要用"或"。变体编号：${v}`:`请生成${l.name}在${e}（${g}）的日程安排。记住每件事要具体确定，不要用"或"。`}],{temperature:m?1:.9}),f=a.replace(/```(?:json)?\s*/gi,"").replace(/```\s*/g,"").trim();let h;try{h=JSON.parse(f)}catch{const o=f.match(/\[[\s\S]*\]/);if(o)h=JSON.parse(o[0]);else return console.warn("[CharacterSchedule] Failed to parse response:",f.slice(0,200)),null}if(!Array.isArray(h))return null;const w=h.map(o=>({id:_("slot"),startTime:String(o?.startTime||"").trim(),endTime:String(o?.endTime||"").trim(),activity:String(o?.activity||"").trim(),location:String(o?.location||"").trim(),interruptible:o?.interruptible!==!1,mood:String(o?.mood||"").trim()})).filter(o=>o.startTime&&o.endTime&&o.activity).sort((o,F)=>o.startTime.localeCompare(F.startTime));return w.length===0?null:(u.setCharacterSchedule(n,e,{slots:w,generatedByModel:d.model,generationVersion:m?Math.max(Number(p?.generationVersion)||1,1)+1:Number(p?.generationVersion)||1,regeneratedFrom:m&&Number(p?.generatedAt)||null,regenerationSeed:m?v:""}),t(),u.getCharacterSchedule(n,e))}catch(a){return console.warn("[CharacterSchedule] Generation failed:",a.message),null}}export{Y as generateCharacterSchedule,L as needsScheduleRefresh};
