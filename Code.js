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

  function getUserEmail() {
    var user_email = "teacher1@gmail.com";//Session.getActiveUser().getEmail();
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
      email_id: Session.getActiveUser().getEmail()
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
      email_id: Session.getActiveUser().getEmail(),
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
  // Mocked data - replace with real data fetch from Sheets or DB
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
  console.log('=== EXPORT STARTED ===');
  console.log('Student Name:', studentName);
  console.log('Project Content Type:', typeof projectContent);
  console.log('Project Content Length:', projectContent ? projectContent.length : 'NULL/UNDEFINED');
  console.log('Project Content Preview (first 200 chars):', projectContent ? projectContent.substring(0, 200) : 'NO CONTENT');
  
  try {
    // Step 1: Get document
    console.log('Step 1: Getting active document...');
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    console.log('Document retrieved successfully. Body children count:', body.getNumChildren());
    
    // Step 2: Add page break
    console.log('Step 2: Adding page break...');
    if (body.getNumChildren() > 1) {
      body.appendPageBreak();
      console.log('Page break added');
    } else {
      console.log('Skipped page break (first entry)');
    }
    
    // Step 3: Add heading
    console.log('Step 3: Adding student heading...');
    const headingText = `${studentName.toUpperCase()} - PROJECT`;
    console.log('Heading text:', headingText);
    
    const heading = body.appendParagraph(headingText);
    console.log('Paragraph created, setting heading style...');
    
    heading.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    console.log('Heading style set, applying text formatting...');
    
    // Fix: Get the text element first, then apply styling
    try {
      const headingTextElement = heading.editAsText();
      console.log('Got text element, applying styles...');
      
      headingTextElement.setForegroundColor('#1a365d')
                       .setBold(true)
                       .setFontSize(18);
      console.log('Heading formatting applied successfully');
    } catch (headingError) {
      console.error('Error formatting heading:', headingError);
      console.error('Heading error details:', headingError.toString());
      console.error('Heading error stack:', headingError.stack);
    }
    
    // Step 4: Add separator
    console.log('Step 4: Adding horizontal rule...');
    try {
      body.appendHorizontalRule();
      console.log('Horizontal rule added successfully');
    } catch (ruleError) {
      console.error('Error adding horizontal rule:', ruleError);
      console.error('Rule error details:', ruleError.toString());
    }
    
    // Step 5: Process content
    console.log('Step 5: Processing project content...');
    if (!projectContent || projectContent.trim() === '') {
      console.log('WARNING: No project content provided, adding placeholder...');
      body.appendParagraph('No project content available.');
      return true;
    }
    
    console.log('Content validation passed, splitting into sections...');
    // Split content by double line breaks first (paragraphs), then handle single line breaks
    const sections = projectContent.split(/\n\s*\n/);
    console.log('Content split into', sections.length, 'sections');
    
    let processedParagraphs = 0;
    let processedSections = 0;
    
    sections.forEach((section, sectionIndex) => {
      console.log(`Processing section ${sectionIndex + 1}/${sections.length}...`);
      console.log('Section preview:', section.substring(0, 100));
      
      if (section.trim()) {
        processedSections++;
        
        // For sections that might have single line breaks, split them too
        const lines = section.split('\n');
        console.log(`Section has ${lines.length} lines`);
        
        lines.forEach((line, lineIndex) => {
          console.log(`Processing line ${lineIndex + 1}/${lines.length}...`);
          
          if (line.trim()) {
            processedParagraphs++;
            console.log(`Adding paragraph ${processedParagraphs}: "${line.trim().substring(0, 50)}..."`);
            
            try {
              const para = body.appendParagraph(line.trim());
              console.log('Paragraph added successfully');
              
              // Check if this line contains bold formatting (**)
              if (line.includes('**')) {
                console.log('Line contains bold formatting, processing...');
                
                try {
                  const text = para.getText();
                  const textElement = para.editAsText();
                  console.log('Got text element for bold processing');
                  
                  // Process bold text formatting
                  let processedText = text;
                  let offset = 0;
                  
                  // Find all bold sections
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  let match;
                  let boldMatches = 0;
                  
                  while ((match = boldRegex.exec(text)) !== null) {
                    boldMatches++;
                    console.log(`Processing bold match ${boldMatches}:`, match[1]);
                    
                    const fullMatch = match[0]; // **text**
                    const boldText = match[1];   // text
                    const startIndex = match.index - offset;
                    const endIndex = startIndex + fullMatch.length;
                    
                    console.log(`Bold text range: ${startIndex} to ${endIndex}, text: "${boldText}"`);
                    
                    // Remove the ** markers
                    textElement.deleteText(startIndex + boldText.length, endIndex - 1);
                    textElement.deleteText(startIndex, startIndex + 1);
                    
                    // Apply bold formatting to the remaining text
                    textElement.setBold(startIndex, startIndex + boldText.length - 1, true);
                    
                    // Update offset for next iteration
                    offset += 4; // Two ** on each side
                    
                    console.log(`Bold formatting applied for "${boldText}"`);
                  }
                  
                  console.log(`Processed ${boldMatches} bold sections in this line`);
                  
                  // If it looks like a heading (starts with ** or is short), make it bigger
                  if (line.trim().startsWith('**') || (line.includes('**') && line.length < 100)) {
                    console.log('Applying heading-style formatting...');
                    textElement.setFontSize(14)
                              .setForegroundColor('#2d3748');
                    console.log('Heading-style formatting applied');
                  }
                  
                } catch (boldError) {
                  console.error('Error processing bold formatting:', boldError);
                  console.error('Bold error details:', boldError.toString());
                  console.error('Bold error stack:', boldError.stack);
                }
              }
              
              // Set general paragraph formatting
              try {
                para.setFontFamily('Arial')
                    .setFontSize(11)
                    .setSpacingAfter(8)
                    .setLineSpacing(1.15);
                console.log('Paragraph formatting applied');
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
        
        // Add extra spacing between sections
        try {
          body.appendParagraph('');
          console.log('Section spacing added');
        } catch (spacingError) {
          console.error('Error adding section spacing:', spacingError);
        }
      }
    });
    
    console.log(`Content processing complete. Processed ${processedSections} sections, ${processedParagraphs} paragraphs`);
    
    // Step 6: Add timestamp
    console.log('Step 6: Adding timestamp...');
    try {
      body.appendParagraph(''); // Empty line
      const timestamp = body.appendParagraph(`Exported: ${new Date().toLocaleString()}`);
      timestamp.setFontSize(9);
      const timestampText = timestamp.editAsText();
      timestampText.setForegroundColor('#666666')
               .setItalic(true);
      console.log('Timestamp added successfully');
    } catch (timestampError) {
      console.error('Error adding timestamp:', timestampError);
      console.error('Timestamp error details:', timestampError.toString());
    }
    
    // Step 7: Add final spacing
    console.log('Step 7: Adding final spacing...');
    try {
      body.appendParagraph('');
      body.appendParagraph('');
      console.log('Final spacing added');
    } catch (finalSpacingError) {
      console.error('Error adding final spacing:', finalSpacingError);
    }
    
    console.log('=== EXPORT COMPLETED SUCCESSFULLY ===');
    console.log(`Successfully exported project for ${studentName}`);
    console.log(`Project content length: ${projectContent.length} characters`);
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