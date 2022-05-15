import React, {useState, useEffect} from 'react';

function App() {

  const [events, setEvents] = useState(false);
  useEffect(() => {
    getEvent();
  }, []);

  function getEvent() {
    fetch('http://localhost:3000/events')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setEvents(data);
      });
  }

	// data["username"], data["eventtype"], data["eventtime"], data["amount"], data["product"] ];
  function createEvent() {
    let username = prompt('username');
    let eventtype = prompt('event tyep');
    let eventtime = prompt('event time');
    let amount = prompt('amount');
    let product = prompt('product');
    fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, eventtype, eventtime, amount, product}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getEvent();
      });
  }

	/*
  function deleteMerchant() {
    let id = prompt('Enter merchant id');
    fetch(`http://localhost:3001/merchants/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getMerchant();
      });
  }
  */

  return (
    <div>
      {events ? events : 'There is no events data available'}
      <br />
      <button onClick={createEvent}>Add an event</button>
      <br />
    </div>
  );

}

export default App;
