sudo apt update -y
sudo apt install python3 python3-venv libaugeas0 -y

sudo apt-get remove certbot

sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip

sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
