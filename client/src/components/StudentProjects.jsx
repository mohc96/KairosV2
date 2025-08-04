import React, { useState, useEffect } from 'react';
import {
  FolderOpen, ChevronDown, ChevronRight, Eye, BookOpen, 
  CheckCircle, Clock, Target, ExternalLink, Search, Filter
} from 'lucide-react';


export default function StudentProjects() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedStages, setExpandedStages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MOCK_PROJECTS = [
    {
    "project_id": "1",
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
      "project_id": "2",
      "project_title": "Binomial Theorem Exploration",
      "description": "A project to explore the concepts and applications of the binomial theorem in Mathematics.",
      "subject_domain": "Mathematics",
      "stages": [
        {
          "stage_id": "c2375e72-439e-11ec-82a8-0242ac130003",
          "stage_order": 1,
          "title": "Introduction to Binomial Theorem",
          "tasks": [
            {
              "task_id": "c23760b8-439e-11ec-82a8-0242ac130003",
              "title": "Research Binomial Theorem",
              "description": "Study the history and fundamentals of the binomial theorem",
              "academic_standard": "Mathematics Education",
              "resource_id": {
                "label": "Binomial Theorem - Wikipedia",
                "url": "https://en.wikipedia.org/wiki/Binomial_theorem"
              }
            },
            {
              "task_id": "c2827ee4-439e-11ec-82a8-0242ac130003",
              "title": "Watch Video on Binomial Theorem",
              "description": "View an educational video explaining the binomial theorem concept",
              "academic_standard": "Mathematics Education",
              "resource_id": {
                "label": "Khan Academy - Binomial Theorem",
                "url": "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:binomial-theorem"
              }
            }
          ],
          "gate": {
            "gate_id": "c2caa03a-439e-11ec-82a8-0242ac130003",
            "title": "Understanding the Basics",
            "description": "Pass this gate after completing tasks related to the basic understanding of the binomial theorem",
            "checklist": [
              "Research completed",
              "Video watched"
            ]
          }
        },
        {
          "stage_id": "c26a4ad0-439e-11ec-82a8-0242ac130003",
          "stage_order": 2,
          "title": "Advanced Applications",
          "tasks": [
            {
              "task_id": "c2979d54-439e-11ec-82a8-0242ac130003",
              "title": "Solve Binomial Problems",
              "description": "Practice solving problems using the binomial theorem",
              "academic_standard": "Mathematics Education",
              "resource_id": {
                "label": "Binomial Theorem Practice Problems",
                "url": "https://www.mathopolis.com/questions/practice_intro.php?cid=21&sid=84"
              }
            }
          ],
          "gate": {
            "gate_id": "c2f14d6e-439e-11ec-82a8-0242ac130003",
            "title": "Mastering Applications",
            "description": "Pass this gate after demonstrating proficiency in solving binomial problems",
            "checklist": [
              "Problems solved accurately"
            ]
          }
        },
        {
          "stage_id": "c2836af4-439e-11ec-82a8-0242ac130003",
          "stage_order": 3,
          "title": "Real-world Implementations",
          "tasks": [
            {
              "task_id": "c24e0c46-439e-11ec-82a8-0242ac130003",
              "title": "Research Binomial Theorem in Real-world Scenarios",
              "description": "Investigate how the binomial theorem is applied in various real-world situations",
              "academic_standard": "Mathematics Education",
              "resource_id": {
                "label": "Real-life Examples of Binomial Theorem",
                "url": "https://www.onlinemath4all.com/real-life-applications-of-the-binomial-theorem.html"
              }
            }
          ],
          "gate": {
            "gate_id": "c2cf443a-439e-11ec-82a8-0242ac130003",
            "title": "Real-world Understanding",
            "description": "Pass this gate after exploring real-world applications of the binomial theorem",
            "checklist": [
              "Research on real-world applications"
            ]
          }
        },
        {
          "stage_id": "c2548b2e-439e-11ec-82a8-0242ac130003",
          "stage_order": 4,
          "title": "Project Conclusion",
          "tasks": [
            {
              "task_id": "c276cfa0-439e-11ec-82a8-0242ac130003",
              "title": "Create Binomial Theorem Presentation",
              "description": "Prepare and deliver a presentation summarizing the key learnings about the binomial theorem",
              "academic_standard": "Mathematics Education",
              "resource_id": {
                "label": "Presentation Tips and Tricks",
                "url": "https://www.skillsyouneed.com/presentation-tips.html"
              }
            }
          ],
          "gate": {
            "gate_id": "c2de58ce-439e-11ec-82a8-0242ac130003",
            "title": "Project Completion",
            "description": "Successfully conclude the project by delivering the final presentation",
            "checklist": [
              "Presentation prepared and delivered"
            ]
          }
        }
      ]
    },
    {
      "project_id": "3",
      "project_title": "Screenwriting and Character Development Workshop",
      "description": "A project focused on learning screenwriting and character development techniques from Shakespeare's works.",
      "subject_domain": "English",
      "stages": [
        {
          "stage_id": "0c89de44-5a8f-4d90-ae1e-ba75ac21e158",
          "stage_order": 1,
          "title": "Introduction to Screenwriting",
          "tasks": [
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815493",
              "title": "Introduction to Screenwriting Basics",
              "description": "Understand the fundamentals of screenwriting and its importance in storytelling.",
              "academic_standard": "Screenwriting 101",
              "resource_id": {
                "label": "Screenwriting Basics",
                "url": "https://www.masterclass.com/articles/how-to-write-a-screenplay-a-guide-to-screenwriting"
              }
            },
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815494",
              "title": "Analyzing Shakespeare's Screenwriting Style",
              "description": "Study Shakespeare's plays to analyze his unique screenwriting style and techniques.",
              "academic_standard": "Literature Analysis",
              "resource_id": {
                "label": "Shakespeare Screenwriting Analysis",
                "url": "https://www.britannica.com/art/dramatic-literature/Screenwriting"
              }
            }
          ],
          "gate": {
            "gate_id": "1b33f1dd-d5ab-4c4c-9456-475c2d072c2b",
            "title": "Checkpoint 1: Understanding Screenwriting Basics",
            "description": "Ensure understanding of basic screenwriting principles and concepts.",
            "checklist": [
              "Completed Introduction to Screenwriting Basics task",
              "Analyzed Shakespeare's screenwriting style"
            ]
          }
        },
        {
          "stage_id": "f6420384-45e9-4c43-bc68-0f2f2ae1fbbd",
          "stage_order": 2,
          "title": "Character Development Exploration",
          "tasks": [
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815495",
              "title": "Understanding Character Arcs",
              "description": "Learn about character development, arcs, and growth in storytelling.",
              "academic_standard": "Character Development",
              "resource_id": {
                "label": "Character Arcs in Film",
                "url": "https://nofilmschool.com/character-arcs-guide"
              }
            },
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815496",
              "title": "Shakespearean Characters Deconstruction",
              "description": "Deconstruct Shakespearean characters to understand their complexities and depth.",
              "academic_standard": "Literary Character Analysis",
              "resource_id": {
                "label": "Shakespearean Characters",
                "url": "https://blog.udemy.com/shakespeare-characters/"
              }
            }
          ],
          "gate": {
            "gate_id": "7e71acdd-0014-4477-93f3-77b10310fbf6",
            "title": "Checkpoint 2: Mastering Character Development",
            "description": "Demonstrate understanding of character arcs and complexities in character development.",
            "checklist": [
              "Completed Understanding Character Arcs task",
              "Deconstructed Shakespearean characters"
            ]
          }
        },
        {
          "stage_id": "b4ce119c-f5b8-4497-8c26-1c25115a9cb3",
          "stage_order": 3,
          "title": "Putting Theory into Practice",
          "tasks": [
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815497",
              "title": "Script Writing Exercise",
              "description": "Write a short script applying learned screenwriting and character development techniques.",
              "academic_standard": "Script Writing",
              "resource_id": {
                "label": "Script Writing Tips",
                "url": "https://www.writersstore.com/10-rules-for-writing-scripts/"
              }
            },
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815498",
              "title": "Peer Review and Feedback",
              "description": "Participate in peer review sessions to improve scriptwriting skills.",
              "academic_standard": "Collaborative Feedback",
              "resource_id": {
                "label": "Peer Review Guidelines",
                "url": "https://grammarly.com/blog/peer-review/"
              }
            }
          ],
          "gate": {
            "gate_id": "1b82ef82-66eb-4aa4-ba83-04ebd6ef7177",
            "title": "Checkpoint 3: Scriptwriting Proficiency",
            "description": "Showcase ability to apply screenwriting and character development techniques in scriptwriting.",
            "checklist": [
              "Completed Script Writing Exercise",
              "Participated in Peer Review sessions"
            ]
          }
        },
        {
          "stage_id": "f1c0eb19-6113-49ab-a624-b586cef343cc",
          "stage_order": 4,
          "title": "Culmination and Presentation",
          "tasks": [
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815499",
              "title": "Final Script Preparation",
              "description": "Refine the script based on feedback and prepare for final presentation.",
              "academic_standard": "Presentation Skills",
              "resource_id": {
                "label": "Presentation Tips",
                "url": "https://business.tutsplus.com/articles/10-slide-design-tips-for-producing-powerful-and-effective-presentations--cms-30986"
              }
            },
            {
              "task_id": "f8d2b065-c1af-4a8c-9a2a-ec7ea4815500",
              "title": "Project Showcase",
              "description": "Present the final script to peers and receive feedback for further improvement.",
              "academic_standard": "Project Presentation",
              "resource_id": {
                "label": "Project Presentation Guide",
                "url": "https://www.haikudeck.com/presentation-making-guide"
              }
            }
          ],
          "gate": {
            "gate_id": "cc6f69b3-9f57-4496-865b-52ec2f6392dd",
            "title": "Final Gate: Script Pitch Presentation",
            "description": "Pitch the final script with proficient screenwriting and character development elements.",
            "checklist": [
              "Prepared Final Script",
              "Successfully Presented Project Showcase"
            ]
          }
        }
      ]
    },
    {
      "project_id": "4",
      "project_title": "Psychological Effects Post World War 2",
      "description": "Exploring the psychological impact on people from nations involved in World War 2",
      "subject_domain": "History",
      "stages": [
        {
          "stage_id": "4b9e8c9d-33c9-486c-8560-97bcf5c6749d",
          "stage_order": 1,
          "title": "Research",
          "tasks": [
            {
              "task_id": "f5d39c7a-02b5-4a50-89b6-0d907e5c234c",
              "title": "Compile historical data",
              "description": "Gather information and data on the psychological effects post World War 2",
              "academic_standard": "Historical Research",
              "resource_id": {
                "label": "Library Archives",
                "url": "https://www.archives.gov/"
              }
            },
            {
              "task_id": "3c804ad1-2b97-41b4-923d-5c73fbd8f1e5",
              "title": "Conduct interviews",
              "description": "Interview experts and survivors to understand first-hand experiences",
              "academic_standard": "Primary Research",
              "resource_id": {
                "label": "Interview Guidelines",
                "url": "https://www.psychological_research.org/interview-guidelines"
              }
            }
          ],
          "gate": {
            "gate_id": "5e377f72-99c7-45c7-a4b4-82ac3543d74e",
            "title": "Research Review",
            "description": "Evaluate the gathered data for relevance and accuracy",
            "checklist": [
              "Data Compilation",
              "Interview Analysis"
            ]
          }
        },
        {
          "stage_id": "e2b4e2db-1c14-40f4-8e54-9b5341f0214b",
          "stage_order": 2,
          "title": "Analysis",
          "tasks": [
            {
              "task_id": "46e34899-77b8-41ff-b057-47b54b900138",
              "title": "Identify patterns",
              "description": "Analyze the data to identify common psychological patterns",
              "academic_standard": "Data Analysis",
              "resource_id": {
                "label": "Analytical Tools",
                "url": "https://www.analytics.com/tools"
              }
            },
            {
              "task_id": "fac1f7cd-7bc6-4191-8103-b730b961f384",
              "title": "Summarize findings",
              "description": "Create a summary report outlining the key psychological effects observed",
              "academic_standard": "Report Writing",
              "resource_id": {
                "label": "Report Writing Guide",
                "url": "https://www.writingguidelines.org/report-writing"
              }
            }
          ],
          "gate": {
            "gate_id": "8d6b0496-7711-4781-939c-8fd96e6beab2",
            "title": "Analysis Presentation",
            "description": "Prepare a presentation to share the analyzed findings",
            "checklist": [
              "Pattern Identification",
              "Report Summary"
            ]
          }
        },
        {
          "stage_id": "b9c7f5db-6721-4291-8f1f-37f624d7e312",
          "stage_order": 3,
          "title": "Validation",
          "tasks": [
            {
              "task_id": "cebeb003-5d6e-4d2a-89ff-6fe68d2c43b7",
              "title": "Peer review",
              "description": "Have experts in the field review and validate the analysis",
              "academic_standard": "Peer Validation",
              "resource_id": {
                "label": "Peer Review Guidelines",
                "url": "https://www.researchpeerreview.org/guidelines"
              }
            },
            {
              "task_id": "14ed84d8-6f7b-4ae8-8d77-5d56f7b5b5f6",
              "title": "Feedback incorporation",
              "description": "Incorporate feedback from peers to enhance the validity of the findings",
              "academic_standard": "Feedback Integration",
              "resource_id": {
                "label": "Feedback Integration Methods",
                "url": "https://www.feedbackmethods.org/integration"
              }
            }
          ],
          "gate": {
            "gate_id": "c2f0cd98-0795-42d5-8194-f28c75b8d844",
            "title": "Validation Approval",
            "description": "Approval of the validated analysis for final presentation",
            "checklist": [
              "Peer Review Feedback",
              "Incorporation Completion"
            ]
          }
        },
        {
          "stage_id": "bd8a5b81-efc2-432c-ba15-be30a84433c4",
          "stage_order": 4,
          "title": "Presentation",
          "tasks": [
            {
              "task_id": "a3e94ed4-e691-4190-9946-2b703974d91d",
              "title": "Create presentation slides",
              "description": "Develop visually engaging slides to present the findings",
              "academic_standard": "Presentation Design",
              "resource_id": {
                "label": "Presentation Templates",
                "url": "https://www.presentationtemplates.com/designs"
              }
            },
            {
              "task_id": "e47b772d-951f-4920-bb96-d26b0536e84a",
              "title": "Practice presentation",
              "description": "Rehearse the presentation for effective delivery",
              "academic_standard": "Presentation Skills",
              "resource_id": {
                "label": "Presentation Tips",
                "url": "https://www.presentationtips.org/delivery"
              }
            }
          ],
          "gate": {
            "gate_id": "f3406b3c-a860-4c6d-8157-f1838181cb19",
            "title": "Final Presentation",
            "description": "Deliver the final presentation on the psychological effects post World War 2",
            "checklist": [
              "Slide Creation",
              "Presentation Practice"
            ]
          }
        }
      ]
    },
    {
      "project_id": "5",
      "project_title": "Exploring Vincent van Gogh and Edward Hopper: Inspirations, Similarities, and Thoughts",
      "description": "This project aims to delve deeper into the lives of Vincent van Gogh and Edward Hopper, exploring their inspirations, similarities, and thoughts to gain a better understanding of their art.",
      "subject_domain": "Art",
      "stages": [
        {
          "stage_id": "1a5f7eb9-b17a-42c9-9a26-6141e29b7f37",
          "stage_order": 1,
          "title": "Research on Vincent van Gogh",
          "tasks": [
            {
              "task_id": "4a715e99-3b38-4441-8f15-73b6f1c93c48",
              "title": "Biographical Research on Vincent van Gogh",
              "description": "Conduct in-depth research on the life, influences, and key artworks of Vincent van Gogh.",
              "academic_standard": "Art History",
              "resource_id": {
                "label": "Vincent van Gogh Biography",
                "url": "https://www.vangoghgallery.com/"
              }
            },
            {
              "task_id": "5d854f15-af4d-4033-989e-2237af9e6e65",
              "title": "Artistic Style Analysis",
              "description": "Analyze the artistic style, techniques, and themes prevalent in the works of Vincent van Gogh.",
              "academic_standard": "Art Analysis",
              "resource_id": {
                "label": "Vincent van Gogh Artworks",
                "url": "https://www.vangoghmuseum.nl/en/"
              }
            }
          ],
          "gate": {
            "gate_id": "16b17507-0572-41b7-a44a-ba25579b0895",
            "title": "Vincent van Gogh Research Gate",
            "description": "Complete the research tasks and compile findings for review.",
            "checklist": [
              "Biographical research completed",
              "Artistic style analysis completed"
            ]
          }
        },
        {
          "stage_id": "783ead9e-8f25-4992-8570-75d3e32b5646",
          "stage_order": 2,
          "title": "Research on Edward Hopper",
          "tasks": [
            {
              "task_id": "dbf06b8e-fe84-4b5a-a92c-067133d65c43",
              "title": "Biographical Research on Edward Hopper",
              "description": "Conduct detailed research on the life, influences, and notable works of Edward Hopper.",
              "academic_standard": "Art History",
              "resource_id": {
                "label": "Edward Hopper Biography",
                "url": "https://www.artsy.net/artist/edward-hopper"
              }
            },
            {
              "task_id": "b6032159-45c1-4c65-8e40-7e591953f056",
              "title": "Artistic Comparison with Vincent van Gogh",
              "description": "Compare and contrast the artistic styles and themes of Edward Hopper with Vincent van Gogh.",
              "academic_standard": "Art Analysis",
              "resource_id": {
                "label": "Edward Hopper Artworks",
                "url": "https://www.edwardhopper.net/"
              }
            }
          ],
          "gate": {
            "gate_id": "ae23691b-121c-4d73-9347-aa2dd59e7252",
            "title": "Edward Hopper Research Gate",
            "description": "Completion of biographical research and comparison task for Edward Hopper.",
            "checklist": [
              "Biographical research on Edward Hopper completed",
              "Artistic comparison with Vincent van Gogh completed"
            ]
          }
        },
        {
          "stage_id": "ce24b0fa-21c3-40d7-8d79-15c2a376c9f8",
          "stage_order": 3,
          "title": "Identifying Inspirations and Similarities",
          "tasks": [
            {
              "task_id": "ec96c80d-e54f-4aa9-b6d0-71fe4b8a2a0a",
              "title": "Identify Inspirations behind Artworks",
              "description": "Research and present the key inspirations and influences that shaped the art of van Gogh and Hopper.",
              "academic_standard": "Art Analysis",
              "resource_id": {
                "label": "Artistic Inspirations",
                "url": "https://www.metmuseum.org/"
              }
            },
            {
              "task_id": "f5cfe088-15ce-4db2-81f4-32863b9f7d27",
              "title": "Highlighting Similarities in Artistic Expression",
              "description": "Explore and document the similarities in the artistic expression and themes of van Gogh and Hopper.",
              "academic_standard": "Art Analysis",
              "resource_id": {
                "label": "Artistic Similarities",
                "url": "https://www.nga.gov/"
              }
            }
          ],
          "gate": {
            "gate_id": "789b5a3a-0abc-4df7-8aad-171ad632b281",
            "title": "Inspirations and Similarities Gate",
            "description": "Present findings on inspirations and similarities between van Gogh and Hopper.",
            "checklist": [
              "Inspirations research completed",
              "Similarities analysis documented"
            ]
          }
        },
        {
          "stage_id": "b16f06d3-4a2f-4cd3-9c6f-b66a93e3bbf6",
          "stage_order": 4,
          "title": "Final Presentation and Reflection",
          "tasks": [
            {
              "task_id": "1340f60c-6477-4bc3-bc5d-007c5057cdeb",
              "title": "Prepare Final Presentation",
              "description": "Compile the research findings and analysis into a final presentation.",
              "academic_standard": "Presentation Skills",
              "resource_id": {
                "label": "Presentation Tips",
                "url": "https://www.presentationzen.com/"
              }
            },
            {
              "task_id": "746b5bfa-1629-4130-8f4e-0e752b8faa3e",
              "title": "Reflective Study on Artistic Journey",
              "description": "Reflect on the insights gained from studying the artworks of van Gogh and Hopper.",
              "academic_standard": "Art Critique",
              "resource_id": {
                "label": "Art Reflection Guide",
                "url": "https://www.artworkarchive.com/blog/the-artists-guide-to-journaling"
              }
            }
          ],
          "gate": {
            "gate_id": "b7331417-6881-403d-9da8-609de99161e0",
            "title": "Final Presentation Gate",
            "description": "Prepare and deliver the final presentation on van Gogh and Hopper.",
            "checklist": [
              "Final presentation prepared",
              "Artistic journey reflection completed"
            ]
          }
        }
      ]
    },
    {
      "project_id": "6",
      "project_title": "Effects of Artificial Intelligence on the Job Market",
      "description": "Investigating the impacts of Artificial Intelligence on existing jobs and exploring the emergence of new job opportunities.",
      "subject_domain": "Technology",
      "stages": [
        {
          "stage_id": "907591ad-521d-4d9b-937a-dc03a80b00f7",
          "stage_order": 1,
          "title": "Research on AI in Job Market",
          "tasks": [
            {
              "task_id": "ea3cccff-af3c-4985-9619-8c995552dbcf",
              "title": "Gather Data on Current AI Implementation in Jobs",
              "description": "Research how AI is currently being used in various industries and its impact on job roles.",
              "academic_standard": "AI Research Standards",
              "resource_id": {
                "label": "AI Implementation in Job Market",
                "url": "https://www.example.com/ai-implementation-job-market"
              }
            },
            {
              "task_id": "06a073b7-d1fe-4328-b65f-965fd92c7499",
              "title": "Identify Job Sectors Most Affected by AI",
              "description": "Analyze which job sectors are most susceptible to automation and changes due to AI.",
              "academic_standard": "AI Impact Analysis",
              "resource_id": {
                "label": "Job Sectors Affected by AI",
                "url": "https://www.example.com/job-sectors-ai-impact"
              }
            }
          ],
          "gate": {
            "gate_id": "e2969b04-f030-48df-ba0a-b0329b30dea2",
            "title": "Research Review",
            "description": "Review of collected data and initial findings from the AI job market research.",
            "checklist": [
              "Data Collection Completed",
              "Initial Analysis Conducted",
              "Findings Documented"
            ]
          }
        },
        {
          "stage_id": "6fcb8132-6f5c-46f1-8179-94cdd812adcb",
          "stage_order": 2,
          "title": "Future Job Prospects with AI Advancements",
          "tasks": [
            {
              "task_id": "53584f8f-f651-4b4f-a8da-876dc8f94e98",
              "title": "Research on New Jobs Created by AI",
              "description": "Investigate the new job roles and opportunities emerging with advancements in AI technology.",
              "academic_standard": "AI Job Evolution",
              "resource_id": {
                "label": "New Jobs with AI",
                "url": "https://www.example.com/new-jobs-ai"
              }
            },
            {
              "task_id": "bdc76067-9d7d-45d0-9ed0-708937f72642",
              "title": "Skills Required for Future AI Jobs",
              "description": "Identify the skills and qualifications needed for jobs evolving with AI.",
              "academic_standard": "Future Job Skills",
              "resource_id": {
                "label": "AI Job Skills",
                "url": "https://www.example.com/ai-job-skills"
              }
            }
          ],
          "gate": {
            "gate_id": "9f91d134-33d8-4cff-a6e3-38be6f382957",
            "title": "Future Job Analysis",
            "description": "Assessment of the potential new job landscape influenced by AI advancements.",
            "checklist": [
              "New Jobs Research Completed",
              "Skills Mapping Done",
              "Report Prep for Presentation"
            ]
          }
        },
        {
          "stage_id": "c6b847ab-3726-4309-8494-0a9fc632d07e",
          "stage_order": 3,
          "title": "Impacts on Existing Job Market",
          "tasks": [
            {
              "task_id": "f221cb52-2650-4370-94d2-c9ec04052dfb",
              "title": "Assess AI Displacement Effects",
              "description": "Evaluate the displacement effects of AI on traditional job roles and industries.",
              "academic_standard": "Job Disruption Analysis",
              "resource_id": {
                "label": "AI Displacement Effects",
                "url": "https://www.example.com/ai-displacement-effects"
              }
            },
            {
              "task_id": "401fdff1-94f5-41e9-8754-f989ce186dca",
              "title": "Recommendations for Job Market Sustainability",
              "description": "Provide recommendations to sustain the job market amidst AI disruptions.",
              "academic_standard": "Sustainable Workforce",
              "resource_id": {
                "label": "Job Market Sustainability",
                "url": "https://www.example.com/job-market-sustainability"
              }
            }
          ],
          "gate": {
            "gate_id": "4a8f1f81-3b32-4dee-b938-4cd6f8b55c24",
            "title": "Disruption Analysis",
            "description": "Analysis of the impacts of AI-induced disruptions on the existing job market.",
            "checklist": [
              "Displacement Assessment Completed",
              "Recommendations Drafted",
              "Sustainability Plan Outlined"
            ]
          }
        },
        {
          "stage_id": "9e7067a1-97c8-4a01-8ca4-1d0728b6a482",
          "stage_order": 4,
          "title": "Final Report and Presentation",
          "tasks": [
            {
              "task_id": "b4eaa2a2-9a21-43ee-8369-33e3a96e4460",
              "title": "Compile Research Findings",
              "description": "Collate all research findings and analysis into a comprehensive report.",
              "academic_standard": "Research Reporting",
              "resource_id": {
                "label": "AI Research Report",
                "url": "https://www.example.com/ai-research-report"
              }
            },
            {
              "task_id": "07aa2e7b-4bc7-4dd1-994b-ec0b705efc23",
              "title": "Prepare Presentation on Job Market Insights",
              "description": "Create a presentation summarizing the key insights on AI impacts on the job market.",
              "academic_standard": "Presentation Skills",
              "resource_id": {
                "label": "Job Market Presentation",
                "url": "https://www.example.com/job-market-presentation"
              }
            }
          ],
          "gate": {
            "gate_id": "46a78403-0981-4328-a00a-4d8e037f1d19",
            "title": "Final Presentation Review",
            "description": "Review of the complete project findings and preparations for the final presentation.",
            "checklist": [
              "Report Compilation Done",
              "Presentation Prepared",
              "Q&A Rehearsal Complete"
            ]
          }
        }
      ]
    }
  ];


  // Load projects when component expands
      useEffect(() => {
          if (isExpanded && projects.length === 0) {
              setIsLoading(true);
              // Simulate loading delay
              setTimeout(() => {
                  setProjects(MOCK_PROJECTS);
                  setIsLoading(false);
              }, 500);
          }
      }, [isExpanded, projects.length]);

  // Get unique subjects for filtering
  const subjects = [...new Set(projects.map(p => p.subject_domain))];

  // Filter projects based on search and subject
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !selectedSubject || project.subject_domain === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleStageExpansion = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'History': 'bg-purple-100 text-purple-800',
      'Science': 'bg-orange-100 text-orange-800',
      'Art': 'bg-yellow-100 text-yellow-800',
      'Technology': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[subject] || colors.default;
  };

  const getStatusText = () => {
    if (isLoading) return 'Loading projects...';
    if (projects.length === 0) return 'No projects yet';
    return `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`;
  };

  const getStatusClass = () => {
    if (isLoading) return 'text-yellow-400';
    if (projects.length === 0) return 'text-gray-600';
    return 'text-purple-600';
  };

  const getStatusDot = () => {
    if (isLoading) return 'bg-blue-500';
    if (projects.length === 0) return 'bg-gray-400';
    return 'bg-purple-500';
  };

  return (
    <div className="w-full max-w-[300px] font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full overflow-hidden transition-all duration-200">
        {/* Toggle Button */}
        <div 
          onClick={toggleExpanded} 
          className="w-full p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FolderOpen className={`w-5 h-5 ${getStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">My Projects</div>
                <div className="text-sm text-gray-500">
                  {getStatusText()}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-3">
              {/* Search and Filter Controls */}
              {projects.length > 0 && (
                <div className="mb-3 space-y-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Subject Filter */}
                  {subjects.length > 1 && (
                    <div className="relative">
                      <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                      >
                        <option value="">All Subjects</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading your projects...
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && projects.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">No projects yet</p>
                  <p className="text-xs text-gray-400">Create your first project to get started!</p>
                </div>
              )}

              {/* No Results State */}
              {!isLoading && projects.length > 0 && filteredProjects.length === 0 && (
                <div className="text-center py-6">
                  <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No matching projects</p>
                  <p className="text-xs text-gray-400">Try adjusting your search or filter</p>
                </div>
              )}

              {/* Projects List */}
              {!isLoading && filteredProjects.length > 0 && (
                <div className="space-y-2">
                  {filteredProjects.map((project) => (
                    <div key={project.project_id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Project Header */}
                      <div 
                        className="p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleProjectExpansion(project.project_id)}
                      >
                        <div className="flex items-start gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded mt-0.5">
                            {expandedProjects[project.project_id] ? (
                              <ChevronDown size={12} />
                            ) : (
                              <ChevronRight size={12} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {project.project_title}
                                </h3>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                  {project.description}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getSubjectColor(project.subject_domain)}`}>
                                {project.subject_domain}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Target size={10} />
                                {project.stages?.length || 0} stage{(project.stages?.length || 0) !== 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {project.stages?.reduce((total, stage) => total + (stage.tasks?.length || 0), 0) || 0} task{(project.stages?.reduce((total, stage) => total + (stage.tasks?.length || 0), 0) || 0) !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Content */}
                      {expandedProjects[project.project_id] && (
                        <div className="border-t border-gray-200">
                          <div className="p-3 space-y-2">
                            {project.stages?.map((stage) => (
                              <div key={stage.stage_id} className="border border-gray-200 rounded overflow-hidden">
                                {/* Stage Header */}
                                <div 
                                  className="p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={() => toggleStageExpansion(stage.stage_id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                      {expandedStages[stage.stage_id] ? (
                                        <ChevronDown size={10} />
                                      ) : (
                                        <ChevronRight size={10} />
                                      )}
                                    </button>
                                    <div className="flex-1">
                                      <h4 className="text-xs font-medium text-gray-900">
                                        {stage.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>

                                {/* Stage Content */}
                                {expandedStages[stage.stage_id] && (
                                  <div className="border-t border-gray-200 p-2 space-y-2">
                                    {/* Tasks */}
                                    {stage.tasks?.map((task) => (
                                      <div key={task.task_id} className="p-2 bg-blue-50 rounded text-xs space-y-1">
                                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                                        <p className="text-gray-600">{task.description}</p>
                                        <div className="text-gray-500">
                                          Standard: {task.academic_standard}
                                        </div>
                                        
                                        {task.resource_id && (
                                          <div>
                                            <a 
                                              href={task.resource_id.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                                            >
                                              <BookOpen size={10} />
                                              {task.resource_id.label}
                                              <ExternalLink size={8} />
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    {/* Gate */}
                                    {stage.gate && (
                                      <div className="p-2 bg-green-50 rounded text-xs space-y-1">
                                        <h5 className="font-medium text-gray-900 flex items-center gap-1">
                                          <CheckCircle size={10} className="text-green-600" />
                                          {stage.gate.title}
                                        </h5>
                                        <p className="text-gray-600">{stage.gate.description}</p>
                                        
                                        {stage.gate.checklist && stage.gate.checklist.length > 0 && (
                                          <div className="space-y-1 mt-2">
                                            {stage.gate.checklist.map((item, index) => (
                                              <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                                <span className="text-xs text-gray-700">{item}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Status Summary */}
              <div className={`text-center py-1 px-2 rounded-full text-xs font-medium inline-block mt-3 ${
                isLoading ? 'bg-blue-100 text-blue-800' :
                projects.length === 0 ? 'bg-gray-100 text-gray-700' :
                'bg-purple-100 text-purple-800'
              }`}>
                {isLoading ? '🔄 Loading...' :
                 projects.length === 0 ? '📁 Empty' :
                 `📚 ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}