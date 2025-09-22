import IntroductionContainer from './IntroductionContainer';
import SidebarAdvice from './Advice';
import SidebarBreakTimer from './Break';
import AboutMe from './AboutMe';
import ExpertSearchComponent from './WhoCanHelp';
<<<<<<< HEAD
import StudentProjects from './StudentProjects';
import GuideMe from './GuideMe';

=======
import StudentProjects from './StudentProjects/StudentProjects';
import SidebarMorningPulse from './MorningPulse';
import CreateProject from './CreateProject/CreateProject';
>>>>>>> 70c288111c7393cadc3dfb759cd52b8dba7ae217

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
