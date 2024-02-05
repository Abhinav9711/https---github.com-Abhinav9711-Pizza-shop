import React, { useEffect, useState } from 'react';
import './App.css';


let id = 0;
const status = [
  'order_placed',
  'order_in_making',
  'order_ready',
  'order_picked'
]

const statusLabel = [
  'Order Placed',
  'Order In Making',
  'Order Ready',
  'Order Picked'
]

const timeTaken = {};

const OrderDetails = ({ order, updateStatus, isCancel }) => {
  const [color, setColor] = useState(0);

  return (
    <>
      <div className='order-details' style={{
        backgroundColor: color
          ? 'red' : 'white'
      }}>
        <label>order {order.id}</label> <br />
        <label>size: {order.size}</label> <br />
        {order.status < 3 ? <Timer isCancel={isCancel} time={0} order={order} setColor={setColor}></Timer> : <></>}
        {order.status < 3 ? <button onClick={() => updateStatus(order.id, order.status)}>Next</button> : <label>Picked</label>}
      </div>
    </>
  )
}

const Timer = ({ isCancel = [], time, order, status = 1, setColor = () => { } }) => {
  const [minutes, setMinutes] = useState(time);
  const [seconds, setSeconds] = useState(time);
  let backgroundTime = 3;

  // change the background color based on size of Pizza - small (3min) , medium (min) , large(5min)
  if (order.size === 'medium') {
    backgroundTime = 4;
  }
  else if (order.size == 'large') {
    backgroundTime = 5;
  }

  useEffect(() => {
    let interval;
    if (status < 3 && !isCancel.includes(order.id)) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => (prevSeconds === 59 ? 0 : prevSeconds + 1));

        if (seconds === 59) {
          setMinutes(prevMinutes => prevMinutes + 1);
        }
      }, 1000);
    }

    if (minutes >= backgroundTime && seconds >= 0) {
      setColor(1);
    }

    return () => clearInterval(interval);
  }, [seconds]);


  const formattedTime = `${String(minutes)} min ${String(seconds).padStart(2, '0')} sec`;
  timeTaken[order.id] = formattedTime;

  return (
    <label> {formattedTime}</label>
  );
};


function App() {
  const [orders, setOrders] = useState([]);
  const [type, setType] = useState();
  const [size, setSize] = useState();
  const [base, setBase] = useState();
  const [isCancel, setIsCancel] = useState([]);

  const updateStatus = (orderId, status) => {
    let ods = Array.from(orders);
    ods.map(order => {
      if (order.id === orderId) {
        order.status = status + 1;
      }
    })
    setOrders(ods);
  }

  const createOrder = () => {
    if (!type || !base || !size) {
      alert('please select all required values');
      return;
    }

    setOrders([...orders, {
      id: id + 1,
      type,
      size,
      base,
      status: 0,
      currentTime: 0,
      totalTime: 0
    }])

    id = id + 1;
    setType('');
    setBase('');
    setSize('');
  }

  const getDeliveredOrder = () => {
    let count = 0;
    orders.map(ord => {
      if (ord.status === 3) {
        count = count + 1;
      }
    })
    return count;
  }

  return (
    <>
      <div className='app'>
        {
          orders.length < 10 ?
            <div className="form">
              <h3>Create orders</h3>

              <label>Select type of Pizza:    </label>
              <select id="dropdown" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select type</option>
                <option value="veg">Veg</option>
                <option value="nonVeg">Non Veg</option>
              </select> <br /> <br />

              <label>Select size of Pizza:    </label>
              <select id="dropdown" value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">Select size</option>
                <option value="large">Large</option>
                <option value="medium">Medium</option>
                <option value="small">Small</option>
              </select><br /><br />

              <label>Select base of Pizza:    </label>
              <select id="dropdown" value={base} onChange={(e) => setBase(e.target.value)}>
                <option value="">Select base</option>
                <option value="thin">Thin</option>
                <option value="thick">Thick</option>
              </select><br /><br />

              <button onClick={createOrder}>Create order</button>

            </div> : <h2> Not taking any order for now</h2>
        }

        <div className='stages'>
          <h3>Pizza Stages Section</h3>
          <div className='main-content'>
            <div className='items'>
              <h5>Order Placed</h5>
              {
                orders.map((order) => {
                  return order.status === 0 ?
                    <div>
                      <OrderDetails order={order} updateStatus={updateStatus} isCancel={isCancel}> </OrderDetails>
                    </div>
                    :
                    <></>
                })
              }
            </div>

            <div className='items'>
              <h5>Order In Making</h5>
              {
                orders.map((order) => {
                  return order.status === 1 ?
                    <div>
                      <OrderDetails order={order} updateStatus={updateStatus} isCancel={isCancel}> </OrderDetails>
                    </div>
                    :
                    <></>
                })
              }
            </div>

            <div className='items'>
              <h5>Order Ready</h5>
              {
                orders.map((order) => {
                  return order.status === 2 ?
                    <div>
                      <OrderDetails order={order} updateStatus={updateStatus} isCancel={isCancel}> </OrderDetails>
                    </div>
                    :
                    <></>
                })
              }
            </div>

            <div className='items'>
              <h5>Order Picked</h5>
              {
                orders.map((order) => {
                  return order.status === 3 ?
                    <div>
                      <OrderDetails order={order} updateStatus={updateStatus} isCancel={isCancel}> </OrderDetails>
                    </div>
                    :
                    <></>
                })
              }
            </div>
          </div>
        </div>

        <div className='main-section'>
          <h3>Main Section</h3>
          <table>
            <tr >
              <th >Order Id</th>
              <th>Stage</th>
              <th>Total Time Spent</th>
              <th>Action</th>
            </tr>

            {
              orders.length ?
                orders.map(order => {
                  return <tr>
                    <td>Order Id: {order.id}</td>
                    <td>{statusLabel[order.status]}</td>
                    <td><Timer isCancel={isCancel} time={0} order={order} status={order.status}></Timer></td>
                    {order.status < 3 && !isCancel.includes(order.id) ? <td><button onClick={() => {
                      setIsCancel((isCancel) => [...isCancel, order.id])
                    }}>Cancel</button></td> : <td></td>}
                  </tr>
                })
                : <></>

            }

            {
              <tr>
                <th>Total order delivered</th>
                <th>{getDeliveredOrder()}</th>
              </tr>
            }
          </table>
        </div>

      </div>
    </>
  );
}

export default App;