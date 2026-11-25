# cw-ai-demo-app

A tiny Node.js demo: one page with a box where you ask a question, and Claude answers it through the Anthropic API. Built for the Cloudways "Deploy an AI App" tutorial.

## Deploy on Cloudways

1. Create a Custom App on the Hybrid stack.
2. In Deployment via Git, add the Cloudways SSH key to this GitHub repo and deploy the repo.
3. Open SSH and run `npm install` in the app's `public_html` folder.
4. Create `.env` from `.env.example` (`cp .env.example .env`), then put your own `ANTHROPIC_API_KEY` in it.
5. Run `npx pm2 start ecosystem.config.cjs`.
6. Run `npx pm2 save`.

The included `.htaccess` sends every visit to `proxy.php`, which passes it to the app on port 3000. It works on Cloudways servers where Apache has no proxy module (a plain `[P]` proxy rule gives error 500 there).

Keep the app alive after a server reboot with this line in the app's Advanced cron:

```
@reboot cd /home/<server-id>.cloudwaysapps.com/<app-folder>/public_html && PM2_HOME=/home/master/.pm2 npx pm2 resurrect
```

Video: coming soon
