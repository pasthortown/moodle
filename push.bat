set datestr=%date%
set result=%datestr:/=-%
@echo %result%

git add .
git commit -m hola
git push -u origin master
