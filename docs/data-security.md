# Self Hosting

If your company has hosting security constraints you can decide to self host all your data behind a local network. On a local network Labelbox will not have access to any of your source data but Labelbox will still have access to your generated labels (typically not valueable without source data). If you do setup self hosting some products such as image masks won't be available since Labelbox can't access your data.

Below is a tutorial for how to self host through a local http server. Only computers on the same internet connection will be able to access the data. If your team is not in the same phyiscal location you can instead secure your data through a VPN (Please comment if you would like tutorials for setting up a VPN [google cloud vpn](https://cloud.google.com/vpn/docs/how-to/creating-vpns) [aws vpn](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/SetUpVPNConnections.html)) 

## Setting up a local network

1. Get the ipaddress of your computer on your network

The command below should yield your ipaddress EX: `192.168.1.112`

```
ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'
```

2. Start a server on your machine.

Put all the files you want to label into a single folder and start a server in that folder. You can start a local server via the command line. "python -m SimpleHTTPServer" or "npm install -g http-server; http-server -p 8000". Note in this example 8000 is the port we serving from.

3. Create a CSV with your data

Now if you visit `<your-ip-address>:8000` you should see a directory listing with all your files.

`cd` into the directory with all your files and run the below command that will generate data.csv

```
IP_ADDRESS=$(ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}')
CSV=$(echo "Data URL"; for fileName in $(ls); do echo $IP_ADDRESS:8000/$fileName; done)
echo $CSV > data.csv
```

4. Upload data.csv to https://app.labelbox.io/data

**Notes**
- Only users on the same wifi network can see your data
- If you stop your local server (shutdown your computer) others won't be able to access the data

Please comment or leave an issue if you got stuck on any steps or have a question. Feedback welcome.

