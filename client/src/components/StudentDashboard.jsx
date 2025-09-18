import IntroductionContainer from './IntroductionContainer';
import MorningPulse from './MorningPulse';
import SidebarAdvice from './Advice';
import CreateProject from './CreateProject';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import StudentProjects from './StudentProjects';
import SidebarWorkshop from './workshopbuilder';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <AboutMe />
      <MorningPulse />
      <SidebarWorkshop />
      <SidebarAdvice />
      <CreateProject />
      <SidebarBreakTimer />
      <ExpertSearchComponent />
      <StudentProjects />
    </div>
  );
}
