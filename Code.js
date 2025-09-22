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


  function validateUser() {
    var user_email = currentUser();
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
    if (response.getResponseCode()==200){
      PropertiesService.getUserProperties().setProperty('USER_ID', responseJson.user_id)
    }
    return {
      statusCode: response.getResponseCode(),
      email: user_email,
      role: responseJson.role
    }
  }
  function getAdvice(prompt) {
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

  try {
    const response = UrlFetchApp.fetch(baseUrl, options);
    const result = JSON.parse(response.getContentText());


    // ✅ Return the entire object — not just result.recommendation.advice
    return result;
  } catch (error) {
    Logger.log("❌ Error fetching from OpenAI Lambda:");
    Logger.log(error);
    return {
      recommendation: {
        advice: "No response available",
        subject: "",
        connection: "",
        examples: [],
        resources: []
      }
    };
  }
}

function lockProject(projectData) {
  const baseUrl = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke'
  Logger.log(projectData)
  try {  
    
    // Prepare the data for the API call
    const payload = {
      action: "saveproject",
      payload: {
        json: {
          project:projectData
        },
        user_id: "23e228fa-4592-4bdc-852e-192973c388ce",
        email_id: 'mindspark.user1@schoolfuel.org',
      },
    };

    //Logger.log(JSON.stringify(payload))

    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
    
    // Make the API call to the backend
    const response = UrlFetchApp.fetch(baseUrl, options);

    const responseData = JSON.parse(response.getContentText());

    
    // Handle different response codes
    return {
      success: true,
      message: responseData.action_response.response || 'Project successfully locked and submitted for review!',
    }
    
  } catch (error) {
    console.error('Error in lockProject function:', error);
    
    // Handle different types of errors
    if (error.toString().includes('DNS error')) {
      return {
        success: false,
        message: 'Network connection error. Please check your internet connection.'
      };
    } else if (error.toString().includes('timeout')) {
      return {
        success: false,
        message: 'Request timed out. Please try again.'
      };
    } else {
      return {
        success: false,
        message: 'An unexpected error occurred. Please contact support if the problem persists.'
      };
    }
  }
}

