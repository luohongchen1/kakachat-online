import{b as v,cI as y,cJ as f,cK as P,dr as $}from"./index-BzXTn72h.js";function b(){const h=v();async function g(e,a,p={}){const t=h.getConfig;if(!t?.url||!t?.key)throw new Error("请先配置 LLM API");const n=`你是一个专业的视觉小说角色设计师。根据提供的角色信息，生成两部分内容：

1. **vnDescription**（中文，200-400字）：
   - 角色的性格特点、说话方式、口头禅
   - 背景故事、与其他角色的关系
   - 在故事中的定位和作用
   - 不要包含聊天格式规则

2. **spritePrompt**（英文，用于 AI 绘图）：
   - 详细的外貌描述：发色、发型、眼睛颜色、肤色
   - 体型特征：身高、体型
   - 服装描述：日常穿着风格
   - 风格标签：anime style, upper body, character sprite, white background

直接输出 JSON 格式，不要有其他内容：
{
  "vnDescription": "中文角色描述...",
  "spritePrompt": "English appearance prompt..."
}`,o=e.vnDescription||e.prompt||"",r=`角色名称: ${e.vnName||e.name||"未命名"}
角色定位: ${e.role==="protagonist"?"主角":e.role==="heroine"?"女主角":"配角"}
世界观: ${a||"现代都市"}
${o?`现有描述参考: ${o}`:""}

请根据以上信息生成角色的详细描述和立绘提示词。`,m={model:t.model||"gpt-3.5-turbo",messages:[{role:"system",content:n},{role:"user",content:r}],temperature:.7};y(m,t.maxTokens);const{response:s}=await f(t,m);if(!s.ok)throw new Error(`LLM API 错误: ${s.status} ${await P(t,s)}`);const u=await s.json(),l=$(t,u).match(/\{[\s\S]*\}/);if(!l)throw new Error("AI 返回格式错误，无法解析");try{const i=JSON.parse(l[0]);return{vnDescription:i.vnDescription||"",spritePrompt:i.spritePrompt||""}}catch(i){throw new Error("JSON 解析失败: "+i.message)}}async function N(e,a,p){const t=[];for(let n=0;n<e.length;n++){const o=e[n];p?.(n+1,e.length,o.vnName||"角色");try{const r=await g(o,a);t.push({contactId:o.contactId,...r,success:!0})}catch(r){console.warn("生成失败:",o.vnName,r),t.push({contactId:o.contactId,success:!1,error:r.message})}n<e.length-1&&await new Promise(r=>setTimeout(r,500))}return t}async function k(e,a,p={}){const t=h.getConfig;if(!t?.url||!t?.key)throw new Error("请先配置 LLM API");const{maxBackgrounds:n=8,maxExpressions:o=6}=p,r=a.map(d=>`- ${d.vnName}（${d.role==="protagonist"?"主角":d.role==="heroine"?"女主角":"配角"}）`).join(`
`),m=`你是视觉小说资源规划师。分析项目需要的图像资源。

输出 JSON 格式：
{
  "backgrounds": [
    { "name": "场景名_时间段", "prompt": "英文背景提示词, anime style, detailed background, no characters" }
  ],
  "sprites": [
    { "characterName": "角色名", "expressions": ["normal", "happy", "sad", "angry", "surprised", "shy"] }
  ]
}

要求：
- 背景最多 ${n} 个，覆盖主要场景和时间变化
- 每个角色最多 ${o} 个常用表情
- 背景提示词必须英文，包含 "anime style, detailed background, no characters"
- 表情使用英文单词`,s=`世界观/故事大纲:
${e||"现代校园恋爱故事"}

角色列表:
${r||`- 主角
- 女主角`}

请分析这个项目需要哪些背景和角色表情。`,u={model:t.model||"gpt-3.5-turbo",messages:[{role:"system",content:m},{role:"user",content:s}],temperature:.7};y(u,t.maxTokens);const{response:c}=await f(t,u);if(!c.ok)throw new Error(`LLM API 错误: ${c.status} ${await P(t,c)}`);const l=await c.json(),w=$(t,l).match(/\{[\s\S]*\}/);if(!w)throw new Error("AI 返回格式错误");try{return JSON.parse(w[0])}catch{throw new Error("JSON 解析失败")}}return{generateCharacterPrompts:g,batchGeneratePrompts:N,analyzeResourceNeeds:k}}export{b as u};
