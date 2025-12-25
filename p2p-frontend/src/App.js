import { useEffect, useState } from "react";

function App() {

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authMessage, setAuthMessage] = useState("");

  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [selectedUserId, setSelectedUserId] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserBalance, setNewUserBalance] = useState("");


  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [signupBalance, setSignupBalance] = useState("");

  const [page, setPage] = useState(0);
  const pageSize = 5;

  /* ---------------- AUTH HELPERS ---------------- */

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  });

  const handleSignup = () => {
    fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        balance: signupBalance
      })
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text);
        return text;
      })
      .then(msg => {
        setSignupMessage(msg);
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
      })
      .catch(err => setSignupMessage(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsers([]);
    setTransactions([]);
    setAuthMessage("");
  };

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: authHeader()
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }


    return res;
  };

  /* ---------------- API CALLS ---------------- */

  const loadUsers = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e.message);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      console.error(e.message);
    }
  };

  const loadFilteredTransactions = async () => {
    const url = selectedUserId
      ? `http://localhost:8080/api/users/${selectedUserId}/transactions?page=${page}&size=${pageSize}`
      : `http://localhost:8080/api/transactions/all?page=${page}&size=${pageSize}`;

    try {
      const res = await authFetch(url);
      const data = await res.json();
      setTransactions(data);
    } catch {
      setMessage("Failed to load transactions");
    }
  };

  /* ---------------- AUTH ---------------- */

  const handleLogin = () => {
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        return data;
      })
      .then(data => {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setAuthMessage("Login successful");
      })
      .catch(err => setAuthMessage(err.message));
  };

  /* ---------------- ACTIONS ---------------- */

  const handleTransfer = async () => {
    try {
      const res = await authFetch(
        `http://localhost:8080/api/transfer?receiverId=${receiverId}&amount=${amount}`,
        { method: "POST" }
      );
      const text = await res.text();
      setMessage(text);
      loadUsers();
      loadFilteredTransactions();
    } catch {
      setMessage("Transfer failed");
    }
  };


  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (token) {
      loadUsers();
      loadTransactions();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadFilteredTransactions();
  }, [page, token, selectedUserId]);


  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: "20px" }}>

      {!token && (
        <>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          /><br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          /><br /><br />

          <button onClick={handleLogin}>Login</button>
          <p>{authMessage}</p>

          <hr />

          <h2>Signup</h2>

          <input
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={e => setSignupName(e.target.value)}
          /><br /><br />

          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
          /><br /><br />

          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
          /><br /><br />

          <input
            type="number"
            placeholder="Initial Balance"
            value={signupBalance}
            onChange={e => setSignupBalance(e.target.value)}
          /><br /><br />

          <button onClick={handleSignup}>Signup</button>

          <p>{signupMessage}</p>

        </>
      )}

      {token && (
        <>
          <button onClick={handleLogout}>Logout</button>

          <h2>Users</h2>
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.name} — Balance: {u.balance}</li>
            ))}
          </ul>

          <h2>Transfer</h2>

          <select onChange={e => setReceiverId(e.target.value)}>
            <option>Select Receiver</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>

          <input placeholder="Amount" onChange={e => setAmount(e.target.value)} />
          <button onClick={handleTransfer}>Transfer</button>

          <p>{message}</p>

                    <h2>Audit Logs</h2>

                    <h4>Filter by User</h4>

                    <select
                      value={selectedUserId}
                      onChange={e => {
                        setSelectedUserId(e.target.value);
                        setPage(0);
                      }}
                    >
                      <option value="">All Users</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name}
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
                        {Array.isArray(transactions) &&
                          transactions.map(tx => (
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
                  </>
                )}
              </div>
            );
          }

export default App;
