import apiService from './api.service';
import { Transaction, PaymentRequest, PaymentResult, CartItem } from '@/types';

class DonationService {
  // Mock transactions database
  private mockTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      accountId: 1,
      amount: 500,
      type: 'purchase',
      status: 'completed',
      itemName: 'Invincible\'s Reins',
      characterName: 'Arthas',
      createdAt: '2024-12-15T10:30:00Z',
      completedAt: '2024-12-15T10:30:05Z',
      paymentMethod: 'paypal',
    },
    {
      id: 'TXN-002',
      accountId: 1,
      amount: 1000,
      type: 'deposit',
      status: 'completed',
      createdAt: '2024-12-10T14:20:00Z',
      completedAt: '2024-12-10T14:20:10Z',
      paymentMethod: 'stripe',
    },
    {
      id: 'TXN-003',
      accountId: 1,
      amount: 150,
      type: 'purchase',
      status: 'completed',
      itemName: 'Faction Change',
      characterName: 'Sylvanas',
      createdAt: '2024-12-05T09:15:00Z',
      completedAt: '2024-12-05T09:15:08Z',
      paymentMethod: 'crypto',
    },
    {
      id: 'TXN-004',
      accountId: 2,
      amount: 250,
      type: 'purchase',
      status: 'completed',
      itemName: 'Celestial Steed',
      characterName: 'Thrall',
      createdAt: '2024-11-28T16:45:00Z',
      completedAt: '2024-11-28T16:45:12Z',
      paymentMethod: 'paypal',
    },
  ];

  async getTransactionHistory(accountId: number): Promise<Transaction[]> {
    if (!apiService.isMockEnabled()) {
      const resp = await apiService.get<Transaction[]>(`/transactions/${accountId}`);
      return resp.data.data || [];
    }
    await apiService.mockDelay(600);

    return this.mockTransactions
      .filter(t => t.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    await apiService.mockDelay(400);

    const transaction = this.mockTransactions.find(t => t.id === id);
    return transaction || null;
  }

  async processPurchase(request: PaymentRequest): Promise<PaymentResult> {
    await apiService.mockDelay(2000); // Simulate payment processing

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (!success) {
      return {
        success: false,
        transactionId: '',
        message: 'Payment failed. Please try again or use a different payment method.',
      };
    }

    // Create transaction for each item
    const transactionId = `TXN-${Date.now()}`;
    
    request.items.forEach(cartItem => {
      const transaction: Transaction = {
        id: `${transactionId}-${cartItem.item.id}`,
        accountId: 1, // Would come from auth context
        amount: cartItem.item.price * cartItem.quantity,
        type: 'purchase',
        status: 'completed',
        itemName: cartItem.item.name,
        characterName: cartItem.selectedCharacter?.name,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        paymentMethod: request.paymentMethod,
      };

      this.mockTransactions.push(transaction);
    });

    return {
      success: true,
      transactionId,
      message: 'Purchase completed successfully! Items will be delivered to your character.',
    };
  }

  async addBalance(accountId: number, amount: number, paymentMethod: string): Promise<Transaction> {
    if (!apiService.isMockEnabled()) {
      const resp = await apiService.post<Transaction>('/transactions/deposit', { amount, paymentMethod });
      return resp.data.data as Transaction;
    }
    await apiService.mockDelay(1500);

    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      accountId,
      amount,
      type: 'deposit',
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      paymentMethod: paymentMethod as 'paypal' | 'stripe' | 'crypto',
    };

    this.mockTransactions.push(transaction);
    return transaction;
  }

  // Calculate total for cart
  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  }

  // Admin methods
  async getAllTransactions(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ transactions: Transaction[]; total: number }> {
    await apiService.mockDelay(700);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const sortedTransactions = [...this.mockTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      transactions: sortedTransactions.slice(startIndex, endIndex),
      total: this.mockTransactions.length,
    };
  }

  async refundTransaction(transactionId: string): Promise<void> {
    await apiService.mockDelay(800);

    const transaction = this.mockTransactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Create refund transaction
    const refundTransaction: Transaction = {
      id: `REFUND-${Date.now()}`,
      accountId: transaction.accountId,
      amount: transaction.amount,
      type: 'refund',
      status: 'completed',
      itemName: transaction.itemName,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    this.mockTransactions.push(refundTransaction);
  }
}

export default new DonationService();