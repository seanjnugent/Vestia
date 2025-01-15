# Vestia Platform

Vestia started as a sandbox to test some data engineering tools but has grown into something more elaborate. Originally focused on experimenting with Apache Airflow, it now includes a UI and will eventually incorporate Spark and Kafka to explore how they can handle large-scale data processing and real-time streams of price data. Here’s the current breakdown:

1. **vestia_admin** - A UI for managing accounts, clients, assets and other platform wide operations.
2. **vestia_automation** - Airflow DAGs for scheduled operations and tasks such as caching, updates and performance calculations.
3. **vestia_client** - A client-facing app where investors can track portfolios, make trades and get performance insights.
4. **vestia_server** - A backend server providing APIs for accounts, clients, trades, payments, and more.

---

## Folder Structure

### 1. vestia_admin
The administrative interface for managing the platform.

#### Key Directories:
- **`src/`**
  Main application code.
  - **`components/`**
    Reusable UI components like tables, modals, and forms.
  - **`pages/`**
    Specific pages for features like account management, trade history, and performance tracking.

#### Features:
- Manage accounts and trades.
- Track detailed client performance.
- Dashboards with admin-level analytics.

---

### 2. vestia_automation
Airflow DAGs for backend automation.

#### Key Directories:
- **`dags/`**
  Airflow DAGs for tasks like:
  - Caching account and client performance data.
  - Updating daily prices.
  - Generating test data for trades and accounts.

#### Features:
- Automates recurring updates and performance calculations.
- Syncs data in real-time with the backend.

Future plans include integrating **Apache Kafka** for real-time data streams and **Apache Spark** for processing massive datasets efficiently.

---

### 3. vestia_client
The client-facing application for investors.

#### Key Directories:
- **`src/`**
  Main application code.
  - **`components/`**
    Reusable UI elements like portfolio charts, trade buttons, and client modals.
  - **`pages/`**
    Pages for portfolio insights, trade history, and account settings.

#### Features:
- User-friendly dashboard for portfolio management.
- Real-time trading functionality.
- Insights into account performance and investment trends.

**Future plans to share components across admin and client sites
**---

### 4. vestia_server
Node.js-based server providing various APIs for managing accounts, assets, clients, payments, trades, and managed portfolios. The server dynamically creates endpoints for each feature, making it scalable and easy to manage.

#### Key Directories:
- **`routes/`**
  Contains subdirectories for each API feature, with JavaScript files implementing specific endpoints.

#### Features:
- User-friendly dashboard for portfolio management.
- Real-time trading functionality.
- Insights into account performance and investment trends.

---
## Installation and Setup

### Prerequisites
- **Node.js** (for `vestia_admin` and `vestia_client`)
- **Airflow** (for `vestia_automation`)

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/seanjnugent/vestia-platform.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Python dependencies for `vestia_automation`:
   ```bash
   cd vestia_automation
   pip install -r requirements.txt
   ```

4. Run the applications:
     ```bash
     npm run dev
     ```

---
