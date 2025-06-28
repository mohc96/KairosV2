function onOpen() {
    DocumentApp.getUi()
      .createMenu('Kairos')
      .addItem('Open Sidebar', 'showSidebar')
      .addToUi();
  }
  
  function showSidebar() {
    const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle(" ")
      .setWidth(400);
    DocumentApp.getUi().showSidebar(html);
  }

  function getUserEmail() {
    return Session.getActiveUser().getEmail();
  }
  
  
  