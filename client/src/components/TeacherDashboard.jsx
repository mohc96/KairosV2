import React from 'react';
import StudentSubmissions from './StudentSubmissions';

export default function TeacherDashboard({ email }) {
  const studentsData = [
    {
      "student": "john@gmail.com",
      "FirstName": "John",
      "Lastname": "Doe",
      "Status": "Pending for Approval",
      "Project": {
        "project_title": "Statistical Analysis of Mean, Median, Mode",
        "description": "Developing an interactive web application to explain and visualize the concepts of mean, median, and mode in mathematics.",
        "subject_domain": "Mathematics",
        "stages": [
          {
            "stage_id": "1f327fb1-00b6-4de8-b7dc-4498ef6b1d03",
            "stage_order": 1,
            "title": "Conceptualization and Planning",
            "tasks": [
              {
                "task_id": "d886e0b9-cf90-4693-89e3-2c636d52ff86",
                "title": "Research on Mean, Median, Mode",
                "description": "Gather information and resources on the definitions and calculations of mean, median, and mode.",
                "academic_standard": "Mathematics Curriculum Standards",
                "resource_id": {
                  "label": "Mathematics Definitions",
                  "url": "https://www.mathsisfun.com/definitions/index.html"
                }
              },
              {
                "task_id": "fbf29c27-a559-4800-9a5e-0a9c4b4c4af8",
                "title": "Create Wireframes",
                "description": "Sketch out the initial design and user flow of the application.",
                "academic_standard": "Web & User Experience Design Principles",
                "resource_id": {
                  "label": "Wireframing Tools",
                  "url": "https://www.figma.com/"
                }
              }
            ],
            "gate": {
              "gate_id": "88e57f33-4a2a-405b-8ac9-b4fd67fb8c93",
              "title": "Concept Approval",
              "description": "Review the conceptualization and planning stage for approval.",
              "checklist": [
                "Research completed",
                "Wireframes approved"
              ]
            }
          },
          {
            "stage_id": "99344858-4e1f-4f10-814e-07b547ae664c",
            "stage_order": 2,
            "title": "Development",
            "tasks": [
              {
                "task_id": "a95ea159-0891-46cb-8da7-76621d58a554",
                "title": "Frontend Development",
                "description": "Implement the frontend of the web application using React and JavaScript.",
                "academic_standard": "Programming and Web Development Practices",
                "resource_id": {
                  "label": "React Documentation",
                  "url": "https://reactjs.org/docs/getting-started.html"
                }
              },
              {
                "task_id": "b85fa269-1a92-47db-9ea8-87731e69c665",
                "title": "Backend Integration",
                "description": "Develop and integrate API endpoints for data processing and calculations.",
                "academic_standard": "Programming and Web Development Practices",
                "resource_id": {
                  "label": "API Development Guide",
                  "url": "https://developer.mozilla.org/en-US/docs/Web/API"
                }
              }
            ],
            "gate": {
              "gate_id": "61eaf242-ee20-4e80-8756-40ddea302e17",
              "title": "Development Completion",
              "description": "Ensure all development tasks are completed and functional.",
              "checklist": [
                "Frontend implemented",
                "API integrated",
                "Basic testing completed"
              ]
            }
          },
          {
            "stage_id": "c7458962-3f1e-4b20-9c5d-1a2b3c4d5e6f",
            "stage_order": 3,
            "title": "Testing and Deployment",
            "tasks": [
              {
                "task_id": "d7569073-4g2f-5c31-ad6e-2b3c4d5e6f7g",
                "title": "User Testing",
                "description": "Conduct user testing sessions to gather feedback on the application's usability and functionality.",
                "academic_standard": "User Experience Testing Standards",
                "resource_id": {
                  "label": "User Testing Guidelines",
                  "url": "https://www.usability.gov/how-to-and-tools/methods/usability-testing.html"
                }
              },
              {
                "task_id": "e8670184-5h3g-6d42-be7f-3c4d5e6f7g8h",
                "title": "Application Deployment",
                "description": "Deploy the application to a web hosting platform and ensure it's accessible to users.",
                "academic_standard": "Web Deployment Best Practices",
                "resource_id": {
                  "label": "Deployment Guide",
                  "url": "https://docs.netlify.com/site-deploys/overview/"
                }
              }
            ],
            "gate": {
              "gate_id": "f9781295-6i4h-7e53-cf8g-4d5e6f7g8h9i",
              "title": "Project Completion",
              "description": "Final review and approval of the completed project.",
              "checklist": [
                "User testing completed",
                "Application successfully deployed",
                "Documentation finalized"
              ]
            }
          }
        ]
      }
    },
    {
      "student": "jane@gmail.com",
      "FirstName": "Jane",
      "Lastname": "Hoper",
      "Status": "Pending for Approval",
      "Project": {
        "project_title": "Photosynthesis Explained",
        "description": "An educational project aimed at explaining the process of photosynthesis in plants",
        "subject_domain": "Science",
        "stages": [
          {
            "stage_id": "ee9f6b54-85d5-4c16-b071-cf57a554ceae",
            "stage_order": 1,
            "title": "Introduction to Photosynthesis",
            "tasks": [
              {
                "task_id": "aa246f0f-6537-442b-a944-b374853faa46",
                "title": "Research on Photosynthesis",
                "description": "Gather information about the process of photosynthesis in plants",
                "academic_standard": "Botany 101",
                "resource_id": {
                  "label": "Photosynthesis Basics",
                  "url": "https://www.botany.com/photosynthesis"
                }
              },
              {
                "task_id": "bb357g1g-7648-553c-b055-c485964gbb57",
                "title": "Understanding Light-Dependent Reactions",
                "description": "Study the light-dependent reactions that occur in the thylakoids of chloroplasts",
                "academic_standard": "Plant Biology Standards",
                "resource_id": {
                  "label": "Light Reactions Guide",
                  "url": "https://www.khanacademy.org/science/biology/photosynthesis-in-plants"
                }
              }
            ],
            "gate": {
              "gate_id": "33de78dc-386a-4e34-93a2-2d82128956f8",
              "title": "Research Completion Check",
              "description": "Ensure all information is accurate and up to date",
              "checklist": [
                "Verify sources",
                "Cross-check data",
                "Complete concept understanding"
              ]
            }
          },
          {
            "stage_id": "ff0g7c65-96e6-5d27-c182-dg68b665dfbf",
            "stage_order": 2,
            "title": "Experimental Design",
            "tasks": [
              {
                "task_id": "cc468h2h-8759-664d-c166-d596075hcc68",
                "title": "Design Photosynthesis Experiment",
                "description": "Create an experimental setup to demonstrate photosynthesis using aquatic plants",
                "academic_standard": "Scientific Method Standards",
                "resource_id": {
                  "label": "Plant Experiment Designs",
                  "url": "https://www.exploratorium.edu/gardening/activities"
                }
              },
              {
                "task_id": "dd579i3i-9860-775e-d277-e607186idd79",
                "title": "Prepare Materials and Equipment",
                "description": "Gather all necessary materials including plants, light sources, and measurement tools",
                "academic_standard": "Laboratory Safety Standards",
                "resource_id": {
                  "label": "Lab Equipment Guide",
                  "url": "https://www.carolina.com/teacher-resources/Interactive/photosynthesis-lab"
                }
              }
            ],
            "gate": {
              "gate_id": "gg1h8d76-a7f7-6e38-e293-fg79c776egcg",
              "title": "Experiment Approval",
              "description": "Review and approve the experimental design and safety protocols",
              "checklist": [
                "Experimental design reviewed",
                "Safety protocols established",
                "Materials inventory completed"
              ]
            }
          }
        ]
      }
    },
    {
      "student": "frank@gmail.com",
      "FirstName": "Frank",
      "Lastname": "Cooper",
      "Status": "Pending for Approval",
      "Project": {
        "project_title": "Tyndall Effect Study",
        "description": "Investigating the Tyndall Effect phenomenon in science education",
        "subject_domain": "Science",
        "stages": [
          {
            "stage_id": "e6f4e2ef-7e68-42e1-9d67-2cb4af7da435",
            "stage_order": 1,
            "title": "Introduction to Tyndall Effect",
            "tasks": [
              {
                "task_id": "1de16f4f-9dbc-4094-a9dc-3f1dfd22701b",
                "title": "Overview of Tyndall Effect",
                "description": "Understand the principles and applications of the Tyndall Effect",
                "academic_standard": "Science Curriculum Standards",
                "resource_id": {
                  "label": "Tyndall Effect Overview",
                  "url": "https://www.scienceabc.com/physics/tyndall-effect-definition-with-explanation-and-examples.html"
                }
              },
              {
                "task_id": "2ef27g5g-aecd-5105-ba4d-4g2gge33812c",
                "title": "Study Light Scattering Principles",
                "description": "Research the physics behind light scattering in colloidal solutions and suspensions",
                "academic_standard": "Physics Standards - Light and Optics",
                "resource_id": {
                  "label": "Light Scattering Physics",
                  "url": "https://www.physics.org/article-questions.asp?id=51"
                }
              }
            ],
            "gate": {
              "gate_id": "cc195f6a-24a0-490e-bf8c-d8b45b0ec537",
              "title": "Completion of Introduction Stage",
              "description": "Ensure understanding of the basic concepts of Tyndall Effect",
              "checklist": [
                "Review of Tyndall Effect materials",
                "Completion of introductory experiments",
                "Understanding of light scattering concepts"
              ]
            }
          },
          {
            "stage_id": "f7g5f3f0-8f79-53f2-ae78-3dc5bg8eb546",
            "stage_order": 2,
            "title": "Practical Applications Study",
            "tasks": [
              {
                "task_id": "3fg38h6h-bfde-6216-cb5e-5h3hgf44923d",
                "title": "Real-world Examples Research",
                "description": "Identify and document real-world examples of the Tyndall Effect in nature and technology",
                "academic_standard": "Applied Science Standards",
                "resource_id": {
                  "label": "Tyndall Effect Applications",
                  "url": "https://www.britannica.com/science/Tyndall-effect"
                }
              },
              {
                "task_id": "4gh49i7i-cgef-7327-dc6f-6i4ihg55034e",
                "title": "Create Demonstration Models",
                "description": "Build physical models to demonstrate the Tyndall Effect using common materials",
                "academic_standard": "Hands-on Learning Standards",
                "resource_id": {
                  "label": "DIY Science Demonstrations",
                  "url": "https://www.stevespanglerscience.com/lab/experiments"
                }
              }
            ],
            "gate": {
              "gate_id": "hh2i9e87-35b1-5b1f-fg9d-e9c6dh9fh648",
              "title": "Application Understanding Gate",
              "description": "Verify comprehensive understanding of Tyndall Effect applications",
              "checklist": [
                "Real-world examples documented",
                "Demonstration models completed",
                "Ability to explain practical applications"
              ]
            }
          }
        ]
      }
    }
  ];
  const handleStatusChange = (studentId, newStatus) => {
    // Handle status change at the dashboard level if needed
    console.log(`Student ${studentId} status changed to ${newStatus}`);
  };
  return (
    <div className="space-y-4 p-2">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Teacher Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome, {email}. Manage and export your students' project data below.
        </p>
      </div>
      
          <StudentSubmissions 
      studentsData={studentsData} 
      onStatusChange={handleStatusChange}
    />
    </div>
  );
}