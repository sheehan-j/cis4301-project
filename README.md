## Setup

1. Run `$ git clone https://github.com/sheehan-j/cis4301-project`

2. Change directory into frontend folder and run `$ npm i`

3. Change directory into backend folder and run `$ npm i`

4. Inside of the backend folder, create a ".env" file and add these variables. Replace "your_username" and "your_password" with your credentials.

```
DBAAS_USER_NAME = your_username
DBAAS_USER_PASSWORD = your_password
DBAAS_DEFAULT_CONNECT_DESCRIPTOR = (DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = oracle.cise.ufl.edu)(PORT = 1521))(CONNECT_DATA =(SID= orcl)))
PORT = 8089
```

5. Navigate to this directory within the project folder: `\cis4301-project\backend\node_modules\oracledb\build\Release`

6. Unzip the instantclient folder and move its contents into the Release folder. Make sure you are not creating a new directory within the Release folder, just move the files within the unzipped folder into the Release folder.

7. Run the VC_redist application.

8. Run two terminals side-by-side, with one changed into the frontend folder and one into the backend folder.

9. **Make sure you are connected through the Gatorlink VPN.** Otherwise, no data will get loaded.

10. Run `$ npm start` in the frontend folder to start the frontend.

11. Run `$ npm run dev` in the backend folder to start the backend server.

12. Open localhost:3000 in your browser to see the frontend.

## Important Links

1. VC_redist: https://drive.google.com/file/d/1LdhQQdP3OUAlGhQy1Z3CPKInstraxv1E/view?usp=share_link
2. instantclient Zip: https://drive.google.com/file/d/1d9Q3xXTEsGFgPWiKqk7CXVzh2nsUPX_B/view?usp=share_link
