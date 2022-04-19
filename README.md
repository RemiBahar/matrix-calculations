# matrix-calculations
## Set-up

## Accessing the project as a client
1. Visit http://34.142.12.178/

## Set-up client server

Create compute instance
1. Select the following options

* Set boot-disk to Ubuntu
* Allow HTTP and HTTPS traffic

Install Node
1. From home directory, install Node:
```bash
 cd ~
 curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
 sudo bash nodesource_setup.sh
 ```

 ```bash
 sudo apt-get install nodejs
 ```

2. Verify installation
```bash
node -v && npm -v
```

Clone project
1. Run:
```bash
cd ~
git clone https://github.com/RemiBahar/matrix-calculations.git
```

Install Nginx
1. Run:
```bash
sudo apt-get update
sudo apt-get install nginx
```

Configure Nginx
1. Run
```bash
sudo ufw enable
```

I have enabled all incoming/outgoing traffic through the firewall because otherwise ssh into the instance can be blocked by ufw. In a live system, this would need to be revised.

```bash
sudo ufw default allow incoming
```


```bash
sudo ufw default allow outgoing
```


```bash
sudo ufw allow 'Nginx Full'
```

2. The following command should output Nginx HTPP | allow
```bash 
sudo ufw status
```

3. Verify set-up: visit http://ip where ip is the ip address of your server. An Nginx page should display.

4. Run:
```bash
cd /
cd /etc/nginx/sites-available 
sudo chmod 777 default
```

5. Run sudo nano default and replace the location block with the following
```bash
location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

6. Allow large file uploads

```bash
    cd / 
    sudo nano /etc/nginx/nginx.conf
```

Add the following line right at the top of the http {...} section
```bash
    client_max_body_size 100M;
```

7. Test to see if everything is configured correctly
```bash
sudo nginx -t
```

```bash
sudo systemctl restart nginx
```
8. From project directory (matrix-calculations)@
```bash
node app.js
```

Configure app to run in the background as a process
Start app process (this ensures the app is running)
9. Run:
```bash
sudo npm install -g pm2
cd ~/matrix-calculations
pm2 start app.js
```

10. Finally: visit ip address in browser, the app's homepage should now be shown

## Set up server(s)

For each server/node

Create compute instance
1. Select the following options

* Set boot-disk to Ubuntu
* Allow HTTP and HTTPS traffic

Install Node
1. From home directory, install Node:
```bash
 cd ~
 curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
 sudo bash nodesource_setup.sh
 ```

 ```bash
 sudo apt-get install nodejs
 ```

2. Verify installation
```bash
node -v && npm -v
```

Clone project
1. Run:
```bash
cd ~
git clone https://github.com/RemiBahar/matrix-calculations.git
```

Start server process (this ensures the server is running)
1. Run:
```bash
sudo npm install -g pm2
cd ~/matrix-calculations
pm2 start server.js
```

You can also use systemctl to start pm2 on startup in-case the server needs restarting.

Update client with server details
1. Find the internal IP address of the server you created 
2. From the client: add a new entry to the top of servers.txt in the form ip_address:50051
```bash
nano ~/matrix-calculations/servers.txt
```
3. Restart the client
```bash
pm2 stop app
pm2 start app
```

4. Visit the app website and click multiply to test if the server is set-up correctly