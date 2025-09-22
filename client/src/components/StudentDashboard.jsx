import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import GuideMe from './GuideMe';
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';
import CreateProject from './CreateProject/CreateProject';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProject/>
      <StudentProjects />
      <GuideMe />
      <SidebarAdvice />
      <ExpertSearchComponent />
      <AboutMe />
      <SidebarBreakTimer />
    </div>
  );
}
