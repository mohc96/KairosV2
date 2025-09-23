import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';
import CreateProject from './CreateProject/CreateProject';
import SidebarWorkshop from './WorkshopBuilder';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProject/>
      <StudentProjects />
      <SidebarWorkshop /> 
      <SidebarAdvice />
      <ExpertSearchComponent />
      <AboutMe />
      <SidebarBreakTimer />
    </div>
  );
}
