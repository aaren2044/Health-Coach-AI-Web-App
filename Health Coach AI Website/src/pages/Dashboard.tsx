import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Activity, Pill, Dumbbell, Apple, Heart, MessageSquare, Settings,
  Bell, ChevronRight, User, Calendar, CheckCircle, 
  AlertCircle, Clock, ChevronDown, ChevronUp, Plus, Loader2,
  Flame, Move, Watch, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import useAuth from '../hooks/useAuth';
import { FaRobot } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { SiProbot } from "react-icons/si";
import { GiRobotAntennas } from 'react-icons/gi';

const healthData = {
  bloodO2: [
    { time: '6:00', value: 98 },
    { time: '9:00', value: 97 },
    { time: '12:00', value: 98 },
    { time: '15:00', value: 96 },
    { time: '18:00', value: 97 },
  ],
  heartRate: [
    { time: '6:00', value: 72 },
    { time: '9:00', value: 75 },
    { time: '12:00', value: 78 },
    { time: '15:00', value: 73 },
    { time: '18:00', value: 71 },
  ],
  nutrition: [
    { name: 'Carbs', value: 45 },
    { name: 'Protein', value: 30 },
    { name: 'Fats', value: 25 },
  ],
  activity: [
    { day: 'Mon', steps: 8500 },
    { day: 'Tue', steps: 10200 },
    { day: 'Wed', steps: 7800 },
    { day: 'Thu', steps: 9200 },
    { day: 'Fri', steps: 11000 },
    { day: 'Sat', steps: 6500 },
    { day: 'Sun', steps: 4800 },
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#22D3EE'];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { session } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [medications, setMedications] = useState([
    { name: t('medications.metformin'), time: '8:00', taken: true },
    { name: t('medications.lisinopril'), time: '12:00', taken: false },
    { name: t('medications.aspirin'), time: '20:00', taken: false },
  ]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Health summary data
  const healthSummary = {
    calories: 1850,
    exercise: 45, // minutes
    standHours: 10
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('name, email, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  // Update medications when language changes
  useEffect(() => {
    setMedications([
      { name: t('medications.metformin'), time: '8:00', taken: true },
      { name: t('medications.lisinopril'), time: '12:00', taken: false },
      { name: t('medications.aspirin'), time: '20:00', taken: false },
    ]);
  }, [i18n.language]);

  const navItems = [
    { id: 'overview', icon: Activity, label: t('nav.overview') },
    { id: 'medications', icon: Pill, label: t('nav.medications'), link: '/medication' },
    { id: 'exercise', icon: Dumbbell, label: t('nav.exercise'), link: '/exercise' },
    { id: 'diet', icon: Apple, label: t('nav.diet'), link: '/diet' },
    { id: 'monitoring', icon: Heart, label: t('nav.monitoring'), link: '/monitoring' },
    { id: 'guidance', icon: MessageSquare, label: t('nav.guidance'), link: '/ai-guidance' },
    { id: 'settings', icon: Settings, label: t('nav.settings'), link: '/profile-setup' },
    { id: 'activity', icon: Activity, label: t('nav.activity'), link: '/activity-summary' },
    { id: 'documents', icon: FileText, label: t('nav.documents'), link: '/documents' },
    { id: 'MedGuardian', icon: FaRobot, label: t('MedGuardian'), link: 'https://web.telegram.org/k/#@MedGuardian_bot' },
    { id: 'DietaryBot', icon: GiRobotAntennas , label: t('DietaryBot'), link: 'https://web.telegram.org/k/#@MedGu ardianDietBot' },
    { id: 'DailyTaskBot', icon: RiRobot2Line , label: t('DailyTaskBot'), link: 'https://web.telegram.org/k/#@MedGaurdianDaily_bot' },
  ];

  const alerts = [
    { type: 'warning', message: t('alerts.blood_oxygen'), time: t('time.2h_ago') },
    { type: 'reminder', message: t('alerts.medication_reminder'), time: t('time.5m_ago') },
    { type: 'success', message: t('alerts.step_goal'), time: t('time.just_now') },
  ];

  const tasks = [
    { task: t('tasks.morning_medication'), completed: true },
    { task: t('tasks.walking'), completed: false },
    { task: t('tasks.check_oxygen'), completed: true },
    { task: t('tasks.log_lunch'), completed: false },
  ];

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleMedication = (index: number) => {
    const updatedMeds = [...medications];
    updatedMeds[index].taken = !updatedMeds[index].taken;
    setMedications(updatedMeds);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="m-auto">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar - Made sticky */}
      <div className="sticky top-0 h-screen">
        <motion.nav 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 md:w-64 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center space-x-4 mb-8">
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt={t('profile.alt')}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-green-400 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="hidden md:block">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {userProfile?.name || t('user.default')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userProfile?.email || ''}
                </p>
              </div>
            </div>
            <div className="space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link || '#'}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:block font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.welcome', { name: userProfile?.name || t('user.default') })}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                {format(new Date(), t('date_format'))}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow hover:shadow-md transition-all">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </button>
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt={t('profile.alt')}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-400 object-cover shadow"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Health Summary Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    {t('dashboard.health_summary')}
                  </h2>
                  <button className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                    {t('actions.view_details')} <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t('metrics.calories')}
                    </p>
                    <p className="text-lg font-bold">{healthSummary.calories}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">kcal</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
                      <Move className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t('metrics.exercise')}
                    </p>
                    <p className="text-lg font-bold">{healthSummary.exercise}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('units.minutes')}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                      <Watch className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t('metrics.stand_hours')}
                    </p>
                    <p className="text-lg font-bold">{healthSummary.standHours}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('units.hours')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Blood O2 Levels Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 dark:border-gray-700/30"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    {t('Blood Oxygen')}
                  </h2>
                  <button 
                    onClick={() => toggleCard('bloodO2')}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {expandedCard === 'bloodO2' ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                
                {expandedCard === 'bloodO2' ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData.bloodO2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fill: '#6b7280' }}
                          axisLine={false}
                        />
                        <YAxis 
                          domain={[90, 100]}
                          tick={{ fill: '#6b7280' }}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: 'white',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                          formatter={(value) => [`${value}%`, t('metrics.blood_oxygen')]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData.bloodO2}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>

              {/* Activity Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 dark:border-gray-700/30"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-teal-500" />
                  {t('Weekly Activity')}
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={healthData.activity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: '#6b7280' }}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280' }}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                        formatter={(value) => [`${value}`, t('metrics.steps')]}
                      />
                      <Bar
                        dataKey="steps"
                        fill="#22D3EE"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Medication Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 dark:border-gray-700/30"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-blue-500" />
                    {t('medications.title')}
                  </h2>
                  <button className="text-blue-600 dark:text-blue-400 flex items-center text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    {t('actions.add')}
                  </button>
                </div>
                <div className="space-y-3">
                  {medications.map((med, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Pill className={`w-5 h-5 mr-3 ${med.taken ? 'text-green-500' : 'text-blue-500'}`} />
                        <div>
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {med.time}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMedication(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          med.taken
                            ? 'bg-green-100 dark:bg-green-900/50'
                            : 'bg-blue-100 dark:bg-blue-900/50'
                        }`}
                      >
                        <CheckCircle
                          className={`w-5 h-5 ${
                            med.taken
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-blue-500 dark:text-blue-400'
                          }`}
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Alerts Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 dark:border-gray-700/30"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  {t('alerts.title')}
                </h2>
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 2 }}
                      className={`flex items-start p-4 rounded-xl border-l-4 ${
                        alert.type === 'warning'
                          ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20'
                          : alert.type === 'success'
                          ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20'
                          : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 mr-3 mt-0.5 ${
                          alert.type === 'warning'
                            ? 'text-yellow-500'
                            : alert.type === 'success'
                            ? 'text-green-500'
                            : 'text-blue-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{alert.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tasks Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 dark:border-gray-700/30"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  {t('tasks.title')}
                </h2>
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 2 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className={`w-5 h-5 rounded border-2 ${
                            task.completed
                              ? 'border-green-500 bg-green-500'
                              : 'border-blue-300 dark:border-gray-500'
                          } focus:ring-0 focus:ring-offset-0`}
                        />
                        <span
                          className={`ml-3 ${
                            task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                          }`}
                        >
                          {task.task}
                        </span>
                      </div>
                      {task.completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}