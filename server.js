import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json());

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ask the AI</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#eef1f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c2333;padding:16px}
.card{width:100%;max-width:560px;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(20,30,60,.12);padding:32px}
h1{margin:0 0 20px;font-size:28px}
.row{display:flex;gap:10px}
input{flex:1;padding:12px 14px;border:1px solid #cfd6e4;border-radius:10px;font-size:16px}
input:focus{outline:2px solid #4f6df5;border-color:transparent}
button{padding:12px 22px;border:0;border-radius:10px;background:#4f6df5;color:#fff;font-size:16px;font-weight:600;cursor:pointer}
button:disabled{opacity:.6;cursor:wait}
#answer{margin-top:20px;white-space:pre-wrap;line-height:1.5;min-height:24px}
#answer.err{color:#c0392b}
</style></head><body>
<div class="card">
<h1>Ask the AI</h1>
<div class="row"><input id="q" placeholder="Ask something" autofocus><button id="send">Send</button></div>
<div id="answer"></div>
</div>
<script>
const q=document.getElementById('q'),btn=document.getElementById('send'),out=document.getElementById('answer');
async function ask(){
  const question=q.value.trim(); if(!question) return;
  btn.disabled=true; out.className=''; out.textContent='Thinking...';
  try{
    const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});
    const d=await r.json();
    if(!r.ok){out.className='err';out.textContent=d.error||'Something went wrong';}
    else out.textContent=d.answer;
  }catch(e){out.className='err';out.textContent='Request failed';}
  btn.disabled=false;
}
btn.addEventListener('click',ask);
q.addEventListener('keydown',e=>{if(e.key==='Enter')ask();});
</script></body></html>`;

app.get('/', (req, res) => res.type('html').send(page));

app.post('/api/ask', async (req, res) => {
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY is missing in .env' });
    const question = String(req.body?.question || '').trim();
    if (!question) return res.status(400).json({ error: 'Question is empty' });
    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: question }]
    });
    const answer = msg.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`cw-ai-demo-app listening on ${port}`));
