import { AvailabilitySlot, ChamberDocument, FundingDeal, MeetingRequest, Transaction } from '../types';

export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: 'slot-1',
    userId: 'e1',
    date: '2026-05-18',
    startTime: '09:00',
    endTime: '10:00',
    label: 'Investor intro block',
    mode: 'Video',
  },
  {
    id: 'slot-2',
    userId: 'e1',
    date: '2026-05-20',
    startTime: '14:00',
    endTime: '15:30',
    label: 'Product demo window',
    mode: 'Video',
  },
  {
    id: 'slot-3',
    userId: 'i1',
    date: '2026-05-19',
    startTime: '11:00',
    endTime: '12:00',
    label: 'Portfolio office hours',
    mode: 'Phone',
  },
  {
    id: 'slot-4',
    userId: 'i1',
    date: '2026-05-22',
    startTime: '16:00',
    endTime: '17:00',
    label: 'Term sheet review',
    mode: 'Video',
  },
];

export const meetingRequests: MeetingRequest[] = [
  {
    id: 'meet-1',
    requesterId: 'i1',
    recipientId: 'e1',
    title: 'TechWave AI seed round diligence',
    date: '2026-05-19',
    startTime: '11:00',
    endTime: '11:45',
    status: 'pending',
    note: 'Review traction, ICP fit, and next funding milestones.',
  },
  {
    id: 'meet-2',
    requesterId: 'e1',
    recipientId: 'i2',
    title: 'Climate impact angle for AI finance',
    date: '2026-05-21',
    startTime: '13:00',
    endTime: '13:30',
    status: 'accepted',
    note: 'Discuss sustainable finance positioning and investor fit.',
  },
  {
    id: 'meet-3',
    requesterId: 'i3',
    recipientId: 'e3',
    title: 'HealthPulse product walkthrough',
    date: '2026-05-23',
    startTime: '10:00',
    endTime: '10:45',
    status: 'accepted',
    note: 'Walk through retention metrics and care provider onboarding.',
  },
];

export const chamberDocuments: ChamberDocument[] = [
  {
    id: 'doc-1',
    name: 'TechWave SAFE Agreement.pdf',
    type: 'PDF',
    size: '1.4 MB',
    lastModified: '2026-05-10',
    shared: true,
    ownerId: 'e1',
    dealName: 'TechWave AI Seed',
    status: 'In Review',
    signer: 'Michael Rodriguez',
  },
  {
    id: 'doc-2',
    name: 'GreenLife Term Sheet.docx',
    type: 'Document',
    size: '860 KB',
    lastModified: '2026-05-07',
    shared: true,
    ownerId: 'i2',
    dealName: 'GreenLife Seed',
    status: 'Draft',
  },
  {
    id: 'doc-3',
    name: 'HealthPulse NDA.pdf',
    type: 'PDF',
    size: '540 KB',
    lastModified: '2026-05-04',
    shared: false,
    ownerId: 'e3',
    dealName: 'HealthPulse Series A',
    status: 'Signed',
    signer: 'Robert Torres',
  },
];

export const walletBalances: Record<string, number> = {
  e1: 84200,
  e2: 51250,
  e3: 38600,
  e4: 27400,
  i1: 620000,
  i2: 940000,
  i3: 735000,
};

export const transactions: Transaction[] = [
  {
    id: 'txn-1',
    date: '2026-05-11',
    type: 'Deal Funding',
    amount: 150000,
    sender: 'Michael Rodriguez',
    receiver: 'TechWave AI',
    status: 'Completed',
  },
  {
    id: 'txn-2',
    date: '2026-05-09',
    type: 'Deposit',
    amount: 50000,
    sender: 'Linked bank',
    receiver: 'Nexus Wallet',
    status: 'Completed',
  },
  {
    id: 'txn-3',
    date: '2026-05-06',
    type: 'Transfer',
    amount: 18500,
    sender: 'TechWave AI',
    receiver: 'Legal Partner',
    status: 'Pending',
  },
];

export const fundingDeals: FundingDeal[] = [
  {
    id: 'fund-1',
    investorId: 'i1',
    entrepreneurId: 'e1',
    startupName: 'TechWave AI',
    amount: 250000,
    status: 'Ready',
  },
  {
    id: 'fund-2',
    investorId: 'i2',
    entrepreneurId: 'e2',
    startupName: 'GreenLife Solutions',
    amount: 175000,
    status: 'Processing',
  },
];

export const getWalletBalance = (userId: string): number => walletBalances[userId] ?? 0;

export const getConfirmedMeetingsForUser = (userId: string): MeetingRequest[] =>
  meetingRequests
    .filter((meeting) => meeting.status === 'accepted' && [meeting.requesterId, meeting.recipientId].includes(userId))
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));

export const getPendingMeetingsForUser = (userId: string): MeetingRequest[] =>
  meetingRequests
    .filter((meeting) => meeting.status === 'pending' && meeting.recipientId === userId)
    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));
