## [任务地址](https://cliqueofficial.notion.site/Full-Stack-FE-Engineer-Interview-Task-16de83b9c57f80948685d6a41c680c62)

### Task Objective

Build a simplified **UniswapV2-inspired SPA** (Single Page Application) for trading and adding liquidity between two tokens: **MockERC20** and **MOCK_USDC**. Use AI to generate a bulk of the code, make necessary modifications to ensure functionality, and document the entire process including prompt history.

The final application should:

1. Enable users to trade tokens and add liquidity.
2. Display the user's wallet transaction history.
3. Support both **MetaMask** and **WalletConnect** for wallet integration.
4. Be deployed on **GitHub Pages**.

---

### Deliverables

1. **GitHub Repository**:
    - Include all source code, properly organized.
    - Use **TypeScript** for the frontend.
    - Add a `README.md` with clear instructions for setup and deployment.
    - Include **prompt history** used to generate code via AI in a dedicated `PROMPTS.md` file.
2. **SPA Features**:
    - **Wallet Integration**:
        - Support MetaMask and WalletConnect.
    - **Trading Functionality**:
        - Trade between `MockERC20` and `MOCK_USDC`.
    - **Liquidity Management**:
        - Add/remove liquidity for the token pair.
    - **Transaction History**:
        - Display the current wallet's transaction history (local storage or fetched from an Ethereum provider).
    - **Balances**:
        - Show token balances for connected wallets.
    - Use an **Ethereum testnet** (e.g., Goerli, Sepolia).
3. **Contract Mock**:
    - Use mock ERC20 contracts (`MockERC20`, `MOCK_USDC`) and a simple UniswapV2 pair contract.
    - Provide a deployment script using **Hardhat** or **Foundry**.
4. **Deployment**:
    - Deploy the SPA to **GitHub Pages** and provide the link in the README.

---

### Task Details

### 1. **Smart Contract Mock**

- Use `MockERC20` for tokens:
    - `MockERC20`: Generic ERC20 token.
    - `MOCK_USDC`: Mimic USDC (6 decimals).
- Use a simplified UniswapV2-like pair contract:
    - Implement `swap` and `addLiquidity` methods.
    - Generate **ABIs** for frontend integration.

> Hint: Use AI to help draft the contracts and refine for testnet deployment. Document prompts in PROMPTS.md.
> 

---

### 2. **Frontend SPA**

- Use **React** or **Vue.js** (TypeScript preferred).
- Key pages/components:
    - **Homepage**:
        - Display connected wallet address and token balances.
    - **Trading Page**:
        - Trade between `MockERC20` and `MOCK_USDC`.
    - **Liquidity Page**:
        - Add/remove liquidity for the pair.
    - **History Page**:
        - Show past trades and liquidity actions from the connected wallet.
- Use **ethers.js** or **web3.js** for Ethereum interactions.
- Support wallet connection via MetaMask and WalletConnect.
- Styling: Basic UI with a modern look (Material UI, Tailwind CSS, or similar).

---

### 3. **Integration & Deployment**

- Deploy smart contracts to an Ethereum testnet (e.g., Goerli).
- Integrate SPA with deployed contracts.
- Use GitHub Actions for CI/CD to deploy the frontend to GitHub Pages.

---

### 4. **Evaluation Criteria**

- **Code Quality**: Clean, readable, and modular code.
- **AI Usage**: Effective use of AI to generate bulk of code, followed by appropriate modifications.
- **Prompt Documentation**: Complete and well-structured `PROMPTS.md` showcasing the candidate's interaction with AI.
- **Functionality**: Fully functional SPA with all specified features.
- **Deployment**: Successfully deployed on GitHub Pages, accessible via the provided link.

---

### Candidate Instructions

- Use AI tools (e.g., ChatGPT, GitHub Copilot) for initial scaffolding and logic generation.
- Modify AI-generated code to fix issues, refine logic, or enhance features.
- Save and document all prompts and responses in `PROMPTS.md`.
- Allocate approximately 8-12 hours for this task.

---

### Follow-up Discussion Topics

- Walk through the `PROMPTS.md` file: Discuss how AI was used and modified.
- Explain architecture decisions and debugging processes.
- Suggest improvements or potential feature expansions.