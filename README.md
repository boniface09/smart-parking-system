\# Smart Parking System



A full-stack Smart Parking Management System developed to manage parking slots, vehicle entry and exit, parking fees, vehicle records, payments, and reports through both a Python desktop application and a modern web interface.



\## Project Overview



The Smart Parking System provides a centralized solution for managing parking operations.



The project combines:



\* A Python desktop application for core parking operations

\* A Flask REST API for web communication

\* A SQLite database for data persistence

\* A React-based web interface for management and monitoring

\* JWT-based authentication for the web dashboard



The system is designed to make parking management more organized, efficient, and easier to monitor.



\## Key Features



\### Parking Management



\* Management of 50 parking slots

\* Real-time parking slot availability

\* Vehicle entry processing

\* Vehicle exit processing

\* Automatic parking fee calculation

\* Parking status tracking



\### Vehicle Management



\* Vehicle registration

\* Vehicle records

\* Entry and exit information

\* Searchable vehicle history



\### Payments and Reports



\* Parking fee calculation

\* Payment records

\* Parking reports

\* Vehicle and transaction information



\### Web Dashboard



\* Secure administrator login

\* Dashboard statistics

\* Parking slot monitoring

\* Vehicle entry and exit

\* Vehicle records

\* Reports

\* Account settings

\* Username and password management



\### Authentication



The web application uses JWT authentication to protect administrative functionality.



Administrators can also update their username and password through the Settings page.



\## Technologies Used



\### Backend



\* Python

\* Flask

\* SQLite

\* Flask-JWT-Extended

\* Flask-CORS



\### Frontend



\* React

\* Vite

\* Tailwind CSS

\* Axios

\* Lucide React



\### Desktop Application



\* Python

\* Tkinter

\* SQLite



\### Development Tools



\* Git

\* GitHub

\* Visual Studio Code



\## Project Structure



```text

smart-parking-system/

│

├── backend/

│   ├── app.py

│   ├── algorithms.py

│   ├── config.py

│   ├── database.py

│   ├── models.py

│   ├── web\_api.py

│   ├── requirements.txt

│   │

│   └── ui/

│       ├── entry.py

│       ├── exit.py

│       ├── reports.py

│       └── vehicles.py

│

├── frontend/

│   ├── package.json

│   ├── package-lock.json

│   ├── vite.config.js

│   │

│   └── src/

│       ├── components/

│       ├── layouts/

│       ├── pages/

│       ├── services/

│       ├── App.jsx

│       ├── App.css

│       └── main.jsx

│

├── .gitignore

└── README.md

```



\## Installation and Setup



\### 1. Clone the Repository



```bash

git clone https://github.com/boniface09/smart-parking-system.git

cd smart-parking-system

```



\## 2. Backend Setup



Navigate to the backend directory:



```bash

cd backend

```



Create a Python virtual environment:



\### Windows



```powershell

python -m venv venv

```



Activate it:



```powershell

venv\\Scripts\\activate

```



Install the required packages:



```powershell

pip install -r requirements.txt

```



The SQLite database is created locally by the application.



\### Start the Backend



Run:



```powershell

python web\_api.py

```



The Flask API runs on:



```text

http://127.0.0.1:5000

```



\## 3. Frontend Setup



Open a second terminal and navigate to the frontend:



```powershell

cd frontend

```



Install the dependencies:



```powershell

npm install

```



Start the development server:



```powershell

npm run dev

```



Vite will provide a local address, normally similar to:



```text

http://localhost:5173

```



Open the displayed address in a web browser.



\## Default Web Login



The initial administrator account is:



```text

Username: admin

Password: admin123

```



For security, the administrator can change the username and password from:



```text

Dashboard → Settings

```



\## System Architecture



```text

&#x20;                 ┌──────────────────────┐

&#x20;                 │      React UI        │

&#x20;                 │   Vite + Tailwind    │

&#x20;                 └──────────┬───────────┘

&#x20;                            │

&#x20;                            │ HTTP / REST API

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │      Flask API       │

&#x20;                 │      Python          │

&#x20;                 └──────────┬───────────┘

&#x20;                            │

&#x20;                            ▼

&#x20;                 ┌──────────────────────┐

&#x20;                 │       SQLite         │

&#x20;                 │      Database        │

&#x20;                 └──────────────────────┘

```



The project also contains a Python/Tkinter desktop interface for parking operations.



\## Main System Modules



| Module        | Description                                  |

| ------------- | -------------------------------------------- |

| Dashboard     | Displays parking and system statistics       |

| Parking Slots | Displays available and occupied slots        |

| Vehicle Entry | Registers vehicles entering the parking area |

| Vehicle Exit  | Processes vehicle exits and calculates fees  |

| Vehicles      | Manages vehicle records                      |

| Reports       | Displays parking and transaction information |

| Settings      | Allows administrator account management      |



\## Database



The system uses SQLite for local data storage.



The database stores information related to:



\* Parking slots

\* Vehicles

\* Parking transactions

\* Payments

\* Administrator accounts



The local database file is intentionally excluded from GitHub so that each installation can maintain its own local database.



\## Security



The web dashboard includes:

password for admin

username:admin

password:admin123



\* JWT authentication

\* Protected administrative routes

\* Authorization headers

\* Password-change functionality

\* Local environment and database files excluded from version control



\## Purpose of the Project



This project was developed as a practical software development project demonstrating the application of:



\* Database management

\* Data structures and algorithms

\* Backend development

\* REST API development

\* Frontend development

\* Authentication

\* CRUD operations

\* Software architecture

\* Version control using Git and GitHub



\## Author



\*\*Boniface Gitu\*\*



Computer Science Student

Multimedia University of Kenya



\## Repository



GitHub:



https://github.com/boniface09/smart-parking-system



\---



\*\*Smart Parking System — Full-Stack Parking Management Solution\*\*



