import React, {
  useReducer, useCallback, useEffect,
} from 'react';
import Web3 from 'web3';
import Web3Quorum from 'web3js-quorum';
import { reducer, actions, initialState } from './state';
import EthContext from './EthContext';

const SupplyChain = require('../../../../client/src/contracts/SupplyChain.json');

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    if (SupplyChain) {
      const web3default = new Web3("http://localhost:22000");
      const web3 = new Web3Quorum(
        web3default,
        "http://localhost:9081",
        true,
      );
      const accounts = await web3.eth.getAccounts();
      const networkID = await web3.eth.net.getId();

      const { abi } = SupplyChain;

      const { address } = SupplyChain.networks[networkID];

      const SupplyChainInstance = new web3.eth.Contract(abi, address);

      const ordersCount = await SupplyChainInstance.methods.ordersCount().call()
      const totalCount = await SupplyChainInstance.methods.totalOrdersCount().call()

      console.log("count ", ordersCount);
      console.log("total count ", totalCount);
      console.log(accounts[0]);

      const orders = [];

      for (let i = 0; i < ordersCount; i++) {
        let orderInst = await SupplyChainInstance.methods.getOrder(i).call();
        let order = {
          id: +orderInst[0],
          title: orderInst[1],
          description: orderInst[2],
          supplier: orderInst[3],
          customer: orderInst[4],
          deliveryCompany: orderInst[5],
          customs: orderInst[6],
          status: orderInst[7],
        }
        orders.push(order)
      }

      console.log(orders);

      dispatch({
        type: actions.init,
        data: {
          web3,
          orders,
          isLoading: false,
          userAccount: accounts[0],
          SupplyChainInstance,
        },
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: actions.init,
      data: { isMetamaskInstalled: !!window.ethereum },
    });
  }, []);

  useEffect(() => {
    //      isConnected();
    const events = ['chainChanged', 'accountsChanged'];
    const handleChange = () => {
      init();
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, SupplyChain]);

  useEffect(() => {
    init()
  }, []);

  const isConnected = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      init();
    }
  };

  const connectWallet = () => {
    init();
  };

  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      connectWallet,
    }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
