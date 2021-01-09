<div align="center">
  <image src="assets/onedrive-cf-index.png" alt="onedrive-cf-index" width="150px" />
  <h3><a href="https://storage.spencerwoo.com">onedrive-cf-index</a></h3>
  <em>Yet another OneDrive index, powered by CloudFlare Workers.</em>
</div>

---

[![Hosted on Cloudflare Workers](https://img.shields.io/badge/Hosted%20on-CF%20Workers-f38020?logo=cloudflare&logoColor=f38020&labelColor=282d33)](https://storage.spencerwoo.com/)
[![Deploy](https://github.com/spencerwooo/onedrive-cf-index/workflows/Deploy/badge.svg)](https://github.com/spencerwooo/onedrive-cf-index/actions?query=workflow%3ADeploy)
[![README-CN](assets/chinese.svg)](./README-CN.md)

<h5>This project is greatly inspired by: <a href="https://github.com/heymind/OneDrive-Index-Cloudflare-Worker">onedrive-index-cloudflare-worker</a>.</h5>

## Demo

Live demo at [Spencer's OneDrive Index](https://storage.spencerwoo.com/).

![Screenshot Demo](assets/screenshot.png)

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
- Token cached and refreshed with Cloudflare Workers KV storage. _(We got rid of external Firebase dependencies!)_
- Route lazy loading with the help of [Turbolinks®](https://github.com/turbolinks/turbolinks).
- Supports OneDrive 21Vianet.（由世纪互联运营的 OneDrive。）
- ...

#### Under the hood

- CSS animations all the way.
- Package source code with wrangler and webpack.
- Convert all CDN assets to load with jsDelivr.
- **Almost all scripts are loaded with webpack!** (Other than a few libraries for rendering file previews.)
- ...

### Other features

#### Proxied / Raw file download

- Proxied download: `?proxied` - Downloads the file through CloudFlare Workers if (1) `proxyDownload` is true in `config/default.js` and (2) parameter is present in url.
- Raw file download: `?raw` - Return direct raw file instead of rich rendered preview if parameter is present.

Both these parameters can be used side by side, meaning that `?proxied&raw` and `?raw&proxied` are both valid. Example: [`https://storage.spencerwoo.com/🥟%20Some%20test%20files/Previews/eb37c02438f.png?raw&proxied`](https://storage.spencerwoo.com/🥟%20Some%20test%20files/Previews/eb37c02438f.png?raw&proxied).

#### Others

See: [New features - OneDrive-Index-Cloudflare-Worker](https://github.com/heymind/OneDrive-Index-Cloudflare-Worker#-%E6%96%B0%E7%89%B9%E6%80%A7-v11).

## Deployment

> Online token generation tool taken from the generous: <https://heymind.github.io/tools/microsoft-graph-api-auth>.

### Generating OneDrive API Tokens

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

### Preparations

Fork the repository. Install dependencies.

_We strongly recommend you install npm with a Node version manager like [n](https://github.com/tj/n) or [nvm](https://github.com/nvm-sh/nvm), which will allow wrangler to install configuration data in a global node_modules directory in your user's home directory, without requiring that you run as root._

```sh
# Install cloudflare workers official packing and publishing tool
npm i @cloudflare/wrangler -g

# Install dependencies with npm
npm install

# Login to Cloudflare with wrangler
wrangler config

# Verify wrangler status with this command
wrangler whoami
```

Create a **DRAFT** worker at Cloudflare Workers with a cool name. Get your own Cloudflare `account_id` and `zone_id`: [Docs - Account ID And Zone ID](https://developers.cloudflare.com/workers/quickstart#account-id-and-zone-id).

Modify [`wrangler.toml`](wrangler.toml):

- `name`: The draft worker's name, your worker will be published at `<name>.<worker_subdomain>.workers.dev`.
- `account_id`: Your Cloudflare Account ID.
- `zone_id`: Your Cloudflare Zone ID.

Create Cloudflare Workers KV bucket named `BUCKET`:

```sh
# Create KV bucket
wrangler kv:namespace create "BUCKET"

# ... or, create KV bucket with preview functions enabled
wrangler kv:namespace create "BUCKET" --preview
```

Modify `kv_namespaces` inside [`wrangler.toml`](wrangler.toml):

- `kv_namespaces`: Your Cloudflare KV namespace, you should substitute the `id`
  and `preview_id` values accordingly. _If you don't need preview functions, you
  can remove the `preview_id` field._

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

### Building and deployment

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

🏵 **onedrive-cf-index** ©Spencer Woo. Released under the MIT License.

Authored and maintained by Spencer Woo.

[@Portfolio](https://spencerwoo.com/) · [@Blog](https://blog.spencerwoo.com/) · [@GitHub](https://github.com/spencerwooo)
