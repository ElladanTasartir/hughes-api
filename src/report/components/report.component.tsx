import { StyleSheet, Text, View, Document, Page } from '@react-pdf/renderer';
import * as dayjs from 'dayjs';
import { Order } from '../../order/entities/order.entity';

interface ReportProps {
  finishedOrders: number;
  orders: Order[];
}

const status = {
  FINISHED: 'Finalizado',
  IN_PROGRESS: 'Em progresso',
  OPEN: 'Aberto',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    flexDirection: 'column',
  },
  title: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  orderText: {
    fontSize: 12,
    color: '#000',
  },
  orderValue: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  orderInfo: {
    border: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E4E4E4',
  },
  orderInfoText: {
    fontSize: 12,
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

function BoldText({ children }) {
  return <Text style={styles.boldText}>{children}</Text>;
}

export function Report({ finishedOrders, orders }: ReportProps) {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.page}>
          <Text style={styles.title}>Relatório de Ordens finalizadas</Text>

          <Text style={styles.orderText}>
            Ordens de serviço finalizadas:{' '}
            <Text style={styles.orderValue}>{finishedOrders}</Text>
          </Text>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderInfo}>
              <Text style={styles.orderInfoText}>
                Nome do Cliente: <BoldText>{order?.client?.name}</BoldText>
              </Text>
              <Text style={styles.orderInfoText}>
                Plano selecionado: <BoldText>{order?.plan?.name}</BoldText>
              </Text>
              <Text style={styles.orderInfoText}>
                Status da Ordem: <BoldText>{status[order?.status]}</BoldText>
              </Text>
              <Text style={styles.orderInfoText}>
                Data de criação da Ordem:{' '}
                <BoldText>
                  {dayjs(order?.created_at).format('DD/MM/YYYY')}
                </BoldText>
              </Text>
              <Text style={styles.orderInfoText}>
                Data de criação da Ordem:{' '}
                <BoldText>
                  {dayjs(order?.created_at).format('DD/MM/YYYY')}
                </BoldText>
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
