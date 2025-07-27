import { CheckCircle, Briefcase, Users, Heart } from 'lucide-react';
import { DashboardSection } from './DashboardSection';

export const DashboardView = ({ 
  dashboardData,
  onReset,
  welcomeTitle = "Welcome to Your Day!",
  welcomeSubtitle = "Here's what's happening in your learning community",
  resetButtonText = "Submit New Morning Pulse",
  sectionsConfig = null,
  showResetButton = true,
  className = ""
}) => {
  const defaultSectionsConfig = [
    {
      key: 'ActiveProjects',
      title: 'Active Projects',
      icon: Briefcase,
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      itemColor: 'text-blue-800',
      dotColor: 'bg-blue-500'
    },
    {
      key: 'Peers',
      title: 'Peer Updates',
      icon: Users,
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      itemColor: 'text-green-800',
      dotColor: 'bg-green-500',
      maxHeight: '48'
    },
    {
      key: 'ValueMessage',
      title: 'Daily Inspiration',
      icon: Heart,
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      itemColor: 'text-amber-800',
      dotColor: 'bg-amber-500',
      renderItem: (item, index) => (
        <div key={index} className="p-3 bg-white bg-opacity-60 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-800 leading-relaxed italic">"{item}"</p>
        </div>
      )
    }
  ];

  const sections = sectionsConfig || defaultSectionsConfig;

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{welcomeTitle}</h3>
        <p className="text-sm text-gray-600">{welcomeSubtitle}</p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sections.map((section) => (
          <DashboardSection
            key={section.key}
            title={section.title}
            icon={section.icon}
            items={dashboardData[section.key] || []}
            bgGradient={section.bgGradient}
            borderColor={section.borderColor}
            iconColor={section.iconColor}
            titleColor={section.titleColor}
            itemColor={section.itemColor}
            dotColor={section.dotColor}
            maxHeight={section.maxHeight}
            renderItem={section.renderItem}
          />
        ))}
      </div>

      {showResetButton && onReset && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            {resetButtonText}
          </button>
        </div>
      )}
    </div>
  );
};