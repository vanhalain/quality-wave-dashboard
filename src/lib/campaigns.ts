
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  evaluatedCount: number;
  gridId?: number;
}

interface CampaignStore {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: number, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: number) => void;
  getCampaign: (id: number) => Campaign | undefined;
}

// Mock implementation - in a real app, we would connect to the backend
export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [
        {
          id: 1,
          name: 'Customer Service Q1',
          description: 'Quality assessment for customer service team in Q1 2025',
          status: 'active',
          createdAt: '2025-01-15T00:00:00.000Z',
          updatedAt: '2025-01-15T00:00:00.000Z',
          recordCount: 50,
          evaluatedCount: 28,
          gridId: 1,
        },
        {
          id: 2,
          name: 'Technical Support Evaluation',
          description: 'Evaluation of technical support calls for compliance and quality',
          status: 'active',
          createdAt: '2025-02-01T00:00:00.000Z',
          updatedAt: '2025-02-10T00:00:00.000Z',
          recordCount: 100,
          evaluatedCount: 42,
        },
        {
          id: 3,
          name: 'Sales Team Compliance',
          description: 'Regulatory compliance assessment for the sales team',
          status: 'active',
          createdAt: '2025-03-05T00:00:00.000Z',
          updatedAt: '2025-03-05T00:00:00.000Z',
          recordCount: 75,
          evaluatedCount: 15,
        },
      ],
      
      addCampaign: (campaign) => {
        set((state) => ({
          campaigns: [
            ...state.campaigns,
            {
              ...campaign,
              id: Math.max(0, ...state.campaigns.map((c) => c.id)) + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        }));
      },
      
      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === id
              ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
              : campaign
          ),
        }));
      },
      
      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        }));
      },
      
      getCampaign: (id) => {
        return get().campaigns.find((campaign) => campaign.id === id);
      },
    }),
    {
      name: 'campaign-storage',
    }
  )
);
