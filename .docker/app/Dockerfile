# Fijamos la imágen más estable del momento
FROM python:3.13.13-alpine3.23

# Nos aseguramos de actualizar pip
RUN pip install --upgrade pip 

# Crear usuario del contenedor
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser -s /sbin/nologin appuser

# Creamos y definimos el directorio de trabajo
RUN cd /home/appuser && \
    mkdir app mediafiles staticfiles

# # Copiar el archivo de requerimientos y dependencias
COPY ./requirements.txt /home/appuser/app

# # Nos aseguramos que el directorio de la aplicación pertenece al usuario appuser
RUN chown -R appuser: /home/appuser

WORKDIR /home/appuser/app/

USER appuser

# Instalando dependencias
RUN pip install --no-cache-dir -r requirements.txt

# # Puerto de acceso a ala aplicación
EXPOSE 8000

# # Ejecutando servidor django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# cd  ./.docker/app/
# docker build -t dkdaco .
# docker run -it dkdaco sh
# docker rmi -f dkdaco
# python -m django  startproject app .
