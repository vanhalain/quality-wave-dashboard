
import { BarChart3, CheckCircle, FileText, PlayCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { CampaignList } from '@/components/dashboard/CampaignList';
import { QualityScoreChart } from '@/components/dashboard/QualityScoreChart';

// Mock data for the dashboard
const mockCampaigns = [
  {
    id: 1,
    name: 'Customer Service Q1',
    status: 'active' as const,
    evaluations: 28,
    totalRecords: 50,
  },
  {
    id: 2,
    name: 'Technical Support Evaluation',
    status: 'active' as const,
    evaluations: 42,
    totalRecords: 100,
  },
  {
    id: 3,
    name: 'Sales Team Compliance',
    status: 'active' as const,
    evaluations: 15,
    totalRecords: 75,
  },
];

const scoreData = [
  { name: 'Greeting', score: 85 },
  { name: 'Clarity', score: 72 },
  { name: 'Knowledge', score: 90 },
  { name: 'Resolution', score: 65 },
  { name: 'Closing', score: 78 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-qa-charcoal">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Records"
          value={235}
          description="Across all campaigns"
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Evaluated"
          value={142}
          description="60.4% of total"
          icon={CheckCircle}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Pending"
          value={93}
          description="39.6% of total"
          icon={PlayCircle}
          color="orange"
        />
        <StatCard
          title="Average Score"
          value="78%"
          description="Overall quality score"
          icon={BarChart3}
          color="purple"
          trend={{ value: 2, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <QualityScoreChart data={scoreData} />
        <CampaignList campaigns={mockCampaigns} />
      </div>
    </DashboardLayout>
  );
}
