import BeefreeSDK from '@beefree.io/sdk'
import './styles.css'

// Status management
const statusEl = document.getElementById('status')

function setStatus(message, kind = 'info') {
  if (!statusEl) return
  statusEl.textContent = message
  statusEl.dataset.kind = kind
}

// Initial template embedded directly
const initialTemplate = {
  "page": {
    "body": {
      "container": {
        "style": {
          "background-color": "#FFFFFF"
        }
      },
      "content": {
        "computedStyle": {
          "linkColor": "#0068A5",
          "messageBackgroundColor": "transparent",
          "messageWidth": "562px"
        },
        "style": {
          "color": "#000000",
          "font-family": "Arial, Helvetica Neue, Helvetica, sans-serif"
        },
        "webFonts": []
      },
      "description": "",
      "rows": [
        {
          "container": {
            "style": {
              "background-color": "transparent",
              "background-image": "none",
              "background-repeat": "no-repeat",
              "background-position": "top left"
            }
          },
          "content": {
            "style": {
              "background-color": "transparent",
              "color": "#000000",
              "width": "500px",
              "background-image": "none",
              "background-repeat": "no-repeat",
              "background-position": "top left",
              "border-top": "0px solid transparent",
              "border-right": "0px solid transparent",
              "border-bottom": "0px solid transparent",
              "border-left": "0px solid transparent",
              "border-radius": "0px",
              "padding-top": "0px",
              "padding-right": "0px",
              "padding-bottom": "0px",
              "padding-left": "0px"
            },
            "mobileStyle": {},
            "computedStyle": {
              "rowColStackOnMobile": true,
              "rowReverseColStackOnMobile": false,
              "verticalAlign": "top",
              "hideContentOnMobile": false,
              "hideContentOnDesktop": false
            }
          },
          "columns": [
            {
              "grid-columns": 12,
              "modules": [
                {
                  "type": "mailup-bee-newsletter-modules-heading",
                  "descriptor": {
                    "heading": {
                      "title": "h1",
                      "text": "<span class=\"tinyMce-placeholder\">Hello World! This is Beefree SDK!</span>",
                      "style": {
                        "color": "#000000",
                        "font-size": "30px",
                        "font-family": "Arial, sans-serif",
                        "link-color": "#0068A5",
                        "line-height": "120%",
                        "text-align": "center",
                        "direction": "ltr",
                        "font-weight": "700",
                        "letter-spacing": "0px"
                      }
                    },
                    "style": {
                      "width": "100%",
                      "text-align": "center",
                      "padding-top": "0px",
                      "padding-right": "0px",
                      "padding-bottom": "0px",
                      "padding-left": "0px"
                    },
                    "mobileStyle": {}
                  },
                  "uuid": "0ade355b-59cc-47aa-9b08-86a735b228be"
                }
              ],
              "style": {
                "background-color": "transparent",
                "padding-top": "5px",
                "padding-right": "0px",
                "padding-bottom": "5px",
                "padding-left": "0px",
                "border-top": "0px solid transparent",
                "border-right": "0px solid transparent",
                "border-bottom": "0px solid transparent",
                "border-left": "0px solid transparent"
              },
              "uuid": "52d032db-1305-46e9-8159-60083bffbb09"
            }
          ],
          "uuid": "40e32a81-56b7-4e3b-98b8-3dbc6d8ab25e"
        }
      ],
      "template": {
        "version": "2.0.0"
      },
      "title": ""
    },
    "comments": {}
  }
}

// API functions
async function requestBeeToken(uid) {
  const response = await fetch('/api/bee-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
    credentials: 'same-origin',
  })
  
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Auth failed: ${response.status} ${text}`)
  }
  
  return response.json()
}

// Main initialization
async function startBeefree() {
  try {
    setStatus('Requesting Beefree token...')
    const token = await requestBeeToken('demo-user')
    
    setStatus('Initializing Beefree SDK...')
    const sdk = new BeefreeSDK({ ...token, v2: true })

    const beeConfig = {
      container: 'beefree-editor-container',
      language: 'en-US',
      onSave: (pageJson, pageHtml, ampHtml, templateVersion, language) => {
        console.log('Saved!', { pageJson, pageHtml, ampHtml, templateVersion, language })
        setStatus('Design saved (see console log).', 'success')
      },
      onError: (error) => {
        console.error('Error:', error)
        setStatus(`SDK error: ${error?.message || String(error)}`, 'error')
      },
      // Customizations
      translations: { 
        'bee-common-top-bar': { 
          save: 'Save changes' 
        } 
      },
      sidebarPosition: 'right',
    }

    const userConfig = undefined // optional user
    const template = ''
    const options = { shared: false }

    await sdk.start(beeConfig, userConfig, template, options)
    setStatus('Beefree SDK initialized. Loading template...')

    // Load the design after the editor is ready
    await sdk.load(initialTemplate)
    setStatus('Template loaded.')
    
  } catch (err) {
    console.error(err)
    setStatus(err.message || 'Failed to initialize Beefree SDK', 'error')
  }
}

// Auto-start on page load
window.addEventListener('DOMContentLoaded', startBeefree)

// Export for potential module usage
export { startBeefree, requestBeeToken }
