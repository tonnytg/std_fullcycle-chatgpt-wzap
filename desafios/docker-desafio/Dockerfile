#Build Builder aplication
FROM golang
WORKDIR /var/app
COPY ./main.go .
RUN go build main.go

#Build scratch less than 16kb + binary total 1.94Mb
FROM scratch
WORKDIR /var/app
COPY --from=0 /var/app .
CMD ["/var/app/main"]