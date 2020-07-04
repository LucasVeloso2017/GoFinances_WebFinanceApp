import React, { useState, useEffect } from 'react';
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue  from '../../utils/formatValue';

import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}
interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      //const response = await api.get('/transactions')

      const [response] = await Promise.all([api.get(`transactions`)]);

      setBalance(response.data.balance)
      const transactionsData = response.data.transactions.map(
        (transaction: Transaction) => {
          return {
            ...transaction,
            created_at: new Date(),
          };
        },
      );
      
      setTransactions(transactionsData)
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(Number(balance.income))}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formatValue(Number(balance.outcome))}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(Number(balance.total))}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {
                transactions.map(trs =>{
                  return(
                  <tr key={trs.id}>
                    <td className="title">{trs.title}</td>
                    <td className="income">{trs.type === 'outcome' && '- '}{formatValue(trs.value)}</td>
                    <td>{trs.category.title}</td>
                    <td>{formatDate(trs.created_at)}</td>
                  </tr>
                  )
                })
              }
              
              
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
