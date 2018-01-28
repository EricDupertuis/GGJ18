FROM python:3.5
MAINTAINER Antoine Albertelli <antoine@antoinealb.net>

# Add Tini
ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

RUN pip install gunicorn
ADD requirements.txt .
RUN pip install -r requirements.txt

ADD . .

CMD gunicorn app:app -b 0.0.0.0:4000
