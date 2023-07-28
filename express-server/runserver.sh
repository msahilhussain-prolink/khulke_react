cp /usr/src/build/faq.html /usr/src/build/disclaimers.html /usr/src/build/community_guidelines.html /usr/src/build/support.html /usr/src/build/privacy_policy.html /usr/src/build/tnc.html /usr/src/build/apple-app-site-association.json /usr/share/nginx/html/ /usr/share/nginx/html/
cp -f /usr/src/server.conf /etc/nginx/sites-available/default
service nginx start
cd /usr/src/express-server
npm run start 2>&1