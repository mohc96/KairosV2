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
    var user_email = Session.getActiveUser().getEmail();
    const identity_url = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/identity-fetch';
    const payload = {
      email_id: user_email,
    };
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,  // Important to get response even if it's 401/403 etc.
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
  const baseUrl = 'https://a3trgqmu4k.execute-api.us-west-1.amazonaws.com/prod/invoke'; // Lambda URL

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

function getStudentProjects() {
  return [
    {
  "project_title": "Learning Evolution Project",
  "description": "A project focused on the evolution of learning methods and technologies in the field of Science.",
  "subject_domain": "Science",
  "stages": [
    {
      "stage_id": "1a1f5f5d-5d75-49b4-882e-726c244896d4",
      "stage_order": 1,
      "title": "Research and Analysis",
      "tasks": [
        {
          "task_id": "4a71b921-5db6-4b27-b9e6-a7fdbe89c2c9",
          "title": "Literature Review on Learning Evolution in Science",
          "description": "Conduct a comprehensive review of academic literature on the evolution of learning methods in the field of Science.",
          "academic_standard": "Research Methodology",
          "resource_id": {
            "label": "Literature Review",
            "url": "https://www.researchgate.net/publication/326758503_Evolution_of_Learning_Methods_in_Science"
          }
        },
        {
          "task_id": "bd4763ae-a777-4d6b-b42e-e89f1be4de27",
          "title": "Data Collection on Emerging Technologies",
          "description": "Gather data on the latest technologies shaping the evolution of learning in Science.",
          "academic_standard": "Data Collection",
          "resource_id": {
            "label": "Emerging Technologies Data",
            "url": "https://www.nature.com/articles/d41586-021-02077-3"
          }
        }
      ],
      "gate": {
        "gate_id": "3ffbc855-79a5-4f41-8202-74b25034cb1f",
        "title": "Research Findings Review",
        "description": "Review and summarize the key findings from the research and analysis stage.",
        "checklist": [
          "Literature review completed",
          "Data collection on technologies compiled"
        ]
      }
    },
    {
      "stage_id": "8e992dfd-5a34-4838-9ecd-dc1f13d478f7",
      "stage_order": 2,
      "title": "Design and Development",
      "tasks": [
        {
          "task_id": "16c50325-76f0-4a7d-8422-b7e1f607ed26",
          "title": "Prototype Creation",
          "description": "Develop a prototype showcasing the application of emerging technologies in Science education.",
          "academic_standard": "Prototype Development",
          "resource_id": {
            "label": "Prototype Tools",
            "url": "https://www.figma.com/"
          }
        },
        {
          "task_id": "0cd0c5e7-d595-4540-bf2d-7e0908818e3e",
          "title": "Integrate React Components",
          "description": "Integrate React components to enhance user interactivity and experience.",
          "academic_standard": "Frontend Development",
          "resource_id": {
            "label": "React Documentation",
            "url": "https://reactjs.org/docs/getting-started.html"
          }
        }
      ],
      "gate": {
        "gate_id": "4764e84f-60e9-41f4-aa69-37d6575878e5",
        "title": "Prototype Evaluation",
        "description": "Evaluate the developed prototype for functionality and user experience.",
        "checklist": [
          "Prototype developed",
          "React components integrated"
        ]
      }
    },
    {
      "stage_id": "1baff977-0367-4624-a411-9f8fee2b22f9",
      "stage_order": 3,
      "title": "Testing and Improvement",
      "tasks": [
        {
          "task_id": "2aa44773-c7f6-48ed-8b17-732a483a7650",
          "title": "Usability Testing",
          "description": "Conduct usability testing to gather feedback on the prototype.",
          "academic_standard": "Usability Testing",
          "resource_id": {
            "label": "Usability Testing Methods",
            "url": "https://www.nngroup.com/articles/usability-101-introduction-to-usability/"
          }
        },
        {
          "task_id": "1fa9758c-a839-4e5a-9234-10ff3d944b43",
          "title": "Implement User Suggestions",
          "description": "Incorporate user feedback to enhance the prototype's functionality and usability.",
          "academic_standard": "User-Centric Design",
          "resource_id": {
            "label": "User-Centric Design Principles",
            "url": "https://www.interaction-design.org/literature/topics/user-centered-design"
          }
        }
      ],
      "gate": {
        "gate_id": "dde1ffda-b3c5-4e3e-b868-6ee472eff1fa",
        "title": "Usability Feedback Implementation",
        "description": "Incorporate user feedback and improve the prototype based on usability testing results.",
        "checklist": [
          "Usability testing conducted",
          "User suggestions implemented"
        ]
      }
    },
    {
      "stage_id": "134c6035-b040-4a86-b056-b5a3bc6c6c11",
      "stage_order": 4,
      "title": "Deployment and Evaluation",
      "tasks": [
        {
          "task_id": "012e3f3d-c1f5-43b5-be0b-88724dfde971",
          "title": "Deploy Prototype",
          "description": "Deploy the finalized prototype for user access and testing.",
          "academic_standard": "Deployment Process",
          "resource_id": {
            "label": "Prototype Deployment Guide",
            "url": "https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/"
          }
        },
        {
          "task_id": "4176f211-01e7-4ea5-8df2-155586d17d85",
          "title": "Collect User Feedback",
          "description": "Gather user feedback on the deployed prototype to evaluate its effectiveness.",
          "academic_standard": "User Feedback Collection",
          "resource_id": {
            "label": "User Feedback Collection Tools",
            "url": "https://www.qualtrics.com/"
          }
        }
      ],
      "gate": {
        "gate_id": "2f8bdb81-5cb5-4c6d-b2b6-cd7f478c4f27",
        "title": "Final Evaluation",
        "description": "Final evaluation of the deployed prototype based on user feedback and effectiveness.",
        "checklist": [
          "Prototype deployed",
          "User feedback collected"
        ]
      }
    }
  ]
},
    {
      project_id: "proj-001",
      project_title: "Binomial Theorem Project",
      description: "Exploring the binomial theorem for personalized learning.",
      subject_domain: "Mathematics",
      stages: [
        {
          stage_id: "stage-001",
          stage_order: 1,
          title: "Introduction to Binomial Theorem",
          tasks: [
            {
              task_id: "task-001",
              title: "Research on Binomial Theorem",
              description: "Read about the history of binomial theorem.",
              academic_standard: "Intermediate Mathematics",
              resource_id: {
                label: "Binomial Theorem Overview",
                url: "https://en.wikipedia.org/wiki/Binomial_theorem",
              },
            },
          ],
          gate: {
            gate_id: "gate-001",
            title: "Stage 1 Review",
            description: "Assess understanding of basic binomial concepts.",
            checklist: [
              "Complete research task",
              "Watch tutorial video",
              "Quiz on basic concepts",
            ],
          },
        },
      ],
    },
    {
      project_id: "proj-002",
      project_title: "Probability and Statistics Project",
      description: "Hands-on project to learn statistics and probability.",
      subject_domain: "Mathematics",
      stages: [
        {
          stage_id: "stage-101",
          stage_order: 1,
          title: "Basics of Probability",
          tasks: [
            {
              task_id: "task-101",
              title: "What is Probability?",
              description: "Understand simple probability with examples.",
              academic_standard: "Basic Mathematics",
              resource_id: {
                label: "Intro to Probability",
                url: "https://www.khanacademy.org/math/statistics-probability",
              },
            },
          ],
          gate: {
            gate_id: "gate-101",
            title: "Probability Gate",
            description: "Evaluate understanding of probability concepts.",
            checklist: [
              "Read intro materials",
              "Solve basic problems",
              "Complete quiz",
            ],
          },
        },
      ],
    },
    {
      project_id: "proj-003",
      project_title: "Algebraic Expressions Project",
      description: "Interactive project to simplify and explore expressions.",
      subject_domain: "Algebra",
      stages: [
        {
          stage_id: "stage-201",
          stage_order: 1,
          title: "Simplifying Expressions",
          tasks: [
            {
              task_id: "task-201",
              title: "Like Terms",
              description: "Learn how to combine like terms.",
              academic_standard: "Algebra I",
              resource_id: {
                label: "Khan Academy - Like Terms",
                url: "https://www.khanacademy.org/math/algebra/intro-to-algebra",
              },
            },
          ],
          gate: {
            gate_id: "gate-201",
            title: "Algebra Gate",
            description: "Test your knowledge of simplifying expressions.",
            checklist: [
              "Complete practice set",
              "Submit worksheet",
              "Take mini quiz",
            ],
          },
        },
      ],
    },
    {
      project_id: "proj-004",
      project_title: "Geometry in Real Life",
      description: "Discover how geometry is used in architecture and art.",
      subject_domain: "Geometry",
      stages: [
        {
          stage_id: "stage-301",
          stage_order: 1,
          title: "Shapes in the World",
          tasks: [
            {
              task_id: "task-301",
              title: "Explore Real-Life Shapes",
              description: "Take photos of geometric shapes in buildings.",
              academic_standard: "Geometry",
              resource_id: {
                label: "Geometry Examples",
                url: "https://www.nationalgeographic.com/architecture-geometry",
              },
            },
          ],
          gate: {
            gate_id: "gate-301",
            title: "Geometry Gate",
            description: "Submit shape observations and reflections.",
            checklist: [
              "Take 5 photos",
              "Write short reflection",
              "Submit assignment",
            ],
          },
        },
      ],
    },
  ];
}
