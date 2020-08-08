[![Hosted on Cloudflare Workers](https://img.shields.io/badge/Hosted%20on-CF%20Workers-f38020?logo=cloudflare&logoColor=f38020&labelColor=282d33)](https://storage.spencerwoo.com/)
[![Deploy](https://github.com/spencerwooo/onedrive-cf-index/workflows/Deploy/badge.svg)](https://github.com/spencerwooo/onedrive-cf-index/actions?query=workflow%3ADeploy)
<image align="right" src="assets/onedrive-cf-index.png" alt="onedrive-cf-index" width="125px" />

<h1>onedrive-cf-index</h1>

🏵 **Yet Another OneDrive Index.** Powered by Cloudflare Workers. Inspired and originated greatly from [heymind/OneDrive-Index-Cloudflare-Worker](https://github.com/heymind/OneDrive-Index-Cloudflare-Worker).

<h2>Table of contents</h2>

- [Demo](#demo)
- [Features](#features)
  - [Improvements](#improvements)
    - [New features](#new-features)
    - [Under the hood](#under-the-hood)
  - [All other features](#all-other-features)
- [Deployment](#deployment)
  - [Prerequisites](#prerequisites)
    - [Get OneDrive API Tokens](#get-onedrive-api-tokens)
    - [Get Firebase Database Tokens](#get-firebase-database-tokens)
  - [Preparing](#preparing)
  - [Building and publishing](#building-and-publishing)

## Demo

Live demo: [📁 Spencer's OneDrive Index](https://storage.spencerwoo.com/).

| Scenario |                              Screenshot                              |
| :------: | :------------------------------------------------------------------: |
|   Home   | ![](https://cdn.spencer.felinae98.cn/blog/2020/08/200806_153117.png) |
|  Folder  | ![](https://cdn.spencer.felinae98.cn/blog/2020/08/200806_153124.png) |

## Features

### Improvements

#### New features

- **New design:** [`spencer.css`](themes/spencer.css).
- File icon rendered according to file type.
- Use [Font Awesome icons](https://fontawesome.com/) instead of material design icons (For better design consistency).
- Use [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) for `README.md` rendering → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/README/).
- **Add breadcrumbs for better directory navigation.**
- **Support file previewing:**
  - Images: `.png`, `.jpg`, `.gif` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Previews/eb37c02438f.png).
  - Plain text: `.txt` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Previews/iso_8859-1.txt).
  - Markdown: `.md`, `.mdown`, `.markdown` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Previews/i_m_a_md.md).
  - Code: `.js`, `.py`, `.c`, `.json`... → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Code/pathUtil.js).
  - **PDF: Lazy loading, loading progress and built-in PDF viewer** → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%91%20Course%20PPT%20for%20CS%20(BIT)/2018%20-%20%E5%A4%A7%E4%BA%8C%E4%B8%8B%20-%20%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2%E5%AD%A6/1%20FoundationofCG-Anonymous.pdf)
  - ...
- Code syntax highlight in GitHub style. (With PrismJS.)
- Image preview supports [Medium style zoom effect](https://github.com/francoischalifour/medium-zoom).
- Token cached and refreshed with Google Firebase Realtime Database. (~~For those who can't afford Cloudflare Workers KV storage.~~ 😢)
- Route lazy loading with the help of [Turbolinks®](https://github.com/turbolinks/turbolinks). (Somewhat buggy when going from `folder` to `file preview`, but not user-experience degrading.)
- ...

#### Under the hood

- CSS animations all the way.
- Package source code with wrangler and webpack.
- Convert all CDN assets to load with jsDelivr.
- No external JS scripts, **all scripts are loaded with webpack!** (Other than some libraries.)
- ...

### All other features

See: [New features | OneDrive-Index-Cloudflare-Worker](https://github.com/heymind/OneDrive-Index-Cloudflare-Worker#-%E6%96%B0%E7%89%B9%E6%80%A7-v11).

## Deployment

> Online token generation tool taken from the generous: <https://heymind.github.io/tools/microsoft-graph-api-auth>.

### Prerequisites

#### Get OneDrive API Tokens

1. Create new blade app here: [Microsoft Azure App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) with:
   1. `Supported account types` set to "Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)".
   2. `Redirect URI (optional)` set to "Web: https://heymind.github.io/tools/microsoft-graph-api-auth".
2. Get your Application (client) ID which is `client_id` at `Overview` panel.
3. Open `Certificates & secrets` panel and create a new secret called `client_secret`.
4. Add permissions `offline_access, Files.Read, Files.Read.All` at `API permissions`.
5. Get your `refresh_token` using <https://heymind.github.io/tools/microsoft-graph-api-auth>.
6. Create a dedicated folder for your public files inside OneDrive, for instance: `/Public`.

#### Get Firebase Database Tokens

1. Register new project at [Google Firebase](https://firebase.google.com/).
2. Enable "Realtime Database" at "Develop » Database", create a key called `auth` and get the URL for your database as `firebase_url` (which should look like `https://xxx.firebaseio.com/auth.json`.).
3. Set database rules to be: `".read": false` and `".write": false`.
4. Get your database token `firebase_token` at "Settings » Service Accounts » Database key".

After all this hassle, you should have successfully acquired the following tokens and secrets:

- `refresh_token`
- `client_id`
- `client_secret`
- `redirect_uri`: <https://heymind.github.io/tools/microsoft-graph-api-auth> (default)
- `base`: '/Public' (default)
- `firebase_url`
- `firebase_token`

### Preparing

Fork the repository. Install dependencies.

```sh
# Install cloudflare workers official packing and publishing tool
yarn global add @cloudflare/wrangler

# Install dependencies with yarn
yarn install

# Login to Cloudflare with wrangler
wrangler config

# Verify wrangler status with this command
wrangler whoami
```

Create a **DRAFT** worker at Cloudflare Workers with a cool name. Get your own Cloudflare `account_id` and `zone_id`.

Modify [`wrangler.toml`](wrangler.toml):

- `name`: The draft worker's name, your worker will be published at `<name>.<worker_subdomain>.workers.dev`.
- `account_id`: Your Cloudflare Account ID.
- `zone_id`: Your Cloudflare Zone ID.

Modify [`src/config/default.js`](src/config/default.js):

- `client_id`: Your `client_id` from above.
- `base`: Your `base` path from above.
- `firebase_url`: Your `firebase_url` from above.

Add secrets to Cloudflare Workers environment variables with `wrangler`:

```sh
# Add your refresh_token, client_secret, firebase_token to Cloudflare
wrangler secret put REFRESH_TOKEN
# ... enter your refresh_token from above here

wrangler secret put CLIENT_SECRET
# ... enter your client_secret from above here

wrangler secret put FIREBASE_TOKEN
# ... enter your firebase_token from above here
```

### Building and publishing

You can preview the worker with `wrangler`:

```sh
wrangler preview
```

After making sure everything is ok, you can publish your worker with:

```sh
wrangler publish
```

You can also create a GitHub Actions for auto publishing your worker on `push`. See [main.yml](.github/workflows/main.yml).

### Customizations

- You can **(AND SHOULD)** change the `intro` on the default landing page here: [src/folderView.js](src/folderView.js#L51-L55). Write HTML directly.
- Your custom styles are loaded from [themes/spencer.css](themes/spencer.css), change that according to your customizations.
- You can also customize Markdown CSS styles, PrismJS code highlight color schemes, etc.

---

🏵 **`onedrive-cf-index`** ©Spencer Woo. Released under the MIT License.

Authored and maintained by Spencer Woo.

[@Portfolio](https://spencerwoo.com/) · [@Blog](https://blog.spencerwoo.com/) · [@GitHub](https://github.com/spencerwooo)
