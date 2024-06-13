# Web application to store and manage files - Technical University of Ambato

This is a web system developed in Next.js for file management at the Technical University of Ambato. The system allows users to log in with their email and password or their institutional account, manage multiple faculties, and facilitate administration by the secretaries of each faculty.

## Features

- **Authentication:** Log in with email and password or institutional account.
- **Faculty Management:** Allows the entry and management of multiple faculties.
- **Administration by Secretaries:** Each faculty is managed by its respective secretary.
- **Intuitive Interface:** User-friendly and easy-to-use interface.

## Technologies Used

- **Next.js:** React framework for web application development.
- **React:** JavaScript library for building user interfaces.
- **Node.js:** JavaScript runtime for server-side development.
- **MongoDB:** NoSQL database for information storage.
- **NextAuth:** Authentication library for Next.js.

## Prerequisites

Before starting, make sure you have the following installed:

- Node.js (version 14 or higher)
- MongoDB

## Installation

Follow these steps to set up and run the project locally:

1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2. Install project dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:

    Create a `.env.local` file in the root of the project and add the following variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret
    ```

4. Run the application in development mode:
    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

Once the application is running, you can perform the following actions:

- **Log in:** Use your email and password or institutional account to access the system.
- **Manage Faculties:** Add, edit, or delete faculties as needed.
- **Administer Faculties:** Each secretary can manage the files of their respective faculty.

## Contributing

If you wish to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push your changes to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## Contact

For more information or inquiries, you can contact me via email: jojeda5171@uta.edu.ec](mailto:jojeda5171@uta.edu.ec).

---

Thank you for using Web application to store and manage files!
