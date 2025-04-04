
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'completed';
  evaluations: number;
  totalRecords: number;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'qa-status-active';
      case 'inactive':
        return 'qa-status-inactive';
      case 'completed':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'qa-status-inactive';
    }
  };

  return (
    <div className="qa-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="qa-heading">Active Campaigns</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/campaigns">View all</Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="qa-table">
          <thead>
            <tr>
              <th className="rounded-tl-md">Campaign Name</th>
              <th>Status</th>
              <th>Evaluations</th>
              <th>Progress</th>
              <th className="rounded-tr-md w-10"></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-muted/50">
                <td className="font-medium">{campaign.name}</td>
                <td>
                  <span className={getStatusClass(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </td>
                <td>{campaign.evaluations} / {campaign.totalRecords}</td>
                <td>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-qa-blue h-2.5 rounded-full" 
                      style={{ width: `${(campaign.evaluations / campaign.totalRecords) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td>
                  <Button asChild variant="ghost" size="icon">
                    <Link to={`/campaigns/${campaign.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
