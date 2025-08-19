setup:
	python3 -m venv .venv
	. .venv/bin/activate && pip install -r requirements.txt
	. .venv/bin/activate && python manage.py migrate
	npm install
	npm install @beefree.io/sdk
	npm run build

run:
	. .venv/bin/activate && python manage.py runserver

.PHONY: setup run