import useEth from '../../contexts/EthContext/useEth';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { CONSORTIUM_KEYS } from '../../constants/constants';
import './ordersPage.scss';

export const OrdersPage = () => {

  const {
    state: {
      orders,
      userAccount,
      SupplyChainInstance,
      isLoading,
    }, dispatch,
  } = useEth();

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Created"
        break;
      case "1":
        return "Processing"
        break;
      case "2":
        return "Delivering"
        break;
      case "3":
        return "Delivered"
        break;
      case "4":
        return "Customs checking"
        break;
      case "5":
        return "Accepted"
        break;
      case "6":
        return "Declined"
        break;
      default:
        break;
    }
  }

  const getStatusButton = (id, status, supplier, customer, deliveryCompany, customs ) => {
    if (userAccount === supplier && status === "0") {
      return (<button className="order-button"
                      onClick={() => SupplyChainInstance.methods.startProcessingOrder(id)
                      .send({
                        from: userAccount,
                        privateFor: CONSORTIUM_KEYS
                      }).then(result => {
                        console.log(result);
                      })}>Start
        processing</button>)
    } else if (userAccount === deliveryCompany && status === "1") {
      return (<button className="order-button"
                      onClick={() => SupplyChainInstance.methods.startDeliveringOrder(id)
                      .send({
                        from: userAccount,
                        privateFor: CONSORTIUM_KEYS
                      })}>Start
        delivering</button>)
    } else if (userAccount === deliveryCompany && status === "2") {
        return (<button className="order-button"
                        onClick={() => SupplyChainInstance.methods.stopDeliveringOrder(id)
                        .send({
                          from: userAccount,
                          privateFor: CONSORTIUM_KEYS
                        })}>Stop
          delivering</button>)
    } else if (userAccount === customs && status === "2") {
      return (<button className="order-button"
                      onClick={() => SupplyChainInstance.methods.startCustomsChecking(id)
                      .send({
                        from: userAccount,
                        privateFor: CONSORTIUM_KEYS
                      })}>Start
        customs checking</button>)
    } else if (userAccount === customs && status === "4") {
      return (<button className="order-button"
                      onClick={() => SupplyChainInstance.methods.finishCustomsChecking(id)
                      .send({
                        from: userAccount,
                        privateFor: CONSORTIUM_KEYS
                      })}>Finish
        customs checking</button>)
    } else if (userAccount === customer && status === "3") {
      return (<div className="customer-buttons">
        <button className="order-button"
                onClick={() => SupplyChainInstance.methods.acceptOrder(id)
                .send({
                  from: userAccount,
                  privateFor: CONSORTIUM_KEYS,
                  gasLimit: "0x24A22"
                })}>Accept order
        </button>
        <button className="order-button"
                onClick={() => SupplyChainInstance.methods.declineOrder(id)
                .send({
                  from: userAccount,
                  privateFor: CONSORTIUM_KEYS,
                  gasLimit: "0x24A22"
                })}>Decline order
        </button>
      </div>)
    } else if (
      userAccount !== customer
      || status === "5"
      || status === "6") {
      return (<div></div>)
    } else {
      return (<button className="order-button" disabled={true}>In process...</button>)
    }
  }

  return (
    <PageLayout>
      {isLoading || !orders
        ? <div>Loading...</div>
        : <div className="page-order-container">
          <h2>Orders</h2>
          <div className="orders-container">
            {orders.map(({
                           id,
                           title,
                           description,
                           supplier,
                           customer,
                           deliveryCompany,
                           customs,
                           status
                         }) => (
              <div className="order-container" key={id}>
                <p className="order-el">id: <span>{id}</span></p>
                <p className="order-el">title: <span>{title}</span></p>
                <p className="order-el">description: <span>{description}</span></p>
                <p className="order-el">supplier address: <span>{supplier}</span></p>
                <p className="order-el">customer address: <span>{customer}</span></p>
                <p className="order-el">order status: <span>{getStatusText(status)}</span></p>
                {getStatusButton(id, status, supplier, customer, deliveryCompany, customs )}
              </div>
            ))
            }
          </div>
        </div>}
    </PageLayout>
  );
}

export default OrdersPage;
