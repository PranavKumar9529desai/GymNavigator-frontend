#!/bin/bash

# Get the primary local IP address
LOCAL_IP=$(ip addr | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d/ -f1 | head -n 1)

# Output the IP for reference and create QR code for easy mobile access
echo "Starting Next.js development server on IP: $LOCAL_IP"
echo "Access your PWA via: http://$LOCAL_IP:3000"

# Generate QR code if qrencode is installed
if command -v qrencode &> /dev/null; then
    echo "Scan this QR code with your mobile device to access the app:"
    qrencode -t UTF8 "http://$LOCAL_IP:3000"
else
    echo "Tip: Install qrencode (sudo apt install qrencode) to generate a QR code for easier mobile access"
fi

# Simplt showt the QrCode instead of running the server
# Run next dev with bun and specific hostname and port
#bun run next dev -H $LOCAL_IP -p 3000

# If you want to use HTTPS (uncomment the line below)
# bun run next dev -H $LOCAL_IP -p 3000 --experimental-https
