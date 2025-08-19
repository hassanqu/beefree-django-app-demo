// Initializes the Beefree SDK using a server-returned token.
// Fetch token from backend and start the SDK in the container.

const statusEl = document.getElementById('status');

function setStatus(message, kind = 'info') {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.dataset.kind = kind;
}

// Initial template to load into Beefree SDK
const initialTemplate = {"page":{"body":{"container":{"style":{"background-color":"#FFFFFF"}},"content":{"computedStyle":{"linkColor":"#0068A5","messageBackgroundColor":"transparent","messageWidth":"562px"},"style":{"color":"#000000","font-family":"Arial, Helvetica Neue, Helvetica, sans-serif"}},"webFonts":[]},"description":"","rows":[{"container":{"style":{"background-color":"transparent","background-image":"none","background-repeat":"no-repeat","background-position":"top left"}},"content":{"style":{"background-color":"transparent","color":"#000000","width":"500px","background-image":"none","background-repeat":"no-repeat","background-position":"top left","border-top":"0px solid transparent","border-right":"0px solid transparent","border-bottom":"0px solid transparent","border-left":"0px solid transparent","border-radius":"0px","padding-top":"0px","padding-right":"0px","padding-bottom":"0px","padding-left":"0px"},"mobileStyle":{},"computedStyle":{"rowColStackOnMobile":true,"rowReverseColStackOnMobile":false,"verticalAlign":"top","hideContentOnMobile":false,"hideContentOnDesktop":false}},"columns":[{"grid-columns":12,"modules":[{"type":"mailup-bee-newsletter-modules-heading","descriptor":{"heading":{"title":"h1","text":"<span class=\"tinyMce-placeholder\">Hello World! This is Beefree SDK!</span>","style":{"color":"#000000","font-size":"30px","font-family":"Arial, sans-serif","link-color":"#0068A5","line-height":"120%","text-align":"center","direction":"ltr","font-weight":"700","letter-spacing":"0px"}},"style":{"width":"100%","text-align":"center","padding-top":"0px","padding-right":"0px","padding-bottom":"0px","padding-left":"0px"},"mobileStyle":{}},"uuid":"0ade355b-59cc-47aa-9b08-86a735b228be"}],"style":{"background-color":"transparent","padding-top":"5px","padding-right":"0px","padding-bottom":"5px","padding-left":"0px","border-top":"0px solid transparent","border-right":"0px solid transparent","border-bottom":"0px solid transparent","border-left":"0px solid transparent"},"uuid":"52d032db-1305-46e9-8159-60083bffbb09"}],"uuid":"40e32a81-56b7-4e3b-98b8-3dbc6d8ab25e"}],"template":{"version":"2.0.0"},"title":""},"comments":{}};

async function requestBeeToken(uid) {
  const response = await fetch('/api/bee-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
    credentials: 'same-origin',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Auth failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function startBeefree() {
  try {
    setStatus('Requesting Beefree token...');
    const token = await requestBeeToken('demo-user');
    setStatus('Loading Beefree SDK...');
    const BeefreeSDK = await loadBeefreeSDK();
    setStatus('Initializing Beefree SDK...');
    const sdk = new BeefreeSDK({ ...token, v2: true });

    const beeConfig = {
      container: 'beefree-editor-container',
      language: 'en-US',
      onSave: (pageJson, pageHtml, ampHtml, templateVersion, language) => {
        // eslint-disable-next-line no-console
        console.log('Saved!', { pageJson, pageHtml, ampHtml, templateVersion, language });
        setStatus('Design saved (see console log).', 'success');
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.error('Error:', error);
        setStatus(`SDK error: ${error?.message || String(error)}`, 'error');
      },
      // Example customizations:
      // translations: { 'bee-common-top-bar': { save: 'Save changes' } },
      // sidebarPosition: 'right',
    };

    const userConfig = undefined; // optional user
    // Prefer fetching a template JSON; fallback to embedded template
    const templateData = await fetch('/static/editor/initial-template.json')
      .then(r => (r.ok ? r.json() : initialTemplate))
      .catch(() => initialTemplate);
    const template = '';
    const options = { shared: false };

    await sdk.start(beeConfig, userConfig, template, options);
    setStatus('Beefree SDK initialized. Loading template...');

    // Load the design after the editor is ready
    await sdk.load(templateData);
    setStatus('Template loaded.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    setStatus(err.message || 'Failed to initialize Beefree SDK', 'error');
  }
}

// Auto-start on page load
window.addEventListener('DOMContentLoaded', startBeefree);

async function loadBeefreeSDK() {
  // Prefer ESM build first
  const esmCandidates = [
    // jsDelivr ESM wrapper
    'https://cdn.jsdelivr.net/npm/@beefree.io/sdk/+esm',
    // esm.sh CDN
    'https://esm.sh/@beefree.io/sdk',
    // Skypack CDN
    'https://cdn.skypack.dev/@beefree.io/sdk',
  ];
  for (const url of esmCandidates) {
    try {
      const mod = await import(/* @vite-ignore */ url);
      return mod.default || mod;
    } catch (e) {
      // try next
    }
  }

  // Fallback to UMD global via script injection
  const umdCandidates = [
    // Common UMD locations
    'https://cdn.jsdelivr.net/npm/@beefree.io/sdk/dist/index.umd.js',
    'https://unpkg.com/@beefree.io/sdk/dist/index.umd.js',
    'https://cdn.jsdelivr.net/npm/@beefree.io/sdk/umd/index.js',
    'https://unpkg.com/@beefree.io/sdk/umd/index.js',
  ];
  for (const url of umdCandidates) {
    try {
      await injectScript(url);
      if (window.BeefreeSDK) return window.BeefreeSDK;
    } catch (e) {
      // try next
    }
  }
  throw new Error('Beefree SDK could not be loaded');
}

function injectScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(s);
  });
}


