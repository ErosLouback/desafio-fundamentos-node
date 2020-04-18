import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    if (this.transactions.length < 1) {
      return this.balance;
    }
    const outcome = this.transactions
      .map(x => (x.type === 'outcome' ? x.value : 0))
      .reduce((accum, curr) => accum + curr);

    const income = this.transactions
      .map(x => (x.type === 'income' ? x.value : 0))
      .reduce((accum, curr) => accum + curr);

    const total = income - outcome;

    this.balance = { income, outcome, total };

    return this.balance;
  }

  public create({
    title,
    value,
    type,
  }: CreateTransactionDTO): Transaction | Error {
    const transaction = new Transaction({ title, value, type });

    this.getBalance();
    if (type === 'outcome') {
      if (value > this.balance.total) {
        throw Error(
          'Should not be able to create outcome transaction without a valid balance.',
        );
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
