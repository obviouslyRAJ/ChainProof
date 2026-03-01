# ChainProof Lite: Structured Data Hashing Refactor

ChainProof Lite has been successfully refactored from file-based hashing to **Deterministic Structured Data Hashing**. This ensures that certificate authenticity is tied to its core information (name, course, date) rather than a specific file binary, making it much more robust against metadata changes.

## ✨ Key Improvements

### 1. Unified Blockchain Workspace
Both Issuing and Verification are now consolidated into a single, high-performance workspace on the home page.

![Verify Credential Tab](file:///Users/rajgurjar/.gemini/antigravity/brain/15abe50f-f40a-45b4-bf08-ec557291bd61/verify_credential_tab_1772363493081.png)
*The new 'Verify' tab allows users to re-compute cryptographic proofs by entering record details.*

### 2. Structured Data Hashing (Keccak256)
We no longer rely on file contents. Instead, we hash the core facts of the certificate using `abi.encode` in Solidity and matching logic in Ethers.js:
*   **Student Name** (e.g., "John Doe")
*   **Course Name** (e.g., "Web3 Engineering")
*   **Issue Date** (e.g., "2026-03-01")
*   **Issuer Entity** (e.g., "ChainProof University")

### 3. Admin-Only Issuance
The "Issue" tab is protected and requires a valid **ISSUER_ROLE** to etch certificates onto the blockchain.

![Issue Certificate Tab](file:///Users/rajgurjar/.gemini/antigravity/brain/15abe50f-f40a-45b4-bf08-ec557291bd61/issue_certificate_tab_1772363499825.png)
*Admins can now issue certificates directly through a structured form with real-time transaction feedback.*

### 🛡️ Role Management (Access Control)
To prevent unauthorized issuance, only accounts with the `ISSUER_ROLE` can create certificates. 
*   **Account #0** (Deployer) has this role by default.
*   **Account #1** (`0x7099...`) has been granted the role for demo purposes.
*   **To grant to others**: Use the `grantRole` function if you are an admin.

## 🛠️ Technical Details

*   **Smart Contract**: [CertificateRegistry.sol](file:///Users/rajgurjar/ChainProof/contracts/CertificateRegistry.sol)
*   **Contract Address**: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
*   **Hashing Utility**: [hashing.ts](file:///Users/rajgurjar/ChainProof/src/lib/hashing.ts)
*   **Unified UI**: [page.tsx](file:///Users/rajgurjar/ChainProof/src/app/page.tsx)

## 🚀 How to Test
1.  **Connect Wallet**: Click the "Connect Wallet" button in the navigation bar using MetaMask (Localhost 8545).
2.  **Issue**: Switch to the "Issue" tab, enter student details, and click "Issue Blockchain Proof".
3.  **Verify**: Switch to the "Verify" tab, enter the *exact same* details, and click "Verify Authenticity".
4.  **Result**: The system re-computes the hash and confirms its existence on the Polygon blockchain!

---
*Developed for the Next Generation of Trust.*
