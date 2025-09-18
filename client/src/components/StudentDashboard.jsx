import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject/CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';
import SidebarAIChat from './SidebarAIChat';
import IntegratedProjectCreator from './IntegratedProjectCreator';
import CreateProjectAI from './CreateProject/CreateProjectAI';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProject />
      <StudentProjects />
      <SidebarAdvice />
      <SidebarAIChat />
      <ExpertSearchComponent />
      <IntegratedProjectCreator />
      <AboutMe />
      <CreateProjectAI />
      <SidebarBreakTimer />
    </div>
  );
}
