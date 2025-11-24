# Besu Private Network – Deployment & Smart Contract Guide

This repository contains a Hyperledger Besu **IBFT 2.0 private blockchain network** deployed on **Minikube/Kubernetes**, along with instructions for deploying smart contracts and integrating with a React frontend.

---

## 🚀 System Requirements

### **Hardware Requirements**

* **4 CPU cores**
* **8 GB RAM**
* **Active internet connection**

### **Software Requirements**

* **Docker**
* **Minikube / Kubernetes**
* **kubectl**

---

## 🏗️ Setting Up the Besu Network

### **Run the deployment**

```bash
./deploy.sh
```

### **Remove all deployments**

```bash
./remove.sh
```

### ⚠️ Important Note

The deployment uses the **private keys inside `ibft-setup/`**.
If you want custom keys, **refer to the Besu documentation** for generating validator keys and modifying the genesis file.

---

## 🌐 Exposing the Network (Minikube)

### **Expose Validator 1 RPC endpoint**

```bash
kubectl port-forward -n besu pod/validator1-0 8545:8545
```

### **Monitoring the Network**

#### **1. Minikube Dashboard**

```bash
minikube dashboard --url
```

#### **2. Besu Network Monitoring**

* Get Minikube IP:

```bash
minikube ip
```

* Open in browser:

```
http://<minikube-ip>:30030
```

#### **3. Block Explorer (Alethio Lite Explorer)**

```bash
docker run --rm -p 8081:80 -e APP_NODE_URL=http://localhost:8545 alethio/ethereum-lite-explorer
```

Here, **APP_NODE_URL must be the locally exposed validator RPC URL**.

### **Internet Exposure**

Use:

* Minikube port exposure
* or **ngrok** (used in this project) for public access.

---

## 📝 Deploying Smart Contracts (Using Remix)

### **Requirements**

* **MetaMask**
* **Network URL**
* **Chain ID**

---

## 🔧 Add Custom Network in MetaMask

1. Open MetaMask
2. Go to **Networks → Add Network**
3. Provide:

   * **RPC URL** (e.g., `http://localhost:8545`)
   * **Chain ID**
4. Save and switch to the network.

### ⚠️ Validator Accounts

Use the validator keys from the genesis file.
Among the 7 accounts, **3 are prefunded**.

> **Never share validator private keys without transferring funds out first.**

---

## 🛠 Deploy Smart Contracts

Move smart contracts to Remix (**Besu uses Solidity 0.7.6**).

### **Compile contracts and save ABI files**

These will be used by the frontend.

### **Deploy in the following order**

1. **UserManager**
2. **BookManager**

   * Requires **UserManager contract address**
3. **BorrowManager**

   * Requires **BookManager** and **UserManager addresses**

Share:

* Deployed **contract addresses**
* Contract **ABI files**
  with the frontend team.

---

# 🌐 Frontend Setup

### **1. Update API URL & Contract Addresses**

Open:

```
client/src/services/api.js
```

Update:

* **Backend API base URL**
* **Smart contract addresses** (new deployed ones)

---

### **2. Connect MetaMask**

* Install MetaMask extension
* Add custom network with your RPC URL
* Switch to the network
* Connect wallet from the DApp UI

---

### **3. Start the React Client**

```bash
cd client
npm run start
```

Your DApp will start on the browser automatically.

---
