import { useEffect, useState } from "react";

function App() {

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserBalance, setNewUserBalance] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const loadUsers = () => {
    fetch("http://localhost:8080/api/users", {
      headers: {
        "Authorization": "Basic " + btoa("user:password")
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to load users", err));
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


  const loadFilteredTransactions = () => {
    const url = selectedUserId
      ? `http://localhost:8080/api/users/${selectedUserId}/transactions?page=${page}&size=${pageSize}`
      : `http://localhost:8080/api/transactions/all?page=${page}&size=${pageSize}`;

    fetch(url, {
      headers: {
        "Authorization": "Basic " + btoa("user:password")
      }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => setMessage("Failed to load transactions"));
  };



  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newUserBalance) {
      setMessage("Please enter name and balance");
      return;
    }

    fetch(
      `http://localhost:8080/api/users?name=${newUserName}&email=${newUserEmail}&balance=${newUserBalance}`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa("user:password")
        }
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to create user");
        }
        return res.json();
      })
      .then(() => {
        setMessage("User created successfully");
        loadUsers();
      })
      .catch(() => setMessage("Failed to create user"));

  };


  useEffect(() => {
    loadUsers();
    loadTransactions();
  }, []);

  useEffect(() => {
    loadFilteredTransactions();
  }, [page]);


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

      <h2>Add New User</h2>

      <input
        type="text"
        placeholder="User Name"
        value={newUserName}
        onChange={e => setNewUserName(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={newUserEmail}
        onChange={e => setNewUserEmail(e.target.value)}
      />


      <br /><br />

      <input
        type="number"
        placeholder="Initial Balance"
        value={newUserBalance}
        onChange={e => setNewUserBalance(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAddUser}>Add User</button>


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
        onChange={e => {
          setSelectedUserId(e.target.value);
          setPage(0); // reset pagination
        }}
      >

        <option value="">All Users</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>


      <button
        onClick={() => {
          setPage(0);
          loadFilteredTransactions();
        }}
        style={{ marginLeft: "10px" }}
      >
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
             <td>
               {tx.timestamp
                 ? tx.timestamp.replace("T", " ").split(".")[0]
                 : ""}
             </td>
           </tr>
         ))}
       </tbody>

      </table>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page + 1}
        </span>

        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={transactions.length < pageSize}
        >
          Next
        </button>
      </div>


    </div>
  );
}

export default App;
