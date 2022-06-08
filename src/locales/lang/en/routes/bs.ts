export default {
  orderShipTracing: {
    title: 'Order Ship Tracing',
    desc: ' Query orders by below field',
    company: {
      svdg: 'SVDG',
      jstw: 'JSTW',
    },
    orderNo: 'Order No.',
    cargoNo: 'Cargo No.',
    customerNo: 'Customer No.',
    location: 'Company Location',
    ship: 'Ship',
    grid: {
      column: {
        titles: {
          categories: 'Categories',
          orderTime: 'Order Time',
          planDate: 'Plan Date',
          orderNo: 'Order No.',
          cargoNo: 'Cargo No.',
          customerNo: 'Customer No.',
          orderQty: 'Order Qty',
          totalShipQty: 'Ship Qty',
          shipDetails: 'Ship Details',
        },
        filters: {
          noShip: 'No ship',
          finishedShip: 'Finished ship',
          notFinishedShip: 'Not finished ship',
        },
      },
    },
  },
};
