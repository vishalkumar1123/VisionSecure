# VisionSecure: WhatsApp aur scheduling guide

Business number: **+91 98721 33840**. Website ke WhatsApp links already `https://wa.me/919872133840` use karte hain. Link khulna aur Cloud API inbox connected hona alag cheezein hain.

## WhatsApp ka daily workflow

1. Customer aapke registered WhatsApp number par message karega.
2. Meta signed webhook website ko message dega. Customer Center ek customer identity, conversation aur message history maintain karega; duplicate webhook se duplicate message nahi banega.
3. **Admin → Customer Center → Inbox** mein message kholein. Customer/lead context, history, summary aur requests ek jagah dikhenge.
4. **Take Over** dabayein, reply type karein, **Send WhatsApp Reply** dabayein. Successful takeover ke baad AI sending paused rahegi. Send already in progress ho to UI retry/reload batayegi; takeover applied hone ka false claim nahi hoga.
5. **AI Knowledge** mein verified information review karke publish karein. **AI Agent** mein pehle enabled + Draft choose karein. Draft customer ko automatically nahi jata. Review karke **Use Draft & Take Over** se send karein.
6. Auto mode sirf published, approved replies aur allowed categories ke liye hai. Missing knowledge, complaints, uncertain delivery, discounts aur human requests team ko hand over hote hain. AI appointment, price ya discount invent nahi karega.
7. **Create / Link Lead** verified WhatsApp phone identity se existing CRM lead match karta hai. Multiple matches milne par manual review chahiye. Sirf same naam hone se accounts merge nahi hote.

Free-form replies ko implementation customer ke latest incoming message se 24-hour window tak allow karta hai. Window close hone par composer send block karega; approved-template outreach alag workflow hai. Inbox mein scheduled automatic campaigns/template composer is release mein nahi hai. Opt-out customer ko sending paused rahegi. Attachments human review ke liye mark hote hain; AI media download/transcription nahi karta.

## One-time Meta setup

Meta business portfolio, WhatsApp Business Account aur registered business number chahiye. **Phone Number ID phone number nahi hai**: `9872133840` ko `META_PHONE_NUMBER_ID` mein paste na karein. Meta se is registered number ka actual ID lein. App ko WABA aur messages webhook se subscribe karna zaroori hai. [Meta's official Cloud API setup reference](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api).

Number abhi phone ke WhatsApp Business app mein use hota ho to Meta onboarding mein us account ke available migration/coexistence options pehle check karein. Is implementation mein existing phone chats import ya phone-app message synchronization implemented nahi hai. Account delete/migrate blindly na karein.

Server deployment settings:

| Setting | Value ka source |
| --- | --- |
| `META_PHONE_NUMBER_ID` | Registered +91 98721 33840 ka Meta ID |
| `META_ACCESS_TOKEN` | Business app/system-user token with required WhatsApp permissions |
| `META_APP_SECRET` | Meta app secret; webhook signature verify karta hai |
| `META_VERIFY_TOKEN` | Aapka securely generated webhook verification token |
| `META_GRAPH_VERSION` | App ke liye currently supported `vNN.0` version |
| `OPENAI_API_KEY` | OpenAI project API key |
| `OPENAI_MODEL` | Responses + structured-output compatible model available to your project |
| `CRON_SECRET` | Random secret, at least 24 characters |

Webhook callback: `https://visionsecuretech.in/api/webhooks/whatsapp`. Verification mein same `META_VERIFY_TOKEN` use karein. Secrets repository/chat/browser code mein paste na karein; hosting environment settings mein save karein. Redeploy ke baad **Settings → Integrations → Test WhatsApp Configuration / Test AI Connection** use karein. Tests configuration/model access verify karte hain; customer message send nahi karte.

MongoDB transactions ke liye replica set/Atlas required hai. Durable pending jobs recover karne ke liye scheduler se har minute `GET /api/internal/customer-center/process` call configure karein, header `Authorization: Bearer <CRON_SECRET>`. Each run at most two conversations processes; larger traffic needs worker capacity review. Host must support the configured 120-second route duration. Cron automatic messaging schedule nahi hai; it processes already received inbox jobs.

Existing admin new-lead WhatsApp alerts are a separate approved-template channel (`ADMIN_NOTIFICATION_WHATSAPP`, `WHATSAPP_TEMPLATE_NAME`, `WHATSAPP_TEMPLATE_LANGUAGE`). Business sender number aur alert recipient ko confuse na karein. No recipient/credentials were activated or messages sent during implementation.

## Follow-up kaise schedule karein

1. **Admin → Leads → customer ki lead open** karein.
2. **Next action → Schedule a follow-up** mein **Follow-up date** aur **Follow-up time (IST)** dono choose karein.
3. **Save follow-up** dabayein. Example: 21 September, 3:30 PM IST correctly stores 10:00 UTC, even when browser/server another timezone mein ho.
4. Saved date/time neeche dikhega, aur lead timeline mein entry aayegi. Date aaj ki ho to dashboard **Today's schedule** mein dikhega. Future day ka follow-up us din dikhega.
5. **Update follow-up** se reschedule aur **Clear follow-up** se remove karein. Past time new scheduling mein reject hota hai.

Dashboard card schedule ka summary hai; date/time editor lead ke andar hai. Scheduling team ke next call/task ko record karta hai. Isse automatic phone call, customer WhatsApp message, Google Calendar invite ya timed reminder email send nahi hota.

Site visits ke liye **Inbox → Customer details → Create customer request → SITE_VISIT** use karein. Preferred time request hai, confirmed appointment nahi. **Customer Requests** mein actual confirmed date/time aur assignee select karke Scheduled save karein. Support/complaint requests bhi wahin manage hote hain.

## Emails aur Google

New-lead, lead-status, sign-in security aur email-settings notifications use actual logo, navy/green colors and “Secure Today. Safe Tomorrow.” Status emails include previous/new status, customer/service, actor and CRM link. Security alerts do not claim a successful intrusion. Settings → Email must be active and the relevant event enabled.

Templates new events par apply hote hain after deployment. Inbox mein already received emails aur old persisted outbox content automatically rewrite nahi hote. Browser previews are local sample renders; Gmail/Outlook may apply their own dark-mode styling or block remote logos.

Google ke liye **Settings → Integrations → One-time Google app setup** mein real OAuth Client ID/Secret save karein as Super Admin, then **Sign in with Google**. Account consent aur authorized callback still required hain; see [Google setup guide](GOOGLE_WEBSITE_SERVICES.md).
