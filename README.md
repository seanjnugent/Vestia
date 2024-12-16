# Vestia: Data Engineering Testing on Minimal Hardware

**Vestia** is a testing ground for some data engineering tools with minimal hardware and performance in mind. The goal is to load-test PostgreSQL databases via automation and scheduling on a Raspberry Pi Model B from 2012 which I couldn't bring myself to throw out and wanted to do something on it. Over time, this will extend to big data, data streaming and governance tools (on more powerful hardware).

---

## Project Overview

This project simulates a trading app—think Trading 212 or Robinhood—but for now, it's focused on database-level operations. I’ve dabbled with a React frontend but scrapped it in favor of having more fun generating test data.

---

## Folder Structure

### `.github/workflows`
Contains GitHub Actions workflows for automation.  
- **`deploy_automation_scripts.yml`**: Deploys files from the repo to the Raspberry Pi and installs the `crontab`.

### `Automation`
Python scripts for automating tasks related to assets, clients, and trades.  
- **`ext_` scripts**: Handle external data import.
- **`tst_` scripts**: Generate test data.

**Key Scripts:**
- `ext_insert_assets.py`: Inserts asset data.  
- `ext_update_prices.py`: Updates asset prices.  
- `tst_manufacture_clients.py`: Manufactures dummy client data for testing.  

### `Database`
SQL scripts for defining and managing the database.  
- **Key File:**  
  - `Schema.sql`: Defines the database schema for the project.

### `Scheduling`
Contains crontab configuration for task scheduling on the Raspberry Pi.  
- **Key File:**  
  - `crontab.txt`: Specifies scheduled jobs to run automation scripts on the Pi.

### Miscellaneous Files
- **`env_template.txt`**: A template for `.env` to guide setting up environment variables.

---

## How It Works

### **Automation Scripts:**
1. Write Python scripts in the `Automation` folder to manage data operations.

### **Task Scheduling:**
1. Use `crontab.txt` to define jobs for the Raspberry Pi.  
2. Scheduled tasks run the automation scripts periodically.

### **GitHub Actions:**
The **`deploy_automation_scripts.yml`** workflow automates deployment. It:  
- Verifies `crontab.txt` exists.  
- Deploys scripts and `crontab.txt` to the Raspberry Pi.  
- Updates the crontab via SSH.

---

## Tools & Tech
- **Languages**: Python, SQL  
- **Database**: PostgreSQL  
- **Automation**: GitHub Actions, crontab  

---

## Future Plans
- Add better error handling to the scripts (because things always go wrong).  
- Build more comprehensive test cases for automation scripts.  
- Expand crontab tasks for additional operations.  
- Document the schema and scripts in greater detail.  
- Migrate from crontab to Apache Airflow.  

---

## Known Issues
- Workflow occasionally complains about missing files (usually my fault).  
- Testing framework needs improvement—currently just running stuff and hoping it works.

---

