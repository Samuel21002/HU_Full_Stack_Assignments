**Setting up project**

1.  Clone the repository
2.      ```bash
    npm install
    ```
3.  **Database Setup:**
    - Make sure your PostgreSQL server is running.
    - Create a new database for the project.
    - You can use a tool like `psql` or a GUI like pgAdmin.

4.  **Environment Configuration:**
    - Create a `.env` file in the root of the project 
    - Open the `.env` file and update the `DATABASE_URL` with your PostgreSQL connection string and `SECRET ` with a random string for JWT tokens. It should look something like this:
    
      ```
      DATABASE_URL='postgres://<user>:<password>@<host>:<port>/<database_name>'
      SECRET=12345asdf
      ```

5.  Runn the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.
