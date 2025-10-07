import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import GuideMe from './GuideMe';
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';
import CreateProject from './CreateProject/CreateProject';
import SidebarWorkshop from './WorkshopBuilder';
import ExpertFinderComponent from './ExpertFinderComponent';
import StandardsSelector from './StandardsSelector';

export default function StudentDashboard({ email }) {
  return (
    <div>
      <IntroductionContainer />
      <SidebarMorningPulse />
      <CreateProject/>
      <StudentProjects />
      <GuideMe />
      <SidebarWorkshop /> 
      <SidebarAdvice />
      <ExpertFinderComponent/>
      <AboutMe />
      <SidebarBreakTimer />
      <StandardsSelector />
    </div>
  );
}
