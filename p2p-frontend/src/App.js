import { useEffect, useState } from "react";

function App() {

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const loadUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  const loadTransactions = () => {
    fetch("http://localhost:8080/api/transactions", {
      headers: {
        "Authorization": "Basic " + btoa("user:password")
      }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error(err));
  };


  const loadUserTransactions = () => {
    if (!selectedUserId) return;

    fetch(`http://localhost:8080/api/users/${selectedUserId}/transactions`, {
      headers: {
        "Authorization": "Basic " + btoa("user:password")
      }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => setMessage("Failed to load user transactions"));
  };


  useEffect(() => {
    loadUsers();
    loadTransactions();
  }, []);


  const handleTransfer = () => {
    fetch(
      `http://localhost:8080/api/transfer?senderId=${senderId}&receiverId=${receiverId}&amount=${amount}`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa("user:password")
        }
      }
    )
      .then(res => res.text())
      .then(data => {
        setMessage(data);
        loadUsers();
        loadTransactions();
      })


      .catch(err => setMessage("Transfer failed"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} — Balance: {user.balance}
          </li>
        ))}
      </ul>

      <hr />

      <h2>Transfer Money</h2>

      <select value={senderId} onChange={e => setSenderId(e.target.value)}>
        <option value="">Select Sender</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>


      <br /><br />

      <select value={receiverId} onChange={e => setReceiverId(e.target.value)}>
        <option value="">Select Receiver</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={handleTransfer}>Transfer</button>

      <p>{message}</p>
      <hr />

      <h2>Audit Logs</h2>

      <h4>Filter by User</h4>

      <select
        value={selectedUserId}
        onChange={e => setSelectedUserId(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <button onClick={loadUserTransactions} style={{ marginLeft: "10px" }}>
        Load User Transactions
      </button>

      <br /><br />


      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
       <tbody>
         {Array.isArray(transactions) && transactions.map(tx => (
           <tr key={tx.id}>
             <td>{tx.id}</td>
             <td>{tx.senderName}</td>
             <td>{tx.receiverName}</td>
             <td>{tx.amount}</td>
             <td>{tx.timestamp}</td>
           </tr>
         ))}
       </tbody>

      </table>

    </div>
  );
}

export default App;
