# Production email: localhost works, Vercel does not

## Confirmed blocker

The live Email Configuration screenshot reports that EMAIL_CONFIG_ENCRYPTION_KEY is missing. The local working key is stored only in ignored `.env.local`; Vercel does not inherit that file. Public response headers identify visionsecuretech.in as a Vercel deployment. No Vercel CLI session, project link or Vercel token was available in this workspace, so the agent has not modified production environment variables or redeployed the live application.

## Apply the production fix securely

1. Open the Vercel project whose production domain is visionsecuretech.in.
2. Open Settings > Environment Variables.
3. Add `EMAIL_CONFIG_ENCRYPTION_KEY` for Production. Set its value to the existing 64-character hexadecimal key from the working local `.env.local`. Copy the value directly between the local editor and the hosting secret field; do not paste it into chat, a Git commit or browser application code. Do not include quotation marks or whitespace.
4. If Preview uses the same database/configuration, configure the same secret there too. Environments sharing encrypted credentials must share the matching key. Do not generate a new key over existing credentials.
5. Redeploy the production project; Vercel changes environment variables only for new deployments. Deploy the current code changes as well for the new safeguards/UI.
6. Reload Email Configuration. The missing-key warning should disappear and Save should be enabled for a super-admin. Recheck server setup refreshes readiness without discarding unsaved form entries.
7. The existing saved SMTP settings may be reused with the matching key. Test Connection, Send Test Email, confirm receipt at both configured recipients, then Activate Notifications. Saving a draft intentionally resets verification; do not save again after activation unless changing details.
8. Create a controlled lead and inspect delivery/site logs. This remains a manual live acceptance test; the agent has not sent production test mail in this task.

If readiness still fails, confirm the secret belongs to the project/environment serving the domain and that the deployment was rebuilt. If readiness succeeds but verification reports CONFIGURATION_ERROR, check for a different encryption key. CONNECTION_FAILED requires checking the SMTP hostname/outbound network from the hosting environment. AUTHENTICATION_FAILED requires a valid newly rotated Zoho app password. Never bypass TLS verification or expose the key in NEXT_PUBLIC variables.

The email write controls intentionally remain disabled without the server secret. A highlighted button alone would not fix encryption or delivery. The new server preflight blocks save/verify/test/activate before changing the shared configuration when its deployment key is missing, while recording a safe audit event.

Official reference: https://vercel.com/docs/environment-variables
