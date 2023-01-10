pragma solidity 0.8.17;

contract SupplyChain {

  enum Status {
    Created,
    Processing,
    Delivering,
    Delivered,
    CustomsChecking,
    Accepted,
    Declined
  }

  mapping(uint => Order) orders;
  mapping(uint => uint) getOrderIndexFromId;
  uint public ordersCount = 0;
  uint public totalOrdersCount = 0;

  struct Order {
    uint id;
    string title;
    string description;
    address supplier;
    address customer;
    address deliveryCompany;
    address customs;
    Status status;
  }

  function getOrder(
    uint256 id
  ) public view returns (uint, string memory, string memory, address, address, address, address, Status) {
    Order memory order = orders[id];
    return (
    order.id,
    order.title,
    order.description,
    order.supplier,
    order.customer,
    order.deliveryCompany,
    order.customs,
    order.status
    );
  }

  function increaseTotalCount() public {
    totalOrdersCount = totalOrdersCount + 1;
  }

  function getOrderById(uint _id) public view returns(uint){
    return getOrderIndexFromId[_id];
  }

  function createOrder(
    string memory _title,
    string memory _description,
    address _supplier,
    address _customer,
    address _deliveryCompany,
    address _customs
  ) public {
    orders[ordersCount] = Order({
    id: totalOrdersCount,
    title: _title,
    description: _description,
    supplier: _supplier,
    customer: _customer,
    deliveryCompany: _deliveryCompany,
    customs: _customs,
    status: Status.Created
    });

    getOrderIndexFromId[totalOrdersCount] = ordersCount;
    ordersCount = ordersCount + 1;
  }

  function startProcessingOrder(uint256 id) public {
    uint index = getOrderById(id);

    require(orders[index].supplier == msg.sender);
    require(orders[index].status == Status.Created);

    Order storage order = orders[index];
    order.status = Status.Processing;
  }

  function startDeliveringOrder(uint256 id) public {
    uint index = getOrderById(id);

    require(orders[index].deliveryCompany == msg.sender);
    require(orders[index].status == Status.Processing);

    Order storage order = orders[index];
    order.status = Status.Delivering;
  }

  function stopDeliveringOrder(uint256 id) public {
    uint index = getOrderById(id);

    require(orders[index].deliveryCompany == msg.sender);
    require(orders[index].status == Status.Delivering);

    Order storage order = orders[index];
    order.status = Status.Delivered;
  }

  function startCustomsChecking(uint256 id) public {
    uint index = getOrderById(id);

    require(orders[index].customs == msg.sender);
    require(orders[index].status == Status.Delivering);

    Order storage order = orders[index];
    order.status = Status.CustomsChecking;
  }

  function finishCustomsChecking(uint256 id) public {
    uint index = getOrderById(id);

    require(orders[index].customs == msg.sender);
    require(orders[index].status == Status.CustomsChecking);

    Order storage order = orders[index];
    order.status = Status.Delivering;
  }

  function acceptOrder(uint256 id) public  {
    uint index = getOrderById(id);

    require(orders[index].customer == msg.sender);
    require(orders[index].status == Status.Delivered);
    orders[index].status = Status.Accepted;
  }

  function declineOrder(uint256 id) public {
    uint index = getOrderById(id);

    require(orders[index].customer == msg.sender);
    require(orders[index].status == Status.Delivered);
    orders[index].status = Status.Declined;
  }
}
