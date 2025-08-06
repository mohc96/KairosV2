function onOpen() {
    DocumentApp.getUi()
      .createMenu('Kairos')
      .addItem('Open Sidebar', 'showSidebar')
      .addToUi();
  }
  
  function showSidebar() {
    const html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle("Kairos for Personalized Learning")
      .setWidth(400);
    DocumentApp.getUi().showSidebar(html);
  }

function currentUser()
{
  return Session.getActiveUser().getEmail();
}


  function getUserEmail() {
    var user_email = "teacher1@gmail.com";//currentUser();
    const identity_url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/identity-fetch';
    const payload = {
      email_id: user_email,
    };
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,  
    };

    const response = UrlFetchApp.fetch(identity_url, options);

    const responseText = response.getContentText();
    const responseJson = JSON.parse(responseText);

    return {
      statusCode: response.getResponseCode(),
      email: user_email,
      role: responseJson.role
    }
  }
  function callOpenAI(prompt) {
  const baseUrl = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke'; 

  const payload = {
    action: "advice",
    payload: {
      message: prompt,
      email_id: currentUser(),
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(baseUrl, options);
  const result = JSON.parse(response.getContentText());
  Logger.log(result)

  return result.recommendation || "No response available";
}

function generateProject(prompt) {
  const baseUrl = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke'; // Lambda URL

  const payload = {
    action: "createproject",
    payload: {
      message: prompt,
      email_id: currentUser(),
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(baseUrl, options);
  const result = JSON.parse(response.getContentText());

  return JSON.stringify(result.json.project) || "No response available";
}



function processDailyCheckin(payload) {


  console.log("this is from processDailyCheckin");
  
  const url = 'YOUR_API_ENDPOINT/process-daily-checkin';
 
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Error processing daily check-in:', error);
    throw error;
  }

}

function getStudentProjectsForTeacher() {
  return [
    {
      title: 'Climate Change Research',
      studentEmail: 'student1@example.com',
      summary: 'A summary of key climate change challenges and mitigation strategies.',
      docLink: 'https://docs.google.com/document/d/xxxxxxx',
    },
    {
      title: 'AI in Healthcare',
      studentEmail: 'student2@example.com',
      summary: 'Exploring applications of machine learning in medical diagnosis.',
      docLink: 'https://docs.google.com/document/d/yyyyyyy',
    },
  ];
}





















function createStudentTab(studentName, projectContent) {
  Logger.log(studentName)
  
  try {
    
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    
   
    if (body.getNumChildren() > 1) {
      body.appendPageBreak();
    }
    
    const headingText = `${studentName.toUpperCase()} - PROJECT`;
    
    const heading = body.appendParagraph(headingText);
    heading.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    
    try {
      const headingTextElement = heading.editAsText();
      headingTextElement.setForegroundColor('#1a365d')
                       .setBold(true)
                       .setFontSize(18);
    } catch (headingError) {
      console.error('Error formatting heading:', headingError);
      console.error('Heading error details:', headingError.toString());
      console.error('Heading error stack:', headingError.stack);
    }
    
    try {
      body.appendHorizontalRule();
    } catch (ruleError) {
      console.error('Error adding horizontal rule:', ruleError);
      console.error('Rule error details:', ruleError.toString());
    }
    
    
    if (!projectContent || projectContent.trim() === '') {
      body.appendParagraph('No project content available.');
      return true;
    }
    
    const sections = projectContent.split(/\n\s*\n/);
    
    let processedParagraphs = 0;
    let processedSections = 0;
    
    sections.forEach((section, sectionIndex) => {
      if (section.trim()) {
        processedSections++;
        
        
        const lines = section.split('\n');
        
        lines.forEach((line, lineIndex) => {
          if (line.trim()) {
            processedParagraphs++;
            
            try {
              const para = body.appendParagraph(line.trim());
              
              
              if (line.includes('**')) {
                try {
                  const text = para.getText();
                  const textElement = para.editAsText();
                  
                  let processedText = text;
                  let offset = 0;
                  
                 
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  let match;
                  let boldMatches = 0;
                  
                  while ((match = boldRegex.exec(text)) !== null) {
                    boldMatches++;
                    
                    const fullMatch = match[0]; 
                    const boldText = match[1]; 
                    const startIndex = match.index - offset;
                    const endIndex = startIndex + fullMatch.length;
                   
                    textElement.deleteText(startIndex + boldText.length, endIndex - 1);
                    textElement.deleteText(startIndex, startIndex + 1);
                    
                    textElement.setBold(startIndex, startIndex + boldText.length - 1, true);
                    
                   
                    offset += 4; 
                  }
                  
                  
                  if (line.trim().startsWith('**') || (line.includes('**') && line.length < 100)) {
                    textElement.setFontSize(14)
                              .setForegroundColor('#2d3748');
                  }
                  
                } catch (boldError) {
                  console.error('Error processing bold formatting:', boldError);
                  console.error('Bold error details:', boldError.toString());
                  console.error('Bold error stack:', boldError.stack);
                }
              }
              
              
              try {
                para.setFontFamily('Arial')
                    .setFontSize(11)
                    .setSpacingAfter(8)
                    .setLineSpacing(1.15);
              } catch (formatError) {
                console.error('Error applying paragraph formatting:', formatError);
                console.error('Format error details:', formatError.toString());
              }
              
            } catch (paraError) {
              console.error(`Error processing paragraph ${processedParagraphs}:`, paraError);
              console.error('Paragraph error details:', paraError.toString());
              console.error('Paragraph error stack:', paraError.stack);
            }
          }
        });
        
       
        try {
          body.appendParagraph('');
        } catch (spacingError) {
          console.error('Error adding section spacing:', spacingError);
        }
      }
    });
    
    
    try {
      body.appendParagraph('');
      const timestamp = body.appendParagraph(`Exported: ${new Date().toLocaleString()}`);
      timestamp.setFontSize(9);
      const timestampText = timestamp.editAsText();
      timestampText.setForegroundColor('#666666')
               .setItalic(true);
    } catch (timestampError) {
      console.error('Error adding timestamp:', timestampError);
      console.error('Timestamp error details:', timestampError.toString());
    }
    
  
    try {
      body.appendParagraph('');
      body.appendParagraph('');
    } catch (finalSpacingError) {
      console.error('Error adding final spacing:', finalSpacingError);
    }
    
    return { success: true, message: `Successfully exported ${studentName}'s project` };
    
  } catch (error) {
    console.error('=== MAJOR ERROR IN EXPORT ===');
    console.error('Error creating student tab:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.toString());
    console.error('Error stack:', error.stack);
    console.error('Student name:', studentName);
    console.error('Content type:', typeof projectContent);
    console.error('Content length:', projectContent ? projectContent.length : 'N/A');
    console.error('=== END ERROR DETAILS ===');
    
    throw new Error(`Failed to export ${studentName}: ${error.message} (${error.name})`);
  }
}