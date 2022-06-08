export default {
  orderShipTracing: {
    title: '订单出库追踪',
    desc: ' 检索条件订单的出库情况，订单数据来源于ERP',
    company: {
      svdg: '东莞斯达文星',
      jstw: '台湾杰士通',
    },
    orderNo: '客户单号',
    cargoNo: '存货编号',
    customerNo: '客商编号',
    location: '地点公司',
    ship: '出货',
    grid: {
      column: {
        titles: {
          categories: '类别',
          orderTime: '订单时间',
          planDate: '计划交期',
          orderNo: '客户单号',
          cargoNo: '存货编号',
          customerNo: '客商编号',
          orderQty: '订单数',
          totalShipQty: '累积出货',
          shipDetails: '出货明细',
        },
        filters: {
          noShip: '未出货',
          finishedShip: '出货完成',
          notFinishedShip: '出货未完成',
        },
      },
    },
  },
};
