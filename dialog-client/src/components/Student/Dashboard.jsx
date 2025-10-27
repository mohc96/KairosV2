import React, { useState } from 'react';
import { Activity, Users, TrendingUp, Bell, X, BarChart3, DollarSign, MousePointerClick } from 'lucide-react';

export default function DialogDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  const stats = [
    { label: 'Active Users', value: '1,234', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50', icon: Users },
    { label: 'Total Sales', value: '$5,678', change: '+8%', color: 'text-green-600', bg: 'bg-green-50', icon: DollarSign },
    { label: 'Conversion', value: '3.2%', change: '+15%', color: 'text-purple-600', bg: 'bg-purple-50', icon: MousePointerClick },
    { label: 'Page Views', value: '12.5K', change: '+23%', color: 'text-orange-600', bg: 'bg-orange-50', icon: BarChart3 }
  ];

  const activities = [
    { text: 'New user John Doe signed up from California', time: '2 minutes ago', type: 'user' },
    { text: 'Sale completed - Order #4532 ($234.99)', time: '5 minutes ago', type: 'sale' },
    { text: 'Monthly report generated successfully', time: '12 minutes ago', type: 'report' },
    { text: 'System backup completed', time: '25 minutes ago', type: 'system' },
    { text: 'New feature deployed to production', time: '1 hour ago', type: 'deployment' },
    { text: 'Email campaign sent to 5,000 users', time: '2 hours ago', type: 'marketing' }
  ];

  if (!isOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
        >
          Open Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-50">
      <div className="w-[900px] h-[700px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <p className="text-blue-100 mt-1">Real-time business metrics and activity</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-blue-800 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'stats'
                ? 'text-blue-600 border-b-3 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Activity className="w-5 h-5" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'activity'
                ? 'text-blue-600 border-b-3 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            Recent Activity
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'stats' && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`p-6 rounded-xl ${stat.bg} border-2 border-gray-100 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-bold ${stat.color} flex items-center gap-1`}>
                            <TrendingUp className="w-4 h-4" />
                            {stat.change}
                          </span>
                          <p className="text-xs text-gray-600 mt-1">vs last week</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 uppercase font-semibold tracking-wide mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                    Generate Report
                  </button>
                  <button className="bg-white text-gray-700 py-3 px-6 rounded-lg text-base font-semibold hover:bg-gray-100 transition-colors border-2 border-gray-300">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <div className="space-y-3 mb-6">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all hover:shadow-sm">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'sale' ? 'bg-green-500' :
                      activity.type === 'report' ? 'bg-purple-500' :
                      activity.type === 'system' ? 'bg-orange-500' :
                      activity.type === 'deployment' ? 'bg-red-500' : 'bg-pink-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-gray-900 font-medium">{activity.text}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'user' ? 'bg-blue-50' :
                      activity.type === 'sale' ? 'bg-green-50' :
                      activity.type === 'report' ? 'bg-purple-50' :
                      activity.type === 'system' ? 'bg-orange-50' :
                      activity.type === 'deployment' ? 'bg-red-50' : 'bg-pink-50'
                    }`}>
                      <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full text-blue-600 py-3 px-6 rounded-xl text-base font-semibold hover:bg-blue-50 transition-colors border-2 border-blue-200">
                View Complete Activity Log
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last updated: 2 minutes ago</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-semibold">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}