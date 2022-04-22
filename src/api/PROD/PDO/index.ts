// import { ScheduleRequest } from '../Schedule/type';
// import { defHttp } from '/@/utils/http/axios';

// enum Api {
//   ProdOrders = '/prod/orders',
// }

export function getProdOrders(/* params: ScheduleRequest */) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        JSON.parse(
          '{"data":[{"id":2177,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R711","ppi_prd_item":"B8591A","ppi_expected_qty":83,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2178,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R711","ppi_prd_item":"B8591B","ppi_expected_qty":73,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2179,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R712","ppi_prd_item":"B8656A","ppi_expected_qty":163,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2180,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R712","ppi_prd_item":"B8656B","ppi_expected_qty":93,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2181,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R714","ppi_prd_item":"B8654A","ppi_expected_qty":63,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2182,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R714","ppi_prd_item":"B8654B","ppi_expected_qty":43,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2183,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R715","ppi_prd_item":"B8695A","ppi_expected_qty":43,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2184,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R715","ppi_prd_item":"B8695B","ppi_expected_qty":83,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2185,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R716","ppi_prd_item":"B8689A","ppi_expected_qty":83,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2186,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R716","ppi_prd_item":"B8689B","ppi_expected_qty":103,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2187,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R716","ppi_prd_item":"B8689C","ppi_expected_qty":63,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2188,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B2885A","ppi_expected_qty":768,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2189,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B2885H","ppi_expected_qty":1308,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2190,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B2885J","ppi_expected_qty":1800,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2191,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B69720","ppi_expected_qty":1452,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2192,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B6959B","ppi_expected_qty":108,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2193,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B1648H","ppi_expected_qty":648,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2194,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B3074D","ppi_expected_qty":1512,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2195,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87855","ppi_prd_item":"B4247A","ppi_expected_qty":444,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2196,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87898","ppi_prd_item":"B70170","ppi_expected_qty":3600,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2197,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87898","ppi_prd_item":"B69880","ppi_expected_qty":576,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2198,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87956","ppi_prd_item":"B70040","ppi_expected_qty":2100,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2199,"pid":0,"seq":null,"ppi_customer_no":"JSTW","ppi_customer_pono":"87956","ppi_prd_item":"B2885J","ppi_expected_qty":1380,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2200,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R713","ppi_prd_item":"B8684A","ppi_expected_qty":83,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2201,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R713","ppi_prd_item":"B8684B","ppi_expected_qty":53,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"},{"id":2202,"pid":0,"seq":null,"ppi_customer_no":"918","ppi_customer_pono":"R713","ppi_prd_item":"B8684C","ppi_expected_qty":123,"ppi_prod_qty":null,"ppi_po_year":"2022","ppi_po_month":"04"}]}',
        ),
      );
    }, 300);
  });
}