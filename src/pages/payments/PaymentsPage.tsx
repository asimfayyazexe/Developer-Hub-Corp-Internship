import React, { useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Send,
  Wallet,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { fundingDeals, getWalletBalance, transactions } from '../../data/collaborationHub';
import { entrepreneurs, findUserById } from '../../data/users';
import { FundingDeal, Transaction } from '../../types';

type PaymentAction = 'Deposit' | 'Withdraw' | 'Transfer';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const transactionVariant = {
  Completed: 'success',
  Pending: 'warning',
  Failed: 'error',
} as const;

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user ? getWalletBalance(user.id) : 0);
  const [action, setAction] = useState<PaymentAction>('Deposit');
  const [amount, setAmount] = useState('25000');
  const [recipient, setRecipient] = useState(entrepreneurs[0]?.startupName ?? 'TechWave AI');
  const [transactionList, setTransactionList] = useState<Transaction[]>(transactions);
  const [dealList, setDealList] = useState<FundingDeal[]>(fundingDeals);

  const visibleDeals = useMemo(() => {
    if (!user) return [];
    return user.role === 'investor'
      ? dealList.filter((deal) => deal.investorId === user.id)
      : dealList.filter((deal) => deal.entrepreneurId === user.id);
  }, [dealList, user]);

  if (!user) return null;

  const runPaymentSimulation = (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return;

    const direction = action === 'Deposit' ? 1 : -1;
    setBalance((currentBalance) => Math.max(0, currentBalance + numericAmount * direction));

    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: action,
      amount: numericAmount,
      sender: action === 'Deposit' ? 'Linked bank' : user.name,
      receiver: action === 'Withdraw' ? 'Linked bank' : recipient,
      status: 'Completed',
    };

    setTransactionList((currentTransactions) => [newTransaction, ...currentTransactions]);
  };

  const fundDeal = (dealId: string) => {
    const deal = dealList.find((currentDeal) => currentDeal.id === dealId);
    if (!deal || deal.status === 'Funded') return;

    setDealList((currentDeals) =>
      currentDeals.map((currentDeal) =>
        currentDeal.id === dealId
          ? {
              ...currentDeal,
              status: 'Funded',
            }
          : currentDeal
      )
    );
    setBalance((currentBalance) => Math.max(0, currentBalance - deal.amount));

    const entrepreneur = findUserById(deal.entrepreneurId);
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'Deal Funding',
      amount: deal.amount,
      sender: user.name,
      receiver: entrepreneur?.name ?? deal.startupName,
      status: 'Completed',
    };

    setTransactionList((currentTransactions) => [newTransaction, ...currentTransactions]);
  };

  const actionMeta = {
    Deposit: {
      icon: <ArrowDownToLine size={18} />,
      helper: 'Add funds to Nexus Wallet',
    },
    Withdraw: {
      icon: <ArrowUpFromLine size={18} />,
      helper: 'Move funds to linked bank',
    },
    Transfer: {
      icon: <ArrowRightLeft size={18} />,
      helper: 'Send funds to a deal partner',
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Simulate wallet movement and deal funding</p>
        </div>
        <Badge rounded variant="primary" className="w-fit">
          {user.role === 'investor' ? 'Investor wallet' : 'Startup wallet'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="bg-primary-50 border border-primary-100 md:col-span-2">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-700">Wallet Balance</p>
                <p className="mt-2 text-3xl font-bold text-primary-950">
                  {currencyFormatter.format(balance)}
                </p>
              </div>
              <div className="rounded-md bg-primary-100 p-4 text-primary-700">
                <Wallet size={32} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="mr-3 rounded-md bg-secondary-100 p-3 text-secondary-700">
                <Landmark size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Escrow</p>
                <p className="text-lg font-semibold text-gray-900">$145K</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="mr-3 rounded-md bg-accent-100 p-3 text-accent-700">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Card ending</p>
                <p className="text-lg font-semibold text-gray-900">4242</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Payment action</h2>
          </CardHeader>
          <CardBody>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {(['Deposit', 'Withdraw', 'Transfer'] as PaymentAction[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAction(option)}
                  className={`rounded-md border px-3 py-3 text-sm font-medium transition-colors ${
                    action === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-primary-200'
                  }`}
                >
                  <span className="mb-1 flex justify-center">{actionMeta[option].icon}</span>
                  {option}
                </button>
              ))}
            </div>

            <form className="space-y-4" onSubmit={runPaymentSimulation}>
              <Input
                label="Amount"
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                startAdornment={<CircleDollarSign size={18} />}
                helperText={actionMeta[action].helper}
                fullWidth
              />
              <Input
                label={action === 'Withdraw' ? 'Destination' : 'Recipient'}
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                fullWidth
              />
              <Button type="submit" fullWidth leftIcon={<Send size={18} />}>
                Simulate {action.toLowerCase()}
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Funding deal flow</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {visibleDeals.length > 0 ? (
              visibleDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex flex-col gap-4 rounded-md border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{deal.startupName}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {currencyFormatter.format(deal.amount)} - Investor to entrepreneur
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        deal.status === 'Funded'
                          ? 'success'
                          : deal.status === 'Processing'
                            ? 'warning'
                            : 'primary'
                      }
                    >
                      {deal.status}
                    </Badge>
                    {user.role === 'investor' && (
                      <Button
                        size="sm"
                        disabled={deal.status === 'Funded'}
                        onClick={() => fundDeal(deal.id)}
                      >
                        Fund
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No active funding deals for this account.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Transaction history</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Sender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Receiver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactionList.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {transaction.date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                      {transaction.type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">
                      {currencyFormatter.format(transaction.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {transaction.sender}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                      {transaction.receiver}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <Badge variant={transactionVariant[transaction.status]}>
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
