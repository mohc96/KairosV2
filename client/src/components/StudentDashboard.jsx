import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject/CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProject />
      <StudentProjects />
      <SidebarAdvice />
      <ExpertSearchComponent />
      <AboutMe />
      <SidebarBreakTimer />
    </div>
  );
}
