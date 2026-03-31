# 🌍 Country Intelligence Dashboard

A web application that allows users to explore and compare countries around the world using real-time data from the REST Countries API.

## 🔗 Live URLs
- **Load Balancer:** http://3.88.237.135
- **Web01:** http://3.92.193.226
- **Web02:** http://3.89.21.93

## 📌 Features
- Search countries by name or capital city
- Filter countries by region (Africa, Americas, Asia, Europe, Oceania)
- Sort by name, population, or area
- Click any country card to view detailed information
- Real-time stats showing total countries and population
- Full error handling for API downtime or network issues

## 🛠️ Technologies Used
- HTML, CSS, JavaScript (Vanilla)
- [REST Countries API](https://restcountries.com) — Free, no API key required
- Nginx — Web server on Web01 and Web02
- HAProxy — Load balancer on Lb01

## 🚀 How to Run Locally
1. Clone the repository:
```
   git clone https://github.com/bmanzi-glitch/github-explorer.git
   cd github-explorer
```
2. Open `index.html` directly in your browser — no server needed.

## 🌐 Deployment Instructions

### Web01 and Web02
SSH into each server and run:
```
sudo apt update -y
sudo apt install nginx git -y
cd /var/www/html
sudo rm -rf *
sudo git clone https://github.com/bmanzi-glitch/github-explorer.git .
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Load Balancer (HAProxy)
HAProxy was pre-installed on Lb01 and configured to distribute traffic between Web01 and Web02 using round-robin balancing.

Config file location: `/etc/haproxy/haproxy.cfg`

Key configuration:
```
frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance roundrobin
    server web-01 3.92.193.226:80 check
    server web-02 3.89.21.93:80 check
```

To verify the load balancer is running:
```
sudo systemctl status haproxy
curl http://localhost
```

## 🔌 API Used
- **REST Countries API** — https://restcountries.com
- No API key required
- Endpoint used: `https://restcountries.com/v3.1/all`
- Returns data on all countries including name, flag, population, region, capital, area, languages, and currencies

## ⚠️ Error Handling
- Network failures show a user-friendly error message
- Invalid or empty API responses are handled gracefully
- No results found state is displayed when filters return nothing

## 🙏 Credits
- [REST Countries API](https://restcountries.com) by Alejandro Matos
- Nginx — https://nginx.org
- HAProxy — https://www.haproxy.org

## 📋 Challenges & Solutions
- **Challenge:** Load balancer port 80 conflict with Nginx.  
  **Solution:** Discovered HAProxy was already running and properly configured, so we used it instead of Nginx.
- **Challenge:** SSH authentication required private key instead of password.  
  **Solution:** Used the `school` private key file with `ssh -i ~/.ssh/school`.
