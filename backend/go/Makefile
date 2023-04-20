createmigratio:
	migrate create -ext=sql -dir=sql/migrations -seq init

migrate:
	migrate -path=sql/migrations -database "mysql://root:root@tcp(localhost:3306)/chat_test" -verbose up

migratedown:
	migrate -path=sql/migrations -database "mysql://root:root@tcp(localhost:3306)/chat_test" -verbose drop

.PHONY: migrate createmigration migratedown