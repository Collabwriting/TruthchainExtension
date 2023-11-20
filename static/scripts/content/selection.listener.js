document.addEventListener('mouseup', function () {
    const content = window.getSelection().toString().trim();
    const title = document.title;
    const url = window.location.href;
    
    chrome.runtime.sendMessage({
      action: 'selectionChanged',
      content: content,
      title: title,
      url: url
    });
});