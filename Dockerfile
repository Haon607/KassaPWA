FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

# Angular-Build ins HTML-Verzeichnis
COPY dist/KassaPWA/browser /usr/share/nginx/html

# nginx.conf ins richtige Verzeichnis
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Zertifikate ins Container-Dateisystem
COPY certs /etc/nginx/certs

EXPOSE 80 443
