import axios, { AxiosInstance } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxies = [
  "http://brd-customer-hl_ab1190c6-zone-residential:ani44d5egcx1@brd.superproxy.io:22225",
  // Add more proxies as needed
];

function getRandomProxy() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

// Create an Axios instance with proxy support
const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const proxy = getRandomProxy();
  const proxyUrl = new URL(proxy);

  const agent = new HttpsProxyAgent({
    host: proxyUrl.hostname,
    port: proxyUrl.port, // Ensure port is a string
    protocol: proxyUrl.protocol,
    auth: `${proxyUrl.username}:${proxyUrl.password}`,
    rejectUnauthorized: false, // Ignore SSL certificate errors
  });

  config.httpAgent = agent;
  config.httpsAgent = agent;
  config.proxy = false; // Disable default Axios proxy handling
  return config;
});

export default axiosInstance;
