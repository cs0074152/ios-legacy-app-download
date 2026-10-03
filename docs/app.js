(() => {
  'use strict';
  const tabs = Array.from(document.querySelectorAll('[data-os]'));
  const code = document.getElementById('command-code');
  const panel = document.getElementById('command-panel');
  const toast = document.querySelector('.toast');
  let toastTimer;
  function commands(executable) {
    return `${executable} auth login --email "your-apple-account@example.com"\n\n${executable} search "应用名称" --limit 5\n${executable} list-versions --app-id APP_ID\n${executable} get-version-metadata --app-id APP_ID --external-version-id VERSION_ID\n\n${executable} download --app-id APP_ID --external-version-id VERSION_ID --output "./app-legacy.ipa"`;
  }
  function selectTab(tab, focus) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    code.textContent = commands(tab.dataset.os === 'windows' ? './ipatool.exe' : 'ipatool');
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab, false));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
  function announce(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }
  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; } catch (_) { /* Try local-file fallback. */ }
    }
    const previous = document.activeElement;
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('aria-label', '待复制内容');
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    field.remove();
    if (previous && previous.focus) previous.focus();
    return ok;
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy === 'commands' ? code.textContent : document.getElementById('agent-prompt').innerText;
      const ok = await copyText(value);
      announce(ok ? '已复制。请替换示例参数后使用。' : '暂时无法自动复制，请选中文字手动复制。');
    });
  });
})();
