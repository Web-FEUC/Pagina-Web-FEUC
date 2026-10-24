# FEUC website – Vite + React (Cloudflare Pages)

## Desarrollo local (solo front)

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run preview`

Sin Functions/D1, Empleos cae a `localStorage` (datos de ejemplo) si `VITE_EMPLEOS_LOCAL_FALLBACK=true`.

## Empleos FEUC (API real)

La publicación real usa **Cloudflare Pages Functions + D1**, evaluación con **Gemini Flash** y correos con **Resend**.

### 1. Base de datos D1

```bash
npx wrangler d1 create feuc-empleos
```

Copia el `database_id` a `wrangler.toml`. Luego:

```bash
npm run db:migrate:local
npm run db:migrate:remote
```

### 2. Secretos (Cloudflare Pages → Settings → Environment variables / `wrangler pages secret put`)

| Variable | Uso |
|----------|-----|
| `EMPLEOS_ADMIN_PASSWORD` | Clave del panel `/empleos/admin` (solo servidor) |
| `EMPLEOS_SESSION_SECRET` | Firma de sesiones admin |
| `GEMINI_API_KEY` | Evaluación IA |
| `RESEND_API_KEY` | Correos transaccionales |
| `EMAIL_FROM` | Remitente verificado en Resend |
| `PUBLIC_SITE_URL` | `https://feuc.cl` |
| `ADMIN_NOTIFY_EMAIL` | Aviso cuando hay revisión manual |

### 3. Probar API en local

```bash
npm run db:migrate:local
npm run pages:dev
```

Abre `http://127.0.0.1:8788`.

Pruebas del motor de decisión (sin red):

```bash
npm run test:empleos
```

### Flujo de publicación

1. POST `/api/empleos` → validación + anti-spam + estado `pending_verification`
2. Correo con enlace `/api/empleos/verify?token=…`
3. Tras verificar → Gemini evalúa → motor de decisión
4. Resultados: `published` (solo si auto-publish global ON + org verificada + IA limpia), `under_review`, `needs_correction` o `rejected`
5. Evento interno `job.published` queda en `distribution_events` para WhatsApp/Telegram futuro

La publicación automática empieza **desactivada** (`auto_publish_enabled=0`). Actívala en `/empleos/admin` → Automatización.
