import React, { useEffect, useState } from 'react';
import { CalendarDays, FileText, PlayCircle, Wallet, X } from 'lucide-react';
import { Button } from '../ui/Button';

const STORAGE_KEY = 'business_nexus_walkthrough_seen';

const steps = [
  {
    title: 'Role-based dashboard',
    body: 'Investor and entrepreneur accounts see different discovery, deal, and profile actions.',
    icon: <PlayCircle size={20} />,
  },
  {
    title: 'Scheduling',
    body: 'Availability slots, meeting requests, and confirmed meetings live in the calendar module.',
    icon: <CalendarDays size={20} />,
  },
  {
    title: 'Document Chamber',
    body: 'Deal files include upload, preview, review status, and signature states.',
    icon: <FileText size={20} />,
  },
  {
    title: 'Payments',
    body: 'Wallet simulations cover deposits, withdrawals, transfers, and funding flows.',
    icon: <Wallet size={20} />,
  },
];

export const GuidedWalkthrough: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setIsOpen(localStorage.getItem(STORAGE_KEY) !== 'true');
  }, []);

  const closeWalkthrough = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary-700"
      >
        <PlayCircle size={18} className="mr-2" />
        Walkthrough
      </button>
    );
  }

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,360px)] rounded-md border border-primary-100 bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary-50 p-2 text-primary-700">{step.icon}</div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{step.title}</p>
            <p className="text-xs text-gray-500">
              {stepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close walkthrough"
          onClick={closeWalkthrough}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={18} />
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">{step.body}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1">
          {steps.map((item, index) => (
            <span
              key={item.title}
              className={`h-1.5 w-8 rounded-full ${
                index === stepIndex ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((currentIndex) => Math.max(0, currentIndex - 1))}
          >
            Back
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (isLastStep) {
                closeWalkthrough();
                return;
              }
              setStepIndex((currentIndex) => currentIndex + 1);
            }}
          >
            {isLastStep ? 'Done' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
