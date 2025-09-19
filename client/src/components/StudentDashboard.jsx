import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';
import CreateProjectAI from './CreateProject/CreateProjectAI';
import StreamingProjectCreator from './CreateProject/StreamingProjectCreator';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProjectAI />
      <StudentProjects />
      <SidebarAdvice />
      <ExpertSearchComponent />
      <AboutMe />
      <StreamingProjectCreator/>
      <SidebarBreakTimer />
    </div>
  );
}
