# 📁 `onedrive-cf-index`

> Yet Another OneDrive Index. Powered by Cloudflare Workers. Inspired and originated greatly from [heymind/OneDrive-Index-Cloudflare-Worker](https://github.com/heymind/OneDrive-Index-Cloudflare-Worker).

## Demo

Live demo: [📁 Spencer's OneDrive Index](https://storage.spencerwoo.com/).

|                                 Home                                 |                                Folder                                |
| :------------------------------------------------------------------: | :------------------------------------------------------------------: |
| ![](https://cdn.spencer.felinae98.cn/blog/2020/08/200806_153117.png) | ![](https://cdn.spencer.felinae98.cn/blog/2020/08/200806_153124.png) |

## Deployment

See: [How to use | OneDrive-Index-Cloudflare-Worker](https://github.com/heymind/OneDrive-Index-Cloudflare-Worker#%E5%92%8B%E7%94%A8) (for now).

## Features

### Improvements

#### New features

- **New design:** [`spencer.css`](themes/spencer.css).
- File icon rendered according to file type.
- Use [Font Awesome icons](https://fontawesome.com/) instead of material design icons (For better design consistency).
- Use [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) for `README.md` rendering.
- **Add breadcrumbs for better directory navigation.**
- **Support file previewing:**
  - Images: `.png`, `.jpg`, `.gif`.
  - Plain text: `.txt`.
  - Markdown: `.md`, `.mdown`, `.markdown`.
  - Code: `.js`, `.py`, `.c`, `.json`...
  - **PDF: Lazy loading, loading progress and built-in PDF viewer.**
  - ...
- Code syntax highlight in GitHub style. (With PrismJS.)
- Image preview supports [Medium style zoom effect](https://github.com/francoischalifour/medium-zoom).
- ...

#### Under the hood

- CSS animations all the way.
- Package source code with wrangler and webpack.
- Convert all CDN assets to load with jsDelivr.
- No external JS scripts, **all scripts are loaded with webpack!** (Other than some libraries.)
- ...

### All other features

See: [New features | OneDrive-Index-Cloudflare-Worker](https://github.com/heymind/OneDrive-Index-Cloudflare-Worker#-%E6%96%B0%E7%89%B9%E6%80%A7-v11) (for now).

## Notes

Currently work in progress. Not recommended to use in production.

---

📁 **`onedrive-cf-index`** ©Spencer Woo. Released under the MIT License.

Authored and maintained by Spencer Woo.

[@Portfolio](https://spencerwoo.com/) · [@Blog](https://blog.spencerwoo.com/) · [@GitHub](https://github.com/spencerwooo)