function getStudentProjects(){
  try {
    const url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';

    const payload = {
      action: "myprojects",
      payload:{
        user_id:"23e228fa-4592-4bdc-852e-192973c388ce",
        request:"student_view_all"
      }
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
    
    const response = UrlFetchApp.fetch(url, options);
    
    // Check if the HTTP request itself failed
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP Error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    const result = JSON.parse(response.getContentText());
    
    // Check if the API returned an error in the response body
    if (!result || result.status !== "success") {
      throw new Error(`API Error: ${result?.status || 'Unknown'} - ${result?.message || 'Unknown error'}`);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in getStudentProjects:', error);
    // Return an error object that your React component can handle
    return {
      statusCode: 500,
      error: error.toString(),
      body: null
    };
  }
}

function getProjectDetails(projectId){
  try {
    const url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';

    const payload = {
      action: "myprojects",
      payload:{
        user_id:"23e228fa-4592-4bdc-852e-192973c388ce",
        project_id:projectId,
        request:"project_details"
      }
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
    
    const response = UrlFetchApp.fetch(url, options);
    
    // Check if the HTTP request itself failed
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP Error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    const result = JSON.parse(response.getContentText());
    
    // Check if the API returned an error in the response body
    if (!result || result.status !== "success") {
      throw new Error(`API Error: ${result?.status || 'Unknown'} - ${result?.message || 'Unknown error'}`);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in getStudentProjects:', error);
    // Return an error object that your React component can handle
    return {
      statusCode: 500,
      error: error.toString(),
      body: null
    };
  }
}

function processDailyCheckin(userInput) {
  const url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';
  
  const payload = {
    action: "morningpulse",
    payload: {
      email_id: Session.getActiveUser().getEmail(),
      emoji: userInput.emoji,
      route: "daily-checkin",
      message: userInput.message
    }
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);

    console.log('API Response Status:', JSON.stringify(response));
    
    const result = JSON.parse(response.getContentText());
    console.log('API Response:', result);
    if( result.statusCode == 200)
      console.log("status 200 received")
    
    // Return the project data or fallback message
<<<<<<< HEAD
    return JSON.parse(JSON.stringify(result?.action_response?.response)) || "No response available";
=======
    return JSON.parse(JSON.stringify(result?.action_response?.motivation)) || "No response available";
>>>>>>> 70c288111c7393cadc3dfb759cd52b8dba7ae217
  } catch (error) {
    console.error('Error processing daily check-in:', error.toString());
    
    // Return a fallback response instead of throwing
    const fallbackResponses = [
      "Thank you for your daily check-in! Keep up the great work! 🌟",
      "Great job starting your day with intention! 🌟",
      "Your mindful check-in sets a positive tone for the day ahead! ✨",
      "Thank you for taking a moment to reflect. Keep up the amazing work! 💪"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

function callAIServiceInitiation(userInput) {
  console.log("this is from callAIServiceInitiation");
  const url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';
  
  const payload = {
    action: "guideme",
    payload: {
      email_id: Session.getActiveUser().getEmail(),
      message: userInput.message,
      context: {
        mode: userInput.context.mode,
        focus: userInput.context.focus,
        course: userInput.context.course,
        grade: userInput.context.grade,
        readingLevel: userInput.context.readingLevel,
        standards: userInput.context.standards,
        pastedContent: userInput.context.pastedContent
      }
    }
  }; 
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    console.log('API Response Status from GuideMe Initiation:', response.getResponseCode());
    
    const result = JSON.parse(response.getContentText());
    console.log('API Response Initiation:', result);
    
    if (result.statusCode == 200) {
      console.log("status 200 received");
    }
    
    // Check if the response has the expected structure
    if (result.status === "success" && result.action_response) {
      // Return the properly structured response that matches what your frontend expects
      return {
        message: result.action_response.response,
        conversation_id: result.action_response.conversation_id,
        generatedAt: result.action_response.generatedAt,
        citations: [] // Add empty citations array if not provided by backend
      };
    } else {
      // Return error structure
      return {
        error: "Invalid response structure",
        message: "No response available"
      };
    }
    
  } catch (error) {
    console.error('Error processing AI initiation request:', error.toString());
    // Return error structure that frontend can handle
    return {
      error: error.toString(),
      message: "Error connecting to AI service"
    };
  }
}

function callAIServiceContinue(userInput) {
  console.log("this is from callAIServiceContinue");
  const url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';
  
  const payload = {
    action: "guideme",
    payload: {
      email_id: Session.getActiveUser().getEmail(),
      message: userInput.message,
      conversation_id: userInput.conversation_id
    }
  }; 
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    console.log('API Response Status from GuideMe Continue:', response.getResponseCode());
    
    const result = JSON.parse(response.getContentText());
    console.log('API Response Continue:', result);
    
    if (result.statusCode == 200) {
      console.log("status 200 received");
    }
    
    // Check if the response has the expected structure
    if (result.status === "success" && result.action_response) {
      // Return the properly structured response that matches what your frontend expects
      return {
        message: result.action_response.response,
        conversation_id: result.action_response.conversation_id,
        generatedAt: result.action_response.generatedAt,
        citations: [] // Add empty citations array if not provided by backend
      };
    } else {
      // Return error structure
      return {
        error: "Invalid response structure",
        message: "No response available"
      };
    }
    
  } catch (error) {
    console.error('Error processing AI continue request:', error.toString());
    // Return error structure that frontend can handle
    return {
      error: error.toString(),
      message: "Error connecting to AI service"
    };
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

function findExperts(message) {
  const baseUrl = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';
  const payload = {
    action: "helpme",
    payload: {
      message: message,
      geolocation: "Tucson, AZ", // You can make this dynamic
      email_id: "student2@gmail.com" // Gets the current user's email
    }
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(baseUrl, options);
    const result = JSON.parse(response.getContentText());
    Logger.log(result);
    return result;
  } catch (error) {
    Logger.log('Error finding experts: ' + error.toString());
    throw error;
  }
}

function submitFormToScript(payload){
  Logger.log(payload)
}

function callMorningPulseAPI(payload) {
  const baseUrl = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke';

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(baseUrl, options);
    const result = JSON.parse(response.getContentText());
    Logger.log('Morning pulse API response:', result);
    return result;
  } catch (error) {
    console.error('Error calling morning pulse API:', error);
    throw error;
  }
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