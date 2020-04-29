# pull official base image
FROM python:3.8.0-alpine

# set work directory
WORKDIR /usr/src/spotme

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/spotme/requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY . /usr/src/spotme/

EXPOSE 8000

ENTRYPOINT ["python", "manage.py", "runserver"]