import emojiRegex from 'emoji-regex/RGI_Emoji'
import { getClassNameForMimeType, getClassNameForFilename } from 'font-awesome-filetypes'

import { renderHTML } from './render/htmlWrapper'
import { renderPath } from './render/pathUtil'
import { renderMarkdown } from './render/mdRenderer'

/**
 * Convert bytes to human readable file size
 *
 * @param {Number} bytes File size in bytes
 * @param {Boolean} si 1000 - true; 1024 - false
 */
function readableFileSize(bytes, si) {
  bytes = parseInt(bytes, 10)
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

/**
 * Render Folder Index
 *
 * @param {*} items
 * @param {*} isIndex don't show ".." on index page.
 */
export async function renderFolderView(items, path, request) {
  const isIndex = path === '/'

  const el = (tag, attrs, content) => `<${tag} ${attrs.join(' ')}>${content}</${tag}>`
  const div = (className, content) => el('div', [`${className}` === "" ? "" : `class=${className}`], content)
  const item = (icon, fileName, fileAbsoluteUrl, size, itemId, emojiIcon) =>
    el(
      'a',
      [`href="${fileAbsoluteUrl}"`, 'class="item"', size ? `size="${size}"` : '', 'style="flex: 1;"'],
      (emojiIcon ? el('i', ['style="font-style: normal"'], emojiIcon) : el('i', [`class="${icon}"`], '')) +
      fileName
      // el('div', ['style="flex-grow: 1;"'], '') +
      ) + 
      (fileName === '..' ? '' :
      el('div', ['style="padding: 0.8rem 1rem;"'],
        el('span', ['class="size"', 'style="margin-right: 10px"'], readableFileSize(size)) + 
        // el('i', [`class="deleteoption", itemId="${itemId}", style="float: right"`], '❌')
        el('i', [`class="deleteoption far fa-trash-alt", itemId="${itemId}", style="float: right; cursor:pointer"`], '')
      ))
  const btn = (content, evt, attrs) => `<button ${attrs.join(' ')} onclick="${evt}">${content}</button>`

  const intro = `<div class="intro markdown-body" style="text-align: left; margin-top: 2rem;">
                    <h2>31415926535x 👋</h2>
                    <p>This is pix's OneDrive public directory listing. Feel free to download any files that you find useful.  <a href="mailto:259437152wx@gmail.com?body=来自网盘"><strong>Mail_Me</strong></a>.</p>
                    <p><a href="https://31415x.cf">Portfolio</a> · <a href="https://31415926535x.github.io/">Blog</a> · <a href="https://github.com/31415926535x">GitHub</a></p>
                  </div>`
  //` + window.location.origin.replace(window.location.origin.split('.')[0].split('//')[1], 'blog') + `
  
  // Check if current directory contains README.md, if true, then render spinner
  let readmeExists = false
  let readmeFetchUrl = ''


  const form = (path) => `<div class="container" id="upload" style="min-width: 200px; width: 40%; position: fixed; _position: absolute; top: 50%; left: 50%; margin-left: -300px; margin-top: -200px; z-index: 10001; display: flex; font-style: small; display: none">
  <div class="items">
      <div style="background: #d3cce3;  background: linear-gradient(to right, rgb(211, 204, 227), rgb(233, 228, 240)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */      ">
        <form path="${path}" method="POST" id="uploadform" enctype="multipart/form-data">
          <a class="item"> <i class="fa fa-file"></i> FILE: <div style="flex-grow: 0.5;"></div> <input type="file" id="form-file"> </a>
        </form>
        <a class="item"> <i class="fa fa-align-justify"></i> FILENAME: <div style="flex-grow: 0.5;"></div> <input type="text" name="upload" id="form-upload"> </a>
        <a class="item"> <i class="fa fa-key"></i> PASSWORD: <div style="flex-grow: 0.5;"></div> <input type="password" name="key" id="form-key"> </a>
        <a class="item"> <i class="fa fa-upload"></i> Upload: <div style="flex-grow: 0.5;"></div> <input type="submit" value="Submit" id="formUpload"> </a>
      </div>
      <script>
        document.getElementById("form-key").onchange = function(){
          document.getElementById("uploadform").action = document.location.href + '?upload=' + document.getElementById("form-upload").value + '&key=' + document.getElementById("form-key").value
          console.log(document.getElementById("uploadform").action)
        }
        document.getElementById("form-upload").onchange = function(){
          document.getElementById("uploadform").action = document.location.href + '?upload=' + document.getElementById("form-upload").value + '&key=' + document.getElementById("form-key").value
        }
        document.getElementById("form-file").onchange = function(){
          document.getElementById("form-upload").value = document.getElementById("form-file").files[0].name
        }
        document.getElementById("formUpload").onclick = function(){
          let posturl = document.location.href + '?upload=' + document.getElementById("form-upload").value + '&key=' + document.getElementById("form-key").value
          let file = document.getElementById("form-file").files[0]
          if(file.size > 4 * 1024 * 1024){
            alert("Can't upload large files(>= 4MB) now..╮o(￣皿￣///).")
            return;
          }
          let request = new XMLHttpRequest()
          request.open("POST", posturl)
          request.send(file)  // maybe 500, but can upload
          document.getElementById("upload").style.display = "none"
          alert("uplonding...pls wait")
          request.onloadend = e =>{
            console.log("uplaod done!!!")
            console.log(request)
            console.log(request.status)
            alert("upload done!!!");
            location.reload();
          }
          
        }
      </script>
  </div>    
</div>`


  const body = div(
    'container',
    div('path', renderPath(path) + 
          btn("上传", `upload()`, ['class="upload-button"', 'style="display: block;background-color: #000;color: #ffffff;cursor: pointer;font-weight: bold;text-decoration: none;padding: 0.2rem 1rem;margin: 0;max-width: 180px;user-select: none;border-radius: 2px;box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);float: right;"'])) +
    div(
      'items',
      el(
        'div',
        ['style="min-width: 600px"'],
        (!isIndex ? item('far fa-folder', '..', `${path}..`) : '') +
        items
          .map(i => {
            // Check if the current item is a folder or a file
            if ('folder' in i) {
              const emoji = emojiRegex().exec(i.name)
              if (emoji && !emoji.index) {
                return el('div', ['class="file"', 'style="display: flex; justify-content: center; align-items: center;"'], item('', i.name.replace(emoji, '').trim(), `${path}${i.name}/`, i.size, i.id, emoji[0]))
              } else {
                return el('div', ['class="file"', 'style="display: flex; justify-content: center; align-items: center;"'], item('far fa-folder', i.name, `${path}${i.name}/`, i.size, i.id))
              }
            } else if ('file' in i) {
              // Check if README.md exists
              if (!readmeExists) {
                // TODO: debugging for README preview rendering
                console.log(i)

                readmeExists = i.name.toLowerCase() === 'readme.md'
                readmeFetchUrl = i['@microsoft.graph.downloadUrl']
              }

              // Render file icons
              let fileIcon = getClassNameForMimeType(i.file.mimeType)
              if (fileIcon === 'fa-file') {
                // Check for files that haven't been rendered as expected
                const extension = i.name.split('.').pop()
                if (extension === 'md') {
                  fileIcon = 'fab fa-markdown'
                } else if (['7z', 'rar', 'bz2', 'xz', 'tar', 'wim'].includes(extension)) {
                  fileIcon = 'far fa-file-archive'
                } else if (['flac', 'oga', 'opus'].includes(extension)) {
                  fileIcon = 'far fa-file-audio'
                } else {
                  fileIcon = `far ${getClassNameForFilename(i.name)}`
                }
              } else {
                fileIcon = `far ${fileIcon}`
              }
              return el('div', ['class="file"', 'style="display: flex; justify-content: center; align-items: center;"'], item(fileIcon, i.name, `${path}${i.name}`, i.size, i.id))
            } else {
              console.log(`unknown item type ${i}`)
            }
          })
          .join('')
      )
    ) +
    (readmeExists && !isIndex ? await renderMarkdown(readmeFetchUrl, 'fade-in-fwd', '') : '') +
    (isIndex ? intro : '')
  )
  return renderHTML(form(path) + body, ...[request.pLink, request.pIdx])
}
