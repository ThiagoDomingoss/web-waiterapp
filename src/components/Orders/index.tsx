import { OrdersBoard } from '../OrdersBoard';
import { Container } from './styles';
import { Order } from '../../types/Order';
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import socketIo from 'socket.io-client';

export function Orders(){

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('orders@new', (order) => {
      setOrders(prevState => prevState.concat(order));

    });
  }, []);

  useEffect(() => {
    api.get('/orders').then(({data}) => {
      setOrders(data);
    });
  }, []);

  const waiting = orders.filter((orders) => orders.status === 'WAITING');
  const inProduction = orders.filter((orders) => orders.status === 'IN_PRODUCTION');
  const done = orders.filter((orders) => orders.status === 'DONE');

  function handleCancelOrder(orderId: string){
    setOrders((prevState) => prevState.filter(order => order._id != orderId));
  }

  function handleOrdersStatusChange( orderId: string, status: Order['status']) {
    setOrders((prevState => prevState.map((order) => (
      order._id === orderId ? {...order, status} : order
    ))));
  }

  return(
    <Container>
      <OrdersBoard
        icon='🕧'
        title = 'Fila de espera'
        orders= {waiting}
        onCancelOrder={handleCancelOrder}
        onChageOrderStatus={handleOrdersStatusChange}
      />
      <OrdersBoard
        icon='🧑‍🍳'
        title = 'Em preparação'
        orders= {inProduction}
        onCancelOrder={handleCancelOrder}
        onChageOrderStatus={handleOrdersStatusChange}
      />
      <OrdersBoard
        icon='✅'
        title = 'Pronto!'
        orders= {done}
        onCancelOrder={handleCancelOrder}
        onChageOrderStatus={handleOrdersStatusChange}
      />
    </Container>
  );
}
