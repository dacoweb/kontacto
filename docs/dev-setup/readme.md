# Configurando debugging en el entorno de desarrollo:
- Agregamos debugpy al entorno:
  -> Ingresamos al contenedor operando: docker exec -it kontacto_app ash
  -> Instalamos el package debugpy: pip install debugpy
  -> Obtenemos la nueva lista de dependencias: pip freeze
  -> reemplazamos el contenido de requirements.txt en .docker/app/requirements.txt
- Recreamos los contenedores con un rebuild: docker-compose down && docker-compose build