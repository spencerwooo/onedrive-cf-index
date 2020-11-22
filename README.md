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
  - [Preparing](#preparing)
  - [Building and publishing](#building-and-publishing)
- [Customizations](#customizations)

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
- File icon rendered according to file type. Emoji as folder icon when available (if the first character of the folder name is an emoji).
- Use [Font Awesome icons](https://fontawesome.com/) instead of material design icons (For better design consistency).
- Use [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) for `README.md` rendering → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/README/).
- **Add breadcrumbs for better directory navigation.**
- **Support file previewing:**
  - Images: `.png`, `.jpg`, `.gif` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Previews/).
  - Plain text: `.txt` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Previews/iso_8859-1.txt).
  - Markdown: `.md`, `.mdown`, `.markdown` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Previews/i_m_a_md.md).
  - Code: `.js`, `.py`, `.c`, `.json`... → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Code/pathUtil.js).
  - **PDF: Lazy loading, loading progress and built-in PDF viewer** → [Demo](<https://storage.spencerwoo.com/%F0%9F%A5%91%20Course%20PPT%20for%20CS%20(BIT)/2018%20-%20%E5%A4%A7%E4%BA%8C%E4%B8%8B%20-%20%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9B%BE%E5%BD%A2%E5%AD%A6/1%20FoundationofCG-Anonymous.pdf>).
  - **Music / Audio:** `.mp3`, `.aac`, `.wav`, `.oga` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Multimedia/Elysian%20Fields%20-%20Climbing%20My%20Dark%20Hair.mp3).
  - **Videos:** `.mp4`, `.flv`, `.webm`, `.m3u8` → [Demo](https://storage.spencerwoo.com/%F0%9F%A5%9F%20Some%20test%20files/Multimedia/%E8%BD%A6%E5%BA%93%E5%A5%B3%E7%8E%8B%20%E9%AB%98%E8%B7%9F%E8%B9%A6%E8%BF%AA%20%E4%B9%98%E9%A3%8E%E7%A0%B4%E6%B5%AA%E7%9A%84%E5%A7%90%E5%A7%90%E4%B8%BB%E9%A2%98%E6%9B%B2%E3%80%90%E9%86%8B%E9%86%8B%E3%80%91.mp4).
  - ...
- Code syntax highlight in GitHub style. (With PrismJS.)
- Image preview supports [Medium style zoom effect](https://github.com/francoischalifour/medium-zoom).
- Token cached and refreshed with Cloudflare Workers KV storage.
- Route lazy loading with the help of [Turbolinks®](https://github.com/turbolinks/turbolinks). (Somewhat buggy when going from `folder` to `file preview`, but not user-experience degrading.)
- Supports OneDrive 21Vianet.（由世纪互联运营的 OneDrive。）
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

1. Create a new blade app here [Microsoft Azure App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) (OneDrive normal version) or [Microsoft Azure.cn App registrations](https://portal.azure.cn/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) (OneDrive 世纪互联版本) with:
   1. `Supported account types` set to `Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`. OneDrive 世纪互联用户设置为：`任何组织目录（任何 Azure AD 目录 - 多租户）中的帐户`.
   2. `Redirect URI (optional)` set to "Web: https://heymind.github.io/tools/microsoft-graph-api-auth".
2. Get your Application (client) ID - `client_id` at `Overview` panel.
3. Open `Certificates & secrets` panel and create a new secret called `client_secret`.
4. Add permissions `offline_access, Files.Read, Files.Read.All` at `API permissions`.
5. Get your `refresh_token` using <https://heymind.github.io/tools/microsoft-graph-api-auth>.
6. Create a dedicated folder for your public files inside OneDrive, for instance: `/Public`. Please don't share your root folder directly!

_If you can't fetch the `access_token` and/or `refresh_token` on step 5, please resolve to the solution suggested in the pinned issue [#13](https://github.com/spencerwooo/onedrive-cf-index/issues/13#issuecomment-671027672)._

After all this hassle, you should have successfully acquired the following tokens and secrets:

- `refresh_token`
- `client_id`
- `client_secret`
- `redirect_uri`: Defaults to `https://heymind.github.io/tools/microsoft-graph-api-auth`.
- `base`: Defaults to `/Public`.

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

# Create KV bucket
wrangler kv:namespace create "BUCKET"
```

Create a **DRAFT** worker at Cloudflare Workers with a cool name. Get your own Cloudflare `account_id` and `zone_id`: [Docs - Account ID And Zone ID](https://developers.cloudflare.com/workers/quickstart#account-id-and-zone-id).

Modify [`wrangler.toml`](wrangler.toml):

- `name`: The draft worker's name, your worker will be published at `<name>.<worker_subdomain>.workers.dev`.
- `account_id`: Your Cloudflare Account ID.
- `zone_id`: Your Cloudflare Zone ID.
- `kv_namespaces`: Your Cloudflare KV namespace.

Modify [`src/config/default.js`](src/config/default.js):

- `client_id`: Your `client_id` from above.
- `base`: Your `base` path from above.

_For Chinese 21Vianet OneDrive users. OneDrive 世纪互联用户：将 `useOneDriveCN` 设置（修改）为 `true`。_

Add secrets to Cloudflare Workers environment variables with `wrangler`:

```sh
# Add your refresh_token and client_secret to Cloudflare
wrangler secret put REFRESH_TOKEN
# ... enter your refresh_token from above here

wrangler secret put CLIENT_SECRET
# ... enter your client_secret from above here
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

## Customizations

- You can **(AND SHOULD)** change the `intro` on the default landing page here: [src/folderView.js](src/folderView.js#L51-L55). Write HTML directly.
- You can **(AND ALSO SHOULD)** change the header of the site here: [src/render/htmlWrapper.js](src/render/htmlWrapper.js#L24).
- Your custom styles are loaded from [themes/spencer.css](themes/spencer.css), change that according to your customizations. You may also need to change the commit HASH at [src/render/htmlWrapper.js](src/render/htmlWrapper.js#L3).
- You can also customize Markdown CSS styles, PrismJS code highlight color schemes, etc.

---

🏵 **`onedrive-cf-index`** ©Spencer Woo. Released under the MIT License.

Authored and maintained by Spencer Woo.

[@Portfolio](https://spencerwoo.com/) · [@Blog](https://blog.spencerwoo.com/) · [@GitHub](https://github.com/spencerwooo)
